const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const { getAccessToken } = require('./oauth.js');
const natural = require('natural');
const {nlpMethods} = require('./nlp.js');
const {training} = require('./train.js');


// Middleware to parse the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define your email classification categories
//const categories = ['hardware', 'software', 'billing', 'sales'];

// Handle the incoming HTTP POST request from CloudMailIn 
app.post('/webhook', async(req, res) => {
  
  // Extract the email frm the request body
  const  Subject = req.body.headers.subject;
   //console.log(Subject);
  const  text = req.body.plain;

  const modifiedText = removeExtras(text);
  function removeExtras(text){
    const marker = '\r\n\r\n\r';
    const startIndex = text.indexOf(marker);
    if(startIndex!== -1){
      const modifiedText = text.slice(0,startIndex).trim();
      return modifiedText;
    }
    return text;
  }
  // console.log(Subject);
  // console.log(text);

  //const{Subject,text} = req.body;

console.log('inside app');
//console.log('Here is'+JSON.stringify(req));
  // Send the Email as a case to Salesforce
 // const subject = req.body.subject;
 // const body = req.body.body;
  const caseData = {
    Subject,
    Description: modifiedText

  };
  console.log(caseData);
  const classifier = new natural.BayesClassifier();
  let classifierr;
     await training(classifier)
   .then(response => {
   // console.log('training', response);
    classifierr = response;
       
  })
  .catch(error => {
    console.error('error', error);
  });
  //const classifier = getTrainedClassifier();
 let nlpCaseData;
   await nlpMethods(caseData,classifierr)
  .then(response => {
    console.log('nlp done', response);
    nlpCaseData = response;
       
  })
  .catch(error => {
    console.error('nlp not done', error);
  });

  

  const salesforceAccessToken =  await getAccessToken();
  const salesforceEndpoint = 'https://dxctechnology-ac-dev-ed.develop.my.salesforce.com/services/data/v58.0/sobjects/Case';

  axios.post(salesforceEndpoint, nlpCaseData, {
    headers: {
      'Authorization': `Bearer ${salesforceAccessToken}`,
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      console.log('Case created in Salesforce:', response.data);
         
    })
    .catch(error => {
      console.error('Error creating case in Salesforce:');
    });
  
  // Response to CloudMailIn server
  res.sendStatus(200);
});

// Server Start 
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



// function getTrainedClassifier() {
//   return new Promise((resolve, reject) => {
//     let classifier = new natural.BayesClassifier();
//     training(classifier)
//       .then(() => resolve(classifier))
//       .catch(error => reject(error));
//   });
// }
/*let classifier;

try {
  const existingData = fs.readFileSync('./classifier.json', 'utf8');
  if (existingData) {
    classifier = natural.BayesClassifier.restore(JSON.parse(existingData));
  } else {
    classifier = new natural.BayesClassifier();
  }
} catch (error) {
  classifier = new natural.BayesClassifier();
}*/
