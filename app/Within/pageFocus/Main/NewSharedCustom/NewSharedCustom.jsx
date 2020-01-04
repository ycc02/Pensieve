import React from 'react';
import {
  Route,
  Link,
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import stylesMain from "../styles.module.css"; //Notice, we use shared css file here for easier control
import {
  axios_Units,
  nailChart,
} from '../utils.js';
import {
  handleNounsList,
  handleUsersList
} from "../../../../redux/actions/general.js";
import {
  setFlag
} from '../../../../redux/actions/cosmic.js';
import {
  cancelErr,
  uncertainErr
} from '../../../../utils/errHandlers.js';

class NewSharedCustom extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      unitsBasic: {},
      marksBasic: {}
    };
    this.axiosSource = axios.CancelToken.source();
    this._fetch_Units = this._fetch_Units.bind(this);
    this._render_unitsCustomNew = this._render_unitsCustomNew.bind(this);
    this.style={

    }
  }

  _fetch_Units(unitsList){
    const self = this;
    this.setState({axios: true});

    axios_Units(this.axiosSource.token, unitsList)
    .then((resObj)=>{
      //after res of axios_Units: call get nouns & users
      self.props._submit_NounsList_new(resObj.main.nounsListMix);
      self.props._submit_UsersList_new(resObj.main.usersList);
      //and update the data of units to state
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
    if(this.props.flagNewCustomDataFetch && this.props.flagNewCustomDataFetch != prevProps.flagNewCustomDataFetch){
      // indexLists.listCustomNew was in form "[{star, unitId}]"
      let unitsList = this.props.indexLists['listCustomNew'].map((obj, index)=>{return obj.unitId});
      this._fetch_Units(unitsList);
      this.props._submit_FlagSwitch(['flagNewCustomDataFetch']); //set flag back to dafault
    }
  }

  componentDidMount() {
    if(this.props.flagNewCustomDataFetch){
      // indexLists.listCustomNew was in form "[{star, unitId}]"
      let unitsList = this.props.indexLists['listCustomNew'].map((obj, index)=>{return obj.unitId});
      this._fetch_Units(unitsList);
      this.props._submit_FlagSwitch(['flagNewCustomDataFetch']); //set flag back to dafault
    }
  }

  componentWillUnmount() {
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  _render_unitsCustomNew(){
    //our list was saved to reducer after fetch
    //and indexLists.listCustomNew was in form "[{star, unitId}]"
    let unitsList = this.props.indexLists['listCustomNew'].map((obj, index)=>{return obj.unitId}),
        unitsDOM = [];
    if(unitsList.length > 0 ){ // check necessity first, skip if no item.
      //we render no more than 6, but the backend may pass more than 6, so don't forget setting the limit
      for(let i =0 ; i< 6 && i< unitsList.length; i++){ //again, don't forget the length limit to prevent error cause by unwanted cycle
        let unitId = unitsList[i];
        //then important question: do we have the data of this Unit ? if not, we skip to next one
        if(unitId in this.state.unitsBasic) {
          let nail = nailChart(2, unitId, this);
          unitsDOM.push(nail);
        }
      }
    }

    return unitsDOM;
  }

  render(){
    return(
      <div
        className={classnames(styles.comNewSharedCust)}>
        <div
          className={classnames(styles.boxBillboard)}>
          <span
            className={classnames(styles.spanBillboard, stylesMain.fontTitle)}>
            {this.props.i18nUIString.catalog["title_Main_NewCust"]}</span>
        </div>
        <div
          className={classnames(styles.boxUnits)}>
          {this._render_unitsCustomNew()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    indexLists: state.indexLists,
    unitCurrent: state.unitCurrent,
    i18nUIString: state.i18nUIString,
    flagNewCustomDataFetch: state.flagNewCustomDataFetch,
    nounsBasic: state.nounsBasic,
    usersBasic: state.usersBasic,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
    _submit_UsersList_new: (arr) => { dispatch(handleUsersList(arr)); },
    _submit_FlagSwitch: (target) => { dispatch(setFlag(target)); },
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(NewSharedCustom));
