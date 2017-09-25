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
      imgList: window.imgList

    }
    this.viewW = document.documentElement.clientWidth;
    this.viewH = document.documentElement.clientHeight;

  }
  render() {


    return <div className='zmiti-stage-main-ui'>
      <div>
    {
      /* {
              this.createList().map((item,i)=>{
                var mainStyle={margin:1}
                if(i === this.state.currentImgIndex){
                  mainStyle.opacity = this.state.opacity;
                  mainStyle.display = this.state.show?'inline-block':'none'
                  mainStyle.WebkitTransform = 'translate3d('+(this.state.transX)+'px,'+this.state.transY+'px,0)'
                }
                return <canvas className={'canvas_'+i}  ref={'canvas_'+i} style={mainStyle} width={this.state.canvasW} height={this.state.canvasH} key={i}></canvas>
              })

              
            }
      */
    }
      <div className='zmiti-stage-imglist'>
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
                        mainStyle.display = this.state.show?'inline-block':'none'
                        mainStyle.WebkitTransform = 'translate3d('+(this.state.transX)+'px,'+this.state.transY+'px,0)'
                      }
                    return <li key={i}><canvas className={'canvas1_'+i}  ref={'canvas_'+item} style={mainStyle} width={this.state.canvasW} height={this.state.canvasH}></canvas></li>
                  }else{
                    return <li key={i}></li>
                  }
                })
              }
              
             </ul>

          </div>
        </div>
      </div>
      <canvas draggable='true' ref='stage' className='zmiti-stage-canvas' width={this.state.canvasW*this.state.picLen} height={this.state.canvasH*this.state.picLen}></canvas>
    </div>
  }

  createArr() {
    var arr = [],
      m = Math,
      count = 10;
    for (var i = 0; i < count; i++) {
      arr.push(i)
    }



    /*arr.sort(() => {
      return m.random() - .5
    });*/

    if (arr[arr.length - 1] !== count) {
      var index = -1;
      arr.forEach((a, i) => {
        if (a === count) {
          index = i
        }
      })
      var last = arr[arr.length - 1];
      arr[arr.length - 1] = count;
      arr[index] = last;
    }
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


  }


  componentDidMount() {
    this.loadImg('./assets/images/300.jpg')
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
        var offsetTop = canvas.offsetTop,
          offsetLeft = canvas.offsetLeft;
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

            if (!s.container.getChildByName('bitmap_' + j + '_' + i)) {
              bitMap.name = 'bitmap_' + j + '_' + i;

              var rect = s.container.getChildByName('rect_' + j + "_" + i);
              if (rect) {
                rect.alpha = 0
                $(this).remove()
              }
              s.dragCount++;

              s.container.addChild(bitMap);
              s.container.setChildIndex(bitMap, 1)
              s.stage.update();

              if (s.dragCount >= s.state.picLen * s.state.picLen) {
                //拖放完成
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
      var offsetTop = canvas.offsetTop,
        offsetLeft = canvas.offsetLeft;


      var startX = e.pageX - offsetLeft,
        startY = e.pageY - offsetTop;


      var i = startX / oneWidth | 0,
        j = startY / oneHeight | 0;

      var bitmap = s.container.getChildByName('bitmap_' + j + '_' + i);

      bitmap.defaultX = bitmap.x;
      bitmap.defaultY = bitmap.y;


      canvas.lastBitmap = bitmap;
      console.log(bitmap)

      if (!bitmap) {
        return;
      }



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
      height = canvas.height;



    for (var i = 0; i < this.state.picLen - 1; i++) {
      var line1 = new createjs.Shape();
      line1.graphics.setStrokeStyle(1).beginStroke('#999').moveTo(0, canvas.height / this.state.picLen * (i + 1)).lineTo(canvas.width, canvas.height / this.state.picLen * (i + 1))

      var line2 = new createjs.Shape();
      line2.graphics.setStrokeStyle(1).beginStroke('#999').moveTo(canvas.width / this.state.picLen * (i + 1), 0).lineTo(canvas.width / this.state.picLen * (i + 1), canvas.height)

      stage.addChild(line1);
      stage.addChild(line2);
      stage.setChildIndex(line1, 1000)
      stage.setChildIndex(line2, 1000)
    }

    var container = new createjs.Container();
    this.container = container;
    for (var i = 0; i < this.state.picLen; i++) {

      for (var j = 0; j < this.state.picLen; j++) {
        var rect = new createjs.Shape();
        //console.log(j * width, i * height)
        rect.name = 'rect_' + i + '_' + j;
        rect.graphics.beginStroke('rgba(255,0,0,1)').drawRect(j * width / this.state.picLen, i * height / this.state.picLen, width / this.state.picLen, height / this.state.picLen);
        rect.alpha = 0;
        stage.setChildIndex(container, 1000 + i + j);
        container.addChild(rect);
        stage.addChild(container);

      }

    }


    stage.update()
    this.stage = stage;

    stage.update();


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
      s.createLines();
      var context = canvas.getContext('2d');

      context.drawImage(this, 0, 0, canvas.width, canvas.height);
      s.refs['raw-img'].appendChild(canvas)


      s.setDrag()



      for (var i = 0; i < s.state.picLen; i++) {
        for (var j = 0; j < s.state.picLen; j++) {
          var context1 = s.refs['canvas_' + (i * s.state.picLen + j)].getContext('2d');

          context1.drawImage(canvas, canvas.width / s.state.picLen * j, canvas.height / s.state.picLen * i, canvas.width / s.state.picLen, canvas.height / s.state.picLen, 0, 0, canvas.width / s.state.picLen, canvas.height / s.state.picLen);
          //console.log(canvas.width / s.state.picLen * i, canvas.height / s.state.picLen * j)
        }
      }

    }

    img.src = src;

  }


}

export default PubCom(ZmitiStage);