import React from 'react';
import {
  Route,
  Switch,
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import Around from './partAround/Around.jsx';
import {
  fetchBelongRecords
} from '../redux/actions/general.js'
import NavWithin from '../Components/NavWithin/NavWithin.jsx';
import NavOptions from '../Components/NavOptions/NavOptions.jsx';
import ModalBox from '../Components/ModalBox.jsx';
import ModalBackground from '../Components/ModalBackground.jsx';
import SingleDialog from '../Components/Dialog/SingleDialog/SingleDialog.jsx';
import SingleCloseDialog from '../Components/Dialog/SingleCloseDialog/SingleCloseDialog.jsx';
import BooleanDialog from '../Components/Dialog/BooleanDialog/BooleanDialog.jsx';

class WithinAround extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      switchTo: null
    };
    this._refer_von_cosmic = this._refer_von_cosmic.bind(this);
    this.style={
      Within_Around_backplane:{
        width: '100%',
        height: '100%',
        position: 'fixed',
        backgroundColor: '#FCFCFC'
      },
    }
  }

  _refer_von_cosmic(identifier, route){
    switch (route) {
      case 'user':
        if(identifier == this.props.userInfo.id){
          window.location.assign('/user/screen');
        }else{
          this.setState((prevState, props)=>{
            let switchTo = {
              params: '/cosmic/users/'+identifier+'/accumulated',
              query: ''
            };
            return {switchTo: switchTo}
          })
        }
        break;
      case 'noun':
        this.setState((prevState, props)=>{
          let switchTo = {
            params: '/cosmic/nodes/'+identifier,
            query: ''
          };
          return {switchTo: switchTo}
        })
        break;
      default:
        window.location.assign(route)
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    //set the state back to default if the update came from Redirect
    //preventing Redirect again which would cause error
    if(this.state.switchTo){
      this.setState({
        switchTo: null
      });
    }
  }

  componentDidMount() {
    /*
    Here is the highest level next only to status() in root, fetching data or any info needed
    */
    if( !window.localStorage['token'] ) return;
    //beneath are the process difinately need a token
    this.props._fetch_belongRecords();
  }

  componentWillUnmount() {

  }

  render(){
    if(this.state.switchTo){return <Redirect to={this.state.switchTo.params+this.state.switchTo.query}/>}

    return(
      <div>
        <div style={this.style.Within_Around_backplane}></div>
        <div
          className={classnames(styles.boxAround)}>
          <div
            className={classnames(styles.boxNavOptions)}>
            <NavOptions {...this.props} _refer_to={this._refer_von_cosmic}/>
          </div>
          <div
            className={classnames(styles.boxAroundContent)}>
            <div
              className={classnames(
                styles.boxContentFilledLeft)}/>
            <div
              className={classnames(styles.boxAroundContentCenter)}>
              <Switch>
                <Route path={this.props.match.path} render={(props)=> <Around {...props} _refer_von_cosmic={this._refer_von_cosmic}/>}/>

              </Switch>
            </div>
            <div
              className={classnames(
                styles.boxContentFilledRight)}/>
          </div>
          <div
            className={classnames(styles.boxNavAround)}>
            <NavWithin {...this.props} _refer_to={this._refer_von_cosmic}/>
          </div>
        </div>

        {
          //here and beneath, are dialog system for global used,
          //the series 'message' in redux state is prepared for this kind of global message dialog
          this.props.messageSingleClose['render'] &&
          <ModalBox containerId="root">
            <ModalBackground onClose={()=>{this._set_Dialog();}} style={{position: "fixed", backgroundColor: 'rgba(51, 51, 51, 0.3)'}}>
              <div
                className={"boxDialog"}>
                <SingleCloseDialog
                  message={this.props.messageSingleClose['message']}
                  _positiveHandler={this.props.messageSingleClose['handlerPositive']}/>
              </div>
            </ModalBackground>
          </ModalBox>
        }
        {
          this.props.messageSingle['render'] &&
          <ModalBox containerId="root">
            <ModalBackground onClose={()=>{this._set_Dialog();}} style={{position: "fixed", backgroundColor: 'rgba(51, 51, 51, 0.3)'}}>
              <div
                className={"boxDialog"}>
                <SingleDialog
                  message={this.props.messageSingle['message']}
                  buttonValue={this.props.messageSingle['buttonValue']}
                  _positiveHandler={this.props.messageSingle['handlerPositive']}/>
              </div>
            </ModalBackground>
          </ModalBox>
        }
        {
          this.props.messageBoolean['render'] &&
          <ModalBox containerId="root">
            <ModalBackground onClose={()=>{this._set_Dialog();}} style={{position: "fixed", backgroundColor: 'rgba(51, 51, 51, 0.3)'}}>
              <div
                className={"boxDialog"}>
                <BooleanDialog
                  customButton={this.props.messageBoolean['customButton']}
                  message={this.props.messageBoolean['message']}
                  _positiveHandler={this.props.messageBoolean['handlerPositive']}
                  _negativeHandler={this.props.messageBoolean['handlerNegative']}/>
              </div>
            </ModalBackground>
          </ModalBox>
        }
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    messageSingle: state.messageSingle,
    messageSingleClose: state.messageSingleClose,
    messageBoolean: state.messageBoolean
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _fetch_belongRecords: () => {dispatch(fetchBelongRecords())},
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(WithinAround));
