const natural = require('natural');
const jsforce = require('jsforce');
var fs = require('fs');
const { resolve } = require('path');
const { rejections } = require('winston');


const training = async (classifier) => {
  return new Promise((resolve, reject) => {
    if (!classifier) {
      classifier = new natural.BayesClassifier();
    }
  

//let classifier;

/*
try {
  const existingData = fs.readFileSync(`'classifier.json'`, { encoding: 'utf8', flag: 'r' });
  if(existingData == ''){
    console.log('currently empty');
  }else{
  console.log(existingData);
  }
  if (existingData) {
    classifier = natural.BayesClassifier.restore(JSON.parse(existingData));
    console.log('classifier established');
  } else {
    console.log('first');
    classifier = new natural.BayesClassifier();
  }
} catch (error) {
  classifier = new natural.BayesClassifier();
}*/
//const soqlQuery = "SELECT Keyword__c, Category__c FROM Keyword_Category__c";
  //console.log(soqlQuery);

let conn = new jsforce.Connection({
  loginUrl: 'https://dxctechnology-ac-dev-ed.develop.my.salesforce.com'
});
const username = 'aiemailtocase@dxc.com';
const password = 'Salesforce@123458k3vXh5twsSTQyXR3XCTYhu7T';

conn.login(username, password, (err, res) => {
  if (err) {
    return console.error(err);
    
  }
  console.log('Connected to Salesforce from train');

  const soqlQuery = "SELECT Keyword__c, Category__c FROM Keyword_Category__c";
  console.log(soqlQuery);

 conn.query(soqlQuery, (err, result) => {
    console.log('reached here1');
    if (err) {
      console.log('reached heree');
      console.error('Error querying salesforce',err);
      return;
    }
   // console.log(result);
    
    console.log(' ---   ');
    result.records.forEach(record => {
      const keyword = record.Keyword__c;
      const category = record.Category__c;
      classifier.addDocument(keyword, category);
    });
    
    console.log('  ***  ');
    classifier.train();
   // console.log(classifier);
    console.log('classifier trained');
    resolve(classifier);
    
});

    
    
 //   console.log(classifier.classFeatures.Hardware);

// const keywordsAndCategories = [];
/*Object.entries(classifier.classFeatures).forEach(([category, features]) => {
  Object.keys(features).forEach(keyword => {
    keywordsAndCategories.push({ keyword, category });
  });
});*/

// Convert the array to JSON string
//const jsonData = JSON.stringify(keywordsAndCategories, null, 2);

// Write the JSON data to the file
//fs.writeFileSync('classifier.json', jsonData, 'utf8');

 //   const classifierJSON = JSON.stringify(classifier.toJSON());
    console.log('reached here at last');
  //  console.log(classifierJSON);
 //   fs.writeFileSync('./classifier.json', classifierJSON,'utf8');
   //   console.log('File Saved?');
    
  });


  
});

};
module.exports={
  training
};