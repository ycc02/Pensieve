const express = require('express');
const execute = express.Router();
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../config/jwt.js');
const {_res_success} = require('../utils/resHandler.js');
const {
  _insert_withPromise_Basic
} = require('../utils/dbInsertHandler.js');
const {
  _select_Basic
} = require('../utils/dbSelectHandler.js');
const {
  BROADS_USERS_UNITS
} = require('../utils/queryIndicators.js');
const {
  _handler_err_NotFound,
  _handler_err_BadReq,
  _handler_err_Unauthorized,
  _handler_err_Internal
} = require('../utils/reserrHandler.js');

function _handle_account_setting_GET(req, res){
  jwt.verify(req.headers['token'], verify_key, function(err, payload) {
    if (err) {
      _handler_err_Unauthorized(err, res)
    } else {
      let userId = payload.user_Id;
      let mysqlForm = {
        accordancesList: [[userId]]
      },
      conditionUser = {
        table: "users",
        cols: ["*"],
        where: ["id"]
      },
      conditionVerify = {
        table: "verifications",
        cols: ["email"],
        where: ["id_user"]
      };
      //first, selecting by accordancelist
      
      //select from 'users' & 'verification'
      //do selection twice! due to we are not going to join the table contain the 'password'
      let pUser = Promise.resolve(_select_Basic(conditionUser, mysqlForm.accordancesList)),
          pVerify = Promise.resolve(_select_Basic(conditionVerify, mysqlForm.accordancesList));

      Promise.all([pUser, pVerify]).then((resultsDouble)=>{
        if(resultsDouble.length < 1){throw {status: 500, err: 'no this user in DB'}}; 
        let sendingData={
          accountSet:{
            firstName: '',
            lastName: '',
            mail: ''
          },
          temp: {}
        };
        let resultsUser = resultsDouble[0],
            resultsVerify = resultsDouble[1];

        sendingData.accountSet.firstName = resultsUser[0].first_name;
        sendingData.accountSet.lastName = resultsUser[0].last_name;
        sendingData.accountSet.mail = resultsVerify[0].email;
        return sendingData;
      }).then((sendingData)=>{
        _res_success(res, sendingData, "Complete, GET: account/setting.");
      }).catch((errObj)=>{
        console.log("error occured during GET: account/setting promise: "+errObj.err)
        switch (errObj.status) {
          case 400:
            _handler_err_BadReq(errObj.err, res);
            break;
          case 404:
            _handler_err_NotFound(errObj.err, res);
            break;
          case 500:
            _handler_err_Internal(errObj.err, res);
            break;
          default:
            _handler_err_Internal(errObj.err?errObj.err:errObj, res);
        }
      });
    }
  })
}

execute.get('/', function(req, res){
  console.log('GET: account/setting');
  _handle_account_setting_GET(req, res);
})

module.exports = execute;
