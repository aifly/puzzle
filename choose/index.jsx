import React, {
  Component
} from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import './assets/css/index.css';
import {
  PubCom
} from '../components/public/pub.jsx';

import ZmitiToastApp from '../components/toast/index.jsx'

class ZmitiChooseApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fileVal: '', //.'http://api.zmiti.com/zmiti_ele/public/20170905/13d5f5b828dfc697fced7b7b1baf3458.png',
      className: 'right',
      border: '',
      transX: 0,
      transY: 0,
      tip: '点击上传相片'

    }
    this.viewW = document.documentElement.clientWidth;
    this.viewH = document.documentElement.clientHeight;

  }
  render() {
    var mainStyle = {
      background: 'url(./assets/images/bg1.jpg) no-repeat center center ',
      backgroundSize: 'cover'
    };
    var rem = this.viewW / 10;

    var uploadStyle = {
      border: this.state.fileVal ? '1px dashed #000' : 'none',
      boxSizing: 'border-box'
    }
    if (this.state.fileVal) {
      uploadStyle.background = 'url(' + this.state.fileVal + ') no-repeat';
      uploadStyle.backgroundSize = 'cover';
      uploadStyle.backgroundPosition = this.state.transX + 'px ' + this.state.transY + 'px';
    }
    return <div className={'zmiti-choose-main-ui '+this.state.className} style={mainStyle}>
      <div className='zmiti-choose-main-content'>
        <div className='zmiti-upload' ref='img'>
          {this.state.fileVal && <div  style={uploadStyle} ></div>}
          {!this.state.fileVal &&<img  src={'./assets/images/upload.png'}/>}
          {this.state.fileVal && <img hidden  style={{zIndex:1002,position:'relative',WebkitTransform:'translate('+this.state.transX+'px,'+this.state.transY+'px)'}} src={this.state.fileVal}/>}
          <canvas ref='canvas' width={6*rem}  height={6*rem}></canvas>
          <input ref='upload-file' onChange={this.chooseImg.bind(this)} type='file'/>

          {<span className='zmiti-upload-loading'>{this.state.tip}</span>}
        </div>
        <div className='zmiti-beign-upload' >
          上传照片
        </div>
        <div className='zmiti-btn-groups' style={{width:'4rem'}}>
            <aside onClick={this.rechoose.bind(this)}><img src='./assets/images/rechoose.png'/></aside>
            <aside onClick={this.next.bind(this)}><img src='./assets/images/next.png'/></aside>
        </div>
      </div>
      {this.state.toast && <ZmitiToastApp toast={this.state.toast}></ZmitiToastApp>}
    </div>

  }


  next() {
    if (!this.state.fileVal) {
      this.showToast('请上传一张图片');
      return;
    }
    var {
      obserable
    } = this.props;

    obserable.trigger({
      type: 'toggleChooseBorder',
      data: 'active'
    });
    obserable.trigger({
      type: 'toggleChoose',
      data: 'left'
    });
  }

  rechoose() {
    //重新选择图片
    this.setState({
      fileVal: '',
      tip: '点击上传相片'
    }, () => {
      this.drawImage();
    });

  }

  chooseImg(e) {
    if (!e.target.value) {
      return;
    }
    var formData = new FormData();
    this.setState({
      showUploadLoading: true,
      tip: '上传中,请稍候...'
    })

    formData.append('setupfile', this.refs['upload-file'].files[0]);
    formData.append('uploadtype', 1);
    $.ajax({
      type: "POST",
      contentType: false,
      processData: false,
      url: 'http://api.zmiti.com/v2/share/upload_file/',
      data: formData
    }).done((data) => {
      if (data.getret === 0) {
        var img = new Image();
        img.onload = () => {
          var {
            obserable
          } = this.props;
          this.setState({
            fileVal: data.getfileurl[0].datainfourl,
            tip: ''
          }, () => {
            this.drawImage()
          });

        }
        img.src = data.getfileurl[0].datainfourl
      }
    });

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


  drawImage() {


  }


  componentDidMount() {
    var {
      obserable
    } = this.props;


    obserable.on('toggleChoose', (e) => {
      /* if (e === 'active') {
         var canvas = this.refs['canvas'];
         var context = canvas.getContext('2d');
         var img = new Image();
         img.onload = function() {
           context.globalCompositeOperation = 'destination-atop';
           context.drawImage(this, 0, 0, canvas.width, canvas.height);
         }
         img.src = this.state.border;
       }*/
      this.setState({
        className: e
      })
    });

    obserable.on('getFile', () => {
      return this.state.fileVal
    });

    obserable.on('getPos', () => {
      return {
        transX: this.state.transX,
        transY: this.state.transY
      }
    })

    $(this.refs['img']).on('touchstart', e => {
      var e = e.originalEvent.changedTouches[0];
      var disX = e.pageX - this.state.transX;
      var disY = e.pageY - this.state.transY;

      $(document).on('touchmove', e => {

        var e = e.originalEvent.changedTouches[0];
        console.log(e.pageX);
        this.setState({
          transX: e.pageX - disX,
          transY: e.pageY - disY
        })
      }).on('touchend', () => {
        $(document).off('touchend touchmvee')
      })
    });

  }


}

export default PubCom(ZmitiChooseApp);