import React, {
  Component
} from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import IScroll from 'iscroll';
import './assets/css/index.css';

import {
  PubCom
} from '../components/public/pub.jsx';



class ZmitiIndexApp extends Component {
  constructor(props) {
    super(props);


    this.state = {
      className: 'active',
      startBtnClass: ''

    }
    this.viewW = document.documentElement.clientWidth;
    this.viewH = document.documentElement.clientHeight;
    window.s = this;
  }
  render() {


    return <div className={'zmiti-index-main-ui '+this.state.className}>
       <img src='./assets/images/top1.png' className='zmiti-index-top'/>
       <div className='zmiti-index-chengjiu'>
        <img src='./assets/images/chengjiu.png'/>
       </div>
       <div className='zmiti-index-text'>
        <img src='./assets/images/text.png'/>
       </div>
       <div className='zmiti-index-logo'>
        <img src='./assets/images/logo.png'/>
       </div>

        <img src='./assets/images/bottom.png' className='zmiti-index-bottom'/>
       <div onClick={this.beginGame.bind(this)} className={'zmiti-index-gamestart '+this.state.startBtnClass } onTouchStart={()=>{this.setState({startBtnClass:'active'})}}  onTouchEnd={()=>{this.setState({startBtnClass:''})}}>
          开始游戏
       </div>

    </div>

  }

  beginGame() {
    this.setState({
      className: 'hide'
    })
  }

  showToast(msg) {
    this.setState({
      toast: msg
    });

    setTimeout(() => {
      this.setState({
        toast: ''
      });
    }, 2000)
  }



  componentDidMount() {
    var {
      obserable
    } = this.props;

    obserable.on('toggleIndex', e => {
      this.setState({
        className: e
      })
    })
  }

}

export default PubCom(ZmitiIndexApp);