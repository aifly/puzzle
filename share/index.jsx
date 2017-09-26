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
      className: 'right',
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
    var file = s.getQueryString('file');
    var border = s.getQueryString('border');
    var wish = s.getQueryString('wish');

    return <div className={'zmiti-share-main-ui '+ this.state.className}>
        <div className='zmiti-share-bg'>
          <div className='zmiti-share-info'>
            <div>XXX在“中国成就”拼图游戏中</div>
            <div>用时:40s</div>
            <div>成功闯到第六关!</div>
            <div className='zmiti-puzzle-img'>
              <img src='./assets/images/300.jpg'/>
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

    if (border && file && wish) {
      this.setState({
        className: "active",
        wish: decodeURI(wish),
        border,
        file,
        transX,
        transY
      });
    }
    obserable.on('fixedResultPos', (data) => {
      this.setState({
        transX: data.transX,
        transY: data.transY
      })
    })
    obserable.on('toggleResult', e => {
      this.setState({
        className: e,
        wish: obserable.trigger({
          type: 'getWish'
        })
      }, () => {
        this.getAssets();
      });

      if (e === 'active') {

        var url = window.location.href;
        var params = JSON.stringify({
          file: obserable.trigger({
            type: 'getFile'
          }),
          border: obserable.trigger({
            type: 'getBorder'
          }).src
        })

        url = changeURLPar(url, 'file', obserable.trigger({
          type: 'getFile'
        }));
        url = changeURLPar(url, 'border', obserable.trigger({
          type: 'getBorder'
        }).src);

        url = changeURLPar(url, 'wish', encodeURI(obserable.trigger({
          type: 'getWish'
        })));
        url = changeURLPar(url, 'transX', this.state.transX);
        url = changeURLPar(url, 'transY', this.state.transY);
        setTimeout(() => {
          url = url.split('#')[0];
          wxConfig(window.share.title.replace(/{nickname}/, window.nickname), window.share.desc, 'http://h5.zmiti.com/public/teacherday/assets/images/300.jpg', url);
        }, 1000)

      }

    });
  }

  changeURLPar(url, arg, val) {
    var pattern = arg + '=([^&]*)';
    var replaceText = arg + '=' + val;
    return url.match(pattern) ? url.replace(eval('/(' + arg + '=)([^&]*)/gi'), replaceText) : (url.match('[\?]') ? url + '&' + replaceText : url + '?' + replaceText);
  }

 


}

export default PubCom(ZmitiShareApp);