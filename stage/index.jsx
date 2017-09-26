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
      durantion: window.durations[0],

      showFailResult: false


    }
    this.viewW = document.documentElement.clientWidth;
    this.viewH = document.documentElement.clientHeight;

    window.s = this;

  }
  render() {


    return <div className='zmiti-stage-main-ui'>
      <div>
        <div className='zmiti-stage-title'><span>{this.state.title}</span><span>还剩：{this.state.durantion}s</span></div>
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
          <span>当前关卡：{this.state.gk}</span>
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
                 <div className='zmiti-stage-close'>
                   <img onClick={this.closeResult.bind(this)} src='./assets/images/close.png'/>
                 </div>
              </div>
           </section>}
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
      durantion: window.durations[this.state.gk - 1]
    });

    var {
      obserable
    } = this.props;

    obserable.trigger({
      type: 'gameStart'
    });

    this.drawImage();

    setTimeout(()=>{
      $(this.refs['zmiti-stage-imglist']).find('canvas').show()
    },100)

    this.container.children.forEach((child) => {
      if (child.name.indexOf('bitmap') > -1) {
        this.container.removeChild(child)
      }
    })


  }

  nextGK(){//下一关.
    this.dragCount = 0;

    this.setState({
      gk:this.state.gk+1
    },()=>{
      this.doAgin();
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
    var index = window.imgList.length * Math.random() | 0;
    this.loadImg(this.state.imgList[index].src);

    this.setState({
      title: this.state.imgList[index].title
    })
  }


  componentDidMount() {

    this.drawImage();

    let {
      obserable
    } = this.props;

    obserable.on('gameStart', e => {
      this.timer = setInterval(() => {
        if (this.state.durantion <= 0) {
          this.gameOver();
          return;
        }
        this.setState({
          durantion: this.state.durantion - 1
        })

      }, 1000)
    });
  }

  setDrag() {

    var canvas = this.refs['stage'],

      s = this;

    this.dragCount = this.dragCount || 0;


    var oneHeight = canvas.height / this.state.picLen,
      oneWidth = canvas.width / this.state.picLen,
      canvasW = canvas.width,
      canvasH = canvas.height;
    this.createList().map((item, i) => {

      $(this.refs['canvas_' + item]).on('touchstart', function(e) {
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
                  setTimeout(()=>{
                    s.nextGK(); 
                  },1000)
                } else { //失败
                  s.gameOver();
                }

              }
            } else {

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
        return;
      }

      bitmap.defaultX = bitmap.x;
      bitmap.defaultY = bitmap.y;

      canvas.lastBitmap = bitmap;



      $(document).on('touchmove', e => {
        var e = e.originalEvent.changedTouches[0];

        bitmap.x = e.pageX - startX + i * oneWidth;
        bitmap.y = e.pageY - startY - offsetTop + j * oneHeight;

        s.stage.update()


      }).on('touchend', e => {
        $(document).off('touchend touchmove')
        var e = e.originalEvent.changedTouches[0];


        var startX = e.pageX - offsetLeft,
          startY = e.pageY - offsetTop;


        var x = startX / oneWidth | 0,
          y = startY / oneHeight | 0;

        var bitmap1 = s.container.getChildByName('bitmap_' + y + '_' + x)

        if (bitmap1 || x >= s.state.picLen || y >= s.state.picLen) {
          canvas.lastBitmap.x = canvas.lastBitmap.defaultX;
          canvas.lastBitmap.y = canvas.lastBitmap.defaultY;
          s.stage.update()

          return; //该位置已经有了图片了
        }



        var bitmap = s.container.getChildByName('bitmap_' + y + '_' + x)

        canvas.lastBitmap.name = 'bitmap_' + y + '_' + x;

        canvas.lastBitmap.x = oneWidth * x;
        canvas.lastBitmap.y = oneHeight * y

        s.stage.update()


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

    var width = canvas.width,
      height = canvas.height,
      s = this;

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