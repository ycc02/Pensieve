import React from 'react';
import {
  Link,
  Switch,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesFont from '../../stylesFont.module.css';
import {
  LinkForgetPw,
  LinkMailResend,
} from './SigninFormComps.jsx';
import {
  cancelErr,
  uncertainErr
} from "../../../utils/errHandlers.js";

class SigninForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      resCode: null,
      resMessage: "",
    };
    this.axiosSource = axios.CancelToken.source();
    this._axios_Signin = this._axios_Signin.bind(this);
    this._handle_Signin = this._handle_Signin.bind(this);
  }

  _handle_Signin(event){
    event.preventDefault();
    let submitObj = {
      email: this.emailInput.value,
      password: this.passwordInput.value
    };
    const self = this;
    this.setState({axios: true});

    this._axios_Signin(submitObj)
    .then(()=>{
      this.props._signin_success();

    })
    .catch(function (thrown) {
      self.setState({axios: false});
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);
        if(typeof message == 'object'){ //basically, not a string
          if('code33' in message) {self.setState({resCode: '33'}); message = message.message};
        }
        if(message) self.setState({resMessage: message});
      }
    });
  }

  _axios_Signin(submitObj){
    return axios.post('/router/login', submitObj, {
      headers: {'charset': 'utf-8'},
      cancelToken: this.axiosSource.token
    }).then(function (res) {
      window.localStorage['token'] = res.data.token; //'access token', used in usual case
      window.localStorage['tokenRefresh'] = res.data.tokenRefresh; //'refresh token', used in case the access token expired
      return;
    })
    .catch((err)=>{
      throw err;
    })
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    const message = this.state.resMessage;
    return(
      <div
        className={styles.comSigninForm}>
        <form onSubmit={this._handle_Signin}>
          <span
            className={classnames(styles.spanTag, stylesFont.fontContent, stylesFont.colorSignBlack)}>
            {'Email'}
          </span><br/>
          <input
            type="email"
            placeholder="example@mail.com"
            name="email"
            required
            className={classnames(styles.boxInput, stylesFont.fontContent, stylesFont.colorBlack85)}
            ref={(element)=>{this.emailInput = element}}/><br/>
          {
            message.email &&
            <div
              className={classnames()}>
              {message.email}</div>
          }
          <span
            className={classnames(styles.spanTag, stylesFont.fontContent, stylesFont.colorSignBlack)}>
            {'Password'}
          </span><br/>
          <input
            type="password"
            placeholder="Password"
            required
            className={classnames(styles.boxInput, stylesFont.fontContent, stylesFont.colorEditBlack)}
            ref={(element)=>{this.passwordInput = element}}/><br/>
          {
            message.password &&
            <div
              className={classnames()}>
              {message.password}</div>
          }
          <br/>
          {
            message.warning &&
            <div
              className={classnames()}>
              {message.warning}</div>
          }
          <div
            className={classnames(styles.boxAssist)}>
            <LinkForgetPw {...this.props}/>
            {
              message.warning && this.state.resCode == "33" &&
              <LinkMailResend {...this.props}/>
            }
          </div>

          <input
            type='submit'
            value='Sign in'
            disabled={this.state.axios? true:false}
            className={classnames(styles.boxSubmit, stylesFont.colorWhite, stylesFont.fontSubtitle)}/>
        </form>
      </div>


    )
  }
}

const mapStateToProps = (state)=>{
  return {
    i18nUIString: state.i18nUIString,
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(SigninForm));
