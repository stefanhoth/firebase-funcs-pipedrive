
'use strict';

const functions = require('firebase-functions');

const PIPEDRIVE_TOKEN = functions.config().pipedrive.auth_token;

const Pipedrive = require('pipedrive');
const pipedrive = new Pipedrive.Client(PIPEDRIVE_TOKEN, { strictMode: true });

exports.fetchDeal = function (id) {

  return new Promise(function(resolve,reject){
         pipedrive.Deals.get(id, function(err, deal) {
           if(err){
             reject(err)
           }else {

             if(deal.products_count > 0){
               //TODO add products to deal
             }

             resolve(deal)
           }
         });
  });
}
