import {
  SET_INDEXLISTS,
  SET_BELONGSBYTYPE,
  SUBMIT_FEEDASSIGN,
  SUBMIT_CHAINLIST,
  SUBMIT_SHAREDSLIST,
  SET_FLAG_CHAINRESPOND
} from '../types/typesWithin.js';
import {
  handleNounsList,
} from "../actions/general.js";
import {
  initAround
} from "../states/statesWithin.js";
import {
  uncertainErr
} from "../../utils/errHandlers.js";

export function setBelongsByType(typeObj){
  return {type: SET_BELONGSBYTYPE, typeObj: typeObj}
}

export function setIndexList(listsObj){ //mainly used to reset all when unmount
  return {type: SET_INDEXLISTS, lists: listsObj}
}

export function setWithinFlag(bool, flag){
  switch (flag) {
    case "chainFetRespond":
      return {type: SET_FLAG_CHAINRESPOND, bool: bool}
      break;
    default:
      return {type: SET_FLAG_CHAINRESPOND, bool: bool}
  }
}

export function submitFeedAssigned(listsObj, reset){
  return (dispatch, getState) => {
    const currentState =  getState();
    let copyStateListUnread = currentState.indexLists.listUnread.slice();
    let copyStateListBrowsed = currentState.indexLists.listBrowsed.slice();
    let scrolled = listsObj.scrolled; // only this one follow the param directly

    if(listsObj.listUnread.length > 0) copyStateListUnread.push(listsObj.listUnread);
    if(listsObj.listBrowsed.length > 0) copyStateListBrowsed.push(listsObj.listBrowsed);
    if(!!reset){ // special condition, ask to reset to init state
      copyStateListUnread = initAround.indexLists.listUnread;
      copyStateListBrowsed = initAround.indexLists.listBrowsed;
      scrolled = initAround.indexLists.scrolled;
    }

    dispatch({
      type: SUBMIT_FEEDASSIGN,
      listsObj: {listUnread: copyStateListUnread, listBrowsed: copyStateListBrowsed, scrolled: scrolled}
    });
  }
}

export function submitSharedsList(listsObj){
  return {type: SUBMIT_SHAREDSLIST, listsObj: listsObj}
}

export function submitChainList(listsObj) {
  return { type: SUBMIT_CHAINLIST, listsObj: listsObj }
}

export function fetchBelongsSeries(objByType) {
  //this actoin creator, could do function return is because we use 'thunk' middleware when create store
  return (dispatch, getState) => {
    let typeKeys = Object.keys(objByType);
    let fetchList = typeKeys.map((type, index)=>{
      return objByType[type];
    });
    if(fetchList.length<1){ return;}; //security check, just prevent any unpredictable req

    return axios.get('/router/nouns/direct', {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      params: {
        fetchList: fetchList
      }
    }).then((res)=>{
      let resObj = JSON.parse(res.data);
      let submitObj = {}, submitNodesList = [];
      //continued using var 'typeKeys' to keep it staying consistent
      typeKeys.forEach((type, index) => {
        let targetNode = objByType[type];
        submitObj[(type=="homeland") ?"homelandup": "residenceup" ] = resObj.main.nodesSeries[targetNode];
        submitNodesList= submitNodesList.concat(resObj.main.nodesSeries[targetNode].listToTop);
      });

      dispatch({type: SET_BELONGSBYTYPE, typeObj: submitObj});
      dispatch(handleNounsList(submitNodesList)); //also, these 'new fetched' nodes need to be handle
    })
    .catch(function (thrown) {
      let message = uncertainErr(thrown);
      if(message) alert(message);
    });
  }
}
