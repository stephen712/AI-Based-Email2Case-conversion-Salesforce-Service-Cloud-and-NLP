
//const { ConnectionStates } = require('mongoose');
const lemmatizer= require('node-lemmatizer');
//const lemmatizer = require( 'wink-lemmatizer' );
const natural = require('natural');
const fs = require('fs');
const jsforce = require('jsforce');
const { error } = require('console');
//const { training } = require('./train');
//const {training} = require('./train.js');



/*const test=`The mails are generated based on the culture.
 For example, for Germany's email addresses, we use real 
 German names and the mails will look that belongs to people from Germany.`;*/


const nlpMethods=async(emailData,classifier) =>{
  return new Promise((resolve,reject) =>{
  
    //tokenize the email matter
    
const body = emailData.Subject +' '+ emailData.Description;
const {WordTokenizer} = natural;
const tokenizer = new WordTokenizer();
const tokens = tokenizer.tokenize(body);
console.log('tokens');
console.log(tokens);

//less important words removal
const filteredTokens = tokens.filter(token=>!natural.stopwords.includes(token));
console.log('Stop Words');
console.log(filteredTokens);   


/*const string = filteredTokens.join(' ');
console.log(typeof(string));

/root/snap//lemmatizing
const arrayLemma = lemmatizer.lemmas(string);

console.log(arrayLemma);
//console.log(typeof(arrayLemma[0]));

//const finalLemma=arrayLemma[0].split(' ');
//console.log(finalLemma);   */

//Stemming the data
//const stemmer = natural.PorterStemmer;
//const final = filteredTokens.map(token => stemmer.stem(token));
//console.log(final);
   


//Case classification
//const classifierr=training(classifier);

  const classifiedCategory=  classifier.classify(filteredTokens);
console.log(classifiedCategory);

let conn = new jsforce.Connection({
    loginUrl: 'https://dxctechnology-ac-dev-ed.develop.my.salesforce.com'
});
const username = 'aiemailtocase@dxc.com';
const password = 'Salesforce@123458k3vXh5twsSTQyXR3XCTYhu7T';

conn.login(username, password, (err, res) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Connected to Salesforce from nlp');
  

  const customObjectApi = 'Keyword_Category__c';
  filteredTokens.forEach( keyword =>{
    const customObjectRecord = {
      Keyword__c : keyword,
      Category__c : classifiedCategory,
      Name : keyword
    };

    conn.sobject(customObjectApi).create(customObjectRecord,(err,ret) =>{
      if (err || !ret.success) {
        console.error(err);
        return;
      }
      console.log('Keyword saved in Salesforce:', keyword);
    });
    
  });
});





const modifiedEmailData = {
    Subject:emailData.Subject,
    Description:emailData.Description,
    Categories__c:classifiedCategory

  };
resolve(modifiedEmailData);



});
}
module.exports = {
    nlpMethods
  };    