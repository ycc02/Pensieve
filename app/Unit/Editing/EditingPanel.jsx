import React from 'react';
import {
  Link,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import ContentEditor from './ContentEditor/ContentEditor.jsx';
import NodesEditor from './NodesEditor/NodesEditor.jsx';
import Submit from './components/Submit.jsx';
import ImgImport from './components/ImgImport.jsx';

class EditingPanel extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      contentEditing: false,
      coverSrc: !!this.props.unitSet?this.props.unitSet.coverSrc:null,
      coverMarks: !!this.props.unitSet?this.props.unitSet.coverMarks:{list:[], data:{}},
      nodesSet: {assign:[], tags:[]},
      //beneath, is remaining for future use, and kept the parent comp to process submitting
      beneathSrc: null,
      beneathMarks: {list:[],data:{}},
      refsArr: []
    };
    this._set_newImgSrc = this._set_newImgSrc.bind(this);
    this._set_img_delete = this._set_img_delete.bind(this);
    this._set_Mark_Complete = this._set_Mark_Complete.bind(this);
    this._set_statusEditing = this._set_statusEditing.bind(this);
    this._submit_new_node = this._submit_new_node.bind(this);
    this._submit_newShare = this._submit_newShare.bind(this);
    this._submit_deleteNodes= this._submit_deleteNodes.bind(this);
    this._render_importOrCover = this._render_importOrCover.bind(this);
  }

  _submit_new_node(nodeId, type){
    this.setState((prevState, props)=>{
      prevState.nodesSet[(type=="assign")? 'assign': 'tags'].push(nodeId);

      return {
        nodesSet: prevState.nodesSet
      }
    })
  }

  _submit_deleteNodes(nodeId, type){
    this.setState((prevState, props)=>{
      let targetArr = prevState.nodesSet[(type=="assign")? 'assign': 'tags'];
       targetArr= targetArr.filter((value, index)=>{ // use filter remove id from the list and replace it by new list
        return value != nodeId; //not equal value, but allow different "type" (the nodeId was string saved in the DOM attribute)
      });
      return prevState;
    })
  }

  _set_newImgSrc(dataURL){
    this.setState({
      coverSrc: dataURL,
      contentEditing: true //going to edit directly
    })
  }

  _set_img_delete(){
    /*
      Currently only has layer 'cover',
      so we delete all process related to 'beneath' (refer to previous ver.)
    */
    this.setState((prevState, props)=>{
      let modifiedState = {
        coverSrc: null,
        coverMarks:{list:[], data:{}},
        contentEditing: false
      };

      return modifiedState;
    })
  }

  _set_Mark_Complete(markData, layer){
    this.setState((prevState, props) => {
      return {coverMarks: markData, contentEditing: false};
    });
  }

  _set_statusEditing(bool){
    this.setState((prevState, props)=>{
      return (
        contentEditing: bool
      )
    });
  }

  _submit_newShare(){
    //shallow copy, prevent render init during the modifications
    let newObj = Object.assign({}, this.state);
    /*
      Going to check everything:
      - if the obj contain cover & nodes: give warn
      - no Unit was submitting: give warn
      - not editing: give warn
    */
    if(!newObj["coverSrc"] || newObj['nodesSet'].assign.length < 1) { // the 'img' & 'node assigned to' are required
      this.props._set_warningDialog([{text: "make sure you've already upload 1 image and set at least 1 Node.",style:{}}], 'warning');
      return;
    }else if(this.props.unitSubmitting){
      this.props._set_warningDialog([{text: "submit is processing, please hold on ...",style:{}}], 'warning');
      return;
    }else if(this.state.editing){
      this.props._set_warningDialog([{text: "your edit hasn't completed.", style:{}}], 'warning');
      return;
    };
    //Then if everything is fine
    //seal the mark obj by fill in the lasr undetermined value, 'layer'
    newObj.coverMarks.list.forEach((markKey, index)=>{
      newObj.coverMarks.data[markKey].layer='0';
    });

    this.props._set_Submit(newObj);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  _render_importOrCover(){
    if(!this.state.coverSrc ){
      return(
        <div
          className={styles.boxImgImport}>
          <ImgImport
            _set_newImgSrc={this._set_newImgSrc}/>
        </div>
      )
    }else{
      return(
        <ContentEditor
          editing={this.state.contentEditing}
          imgSrc={this.state.coverSrc}
          marks={this.state.coverMarks}
          _set_statusEditing={this._set_statusEditing}
          _set_Mark_Complete={this._set_Mark_Complete}
          _set_delete={this._set_img_delete}
          _set_warningDialog={this.props._set_warningDialog}/>
      )
    }
  }

  render(){
    return(
      <div
        className={classnames(styles.comEditingPanel)}>
        <div
          className={classnames(styles.boxContent)}>
          {this._render_importOrCover()}
        </div>
        <div
          className={classnames(styles.boxSide, styles.boxSideEdit)}>
          <NodesEditor
            nodesSet={this.state.nodesSet}
            _submit_new_node={this._submit_new_node}
            _submit_deleteNodes={this._submit_deleteNodes}/>
        </div>
        <div
          className={classnames(styles.boxSide, styles.boxBottomPanel)}>
          <Submit
            editing={this.state.contentEditing}
            confirmDialog={this.props.confirmDialog}
            warningDialog={this.props.warningDialog}
            _set_Clear={this.props._set_Clear}
            _submit_newShare={this._submit_newShare}
            _refer_toandclose={this.props._refer_toandclose}/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    belongsByType: state.belongsByType
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(EditingPanel));