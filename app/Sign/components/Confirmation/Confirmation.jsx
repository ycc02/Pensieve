import React from 'react';
import {
  Link,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import stylesFont from '../../stylesFont.module.css';
import {
  LinkMailResend,
} from '../SigninForm/SigninFormComps.jsx';

class ConfirmSuccess extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      ConfirmSuccess_: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        minHeight: '42vh',
        width: '100%',
        boxSizing: 'border-box'
      }
    }
  }

  componentDidMount() {

  }

  componentWillUnmount(){

  }

  render(){
    return(
      <div
        style={this.style.ConfirmSuccess_}>
        <div>
          <span
            className={classnames(stylesFont.fontTitle, stylesFont.colorStandard)}>
            {this.props.i18nUIString.catalog["title_Signup_VefiryConfirm"]}
          </span>
        </div>
        <div
          className={classnames(stylesFont.fontContent, stylesFont.colorSignBlack)}>
          <p>{this.props.i18nUIString.catalog["guidingSign_Confirm_Success"][0]}</p>
          <p>{this.props.i18nUIString.catalog["guidingSign_Confirm_Success"][1]}</p>
        </div>
      </div>
    )
  }
}

class ConfirmFail extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      ConfirmFail_: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        minHeight: '42vh',
        width: '100%',
        boxSizing: 'border-box'
      }
    }
  }

  componentDidMount() {

  }

  componentWillUnmount(){

  }

  render(){
    return(
      <div
        style={this.style.ConfirmFail_}>
        <div>
          <span
            className={classnames(stylesFont.fontTitle, stylesFont.colorBlack85)}>
            {this.props.i18nUIString.catalog["title_Signup_VefiryFail"]}
          </span>
        </div>
        <div
          className={classnames(stylesFont.fontContent, stylesFont.colorSignBlack)}>
          <p>{this.props.i18nUIString.catalog["guidingSign_Confirm_Fail"][0]}</p>
          <p>{this.props.i18nUIString.catalog["guidingSign_Confirm_Fail"][1]}</p>
          <p>{this.props.i18nUIString.catalog["guidingSign_Confirm_Fail"][2]}</p>
          <p style={{textAlign: 'right'}}>
            <LinkMailResend {...this.props}/>
          </p>
        </div>
      </div>
    )
  }
}

class Confirmation extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      Confirmation_: {
        width: '100%',
        paddingBottom: '10vh',
        boxSizing: 'border-box'
      },
    }
  }

  componentDidMount() {

  }

  componentWillUnmount(){

  }

  render(){
    return(
      <div
        style={this.style.Confirmation_}>

        <Route path={this.props.match.path+"/success"} render={(props)=> <ConfirmSuccess {...props} {...this.props}/>}/>
        <Route path={this.props.match.path+"/fail"} render={(props)=> <ConfirmFail {...props} {...this.props}/>}/>
      </div>
    )
  }
}


const mapStateToProps = (state)=>{
  return {
    axios: state.axios,
    message: state.message,
    i18nUIString: state.i18nUIString,
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(Confirmation));
