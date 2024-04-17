const axios = require("axios");
const functions = require('@google-cloud/functions-framework');

/*
 * HTTP function that supports CORS requests.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
functions.http('getToken', (req, res) => {
    returnToken = {
        token: null
    }
    var jsonResponse = {
      session_info: {
          parameters: {
              token: null
          }
      }
  };
    
    res.set('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
      // Send response to OPTIONS requests
      res.set('Access-Control-Allow-Methods', 'POST');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
      res.set('Access-Control-Max-Age', '3600');
      res.status(204).send('');
    } else {
        const CCAAS_ACCOUNT =  req.body.sessionInfo.parameters["CCAAS_ACCOUNT"];
        const CCAAS_ID  = req.body.sessionInfo.parameters["CCAAS_ID"];
        const CCAAS_SECRET = req.body.sessionInfo.parameters["CCAAS_SECRET"];
        const BASE_URL = req.body.sessionInfo.parameters["CCAAS_URL"];
        
        const CCAAS_AUTH = `auth/realms/${CCAAS_ACCOUNT}/protocol/openid-connect/token`;
        const data = `grant_type=client_credentials&client_id=${CCAAS_ID}&client_secret=${CCAAS_SECRET}`;

        res.set('Content-Type', 'application/json');
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'User-Agent': 'Axios 1.1.3'
          }
        axios.post(`${BASE_URL}${CCAAS_AUTH}`, data, {headers})
        .then(function (response) {
            jsonResponse.session_info.parameters.token = response.data.access_token;
            res.status(200).send(JSON.stringify(jsonResponse));
        })
        .catch((error) => {
            console.log("error");
            res.status(200).send(JSON.stringify(jsonResponse));
          })
    }

});   