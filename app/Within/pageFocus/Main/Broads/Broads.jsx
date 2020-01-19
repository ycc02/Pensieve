import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import stylesMain from "../styles.module.css"; //Notice, we use shared css file here for easier control
import {
  axios_Units,
} from '../utils.js';
import {
  nailChart,
} from '../utils.js';
import {
  setIndexLists
} from '../../../../redux/actions/cosmic.js';
import {
  handleNounsList,
  handleUsersList,
} from "../../../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from '../../../../utils/errHandlers.js';

class Broads extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      unitsBasic: {},
      marksBasic: {},
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_nails = this._render_nails.bind(this);
    this._set_BroadsUnits = this._set_BroadsUnits.bind(this);
    this._axios_GET_broadsList = this._axios_GET_broadsList.bind(this);
    this.style={

    }
  }

  _axios_GET_broadsList(){
    let url = '/router/feed/broads';

    return axios.get(url, {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: this.axiosSource.token
    }).then(function (res) {
      let resObj = JSON.parse(res.data);

      return resObj;
    }).catch(function (thrown) {
      throw thrown;
    });
  }

  _set_BroadsUnits(){
    const self = this;
    this.setState({axios: true});

    //get list by lastvisit: new or rand
    this._axios_GET_broadsList()
    .then((resObj)=>{
      //res: update to indexLists, call axios_Units of /MainBanner/utils, call _set_mountToDo from props
      //(we don't update the 'axios' state, because there is another axios here, for units, right after the res)
      self.props._submit_IndexLists({broads: resObj.main.unitsList}); //submit the list to the props.indexLists.
      self.props._set_mountToDo("listRowBroads"); //splice the label from the todo list of Main
      //_set_mountToDo is a process control of Main, make sure the 'lastvisit' was update 'after' all the process was done

      return axios_Units(self.axiosSource.token, resObj.main.unitsList); //and use the list to get the data of eahc unit
    })
    .then((resObj)=>{
      //after res of axios_Units: call get nouns & users
      self.props._submit_NounsList_new(resObj.main.nounsListMix);
      self.props._submit_UsersList_new(resObj.main.usersList);
      //and final, update the data of units to state
      self.setState((prevState, props)=>{
        return ({
          axios: false,
          unitsBasic: {...prevState.unitsBasic, ...resObj.main.unitsBasic},
          marksBasic: {...prevState.marksBasic, ...resObj.main.marksBasic}
        });
      });

    })
    .catch(function (thrown) {
      self.setState({axios: false});
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);
        if(message) alert(message);
      }
    });

  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {
    this._set_BroadsUnits()
  }

  componentWillUnmount() {
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  _render_nails(){
    //our list was saved to reducer after fetch
    let unitsList = this.props.indexLists['broads'],
        unitsDOM = [];

    if(unitsList.length > 0 ){ // check necessity first, skip if no item.
      //the backend may pass more than 4, so don't forget setting the limit
      for(let i =0 ; i< 6 && i< unitsList.length; i++){ //again, don't forget the length limit to prevent error cause by unwanted cycle
        let unitId = unitsList[i];
        //then important question: do we have the data of this Unit ? if not, we skip to next one
        if(unitId in this.state.unitsBasic) {
          //the nailChart was co use with other component in Main,
          // has a special type for broads --- to display broaded users,
          //and should be 'wider' if it is the last one
          let remainder = i % 2; // i start from 0, so it would be either 1 or 0, just like 'true or false'
          let nail = (!remainder && (i+1) == unitsList.length) ? nailChart(6, unitId, this): nailChart(5, unitId, this);
          unitsDOM.push(nail);
          //insert separation if needed
          if(remainder && (i+1)< unitsList.length) unitsDOM.push(
            <div
              key={'key_CosmicMain_Sparation_Broads_'+i}
              className={classnames(stylesMain.boxFillHorizClose)}/>
          ); //end of if()
        }
      }
    }

    return unitsDOM;
  }

  render(){
    return (this.props.indexLists['broads'].length > 0) ? (
      <div
        className={classnames(styles.comBroads)}>
        <div
          className={classnames(styles.boxBillboard)}>
          <div
            className={classnames(styles.boxTitleWrap)}>
            <span
              className={classnames(styles.spanBillboard, stylesMain.fontTitle)}>
              {this.props.i18nUIString.catalog["title_Main_Broads"][0]}</span>
            <br/>
            <span
              className={classnames(styles.spanBillboard, stylesMain.fontType)}>
              {this.props.i18nUIString.catalog["title_Main_Broads"][1]}</span>
          </div>
        </div>
        <div
          className={classnames(styles.boxUnits)}>
          {this._render_nails()}
        </div>
      </div>
    ):(
      <div
        className={classnames(styles.comBroads)}>
        <div
          className={classnames(styles.boxBillboard)}>
          <span
            className={classnames(styles.spanBillboard, stylesMain.fontTitle)}>
            {this.props.i18nUIString.catalog["guidingBroad_atMain"]}</span>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    nounsBasic: state.nounsBasic,
    indexLists: state.indexLists
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_IndexLists: (listsObj) => { dispatch(setIndexLists(listsObj)); },
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
    _submit_UsersList_new: (arr) => { dispatch(handleUsersList(arr)); },
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Broads));