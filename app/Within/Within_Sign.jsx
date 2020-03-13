import React from 'react';
import {
  Route,
  Switch,
  Link,
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import Around from './partAround/Around.jsx';

import NavOptions from '../Components/NavOptions.jsx';

class WithinAround extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._refer_von_cosmic = this._refer_von_cosmic.bind(this);
    this.style={
      Within_Around_backplane:{
        width: '100%',
        height: '100%',
        position: 'fixed',
        backgroundColor: '#FCFCFC'
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


  static getDerivedStateFromProps(props, state){
    //It should return an object to update the state, or 'null' to update nothing.
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    return(
      <div>
        <div style={this.style.Within_Around_backplane}></div>
        <Route path={this.props.match.path} render={(props)=> <Around {...props} _refer_von_cosmic={this._refer_von_cosmic}/>}/>

        <div style={this.style.Within_Around_NavOptions}>
          <NavOptions {...this.props}/>
        </div>

      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {

  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(WithinAround));