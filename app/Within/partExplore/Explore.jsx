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
import styles from './styles.module.css';
import UnitExplore from '../../Unit/UnitExplore/UnitExplore.jsx';

const styleMiddle = {
  comExplore: {
    width: '100%',
    position: 'absolute',
    top: '0',
    left: '0',
    boxSizing: 'border-box'
  },
  boxSubtitle: {
    position: 'fixed',
    bottom: '109px',
    left: '7%'
  },
}

class Explore extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={

    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    let unitify = this.props.location.pathname.includes('/unit');

    return(
      <div
        style={styleMiddle.comExplore}>
        <div
          className={styles.boxMain}
          style={unitify? {top: '7.2vh'}: {}}>
          <Switch>

            <Route path={this.props.match.path+"/unit"} render={(props)=> <UnitExplore {...props} _refer_von_unit={this.props._refer_von_cosmic}/>}/>
          </Switch>
        </div>
        <div
          className={classnames(styles.boxOverlay, styles.boxTop)}
          style={unitify ? {height: '5vh'}: {}}/>
        <div
          className={classnames(styles.boxOverlay, styles.boxBottom)}
          style={unitify ? {height: '66px'}: {}}/>

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
)(Explore));
