const express = require('express');
const execute = express.Router();

const winston = require('../../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_attribution = require('../../../db/models/index').attribution;
const _DB_nodesActivity = require('../../../db/models/index').nodes_activity;
const _DB_usersCustomIndex = require('../../../db/models/index').users_custom_index;
const _DB_usersDemandMatch = require('../../../db/models/index').users_demand_match;
const {_res_success} = require('../../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
} = require('../../utils/reserrHandler.js');

function _handle_GET_feed_customNew(req, res){
  let userId = req.extra.tokenUserId;
  new Promise((resolve, reject)=>{

    _DB_usersCustomIndex.findOne({
      where: {
        id_user: userId
      },
      attributes: ['last_visit', 'currentbelong', 'id_user']
    }).then((usersIndex)=>{
      resolve(usersIndex);
    }).catch((err)=>{
      reject(new internalError(err, 131));
    });
  }).then((usersIndex)=>{
    let pSelectAttri = _DB_attribution.findAndCountAll({
          where: {
            createdAt: {[Op.gt]: usersIndex.last_visit}
          }
        }).catch((err)=>{throw err}),
        pSelectNodesActi = _DB_nodesActivity.findAndCountAll({
          where: {
            createdAt: {[Op.gt]: usersIndex.last_visit}
          }
        }).catch((err)=>{throw err}),
        //in order to pick the Unit related to node user wish or order,
        //select record from users_demand_match
        pSelectUserDemand = _DB_usersDemandMatch.findOne({
          where: {
            id_user: userId
          }
        }).catch((err)=>{throw err});


    return Promise.all([
      pSelectAttri,
      pSelectNodesActi,
      pSelectUserDemand
    ]).then(([newAttri, newNodesActi, userDemand])=>{
      //becuse we still need to use 'usersIndex', so we keep the process in .all()
      let sendingData={
        listCustomNew: [],
        listNew: [],
        temp: {}
      };

      //remember we are using findAndCountAll method
      if(newAttri.count < 0) return sendingData //pass the rest if there is none any new Units.
      else{
        //first,
        let nodesWished = JSON.parse(userDemand.list_wished),
            nodesWaited = JSON.parse(userDemand.list_waited),
            unitsObj={};
        let nodesCustom = usersIndex.currentbelong.concat(nodesWished, nodesWaited); //the arr may have duplicate items, but we just tolarate it.

        newAttri.rows.forEach((attriRow, index)=>{
          if(nodesCustom.indexOf(attriRow.id_noun) < 0){ sendingData.listNew.push(attriRow.id_unit); return;}; //next round if the node not on the desired list

          if(!(attriRow.id_unit in unitsObj) ){
            unitsObj[attriRow.id_unit] = {
              star: attriRow.id_noun,
              unitId: attriRow.id_unit
            };
          }
        });
        //loop unitsObj to insert them back into sendingData.listCustomNew
        let unitsArr = Object.keys(unitsObj);
        sendingData.listCustomNew = unitsArr.map((key, index)=>{
          return unitsObj[key];
        });
        //then, check if the listNew has duplicate
        sendingData.listNew = sendingData.listNew.filter((item, index, list)=>{
          return index == list.indexOf(item); //return the '1st' in the list, to rm duplicate
        })

        return sendingData;


        //check if there is any new Unit match the nodes user hope
        //is that, usersIndex.currentbelong could be 'null' if the user didn't input any records, so skip the loop if the currentbelong is empty
        if(Boolean(usersIndex.currentbelong) ){
          for(let i= (newAttri.rows.length-1) ; i >= 0 ; i--){ //because we need to splice the row if match,
            //we count down from the end, to assure the index is work
            let row = newAttri.rows[i];
            if(usersIndex.currentbelong.indexOf(row.id_noun) >= 0) {
              if(sendingData.temp.skipList.indexOf(row.id_unit) < 0){
                sendingData.listBelong.push({star: row.id_noun, unitId: row.id_unit});
                sendingData.temp.skipList.push(row.id_unit);
              }
              newAttri.rows.splice(i, 1);
            }
          }
        }
        //next, check if any new Nodes used, and if the Unit used it still is on the list
        //and if there is not any new Unit left after belogn check, no need to do the rest
        //notice, the newAttri.count is not reliable now since the count would not change at splice process
        if(newAttri.rows.length > 0){
          //we loop the newAttri again, check if the node id in new nodes list or not
          //so, create a id list of new node first
          let newNodeList = newNodesActi.rows.map((item,index)=>{return item.id_node;});
          newAttri.rows.forEach((row, index)=>{
            //if the node is new used, push it into listFirst
            if(newNodeList.indexOf(row.id_noun) >= 0){
              if(sendingData.temp.skipList.indexOf(row.id_unit) < 0){
                sendingData.listFirst.push({star: row.id_noun, unitId: row.id_unit});
                sendingData.temp.skipList.push(row.id_unit);
              }
            }
            else //to skip the below step if the listFirst has it
              //check the commonList directly, it's an arr with pure item
              if(sendingData.commonList.indexOf(row.id_unit)< 0) sendingData.commonList.push(row.id_unit); //end of 'else'
          })
          //finally, check the length of the listFirst if under the limit
          //length limit of listFirst is 3
          //if over, splice the outsider & move it to the common
          if(sendingData.listFirst.length >3){
            let surplusArr = sendingData.listFirst.slice(3); //shallow copy the surplus items
            sendingData.commonList = sendingData.commonList.concat(surplusArr); //merge surplus items to commonList
            //Notice! And we 'don't' delete the surplus part from listFirst
            //in case the shallow copy lost its referrence(both slice & concat are shallow copy)
            //and since the client side just render the limit amount, it would be safe
          }
        }
        return sendingData;

      }
    })
  }).then((sendingData)=>{
    _res_success(res, sendingData, "feed, GET: /custom/new, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

module.exports = _handle_GET_feed_customNew;
