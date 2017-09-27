import React, {
  Component
} from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import './assets/css/index.css';
import {
  PubCom
} from '../components/public/pub.jsx';


var data = {
  wxappid: 'wxec2401ee9a70f3d9',
  wxappsecret: 'fc2c8e7c243da9e8898516fa5da8cbbb'
}
class ZmitiShareApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      className: 'hide',
      wish: '',
      transX: 0,
      transY: 0
    }
    this.viewW = document.documentElement.clientWidth;
    this.viewH = document.documentElement.clientHeight;

  }
  getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return (r[2]);
    return null;
  }
  render() {


    var s = this;


    return <div className={'zmiti-share-main-ui '+ this.state.className}>
        <div className='zmiti-share-bg'>
          <div className='zmiti-share-info'>
            <div>{this.state.nickname}在“中国成就”拼图游戏中</div>
            <div>用时:{this.state.duration||0}s</div>
            <div>成功闯到第{this.state.gk}关!</div>
            <div className='zmiti-puzzle-img'>
              <img src={this.state.src}/>
            </div>

            <div className='zmiti-medo'>
              <a href={window.href}><img src='./assets/images/medo.png'/></a>
            </div>
          </div>
        </div>
    </div>

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
      obserable,
      wxConfig,
      log,
      nickname,
      changeURLPar,
      border,
      file,
      wish,
      transX,
      transY

    } = this.props;

    var s = this;
    var src = s.getQueryString('src');
    var nickname = s.getQueryString('nickname');
    var duration = s.getQueryString('duration');
    var gk = s.getQueryString('gk');

    if (src && duration) {
      this.setState({
        src,
        className: '',
        nickname,
        duration,
        gk
      });

    }

    obserable.on('showShare', e => {
      this.setState({
        className: '',
        allduration: e.durantion,
        gk: e.gk
      });
    });
  }

  changeURLPar(url, arg, val) {
    var pattern = arg + '=([^&]*)';
    var replaceText = arg + '=' + val;
    return url.match(pattern) ? url.replace(eval('/(' + arg + '=)([^&]*)/gi'), replaceText) : (url.match('[\?]') ? url + '&' + replaceText : url + '?' + replaceText);
  }

}

export default PubCom(ZmitiShareApp);