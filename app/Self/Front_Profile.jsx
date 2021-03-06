import React from 'react';
import {
  Route,
  Switch,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import Sheet from './Profile/Sheet.jsx';
import NavProfile from './Profile/NavProfile.jsx';
import NavWithin from '../Components/NavWithin/NavWithin.jsx';
import NavOptions from '../Components/NavOptions/NavOptions.jsx';

class FrontProfile extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      switchTo: null
    };
    this.style={
      Front_Profile_backplane:{
        width: '100%',
        height: '100%',
        position: 'fixed',
        backgroundColor: '#FCFCFC'
      },
      Within_NavOptions: {
        width: '1.4%',
        height: '3.2%',
        position: 'fixed',
        bottom: '6.9%',
        right: '1%',
        boxSizing: 'border-box'
      }
    }
  }

  _refer_leaveSelf(identifier, route){
    switch (route) {
      case 'user':
        if(identifier == this.props.userInfo.id){
          window.location.assign('/user/screen');
        }else{
          window.location.assign('/cosmic/users/'+identifier+'/accumulated');
        }
        break;
      case 'noun':
        window.location.assign('/cosmic/nodes/'+identifier);
        break;
      default:
        window.location.assign(route)
    }
  }

  render(){
    if(this.state.switchTo){return <Redirect to={this.state.switchTo.params+this.state.switchTo.query}/>}

    return(
      <div>
        <div style={this.style.Front_Profile_backplane}></div>
        <div
          className={classnames(styles.boxProfile)}>
          <div
            className={classnames(styles.boxNavOptions)}>
            <NavOptions {...this.props}/>
          </div>
          <div
            className={classnames(styles.boxContent)}>
            <div
              className={classnames(styles.boxContentCenter)}>
              <Switch>
                <Route path={this.props.match.path+"/sheet"} render={(props)=> <Sheet {...props}/>}/>

              </Switch>
            </div>

            <div style={{width:'100%', height: '10vh', position: 'unset', bottom: 'unset', backgroundColor: 'transparent'}}></div>
          </div>

          <div
            className={classnames(styles.boxNavProfile)}>
            <NavProfile/>
          </div>
          <div className={classnames(styles.boxDecoBottom)}></div>
          <div
            className={classnames(styles.boxNavAround)}>
            <NavWithin {...this.props} _refer_to={this._refer_leaveSelf}/>
          </div>

        </div>

      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    axios: state.axios
  }
}
export default withRouter(connect(
  mapStateToProps,
  null
)(FrontProfile));
