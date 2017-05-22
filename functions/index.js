/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const functions = require('firebase-functions');
const rp = require('request-promise');

const pipedriveApi = require('./pipedrive/api.js');

/**
 * Webhook that will be called each time there is a change on Pipedrive and store the update in firbase
 */
exports.pipedriveWebhook = functions.https.onRequest((req, res) => {

  if (hasCorrectToken(req.query.fbtoken)) {

      let dealId = req.body.current.deal_id;

      pipedriveApi.fetchDeal(dealId).then(function (deal) {
          fbSaveDeal(deal);
      }).catch(error => {
        console.error(error);
        res.status(500).send('Something went wrong while loading the Pipedrive data');
      });

      res.end();
  } else {
    console.error('fb-auth-token', req.query.fbtoken, 'did not match config app.auth_token');
    res.status(403).send('Your \'fbtoken\' bad and you should feel bad!');
  }
});

function hasCorrectToken(token) {

    const AUTH_TOKEN = functions.config().app.auth_token;

    if(! AUTH_TOKEN){
      console.error("fb config value for app.auth_token is missing or empty");
      return false;
    }

    return AUTH_TOKEN == token
}


function fbSaveDeal(deal) {
  console.log("Deal from API", deal);
}
