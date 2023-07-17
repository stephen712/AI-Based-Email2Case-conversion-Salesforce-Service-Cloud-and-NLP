const axios = require('axios');
const { URLSearchParams } = require('url');

const oauthEndpoint = 'https://login.salesforce.com/services/oauth2/token';
const consumerKey = '3MVG9ayzKZt5EleHQJ1eHqkVBFx5tHw1M7pokSU8EnO08LO8BqdzTeVxlKvuw2zOFwnCqs76GeCOTU5hgMZdd';
const consumerSecret = 'B507F16493C4820C90A3926BCF2F479B1FA6274D9740DF10857E5663AC7FE670';

const getAccessToken = async () => {
  console.log('here here');
  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('client_id', consumerKey);
  params.append('client_secret', consumerSecret);
  params.append('username', 'aiemailtocase@dxc.com');
  params.append('password', 'Salesforce@12345');

  try {
    console.log(params);
    console.log(oauthEndpoint);
    const response = await axios.post(oauthEndpoint, params);
    //console.log(response);
    const accessToken = response.data.access_token;
    //console.log(accessToken);
    return accessToken;
  } catch (error) {
    console.error('Error getting access token:'+error);
   // console.log(error);
    throw error;
  }
};

module.exports = {
  getAccessToken
};