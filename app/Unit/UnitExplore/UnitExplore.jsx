import React from 'react';
import {
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import Theater from '../Theater/Theater.jsx';
import SharedEdit from '../Editing/SharedEdit.jsx';
import CreateRespond from '../Editing/CreateRespond.jsx';
import Related from '../Related/Related.jsx';
import {
  _axios_getUnitData,
  _axios_getUnitImgs,
} from '../utils.js';
import NavOptions from '../../Components/NavOptions/NavOptions.jsx';
import ModalBox from '../../Components/ModalBox.jsx';
import ModalBackground from '../../Components/ModalBackground.jsx';
import {
  setUnitView,
  submitUnitRespondsList
} from "../../redux/actions/unit.js";
import {
  setUnitCurrent,
  handleUsersList,
  updateNodesBasic,
  updateUsersBasic
} from "../../redux/actions/general.js";
import {unitCurrentInit} from "../../redux/states/constants.js";
import {
  cancelErr,
  uncertainErr
} from '../../utils/errHandlers.js';

class UnitExplore extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      close: false,
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_switch = this._render_switch.bind(this);
    this._close_theater = this._close_theater.bind(this);
    this._set_UnitCurrent = this._set_UnitCurrent.bind(this);
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
    this._reset_UnitMount = ()=>{this._set_UnitCurrent();};
    this.style={

    };
    //And! we have to 'hide' the scroll bar and preventing the scroll behavior to the page one for all
    //so dismiss the scroll ability for <body> here
    document.getElementsByTagName("BODY")[0].setAttribute("style","overflow-y:hidden;");
  }

  _construct_UnitInit(match, location){
    let unitInit= {marksify: false, initMark: "all", layer: 0};
    return unitInit;
  }

  _close_theater(){
    this.setState((prevState, props)=>{
      return {
        close: true
      }
    })
  }

  _set_UnitCurrent(){
    const self = this;
    this.setState({axios: true});

    let promiseArr = [
      new Promise((resolve, reject)=>{_axios_getUnitData(this.axiosSource.token, this.unitId).then((result)=>{resolve(result);});}),
      new Promise((resolve, reject)=>{_axios_getUnitImgs(this.axiosSource.token, this.unitId).then((result)=>{resolve(result);});})
    ];
    Promise.all(promiseArr)
    .then(([unitRes, imgsBase64])=>{
      self.setState({axios: false});
      let resObj = JSON.parse(unitRes.data);
      //we compose the marksset here, but sould consider done @ server
      let keysArr = Object.keys(resObj.main.marksObj);//if any modified or update, keep the "key" as string
      let [coverMarks, beneathMarks] = [{list:[],data:{}}, {list:[],data:{}}];
      // due to some historical reason, the marks in unitCurrent has a special format
      keysArr.forEach(function(key, index){
        if(resObj.main.marksObj[key].layer==0){
          coverMarks.data[key]=resObj.main.marksObj[key];
          coverMarks.list[resObj.main.marksObj[key].serial] = key; //let the list based on order of marks, same as beneath
        }else{
          beneathMarks.data[key]=resObj.main.marksObj[key]
          beneathMarks.list[resObj.main.marksObj[key].serial] = key;
        }
      });
      // api GET unit data was totally independent, even the nodesBasic & userBasic
      //But we still update the info to redux state, for other comp. using
      let nodesBasic = {}, userBasic = {};
      resObj.main.nouns.list.forEach((nodeKey, index) => {
        nodesBasic[nodeKey] = resObj.main.nouns.basic[nodeKey];
      });
      userBasic[resObj.main.authorBasic.id] = resObj.main.authorBasic;
      self.props._submit_Nodes_insert(nodesBasic);
      self.props._submit_Users_insert(userBasic);

      //actually, beneath part might need to be rewritten to asure the state could stay consistency
      self.props._set_store_UnitCurrent({
        unitId:self.unitId,
        identity: resObj.main.identity,
        authorBasic: resObj.main.authorBasic,
        coverSrc: imgsBase64.cover,
        primerify: resObj.main.primerify,

        beneathSrc: imgsBase64.beneath,
        coverMarksList:coverMarks.list,
        coverMarksData:coverMarks.data,
        beneathMarksList:beneathMarks.list,
        beneathMarksData:beneathMarks.data,
        nouns: resObj.main.nouns,
        refsArr: resObj.main.refsArr,
        createdAt: resObj.main.createdAt
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
    // becuase there is chance we jump to another Unit from Related but using the same component
    //so we check if the unit has changed
    //but Notice! always check the diff between the current & pre id from 'path search'
    //due to this is the only reliable and stable source (compare to the unitCurrent)
    let prevParams = new URLSearchParams(prevProps.location.search); //we need value in URL query
    if(this.unitId !== prevParams.get('unitId')){
      //reset UnitCurrent to clear the view
      //and Don't worry about the order between state reset, due to the Redux would keep always synchronized
      let unitCurrentState = Object.assign({}, unitCurrentInit);
      this.props._set_store_UnitCurrent(unitCurrentState);
      this.props._submit_list_UnitResponds({list:'', scrolled:''}, true); // reset the responds state to initial
      this._set_UnitCurrent();
    };
  }

  componentDidMount(){
    //because we fetch the data of Unit only from this file,
    //now we need to check if it was necessary to fetch or not in case the props.unitCurrent has already saved the right data we want
    this._set_UnitCurrent();
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
    //reset UnitCurrent before leaving
    // It's Important !! next Unit should not have a 'coverSrc' to prevent children component render in UnitModal before Unit data response!
    let unitCurrentState = Object.assign({}, unitCurrentInit);
    this.props._set_store_UnitCurrent(unitCurrentState);
    this.props._set_state_UnitView('theater'); // it's default for next view
    this.props._submit_list_UnitResponds({list:'', scrolled:''}, true); // reset the responds state to initial
    //last, make sure the scroll ability back to <body>
    document.getElementsByTagName("BODY")[0].setAttribute("style","overflow-y:scroll;");
  }

  _render_switch(paramUnitView){
    switch (paramUnitView) {
      case 'theater':
        return (
          <Theater
            {...this.props}
            _construct_UnitInit={this._construct_UnitInit}
            _reset_UnitMount={this._reset_UnitMount}
            _close_theaterHeigher={this._close_theater}/>
        )
        break;
      case 'editing':
        return (
          <SharedEdit
            {...this.props}
            _reset_UnitMount={this._reset_UnitMount}/>
        )
        break;
      case 'respond':
        return (
          <CreateRespond
            {...this.props}
            _reset_UnitMount={this._reset_UnitMount}
            _close_theaterHeigher={this._close_theater}/>
        )
        break;
      case 'related':
        return (
          <div
            className={classnames(styles.boxRelated)}
            onClick={(e)=> { e.stopPropagation();e.preventDefault();this._close_theater()}}>
            <div
              onClick={(e)=> { e.stopPropagation();e.preventDefault();}}>
              <Related
                {...this.props}
                _reset_UnitMount={this._reset_UnitMount}
                _close_theaterHeigher={this._close_theater}/>
            </div>
          </div>
        )
        break;
      default:
        return null
    };
  }

  render(){
    this.urlParams = new URLSearchParams(this.props.location.search);
    this.unitId = this.urlParams.get('unitId');
    let paramUnitView = this.urlParams.get('unitView');
    let cssVW = window.innerWidth; // for RWD

    if(this.state.close){return <Redirect to={{
        pathname: '/',
        search: '',
        state: this.props.location.state //keep the state as props, perhaps need to increase 'current location' for 'back' use
      }}/>};

    return(
      <ModalBox containerId="root">
        <ModalBackground
          _didMountSeries={()=>{window.addEventListener('touchmove', (e)=>{e.stopPropagation();});}}
          _willUnmountSeries={()=>{window.removeEventListener('touchmove', (e)=>{e.stopPropagation();});}}
          onClose={()=>{this._close_theater();}}
          style={{
            position: "fixed",
            backgroundColor: (paramUnitView=="related" || paramUnitView=="respond") ? 'rgba(51, 51, 51, 0.85)': 'rgba(51, 51, 51, 0.3)' }}>
            {
              (cssVW < 860) &&
              <div
                className={classnames(styles.boxNavOptions)}>
                <NavOptions {...this.props} _refer_to={this._close_theater}/>
              </div>
            }
            <div
              className={classnames(styles.boxUnitContent)}
              onClick={this._close_theater}>
              {this._render_switch(paramUnitView)}
            </div>
        </ModalBackground>
      </ModalBox>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitView: state.unitView,
    unitCurrent: state.unitCurrent,
    unitSubmitting: state.unitSubmitting
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {
    _submit_Nodes_insert: (obj) => { dispatch(updateNodesBasic(obj)); },
    _submit_Users_insert: (obj) => { dispatch(updateUsersBasic(obj)); },
    _set_state_UnitView: (expression)=>{dispatch(setUnitView(expression));},
    _set_store_UnitCurrent: (obj)=>{dispatch(setUnitCurrent(obj));},
    _submit_list_UnitResponds: (obj, reset) => { dispatch(submitUnitRespondsList(obj, reset)); }
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(UnitExplore));
