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
class ZmitiResultApp extends Component {
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
    var mainStyle = {
      background: 'url(./assets/images/bg1.jpg) no-repeat center center ',
      backgroundSize: 'cover'
    };

    var wishStyle = {
      background: "url(./assets/images/wish-bg.png) no-repeat center ",
      backgroundSize: 'contain'

    }

    var resultBg = {

    }
    var resultBg1 = {}
    if (this.state.border && this.state.file) {
      resultBg.background = 'url(' + this.state.file + ') no-repeat center',
        resultBg.backgroundSize = 'cover'
      resultBg1.background = 'url(' + this.state.border + ') no-repeat center',
        resultBg1.backgroundSize = 'contain'


    }

    var maskStyle = {
      background: 'url(./assets/images/arron1.png) no-repeat center top',
      backgroundSize: 'cover'
    }

    var s = this;
    var file = s.getQueryString('file');
    var border = s.getQueryString('border');
    var wish = s.getQueryString('wish');
    var isExisit = file && border && wish;


    var uploadStyle = {}
    if (this.state.file) {
      uploadStyle.background = 'url(' + this.state.file + ') no-repeat';
      uploadStyle.backgroundSize = 'cover';
      uploadStyle.backgroundPosition = this.state.transX + 'px ' + this.state.transY + 'px';
    }

    return <div className={'zmiti-result-main-ui '+ this.state.className} style={mainStyle}>
      <div className='zmiti-result-main-content'>
        <div className='zmiti-result-img'>
    <div className='zmiti-file-img' style={uploadStyle}>

          </div>
          {this.state.file&&<img hidden style={{WebkitTransform:'translate('+this.state.transX+'px,'+this.state.transY+'px)'}} src={this.state.file}/>}
           <div style={resultBg1}></div>
        </div>
        <div className='zmiti-wish-C' style={wishStyle}>
            <div>{this.state.wish}</div>
        </div>
    {
      !isExisit && <div className='zmiti-btn-group'>
                  <aside onClick={this.reInput.bind(this)}>
                    <img src='./assets/images/reinput.png'/>
                  </aside>
                   <aside onClick={()=>{this.setState({showMask:true})}}>
                     <img src='./assets/images/done.png'/>
                   </aside>
                </div>}
        {isExisit && <div className='zmiti-btn-group' style={{width:'4rem'}}>
                     <aside>
                        <a href={window.href||'http://h5.zmiti.com/public/teacherday/'}><img src='./assets/images/do.png'/></a>
                      </aside>
                </div>}
      </div>

      {this.state.showMask&&<div  onTouchStart={()=>{this.setState({showMask:false})}} className='zmiti-mask lt-full' style={maskStyle}></div>}

    </div>

  }

  reInput() {
    var {
      obserable
    } = this.props;
    obserable.trigger({
      type: 'toggleInput',
      data: 'active'
    });

    obserable.trigger({
      type: 'toggleResult',
      data: 'right'
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


  log(opt) {

    $.ajax({
      url: 'http://api.zmiti.com/v2/msg/send_msg',
      data: {
        type: opt.key || 'log',
        content: JSON.stringify(opt),
        to: ''
      }
    })
  }

  getAssets() {
    var {
      obserable
    } = this.props;
    var file = obserable.trigger({
      type: 'getFile'
    });
    var border = obserable.trigger({
      type: 'getBorder'
    })
    this.setState({
      file,
      border: border.src
    })
  }


}

export default PubCom(ZmitiResultApp);