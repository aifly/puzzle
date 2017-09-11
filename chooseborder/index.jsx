import React, {
  Component
} from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import './assets/css/index.css';
import {
  PubCom
} from '../components/public/pub.jsx';



class ZmitiChooseBorderApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      className: 'right',
      borderList: [{
        src: './assets/images/border1.png'
      }, {
        src: './assets/images/border2.png'
      }, {
        src: './assets/images/border3.png'
      }, {
        src: './assets/images/border4.png'
      }],
      file: '',
      currentBorderIndex: 0,
      transX: 0,
      transY: 0
    }
    this.viewW = document.documentElement.clientWidth;
    this.viewH = document.documentElement.clientHeight;

  }
  render() {
    var mainStyle = {
      background: 'url(./assets/images/bg1.jpg) no-repeat center center ',
      backgroundSize: 'cover'
    };

    var borderStyle = {

    }
    if (this.state.file) {
      borderStyle.background = 'url(' + this.state.file + ') no-repeat center center',
        borderStyle.backgroundSize = 'cover'
    }

    var uploadStyle = {}
    if (this.state.file) {
      uploadStyle.background = 'url(' + this.state.file + ') no-repeat';
      uploadStyle.backgroundSize = 'cover';
      uploadStyle.backgroundPosition = this.state.transX + 'px ' + this.state.transY + 'px';
    }

    return <div className={'zmiti-chooseborder-main-ui '+ this.state.className} style={mainStyle}>
      <div className='zmiti-chooseborder-main-content'>
        <ul>
          {
            this.state.borderList.map((border,i)=>{
              return <li key={i} onClick={this.chooseBorder.bind(this,i)}>
                  {this.state.currentBorderIndex === i && <img className='zmiti-border-active' src='./assets/images/border-active.png'/>}
                  {this.state.file&&<img hidden style={{WebkitTransform:'translate('+this.state.transX+'px,'+this.state.transY+'px)'}} src={this.state.file} className='zmiti-file'/>}
                  <div style={uploadStyle}></div>
                  <img src={border.src}/>
              </li>
            })  
          }
        </ul>
        <div className='zmiti-btn-groups'>
           <aside onClick={this.preview.bind(this)}><img src='./assets/images/redo.png'/></aside>
           <aside onClick={this.next.bind(this)}><img src='./assets/images/next.png'/></aside>
        </div>
      </div>
    </div>

  }


  preview() {
    var {
      obserable
    } = this.props;

    obserable.trigger({
      type: 'toggleChooseBorder',
      data: 'right'
    });
    obserable.trigger({
      type: 'toggleChoose',
      data: 'active'
    });
  }

  next() {
    var {
      obserable
    } = this.props;
    obserable.trigger({
      type: 'toggleChooseBorder',
      data: 'left'
    });
    obserable.trigger({
      type: 'toggleInput',
      data: 'active'
    });

  }


  chooseBorder(i) {
    this.setState({
      currentBorderIndex: i
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


  componentDidMount() {
    var {
      obserable
    } = this.props;


    obserable.on('toggleChooseBorder', (e) => {
      this.setState({
        className: e,
        file: obserable.trigger({
          type: "getFile"
        })
      });
      if (e === 'active') {
        var {
          transX,
          transY
        } = obserable.trigger({
          type: 'getPos'
        });
        obserable.trigger({
          type: 'fixedResultPos',
          data: {
            transX,
            transY
          }
        })
        this.setState({
          transX,
          transY
        })

      }

      obserable.on('getBorder', () => {
        return this.state.borderList[this.state.currentBorderIndex];
      })

    })


  }


}

export default PubCom(ZmitiChooseBorderApp);