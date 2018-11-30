import React from 'react';
import {
  Link,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';
import LtdUnitsRaws from './LtdUnitsRaws.jsx';
import Unit from '../../Component/Unit.jsx';

class LtdUnits extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      unitsList: [],
      unitsBasicSet: {},
      markBasic: {},
      userBasic: {},
      rawsArr: []
    };
    this.axiosSource = axios.CancelToken.source();
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
    this._axios_list_lookout = this._axios_list_lookout.bind(this);
    this._render_LtdUnitsRaws = this._render_LtdUnitsRaws.bind(this);
    this.style={
      withinCom_LtdUnits_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        padding: '1vh 0 0 0'
      },
      withinCom_LtdUnits_div_: {
        width: '101%',
        position: "relative"
      },
      withinCom_LtdUnits_footer: {
        width: '100%',
        height: '10vh',
        position: 'relative'
      }
    }
  }

  _construct_UnitInit(match, location){
    let unitInit=Object.assign(this.state.unitsBasicSet[match.params.id], {marksify: true, initMark: "all", layer: 0});
    return unitInit;
  }

  _axios_list_lookout(url){
    const self = this;
    axios.get(url, {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: self.axiosSource.token
    }).then(function (res) {
        self.setState((prevState, props)=>{
          let resObj = JSON.parse(res.data);
          return({
            axios: false,
            unitsList: resObj.main.unitsList,
            unitsBasicSet: resObj.main.unitsBasicSet,
            markBasic: resObj.main.markBasic,
            userBasic: resObj.main.userBasic
          });
        }, self._render_LtdUnitsRaws);
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

  _render_LtdUnitsRaws(){
    let point = 0;
    let raws = [];
    while (point< this.state.unitsList.length) {
      if(raws.length==1){raws.push(<div key={'key_LtdUnits_raw_pad_'+point} style={{width: '100%', height: '28vh'}}></div>);continue;};
      let number = Math.floor(Math.random()*3)+1;
      if(this.state.unitsList.length-point < number){number = this.state.unitsList.length-point;};
      raws.push(
        <LtdUnitsRaws
          key={'key_LtdUnits_raw_'+point+'_'+number}
          {...this.props}
          point={point}
          number={number}
          unitsList={this.state.unitsList}
          unitsBasicSet={this.state.unitsBasicSet}
          _handleClick_Share={this._handleClick_Share}/>
      )
      point +=  number;
    };
    this.setState({rawsArr: raws});
  }

  componentDidMount(){
    this.setState((prevState, props)=>{return {axios: true};}, ()=>{
      let url = '/router/user/cognition/lookout';
      this._axios_list_lookout(url);
    })
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    //let cx = cxBind.bind(styles);

    return(
      <div
        style={this.style.withinCom_LtdUnits_}>
        <div
          style={this.style.withinCom_LtdUnits_div_}>
          {this.state.rawsArr}
        </div>
        <div style={this.style.withinCom_LtdUnits_footer}></div>
        <Route
          path="/units/:id"
          render={(props)=> <Unit {...props} _construct_UnitInit={this._construct_UnitInit} _refer_von_unit={this.props._refer_leavevonLtd}/>}/>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(LtdUnits));
