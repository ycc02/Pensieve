import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import ModalBox from '../ModalBox.jsx';
import AccountPalette from '../AccountPalette.jsx';
import SvgLogo from '../Svg/SvgLogo.jsx';

class NavOptions extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      mouseOn: false,
      toolBoxify: false
    };
    this._render_NavToolBox = this._render_NavToolBox.bind(this);
    this._render_NavSmallScreen = this._render_NavSmallScreen.bind(this);
    this._handleEnter_CornerOpt = this._handleEnter_CornerOpt.bind(this);
    this._handleLeave_CornerOpt = this._handleLeave_CornerOpt.bind(this);
    this._handleClick_navToolBox = this._handleClick_navToolBox.bind(this);
    this._handleClick_ToolBox_logout = this._handleClick_ToolBox_logout.bind(this);
  }

  _render_NavSmallScreen(){
    /*
    basically charge for screen width < 860
    depend on css class '.smallDisplayBox'
    */
    let currentPath = this.props.location.pathname;

    if(this.props.tokenStatus != 'verified' &&  currentPath.includes('explore/unit')){
      return(
        <div
          id={"NavOptions_Self_small"}
          className={classnames(
            styles.selfCom_NavOptions_svg_, 'colorWhite', 'fontSubtitle',
            styles.smallDisplayBox
          )}
          onClick={(e)=>{e.preventDefault(); e.stopPropagation(); window.location.assign('/');}}>
          {this.props.i18nUIString.catalog['submit_nav_Signin']}
        </div>
      );
    }
    else if( currentPath.includes('profile')){ //special one for path 'self/profile'
      return(
        <div
          id={"NavOptions_Self_small"}
          className={classnames(
            styles.selfCom_NavOptions_svg_, 'colorWhite', 'fontSubtitle',
            styles.smallDisplayBox
          )}
          onClick={(e)=>{e.preventDefault(); e.stopPropagation(); this.props.history.goBack()}}>
          {this.props.i18nUIString.catalog['submit_back']}
        </div>
      )
    }
    else if( currentPath.includes('/unit')){
      return(
        <div
          id={"NavOptions_Self_small"}
          className={classnames(
            styles.selfCom_NavOptions_svg_, 'colorWhite', 'fontSubtitle',
            styles.smallDisplayBox
          )}
          onClick={(e)=>{e.preventDefault(); e.stopPropagation(); this.props._refer_to()}}>
          {this.props.i18nUIString.catalog['submit_close']}
        </div>
      )
    }
    else{
      return(
        <div
          id={"NavOptions_Self_small"}
          className={classnames(
            styles.selfCom_NavOptions_svg_, 'colorWhite',
            styles.smallDisplayBox
          )}
          onClick={this._handleClick_navToolBox}>
          <AccountPalette
            size={'regular'}
            accountFirstName={this.props.userInfo.firstName}
            accountLastName={this.props.userInfo.lastName}
            styleFirst={{ fontWeight: '600' }}/>
        </div>

      )
    }; // end of 'if'

  }

  _render_NavToolBox(){
    if(this.state.toolBoxify){
      return (
        <ModalBox containerId={this.state.toolBoxify}>
          <div
            className={classnames(
              styles.selfCom_NavOptions_ToolBox_,
              styles.fontContent,
              'colorOptionsBlack'
            )}>
            <div style={{marginBottom: '2rem'}}>
              <span style={{fontSize: '1.6rem'}}>
                {this.props.i18nUIString.catalog["message_hello"]}
              </span>
              <AccountPalette
                size={'regular'}
                accountFirstName={this.props.userInfo.firstName}
                accountLastName={this.props.userInfo.lastName}
                styleFirst={{ color: '#f3b55a'}} />
            </div>

            <ol
              className={styles.boxOlist}>
              <li
                method="account"
                className={classnames(styles.boxLiItem)}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); this.props._refer_to('', '/self/profile/sheet') }}
                onMouseEnter={this._handleEnter_CornerOpt}
                onMouseLeave={this._handleLeave_CornerOpt}>
                <span
                  style={(this.state.mouseOn == 'account') ? {borderBottom: "solid 1px #333333"}:{}}>
                  {this.props.i18nUIString.catalog["submit_Options_profile"]}
                </span>
              </li>
            </ol>

            <div
              className={styles.boxLogout}>
              <span
                method="logout"
                style={{cursor: 'pointer', borderBottom: (this.state.mouseOn == 'logout') ? "solid 1px #333333": ""}}
                onClick={this._handleClick_ToolBox_logout}
                onMouseEnter={this._handleEnter_CornerOpt}
                onMouseLeave={this._handleLeave_CornerOpt}>
                {this.props.i18nUIString.catalog["submit_logout"]}
              </span>
            </div>
          </div>
        </ModalBox>
      )
    }
    else {
      return null;
    }
  }

  render(){
    return(
      <div
        className={classnames(styles.comNavOption)}>
        <div
          className={classnames(styles.boxLogo, styles.smallDisplayBox)}
          onClick={(e)=>{e.preventDefault(); e.stopPropagation(); this.props._refer_to('', '/')}}>
          <SvgLogo
            reverseColor={true}/>
        </div>

        { this._render_NavSmallScreen()
          /*Notice, this render method actually deal with only situation the screen width < 860px
          and the rest (>860px) would rely on the next DOM beneath*/
        }
        {
          (this.props.tokenStatus == 'verified') &&
          <div
            id={"NavOptions_Self_"}
            className={classnames(styles.selfCom_NavOptions_svg_, 'colorDescripBlack', styles.smallDisplayNone)}
            onClick={this._handleClick_navToolBox}>
            <AccountPalette
              size={'regular'}
              accountFirstName={this.props.userInfo.firstName}
              accountLastName={this.props.userInfo.lastName}
              styleFirst={{ display: 'block', fontWeight: '600' }}
              styleLast={{ display: 'block'}} />
          </div>
        }
        {this._render_NavToolBox()}
      </div>
    )
  }

  _handleClick_navToolBox(event){
    event.stopPropagation();
    event.preventDefault();
    let currentTarget = event.currentTarget.attributes.id.value;
    this.setState((prevState, props)=>{
      return {toolBoxify: prevState.toolBoxify?false: currentTarget }
    })
  }

  _handleClick_ToolBox_logout(event){
    event.stopPropagation();
    event.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('tokenRefresh');
    window.location.assign('/');
  }

  _handleEnter_CornerOpt(e) {
    //don't need to stop proppagation,
    //because both the 'onMouseEnter' & 'onMouseLeave'
    //would not 'bubble'
    this.setState({
      mouseOn: e.currentTarget.attributes.method.value
    })
  }

  _handleLeave_CornerOpt(e) {
    //don't need to stop proppagation,
    //because both the 'onMouseEnter' & 'onMouseLeave'
    //would not 'bubble'
    this.setState({
      mouseOn: ''
    })
  }

}

const mapStateToProps = (state)=>{
  return {
    tokenStatus: state.token,
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(NavOptions));
