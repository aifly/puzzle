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

class ZmitiStage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nickname: "",
      picLen: 2,
      canvasW: 0,
      canvasH: 0,
      transX: 0,
      transY: 0,
      currentImgIndex: 0,
      opacity: 1,
      show: true,
      imgList: window.imgList,
      srcElementIndex: 0,
      gk: 1,
      allDuration: 0,
      duration: window.durations[0],

      showFailResult: false


    }
    this.viewW = document.documentElement.clientWidth;
    this.viewH = document.documentElement.clientHeight;

    window.ss = this;

  }
  render() {


    return <div className='zmiti-stage-main-ui'>
      <div>
        <div className='zmiti-stage-title'><span>{this.state.title}</span><span>还剩：{this.state.duration}s</span></div>
        <div className='zmiti-stage-imglist' ref='zmiti-stage-imglist'>
          <div ref='raw-img'></div>
          <div>
             <div>
               
             </div>

             <ul>
              {

                this.createArr().map((item,i)=>{

                  if(this.createList()[item]|| this.createList()[item] === 0){
                     var mainStyle={}
                      if(i === this.state.currentImgIndex){
                        mainStyle.opacity = this.state.opacity;
                        mainStyle.WebkitTransform = 'translate3d('+(this.state.transX)+'px,'+this.state.transY+'px,0)'
                      }
                      return <li key={i}><canvas className={'bitmap_'+(i/this.state.picLen|0)+'_'+(i%this.state.picLen)}  ref={'canvas_'+item} style={mainStyle} width={this.state.canvasW} height={this.state.canvasH}></canvas></li>
                  }else{
                    return <li key={i}></li>
                  }
                })
              }
              
             </ul>

          </div>
        </div>
      </div>
      <div className='zmiti-stage-puzzle' ref='zmiti-stage-puzzle'>
        <canvas draggable='true' ref='stage' className='zmiti-stage-canvas' width={this.state.canvasW*this.state.picLen} height={this.state.canvasH*this.state.picLen}></canvas>
        <div>
          <span>当前关卡：{this.state.gk}/{window.durations.length}</span>
        </div>
      </div>
      <div style={{height:'.5rem'}}></div>


     {this.state.showFailResult &&  <section className='zmiti-stage-result'>
              <div>
                 <div className='zmiti-stage-result-C'>
                   <div style={{height:'.5rem'}}></div>
                   <div className='zmiti-stage-tip'>没有完成关卡：{this.state.gk}</div>
                   <div className='zmiti-stage-agin'>
                     <img onClick={this.doAgin.bind(this)} src='./assets/images/agin.png'/>
                   </div>
                 </div>
                 <div hidden className='zmiti-stage-close'>
                   
                 </div>
              </div>
           </section>}

      {this.state.toast && <ZmitiToastApp toast={this.state.toast}></ZmitiToastApp>}
    </div>
  }


  closeResult() { //
    this.setState({
      showFailResult: false
    });
    clearInterval(this.timer);
  }

  doAgin() { //再来一次
    this.closeResult();

    this.setState({
      duration: window.durations[this.state.gk - 1]
    });

    var {
      obserable
    } = this.props;

    obserable.trigger({
      type: 'gameStart'
    });

    this.drawImage();

    setTimeout(() => {
      $(this.refs['zmiti-stage-imglist']).find('canvas').show()
    }, 100)

    this.container.children.forEach((child) => {
      if (child.name.indexOf('bitmap') > -1) {
        this.container.removeChild(child)
      }
    })


  }

  nextGK() { //下一关.

    this.setState({
      allDuration: this.state.allDuration + (window.durations[this.state.gk - 1] - this.state.duration)
    })

    var {
      obserable,
      wxConfig,
      nickname,
      changeURLPar
    } = this.props;

    /*if (!window.durations[this.state.gk]) {
      obserable.trigger({
          type: 'showShare',
          data: {
            duration: this.state.allDuration,
            gk: this.state.gk
          }
        })
        //进入结果页

      return;
    }*/
    this.dragCount = 0;

    var url = window.location.href;

    $.ajax({
      url: 'http://api.zmiti.com/v2/share/base64_image/',
      type: 'post',
      data: {
        setcontents: this.stage.toDataURL(),
        setimage_w: 300,
        setimage_h: 300
      }
    }).done(data => {

      if (data.getret === 0) {
        var src = data.getimageurl;
        url = changeURLPar(url, 'nickname', encodeURI(nickname));
        url = changeURLPar(url, 'duration', this.state.allDuration);
        url = changeURLPar(url, 'src', src);
        url = changeURLPar(url, 'gk', this.state.gk);

        url = url.split('#')[0];
        var title = window.gkShare.title.replace(/{nickname}/, nickname);
        title = title.replace(/{gk}/, this.state.gk);
        title = title.replace(/{duration}/, this.state.allDuration);
        wxConfig(title, window.gkShare.desc, 'http://h5.zmiti.com/public/' + window.h5name + '/assets/images/300.jpg', url);

      }
    })



    this.setState({
      gk: this.state.gk + 1
    }, () => {
      if (this.state.gk > 3) {
        this.setState({
          picLen: 3
        }, () => {
          this.doAgin();
        })
      } else {
        this.doAgin();
      }
    });

  }

  gameOver() {
    clearInterval(this.timer);
    this.dragCount = 0;
    this.setState({
      showFailResult: true
    })
  }

  createArr() {
    var arr = [],
      m = Math,
      count = 10;
    for (var i = 0; i < count; i++) {
      arr.push(i)
    }
    var area = this.state.picLen * this.state.picLen;

    var a = arr.slice(0, area);
    var c = arr.slice(area)
    a.sort(() => {
      return m.random() - .5
    });

    arr = a.concat(c)



    return arr;


  }


  showToast(msg, fn) {
    this.setState({
      toast: msg
    });

    setTimeout(() => {
      this.setState({
        toast: ''
      });

      fn && fn()

    }, 2000)
  }


  drawImage() {
    var index = (window.imgList.length * Math.random()) | 0;

    var obj = this.state.imgList.splice(index, 1)[0];

    this.objSrc = obj.src;
    this.loadImg(obj.src);

    this.setState({
      title: obj.title
    })
  }
  getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return (r[2]);
    return null;
  }

  componentDidMount() {

    var src = this.getQueryString('src');
    !src && this.drawImage();

    let {
      obserable
    } = this.props;

    obserable.on('gameStart', e => {
      this.timer = setInterval(() => {
        if (this.state.duration <= 0) {
          this.gameOver();
          return;
        }
        this.setState({
          duration: this.state.duration - 1
        })

      }, 1000)
    });

    obserable.on('nextGK', e => {
      this.nextGK();
    })
  }

  setDrag() {

    var canvas = this.refs['stage'],

      s = this;

    var {
      obserable,
      nickname
    } = this.props;



    this.dragCount = this.dragCount || 0;

    var oneHeight = canvas.height / s.state.picLen,
      oneWidth = canvas.width / s.state.picLen,
      canvasW = canvas.width,
      canvasH = canvas.height;

    this.createList().map((item, i) => {

      $(this.refs['canvas_' + item]).on('touchstart', function(e) {


        oneHeight = canvas.height / s.state.picLen;
        oneWidth = canvas.width / s.state.picLen;
        canvasW = canvas.width;
        canvasH = canvas.height;

        var e = e.originalEvent.changedTouches[0];
        var offsetTop = s.refs['zmiti-stage-puzzle'].offsetTop,
          offsetLeft = s.refs['zmiti-stage-puzzle'].offsetLeft;
        var startX = e.pageX,
          startY = e.pageY;
        s.setState({
          opacity: .5,
          currentImgIndex: $(this).parents('li').index()
        })

        $(document).on('touchmove', e => {
          var e = e.originalEvent.changedTouches[0];

          s.setState({
            transX: e.pageX - startX,
            transY: e.pageY - startY
          })
          if (e.pageY > offsetTop && e.pageX > offsetLeft) {
            var x = e.pageX - offsetLeft,
              y = e.pageY - offsetTop;
            var i = x / oneWidth | 0,
              j = y / oneHeight | 0;

            var rect = s.container.getChildByName('rect_' + j + "_" + i);
            if (rect) {

              s.container.children.forEach((item) => {
                if (item.name && item.name.indexOf('rect_') > -1) {
                  item.alpha = 0;
                }
              });

              rect.alpha = 1;
              s.stage.update();
            }

          }

        }).on('touchend', e => {
          $(document).off('touchend touchmove')
          var e = e.originalEvent.changedTouches[0];
          if (e.pageY > offsetTop && e.pageX > offsetLeft) {
            var x = e.pageX - offsetLeft,
              y = e.pageY - offsetTop;
            var i = x / oneWidth | 0,
              j = y / oneHeight | 0;

            //console.log('i => ' + i, ' j => ' + j)

            var bitMap = new createjs.Bitmap(this);

            bitMap.x = oneWidth * i;
            bitMap.y = oneHeight * j;

            bitMap.name1 = this.className;


            if (!s.container.getChildByName('bitmap_' + j + '_' + i)) {
              bitMap.name = 'bitmap_' + j + '_' + i;

              var rect = s.container.getChildByName('rect_' + j + "_" + i);
              if (rect) {
                rect.alpha = 0
                $(this).hide()
              }
              s.dragCount++;



              s.container.addChild(bitMap);
              s.container.setChildIndex(bitMap, 2);

              s.container.children.forEach((child) => {
                if (child.name.indexOf('line') > -1) {
                  s.container.removeChild(child)
                }
              })

              s.lineArr.forEach((l) => {
                s.container.addChild(l)
              })
              s.lineArr1.forEach((l) => {
                s.container.addChild(l)
              })

              s.stage.update();

              if (s.dragCount >= s.state.picLen * s.state.picLen) {
                //拖放完成
                var success = true;
                s.container.children.forEach((child, i) => {
                  if (child.name && child.name.indexOf('bitmap_') > -1) {

                    if (child.name !== child.name1) {
                      success = false;
                    }
                  }
                })

                if (success) { //成功。进入下一关

                  setTimeout(() => {
                    obserable.trigger({
                      type: 'showShare',
                      data: {
                        gk: s.state.gk,
                        duration: s.state.allDuration + (window.durations[s.state.gk - 1] - s.state.duration),
                        src: s.objSrc,
                        nickname: window.nickname
                      }
                    })
                  }, 100)

                  /*s.showToast('恭喜你进入下一关！', function() {
                    s.nextGK();
                  });*/

                } else { //失败
                  s.gameOver();
                }

              }
            } else {
              //有图片的，不能再拖进来了
            }

          }
          s.setState({
            transX: 0,
            transY: 0,
            opacity: 1
          })
        })
      })

    })

    $(canvas).on('touchstart', function(e) {
      var e = e.originalEvent.changedTouches[0];
      var offsetTop = s.refs['zmiti-stage-puzzle'].offsetTop,
        offsetLeft = s.refs['zmiti-stage-puzzle'].offsetLeft;



      var startX = e.pageX - offsetLeft,
        startY = e.pageY - offsetTop;


      var i = startX / oneWidth | 0,
        j = startY / oneHeight | 0;


      var bitmap = s.container.getChildByName('bitmap_' + j + '_' + i);
      if (!bitmap) {
        //console.log(123);
        return;
      }

      bitmap.defaultX = bitmap.x;
      bitmap.defaultY = bitmap.y;

      canvas.lastBitmap = bitmap;


      var bitmap1 = null;
      $(document).on('touchmove', e => {
        var e = e.originalEvent.changedTouches[0];

        bitmap.x = e.pageX - startX + i * oneWidth;
        bitmap.y = e.pageY - startY - offsetTop + j * oneHeight;

        var X = e.pageX - offsetLeft,
          Y = e.pageY - offsetTop;

        var x = X / oneWidth | 0,
          y = Y / oneHeight | 0;

        bitmap1 = s.container.getChildByName('bitmap_' + y + '_' + x)

        s.stage.update()


      }).on('touchend', e => {
        $(document).off('touchend touchmove')

        e.preventDefault();

        var e = e.originalEvent.changedTouches[0];


        var startX = e.pageX - offsetLeft,
          startY = e.pageY - offsetTop;


        var x = startX / oneWidth | 0,
          y = startY / oneHeight | 0;


        if (bitmap1 || x >= s.state.picLen || y >= s.state.picLen) {

          canvas.lastBitmap.x = canvas.lastBitmap.defaultX;
          canvas.lastBitmap.y = canvas.lastBitmap.defaultY;
          s.stage.update()

          //该位置已经有了图片了
        } else {
          canvas.lastBitmap.name = 'bitmap_' + y + '_' + x;

          canvas.lastBitmap.x = oneWidth * x;
          canvas.lastBitmap.y = oneHeight * y

          s.stage.update()
        }

        return false;

      })
    })
  }

  dragStart(index, e) {

  }

  createList() {

    var num = this.state.picLen * this.state.picLen;
    var arr = [];
    for (var i = 0; i < num; i++) {
      arr.push(i)
    }

    return arr;
  }

  createLines() {
    var canvas = this.refs['stage'];
    var stage = new createjs.Stage(canvas);

    stage.removeAllChildren();



    var context = canvas.getContext('2d');


    var width = canvas.width,
      height = canvas.height,
      s = this;
    context.clearRect(0, 0, width, height);

    var container = new createjs.Container();
    this.container = container;
    var lineArr = [],
      lineArr1 = [];

    for (var i = 0; i < this.state.picLen - 1; i++) {
      var line1 = new createjs.Shape();
      line1.graphics.setStrokeStyle(1).beginStroke('#999').moveTo(0, canvas.height / this.state.picLen * (i + 1)).lineTo(canvas.width, canvas.height / this.state.picLen * (i + 1))

      var line2 = new createjs.Shape();
      line2.graphics.setStrokeStyle(1).beginStroke('#999').moveTo(canvas.width / this.state.picLen * (i + 1), 0).lineTo(canvas.width / this.state.picLen * (i + 1), canvas.height)

      container.setChildIndex(line1, 99999)
      container.setChildIndex(line2, 99998)
      line1.name = 'line_' + i;
      line2.name = 'line2_' + i;
      lineArr.push(line1);
      lineArr1.push(line2);

      container.addChild(line1);
      container.addChild(line2);
    }
    this.lineArr = lineArr;
    this.lineArr1 = lineArr1;

    for (var i = 0; i < this.state.picLen; i++) {

      for (var j = 0; j < this.state.picLen; j++) {
        var rect = new createjs.Shape();
        //console.log(j * width, i * height)
        rect.name = 'rect_' + i + '_' + j;
        rect.graphics.beginStroke('rgba(255,0,0,1)').drawRect(j * width / this.state.picLen, i * height / this.state.picLen, width / this.state.picLen, height / this.state.picLen);
        rect.alpha = 0;
        //stage.setChildIndex(container, 10 + i + j);
        container.addChild(rect);
        stage.addChild(container);

      }

    }


    stage.update()
    this.stage = stage;
    stage.update()


  }

  loadImg(src) {
    var img = new Image();
    var s = this;
    img.onload = function() {

      var canvas = document.createElement('canvas');
      var width = Math.min(s.viewW / 10 * 9, this.width)
      canvas.width = width;
      canvas.height = width * (this.height / this.width);
      s.setState({
        canvasW: canvas.width / s.state.picLen,
        canvasH: canvas.height / s.state.picLen
      })
      var context = canvas.getContext('2d');

      context.drawImage(this, 0, 0, canvas.width, canvas.height);
      s.createLines();
      s.refs['raw-img'].innerHTML = '';
      s.refs['raw-img'].appendChild(canvas)



      s.setDrag()

      for (var i = 0; i < s.state.picLen; i++) {
        for (var j = 0; j < s.state.picLen; j++) {
          var c1 = s.refs['canvas_' + (i * s.state.picLen + j)];
          var context1 = c1.getContext('2d');
          var r = (i * s.state.picLen + j);
          c1.className = 'bitmap_' + (r / s.state.picLen | 0) + '_' + (r % s.state.picLen);
          context1.drawImage(canvas, canvas.width / s.state.picLen * j, canvas.height / s.state.picLen * i, canvas.width / s.state.picLen, canvas.height / s.state.picLen, 0, 0, canvas.width / s.state.picLen, canvas.height / s.state.picLen);
          //console.log(canvas.width / s.state.picLen * i, canvas.height / s.state.picLen * j)
        }
      }

    }

    img.src = src;

  }


}

export default PubCom(ZmitiStage);