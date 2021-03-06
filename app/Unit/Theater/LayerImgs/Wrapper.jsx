import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import { connect } from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import ImgsFrame from './ImgsFrame.jsx';
import SidePanel from './SidePanel.jsx';
import Primer from '../components/Primer.jsx';
import {NodesExtensible} from '../../NodesDisplay/NodesExtensible.jsx';
import ImgPreview from '../../../Components/ImgPreview.jsx';
import AccountPalette from '../../../Components/AccountPalette.jsx';
import DateConverter from '../../../Components/DateConverter.jsx';

class Wrapper extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onPrimerImg: false,
      onSpanResponds: false
    };
    this._handleClick_Account = this._handleClick_Account.bind(this);
    this._handleEnter_primerImg = this._handleEnter_primerImg.bind(this);
    this._handleLeave_primerImg = this._handleLeave_primerImg.bind(this);
    this._handleEnter_spanResponds = this._handleEnter_spanResponds.bind(this);
    this._handleLeave_spanResponds = this._handleLeave_spanResponds.bind(this);
    this._handleClick_Primerhref = this._handleClick_Primerhref.bind(this);
    this._handleClick_LinkListResponds = this._handleClick_LinkListResponds.bind(this);
  }

  _handleClick_Account(event){
    event.preventDefault();
    event.stopPropagation();
    // rm this action temporary
    //this.props._refer_toandclose('user', this.props.unitCurrent.authorBasic.authorId);
  }


  render(){
    let nodesTitleObj = this.props.unitCurrent.nouns;
    if(this.props.guidingNailsId.indexOf(this.props.unitCurrent.unitId) != (-1) ){ // guidingNails has its special title
      nodesTitleObj = {
        list: [1],
        basic: {
          1: {name: this.props.i18nUIString.catalog['title_onBoard_GuideNailTitle'][this.props.guidingNailsId.indexOf(this.props.unitCurrent.unitId)]}
        }
      }
    };

    return(
      <div
        className={classnames( styles.comWrapper)}>
        <div
          className={classnames(styles.boxContentWidth, styles.boxTitle)}>
          <NodesExtensible
            nouns={nodesTitleObj}
            _handleClick_listNoun={this.props._refer_toandclose}/>
          <SidePanel
            {...this.props}/>
        </div>
        <div
          className={classnames(styles.boxContentWidth, styles.boxFrame)}>
          <ImgsFrame
            moveCount={this.props.moveCount}
            lockify={this.props.lockify}
            marksStatus={this.props.marksStatus}
            _set_markOpened={this.props._set_markOpened}
            _set_layerstatus={this.props._set_layerstatus}/>
        </div>
        <div
          className={classnames(styles.boxContentWidth, styles.boxBottom)}>
          <div>
            {
              (this.props.guidingNailsId.indexOf(this.props.unitCurrent.unitId) < 0) && // guidingNails do not show the Respond & view responds
              <span
                className={classnames(
                  'colorEditBlack',
                  'fontContentPlain',
                  styles.spanResponds,
                  {[styles.spanRespondsActiv]: this.state.onSpanResponds}
                )}
                onClick={this._handleClick_LinkListResponds}
                onMouseEnter={this._handleEnter_spanResponds}
                onMouseLeave={this._handleLeave_spanResponds}>
                {this.props.i18nUIString.catalog['link_UnitListResponds']}
              </span>
            }
          </div>
          <div
            className={classnames(styles.boxBottomLeft)}>
            <div>
              <div
                className={classnames(styles.boxBottomUpper)}
                style={{color: '#757575'}}
                onClick={this._handleClick_Account}>
                <AccountPalette
                  size={'layer'}
                  accountFirstName={this.props.unitCurrent.authorBasic.firstName}
                  accountLastName={this.props.unitCurrent.authorBasic.lastName}/>
              </div>
              <div
                className={classnames(styles.boxBottomLower)}>
                <div style={{marginRight: '5rem'}}>
                  <DateConverter
                    styles={{color: '#a3a3a3'}}
                    datetime={this.props.unitCurrent.createdAt}/>
                </div>
                <div>
                  {
                    this.props.unitCurrent.primerify &&
                    <Primer
                      {...this.props}/>
                  }
                </div>
              </div>
            </div>
            {
              this.props.unitCurrent.primerify &&
              <Link
                to={''}
                onClick={this._handleClick_Primerhref}
                className={classnames('plainLinkButton', styles.boxLinkPrimerImg)}
                style={{opacity: this.state.onPrimerImg? '1' : "0.3"}}
                onMouseEnter={this._handleEnter_primerImg}
                onMouseLeave={this._handleLeave_primerImg}>
                <ImgPreview
                  blockName={''}
                  previewSrc={'/router/img/'+this.props.unitCurrent.primerSrc+'?type=thumb'}
                  _handleClick_ImgPreview_preview={()=>{/*nothing need to happen*/}}/>
              </Link>
            }
          </div>
        </div>

      </div>
    )
  }

  _handleClick_Primerhref(event){
    event.preventDefault();
    event.stopPropagation();
    if(!this.props.location.pathname.includes('explore/unit')){
      // the browser, which do not know the origin it has was modified, need to be modified again to have the pratical history
      window.history.replaceState(this.props.location.state, '', this.props.location.pathname+this.props.location.search);
    };
    //and Notice! history should be pushed after the replaceState has been done
    let urlParams = new URLSearchParams(this.props.location.search);
    urlParams.set('unitId', this.props.unitCurrent.primer.primerId);
    urlParams.set('unitView', "theater");
    this.props.history.push({
      pathname: this.props.match.path, //should always be ".../unit" because primer only used in a Unit
      search: urlParams.toString(),
      state: {from: this.props.location}
    });
  }

  _handleClick_LinkListResponds(event) {
    event.preventDefault();
    event.stopPropagation();
    this.props._set_state_UnitView("related");
    // now the unitView was switch by the param in URL
    if(!this.props.location.pathname.includes('explore/unit')){
      // the browser, which do not know the origin it has was modified, need to be modified again to have the pratical history
      window.history.replaceState(this.props.location.state, '', this.props.location.pathname+this.props.location.search);
    };
    let nextSearch = this.props.location.search.replace("unitView=theater","unitView=related");
    this.props.history.push({
      pathname: this.props.match.path,
      search: nextSearch,
      state: {from: this.props.location}
    });
  }

  _handleEnter_primerImg(e){
    this.setState({onPrimerImg: true})
  }

  _handleLeave_primerImg(e){
    this.setState({onPrimerImg: false})
  }

  _handleEnter_spanResponds(e){
    this.setState({onSpanResponds: true})
  }

  _handleLeave_spanResponds(e){
    this.setState({onSpanResponds: false})
  }

}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    guidingNailsId: state.guidingNailsId,
    unitCurrent: state.unitCurrent,
    i18nUIString: state.i18nUIString
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(Wrapper));
