import React from 'react';
import { connect } from "react-redux";
import OpenedMark from '../../OpenedMark/OpenedMark.jsx';
import MarkEditingBlock from '../../OpenedMark/MarkBlocks/MarkEditingBlock.jsx';
import SvgCircle from '../../../Components/Svg/SvgCircle.jsx';
import {
  baseHorizonRatial
} from '../../props.js';

class ImgLayerEditing extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      imgWidthHeight: false
    };
    this.Com_ImgLayer_box = React.createRef();
    this.Com_ImgLayer_img = React.createRef();
    this.Com_MarksSpotLayer_div = React.createRef();
    this._set_markJump = this._set_markJump.bind(this);
    this._render_MarksLayer = this._render_MarksLayer.bind(this);
    this._handleClick_SpotsLayer = this._handleClick_SpotsLayer.bind(this);
    this._handleClick_ImgLayer_circle = this._handleClick_ImgLayer_circle.bind(this);
    this._set_imgSize = ()=>{this.setState({imgWidthHeight:true})};
    this.style = {
      Com_ImgLayer_img: {
        maxWidth: '100%',
        maxHeight: '100%',
        right: baseHorizonRatial+'%',
        transform: 'translate('+baseHorizonRatial+'%,-50%)'
      }
    };
  }

  _handleClick_SpotsLayer(event){
    event.stopPropagation();
    event.preventDefault();
    if(this.props.marksList.length >0){ //we now want user only to write in one Mark, so limit the marksList length
      this.props._set_warningDialog([{text: "A better spot? Please delete the old one first before create a new!", style:{}}], 'warning');
      return;
    };

    let originalCoordinate = {
      clickX : event.clientX,
      clickY : event.clientY,
      holdingLeft: this.Com_MarksSpotLayer_div.current.getBoundingClientRect().left,
      holdingTop: this.Com_MarksSpotLayer_div.current.getBoundingClientRect().top,
      holdingWidth: this.Com_MarksSpotLayer_div.current.clientWidth,
      holdingHeight: this.Com_MarksSpotLayer_div.current.clientHeight
    };

    let portionCoordinate = {
      top: ((originalCoordinate.clickY-originalCoordinate.holdingTop)/originalCoordinate.holdingHeight*100),
      left: ((originalCoordinate.clickX-originalCoordinate.holdingLeft)/originalCoordinate.holdingWidth*100)
    };
    this.props._set_markNewSpot(portionCoordinate);
  }

  _handleClick_ImgLayer_circle(event){
    event.preventDefault();
    event.stopPropagation();
    if(!this.props.markOpened) this.props._set_Markvisible(event.currentTarget.getAttribute('id'));
  }

  _set_markJump(direction, currentSerial){
    let markKey;
    switch (direction) {
      case 'next':
        markKey = this.props.marksList[(currentSerial+1)];
        this.props._set_Markvisible(markKey);
        break;
      case 'previous':
        markKey = this.props.marksList[(currentSerial-1)];
        this.props._set_Markvisible(markKey);
        break;
      case 'continue':
        this.props._set_Markvisible(this.props.currentMark);
        break;
      default:
        return
    }
  }

  _render_MarksLayer(){
    let imgWidthHeight = {
      width: this.Com_ImgLayer_img.current.clientWidth,
      height: this.Com_ImgLayer_img.current.clientHeight
    },
      //create the 'relation between img and box', then pass to marklayer as a reference for counting
      //don't use customized statics, raising the maintanance difficulty
      imgPosition = {
        left: this.Com_ImgLayer_img.current.offsetLeft
      },
      boxWidth=this.Com_ImgLayer_box.current.clientWidth;
      let markIndex = this.props.marksList.indexOf(this.props.currentMark);

      if(this.props.markOpened && ( markIndex > (-1))){
        //to mimic the structure used by Unit when displaying
        let marksData = {list: this.props.marksList,data:{}};
        marksData['data'][this.props.currentMark]={
          top: this.props.markCircles[this.props.currentMark].top,
          left: this.props.markCircles[this.props.currentMark].left
        }
        return (
          <OpenedMark
            {...this.props}
            boxWidth={boxWidth}
            serial={markIndex+1}
            currentSerial={markIndex}
            marksData={marksData}
            imgPosition={imgPosition}
            imgWidthHeight={imgWidthHeight}
            _handleClick_ImgLayer_circle={this._handleClick_ImgLayer_circle}
            _set_markJump={this._set_markJump}>
            <MarkEditingBlock
              markKey = {this.props.currentMark}
              contentRaw={this.props.markEditorContent[this.props.currentMark]}
              _set_markUpdate_editor={this.props._set_markUpdate_editor}
              _set_markDelete={this.props._set_markDelete}
              _reset_expandState={this.props._reset_expandState}/>
          </OpenedMark>
        );
      }else{
        const self = this;
        let circlesArr = self.props.marksList.map(function(id, index){
          const coordinate = self.props.markCircles[id];
          return (
            <div
              id={id}
              key={"key_Mark_Circle_"+index}
              className={'boxMarkSpot'}
              style={{top: coordinate.top+"%", left: coordinate.left+'%'}}
              onClick={self._handleClick_ImgLayer_circle}>
              <SvgCircle
                serial={index+1}
                notify={false}
                current={false}/>
            </div>
          )
        });
        return (
          <div
            ref={this.Com_MarksSpotLayer_div}
            className={'boxImgPosition'}
            style={{
              width: imgWidthHeight.width,
              height: imgWidthHeight.height,
              right: baseHorizonRatial+'%',  //it's wierd, because this is a remain from previous ver., which need to set the value not the center
              transform: 'translate('+baseHorizonRatial+'%,-50%)',
              cursor: 'crosshair'}}
              onClick={this._handleClick_SpotsLayer}>
              {circlesArr}
          </div>
        );
      }
  }

  render(){
    return(
      <div
        ref={this.Com_ImgLayer_box}
        className={'boxAbsoluteFull'}>
        <img
          className={'boxImgPosition'}
          style={this.style.Com_ImgLayer_img}
          ref={this.Com_ImgLayer_img}
          src={this.props.imgSrc}
          onLoad={this._set_imgSize}/>
        {
          this.state.imgWidthHeight &&
          this._render_MarksLayer()
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    unitSubmitting: state.unitSubmitting
  }
}

export default connect(
  mapStateToProps,
  null
)(ImgLayerEditing);
