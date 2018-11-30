import React from 'react';
import {
  Route,
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import NailShared from './NailShared.jsx';
import Unit from '../../Component/Unit.jsx';

class Tracks extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      unitsList: [],
      unitsBasic: {},
      authorsBasic: {}
    };
    this.axiosSource = axios.CancelToken.source();
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
    this.style={
      selfCom_Tracks_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      }
    }
  }

  _construct_UnitInit(match, location){
    let unitInit= Object.assign(this.state.unitsBasic[match.params.id], {marksify: true, initMark: "all", layer: 0});
    return unitInit;
  }

  componentDidMount(){
    const self = this;
    axios.get('/router/collaterals/tracks', {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      }
    }).then((res)=>{
      let resObj = JSON.parse(res.data);
      self.setState({
        axios: false,
        unitsList: resObj.main.unitsList,
        unitsBasic: resObj.main.unitsBasic,
        authorsBasic: resObj.main.authorsBasic
      });
    }).catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled: ', thrown.message);
      } else {
        self.setState({axios: false});
        if (thrown.response) {
          // The request was made and the server responded with a status code that falls out of the range of 2xx
          alert('Something went wrong: '+thrown.response.data.message)
          if(thrown.response.status == 403){
            window.location.assign('/login');
          }
        } else if (thrown.request) {
            // The request was made but no response was received
            // `err.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(thrown.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error: ', thrown.message);
        }
        console.log("Error config: "+thrown.config);
      }
    });
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    const self = this;
    let nails = self.state.unitsList.map(function(dataKey, index){
      let dataValue = self.state.unitsBasic[dataKey];
      return(
        <NailShared
          {...self.props}
          key={'key_Shared_nails_'+index}
          sharedId={dataKey}
          unitBasic={dataValue}/>
      )
    })

    return(
      <div
        style={this.style.selfCom_Tracks_}>
        <div
          style={this.style.selfCom_Tracks_nails_}>
          {nails}
        </div>
        <Route path={this.props.match.path+"/units/:id"} render={(props)=> <Unit {...props} _construct_UnitInit={this._construct_UnitInit} _refer_von_unit={this.props._refer_leaveSelf}/>}/>
      </div>
    )
  }
}

class Collaterals extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      close: false
    };
    this._handleClick_Reidrect_back= this._handleClick_Reidrect_back.bind(this);
    this.style={
      selfCom_Collaterals_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        padding: '2vh 0'
      },
      selfCom_Collaterals_Navs_: {
        width: '64%',
        height: '6vh',
        position: 'fixed',
        top: '2vh',
        right: '4%',
        boxSizing: 'border-box',
        padding: '1vh 2%'
      },
      selfCom_Collaterals_Navs_button_: {
        fontSize: '1.1rem',
        fontWeight: '300',
        letterSpacing: '0.2rem',
        cursor: 'pointer'
      },
      selfCom_Collaterals_main_: {
        width: '100%',
        position: 'absolute',
        top: '16vh',
        left: '0'
      }
    }
  }

  _handleClick_Reidrect_back(event){
    event.preventDefault();
    event.stopPropagation();
    this.setState({close: true})
  }

  render(){
    //let cx = cxBind.bind(styles);
    return this.state.close?(
      <Redirect to={this.props.location.state.from}/>
    ):(
      <div
        style={this.style.selfCom_Collaterals_}>
        <div
          key={"key_Link_nav_Collaterals"}
          style={this.style.selfCom_Collaterals_Navs_}>
          <span
            style={this.style.selfCom_Collaterals_Navs_button_}
            onClick={this._handleClick_Reidrect_back}>
            {'collaterals'}</span>
        </div>
        <nav>
        </nav>
        <div
          style={this.style.selfCom_Collaterals_main_}>
          <Route path={this.props.match.path+"/tracks"} render={(props)=> <Tracks {...props} _refer_leaveSelf={this.props._refer_leaveSelf}/>}/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(Collaterals));
