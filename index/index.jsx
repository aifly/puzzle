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
      className: 'active'

    }
    this.viewW = document.documentElement.clientWidth;
    this.viewH = document.documentElement.clientHeight;
    window.s = this;
  }
  render() {

    
    return <div className={'zmiti-index-main-ui '+this.state.className}>
       
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