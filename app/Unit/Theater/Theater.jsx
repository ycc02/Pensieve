import React from 'react';
import {
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import stylesFont from '../stylesFont.module.css';
import Layers from './Layers.jsx';

class Theater extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.unitInit = this.props._construct_UnitInit(this.props.match, this.props.location);
    this._close_theater = this._close_theater.bind(this);
    this._handleClick_heigherBack = this._handleClick_heigherBack.bind(this);

    this.style={

    };
  }

  _handleClick_heigherBack(){
    event.preventDefault();
    event.stopPropagation();


    //only close if passed all above
    this.props._close_theaterHeigher();
  }

  _close_theater(){
    /*
      This f() was originally dealing the close only the 'theater',
      but for simplified ver., without Related in /Unit,
      we don't really need this f(), so just make it have same ability as _handleClick_heigherBack
    */
    this.props._close_theaterHeigher();
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    //due to update to unitId only still Redirect to a new URL
    //check again to re-define the URL
    if(!this.props.location.pathname.includes('explore/unit')) window.history.replaceState(this.props.location.state, '', '/cosmic/explore/unit?unitId='+this.unitId+'&unitView=theater');
    //Note that, replaceState would also change the behavior of 'back' by browser, (only back to the new path)
    //we need to modify the behavior manually one day by 'popstate' iterate by the replaceState
  }

  componentDidMount(){
    //replace the URL display in the browser bar if not from independt page
    if(!this.props.location.pathname.includes('explore/unit')) window.history.replaceState(this.props.location.state, '', '/cosmic/explore/unit?unitId='+this.unitId+'&unitView=theater');
    //Note that, replaceState would also change the behavior of 'back' by browser, (only back to the new path)
    //we need to modify the behavior manually one day by 'popstate' iterate by the replaceState
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    };
  }

  render(){
    let params = new URLSearchParams(this.props.location.search); //we need value in URL query
    this.unitId = params.get('unitId');
    // modification for small screen
    let cssVW = window.innerWidth; // px of vw in pure integer

    return(
      <div
        className={classnames(styles.comTheater)}>
        <Layers
          {...this.props}
          initStatus={this.unitInit}
          _close_theater={this._close_theater}
          _refer_von_unit={this.props._refer_von_unit}/>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitSubmitting: state.unitSubmitting
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Theater));
