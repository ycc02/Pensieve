import React from 'react';
import cxBind from 'classnames/bind';

export default class ExternalPanel extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_selfClose = this._handleClick_selfClose.bind(this);
    this._handleClick_selfCover = this._handleClick_selfCover.bind(this);
    this.style={
      Com_ExternalPanal_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      Com_ExternalPanal_div_: {
        width: '100%',
        height: '33%',
        position: 'relative',
        boxSizing: 'border-box'
      },
      Com_ExternalPanal_div_svg: {
        width: '100%',
        height: '90%',
        position: 'absolute',
        top: '50%',
        left: '0',
        transform: 'translate(0, -50%)',
        boxSizing: 'border-box'
      }
    }
  }

  _handleClick_selfClose(event){
    event.preventDefault();
    event.stopPropagation();
    window.location.assign('/');
  }

  _handleClick_selfCover(event){
    event.preventDefault();
    event.stopPropagation();
    window.location.assign('/self?id=userid');
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.Com_ExternalPanal_}>
        <div
          style={this.style.Com_ExternalPanal_div_}>
          <svg
            style={this.style.Com_ExternalPanal_div_svg}>
            <text x="50%" y="50%" textAnchor="middle" stroke="#999999" strokeWidth="1.2px" fontSize='3vh'>{" x "}</text>
            <circle r="2vh" cx="50%" cy="50%" stroke='#999999' fill="transparent" style={{cursor: 'pointer'}} onClick={this._handleClick_selfClose}/>
          </svg>
        </div>
        <div
          style={this.style.Com_ExternalPanal_div_}>
          <svg
            style={this.style.Com_ExternalPanal_div_svg}>
            <text x="50%" y="50%" textAnchor="middle" stroke="#999999" strokeWidth="0.8px" fontSize='3vh'>{"<-"}</text>
            <circle r="2vh" cx="50%" cy="50%" stroke='#999999' fill="transparent" style={{cursor: 'pointer'}} onClick={this._handleClick_selfCover}/>
          </svg>
        </div>
        <div
          style={this.style.Com_ExternalPanal_div_}>
          <svg
            style={this.style.Com_ExternalPanal_div_svg}>
            <text x="50%" y="50%" textAnchor="middle" stroke="#999999" strokeWidth="0.8px" fontSize='3vh'>{""}</text>
            <circle r="2vh" cx="50%" cy="50%" stroke='#999999' fill="transparent" style={{curcor: 'pointer'}}/>
          </svg>
        </div>
      </div>
    )
  }
}
