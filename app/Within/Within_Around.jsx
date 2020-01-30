import React from 'react';
import {
  Route,
  Switch,
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import Around from './partAround/Around.jsx';
import CosmicCorner from './component/CosmicCorner/CosmicCorner.jsx';
import {
  setMessageSingleClose
} from '../redux/actions/general.js'
import NavOptions from '../Component/NavOptions.jsx';
import ModalBox from '../Component/ModalBox.jsx';
import ModalBackground from '../Component/ModalBackground.jsx';
import SingleCloseDialog from '../Component/Dialog/SingleCloseDialog/SingleCloseDialog.jsx';
import BooleanDialog from '../Component/Dialog/BooleanDialog/BooleanDialog.jsx';

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
      Within_Around_corner_: {
        position: 'fixed',
        bottom: '2.4%',
        right: '20%',
        boxSizing: 'border-box'
      },
      Within_Around_NavOptions: {
        width: '1.4%',
        height: '3.2%',
        position: 'fixed',
        bottom: '6.9%',
        right: '1%',
        boxSizing: 'border-box'
      }
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
        this.setState((prevState, props)=>{
          let switchTo = {
            params: route,
            query: ''
          };
          return {switchTo: switchTo}
      })
    }
  }

  static getDerivedStateFromProps(props, state){
    //It should return an object to update the state, or 'null' to update nothing.
    return null;
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

  }

  componentWillUnmount() {

  }

  render(){
    if(this.state.switchTo){return <Redirect to={this.state.switchTo.params+this.state.switchTo.query}/>}

    return(
      <div>
        <div style={this.style.Within_Around_backplane}></div>
        <Switch>

          <Route path={this.props.match.path} render={(props)=> <Around {...props} _refer_von_cosmic={this._refer_von_cosmic}/>}/>
        </Switch>
        <div
          style={this.style.Within_Around_corner_}>
          <CosmicCorner {...this.props}/>
        </div>
        <div style={this.style.Within_Around_NavOptions}>
          <NavOptions {...this.props}/>
        </div>
        {
          //here and beneath, are dialog system for global used,
          //the series 'message' in redux state is prepared for this kind of global message dialog
          this.props.messageSingleClose &&
          <ModalBox containerId="root">
            <ModalBackground onClose={()=>{this._set_Dialog();}} style={{position: "fixed", backgroundColor: 'rgba(52, 52, 52, 0.36)'}}>
              <div
                className={"boxDialog"}>
                <SingleCloseDialog
                  message={this.props.messageSingleClose}
                  _positiveHandler={()=>{this.props._set_MessageSinClose(null)}}/>
              </div>
            </ModalBackground>
          </ModalBox>
        }
        {
          this.props.messageBoolean['render'] &&
          <ModalBox containerId="root">
            <ModalBackground onClose={()=>{this._set_Dialog();}} style={{position: "fixed", backgroundColor: 'rgba(52, 52, 52, 0.36)'}}>
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
    messageSingleClose: state.messageSingleClose,
    messageBoolean: state.messageBoolean
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _set_MessageSinClose: (message) => { dispatch(setMessageSingleClose(message)); }
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(WithinAround));