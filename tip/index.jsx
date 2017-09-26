import React, {
  Component
} from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import './assets/css/index.css';
import {
  PubCom
} from '../components/public/pub.jsx';



class ZmitiTipApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: true,
      showBtn: true
    }
    this.viewW = document.documentElement.clientWidth;
    this.viewH = document.documentElement.clientHeight;

  }
  render() {

    var mainStyle = {
      background: 'url(./assets/images/tip.jpg) no-repeat center center',
      backgroundSize: 'cover',
      display: this.state.show ? 'block' : 'none'

    }

    return <div className={'zmiti-tip-main-ui '+ this.state.className} style={mainStyle}>
        <div className='zmiti-tip-hand'>
          <img src='./assets/images/hand.png'/>
        </div>

        {this.state.showBtn && <div  className='zmiti-tip-btn' onClick={this.startGame.bind(this)}>
            <img src='./assets/images/btn.png'/>
            <span>移动拼图碎片，拼合成完整图片即可过关。</span>
        </div>}
    </div>

  }

  startGame() {
    this.setState({
      show: false
    });

    let {
      obserable
    } = this.props;
    obserable.trigger({
      type: 'gameStart'
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

    let {
      obserable
    } = this.props;

    obserable.on('toggleTips', e => {
      this.setState({
        show: e
      })

      if (e) {

        setTimeout(() => {
          this.setState({
            showBtn: true
          })
        }, 1000)

      }
    })

  }


}

export default PubCom(ZmitiTipApp);