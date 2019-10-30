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
import styles from "./styles.module.css";
import CreateShare from '../../../Component/CreateShare.jsx';
import {NodeSearchModule} from '../../../Component/NodeSearchModule.jsx';
import {updateNodesBasic} from '../../../redux/actions/general.js'


class BelongbyType extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      settingModal: false,
      onNode: false,
      onType: false
    };
    this._render_type = this._render_type.bind(this);
    this._render_type_used = this._render_type_used.bind(this);
    this._render_nodeLink = this._render_nodeLink.bind(this);
    this._set_choiceFromSearch = this._set_choiceFromSearch.bind(this);
    this._handleClick_belongSetting = this._handleClick_belongSetting.bind(this);
    this._handleMouseOn_Node = ()=> this.setState((prevState,props)=>{return {onNode: prevState.onNode?false:true}});
    this._handleMouseOn_Type = ()=> this.setState((prevState,props)=>{return {onType: prevState.onType?false:true}});
    this._set_settingModal = ()=> this.setState((prevState, index)=>{return {settingModal: prevState.settingModal? false: true}});
    this.style={

    }
  }

  _handleClick_belongSetting(event){
    event.preventDefault();
    event.stopPropagation();

    this._set_settingModal();
  }

  _submit_Share_New(dataObj){
    window.location.assign('/user/cognition/actions/shareds/unit?theater&unitId='+dataObj.unitId);
  }

  _set_choiceFromSearch(nodeBasic){
    //create obj to fit the format of state in redux
    let insertObj = {};
    insertObj[nodeBasic.id] = nodeBasic;

    //pass the node basic into redux first,
    //so the handler would not need to fetch node data from db again
    this.props._submit_Nodes_insert(insertObj);
    //no need to fetch node data from db again for any condition gave the choice a non-false value
    //has already save the data of node in reducer.

    //and pass the choice to
    this.props._set_choiceAnType(nodeBasic.id, this.props.type);

    this.setState((prevState,props)=>{
      return {
        settingModal: false
      };
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _render_nodeLink(){
    //determine the id of current node, but Notice
    //the value of key 'used' is an array, to recognize it
    //we need to follow the length of the whole Belong list --- currently there are 3 tiems before the 1sr 'used'
    const nodeId = (this.props.type != 'used') ? this.props.typeObj[this.props.type] : this.props.typeObj['used'][(this.props.listIndex-3)];

    return (
      <div
        className={classnames(styles.boxDepend)}>
        <Link
          to={"/cosmic/nodes/"+nodeId}
          className={classnames('plainLinkButton', styles.boxNode)}
          onMouseEnter={this._handleMouseOn_Node}
          onMouseLeave={this._handleMouseOn_Node}>
          <div
            className={classnames(styles.spanNode, styles.fontNode)}>
            {
              this.state.onNode &&
              <span style={{
                  width: '74%', position: 'absolute', bottom: '10%', left: '5%',
                  borderBottom: 'solid 1px #ff7a5f'
                }}/>
            }
            {nodeId in this.props.nounsBasic ? (
              this.props.nounsBasic[nodeId].name) : (
                null
            )}
          </div>
        </Link>
        <div
          className={classnames(styles.boxCount)}>
          <span
            className={classnames(styles.spanType, styles.fontType)}>
            {"way to "}</span>
          <span
            className={classnames(styles.spanType, styles.fontCount)}>
            {
              !!(nodeId in this.props.nodesSharedCount) &&
              this.props.nodesSharedCount[nodeId]
            }</span>
        </div>
      </div>
    )
  }

  _render_type(){
    return (
      <div
        title={this.props.i18nUIString.catalog["descript_BelongTypeInteract"][0]+this.props.type+this.props.i18nUIString.catalog["descript_BelongTypeInteract"][1]}
        className={classnames(styles.boxTitleType)}
        onMouseEnter={this._handleMouseOn_Type}
        onMouseLeave={this._handleMouseOn_Type}
        onClick={this._handleClick_belongSetting}>
        <span
          className={classnames(
            styles.spanType,
            styles.fontType,
            {[styles.fontOnType]: this.state.onType}
          )}
          style={{lineHeight: '3rem'}}>
          {this.props.type}</span>
      </div>
    )
  }

  _render_type_used(){
    //'used' display is different, so er render it seperately
    //first, check if the data ready
    let nodeIfy = !!(this.props.typeObj['used']) ? true: false;
    //if the 'used' exist, the value of it is an array, to recognize it
    //we need to follow the length of the whole Belong list --- currently there are 3 tiems before the 1sr 'used'
    if(nodeIfy) nodeIfy = !!(this.props.typeObj['used'][(this.props.listIndex-3)]);

    return (
      <div
        className={classnames(styles.boxTitleType)}
        style={{cursor: nodeIfy? 'default': 'pointer'}}
        onMouseEnter={this._handleMouseOn_Type}
        onMouseLeave={this._handleMouseOn_Type}>
        <span
          className={classnames(
            styles.spanType,
            styles.fontType,
            {[styles.fontOnType]: (this.state.onType && !nodeIfy)}
          )}
          style={{lineHeight: '3rem'}}>
          {this.props.type}</span>
        {
          !nodeIfy &&
          <div
            className={classnames(styles.boxCreate)}>
            <CreateShare
              _submit_Share_New={this._submit_Share_New}
              _refer_von_Create={this.props._refer_von_cosmic}/>
          </div>
        }

      </div>
    )

  }

  render(){

    return(
      <div
        className={classnames(styles.comBelongByType)}>
        { //keep NodeSearchModule prior to the title type so it would not block the title
          this.state.settingModal &&
          <div
            className={classnames(styles.boxSettingModal)}>
            <div
              className={classnames(styles.boxTypeSetting)}>
              <span
                className={classnames(
                  styles.spanType,
                  styles.fontType,
                  styles.fontOnType
                )}
                style={{lineHeight: '3rem'}}>
                {this.props.type}</span>
            </div>
            <NodeSearchModule
              type={"belong"}
              _set_nodeChoice={this._set_choiceFromSearch}
              _set_SearchModal_switch={this._set_settingModal}
              _handleClick_SearchModal_switch={(e)=>{e.preventDefault();e.stopPropagation();this._set_settingModal();}}/>
          </div>
        }
        {(this.props.type=="used") ? this._render_type_used() : this._render_type()}
        {
          //only render the node if there is a data in typeObj (empty in default)
          (!!(this.props.type in this.props.typeObj) && !this.state.settingModal) &&
          this._render_nodeLink()
        }
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    i18nUIString: state.i18nUIString,
    nounsBasic: state.nounsBasic,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_Nodes_insert: (obj) => { dispatch(updateNodesBasic(obj)); },
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(BelongbyType));
