import React, {
	Component
} from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import IScroll from 'iscroll';
import './assets/css/index.css';
import initReactFastclick from 'react-fastclick';
initReactFastclick();
import Obserable from './components/public/obserable';


var obserable = new Obserable();
var worksid = '1606979000';
var data = {
	wxappid: 'wxec2401ee9a70f3d9',
	wxappsecret: 'fc2c8e7c243da9e8898516fa5da8cbbb'
}


class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			nickname: ""
		}

		this.viewW = document.documentElement.clientWidth;
		this.viewH = document.documentElement.clientHeight;
		window.s = this;
		this.zmitiMap = [{
			"name": "北京市",
			"log": "116.46",
			"lat": "39.92"
		}, {
			"name": "上海市",
			"log": "121.48",
			"lat": "31.22"
		}, {
			"name": "天津市",
			"log": "117.2",
			"lat": "39.13"
		}, {
			"name": "重庆市",
			"log": "106.54",
			"lat": "29.59"
		}, {
			"name": "石家庄",
			"log": "114.48",
			"lat": "38.03"
		}, {
			"name": "太原市",
			"log": "112.53",
			"lat": "37.87"
		}, {
			"name": "沈阳市",
			"log": "123.38",
			"lat": "41.8"
		}, {
			"name": "长春市",
			"log": "125.35",
			"lat": "43.88"
		}, {
			"name": "哈尔滨市",
			"log": "126.63",
			"lat": "45.75"
		}, {
			"name": "杭州市",
			"log": "120.19",
			"lat": "30.26"
		}, {
			"name": "福州市",
			"log": "119.3",
			"lat": "26.08"
		}, {
			"name": "济南市",
			"log": "106.54",
			"lat": "29.59"
		}, {
			"name": "郑州市",
			"log": "113.65",
			"lat": "34.76"
		}, {
			"name": "武汉市",
			"log": "114.31",
			"lat": "30.52"
		}, {
			"name": "长沙市",
			"log": "113",
			"lat": "28.21"
		}, {
			"name": "广州市",
			"log": "113.23",
			"lat": "23.16"
		}, {
			"name": "海口市",
			"log": "110.35",
			"lat": "20.02"
		}, {
			"name": "成都市",
			"log": "104.06",
			"lat": "30.67"
		}, {
			"name": "贵阳市",
			"log": "106.71",
			"lat": "26.57"
		}, {
			"name": "昆明市",
			"log": "102.73",
			"lat": "25.04"
		}, {
			"name": "南昌市",
			"log": "115.89",
			"lat": "28.68"
		}, {
			"name": "西安市",
			"log": "108.95",
			"lat": "34.27"
		}, {
			"name": "西宁市",
			"log": "101.74",
			"lat": "36.56"
		}, {
			"name": "兰州市",
			"log": "103.73",
			"lat": "36.03"
		}, {
			"name": "南宁市",
			"log": "106.54",
			"lat": "29.59"
		}, {
			"name": "乌鲁木齐市",
			"log": "87.68",
			"lat": "43.77"
		}, {
			"name": "呼和浩特市",
			"log": "111.65",
			"lat": "40.82"
		}, {
			"name": "拉萨市",
			"log": "91.11",
			"lat": "29.97"
		}, {
			"name": "银川市",
			"log": "106.27",
			"lat": "38.47"
		}, {
			"name": "台北市",
			"log": "121.5",
			"lat": "25.14"
		}, {
			"name": "香港",
			"log": "114.17",
			"lat": "22.27"
		}, {
			"name": "澳门",
			"log": "113.33",
			"lat": "22.13"
		}, {
			"name": "合肥市",
			"log": "117.27",
			"lat": "31.86"
		}, {
			"name": "南京市",
			"log": "118.78",
			"lat": "32.04"
		}]
	}
	render() {

		var data = {
			obserable,
			wxConfig: this.wxConfig.bind(this),
			changeURLPar: this.changeURLPar.bind(this),
			nickname: this.state.nickname
		}


		return <div className='zmiti-main-ui'>

			
			ad
		</div>
	}
	wxConfig(title, desc, img, url) {
		var s = this;
		var appId = 'wxfacf4a639d9e3bcc'; //'wxfacf4a639d9e3bcc'; // data.wxappid; // 'wxfacf4a639d9e3bcc'; //data.wxappid;

		var durl = url || location.href.split('#')[0];


		var code_durl = encodeURIComponent(durl);

		$.ajax({
			type: 'get',
			url: "http://api.zmiti.com/weixin/jssdk.php?type=signature&durl=" + code_durl,
			dataType: 'jsonp',
			jsonp: "callback",
			jsonpCallback: "jsonFlickrFeed",
			error() {

			},
			success(data) {
				wx.config({
					debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId: appId, // 必填，公众号的唯一标识
					timestamp: '1488558145', // 必填，生成签名的时间戳
					nonceStr: 'Wm3WZYTPz0wzccnW', // 必填，生成签名的随机串
					signature: data.signature, // 必填，签名，见附录1
					jsApiList: ['checkJsApi',
							'onMenuShareTimeline',
							'onMenuShareAppMessage',
							'onMenuShareQQ',
							'onMenuShareWeibo',
							'hideMenuItems',
							'showMenuItems',
							'hideAllNonBaseMenuItem',
							'showAllNonBaseMenuItem'
						] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
				});

				wx.ready(() => {

					//朋友圈

					wx.onMenuShareTimeline({
						title: title, // 分享标题
						link: durl, // 分享链接
						imgUrl: img, // 分享图标
						desc: desc,
						success: function() {},
						cancel: function() {}
					});
					//朋友
					wx.onMenuShareAppMessage({
						title: title, // 分享标题
						link: durl,
						imgUrl: img, // 分享图标
						type: "link",
						dataUrl: "",
						desc: desc,
						success: function() {},
						cancel: function() {}
					});
					//qq
					wx.onMenuShareQQ({
						title: title, // 分享标题
						link: durl, // 分享链接
						imgUrl: img, // 分享图标
						desc: desc,
						success: function() {},
						cancel: function() {}
					});
				});
			}
		});

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
	getQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return (r[2]);
		return null;
	}
	getOauthurl() {
		var s = this;



		$.ajax({
			type: 'post',
			url: 'http://api.zmiti.com/v2/weixin/getwxuserinfo/',
			data: {
				code: s.getQueryString('code'),
				wxappid: data.wxappid,
				wxappsecret: data.wxappsecret
			},
			error(e) {},
			success(dt) {

				if (dt.getret === 0) {

					s.openid = dt.userinfo.openid;
					s.nickname = dt.userinfo.nickname;
					s.headimgurl = dt.userinfo.headimgurl;

					// s.wxConfig(window.share.title.replace(/{nickname}/, s.nickname), window.share.desc.replace(/{nickname}/, s.nickname), 'http://h5.zmiti.com/public/teacherday/assets/images/300.jpg');
					s.state.nickname = s.nickname;
					window.nickname = s.nickname;
					s.forceUpdate();

					$.ajax({
						url: 'http://api.zmiti.com/v2/works/update_pvnum/',
						data: {
							worksid: worksid
						},
						success(data) {
							if (data.getret === 0) {}
						}
					});

					var idx = Math.random() * s.zmitiMap.length | 0;

					$.ajax({
						url: 'http://api.zmiti.com/v2/weixin/save_userview/',
						type: 'post',
						data: {
							worksid: worksid,
							wxopenid: s.openid,
							wxname: s.nickname,
							usercity: s.zmitiMap[idx].name,
							longitude: s.zmitiMap[idx].log,
							latitude: s.zmitiMap[idx].lat
						}
					}).done((data) => {
						if (data.getret === 0) {

						} else {
							//alert('save_userview getret : '+ data.getret +' msg : '+ data.getmsg)
						}
					}, () => {
						//alert('save_userview error');
					})


					//获取用户积分
					//
					var opt = {
						type: 'map',
						address: s.zmitiMap[idx].name,
						pos: [s.zmitiMap[idx].log, s.zmitiMap[idx].lat],
						nickname: s.nickname,
						headimgurl: s.headimgurl
					}
					$.ajax({
						url: 'http://api.zmiti.com/v2/msg/send_msg/',
						type: 'post',
						data: {
							type: worksid,
							content: JSON.stringify(opt),
							to: opt.to || ''
						},
						success(data) {

							//console.log(data);
						}
					})

				} else {
					if (s.isWeiXin()) {
						var file = s.getQueryString('file');
						var border = s.getQueryString('border');
						var wish = s.getQueryString('wish');
						var transX = s.getQueryString('transX');
						var transY = s.getQueryString('transY');

						var redirect_uri = window.location.href.split('?')[0];

						var symbol = redirect_uri.indexOf('?') > -1 ? '&' : '?';
						if (file) {
							redirect_uri = s.changeURLPar(redirect_uri, 'file', (file));
							redirect_uri = s.changeURLPar(redirect_uri, 'border', (border));
							redirect_uri = s.changeURLPar(redirect_uri, 'wish', (wish));
							redirect_uri = s.changeURLPar(redirect_uri, 'transX', (transX));
							redirect_uri = s.changeURLPar(redirect_uri, 'transY', (transY));
						}

						//url = s.changeURLPar(url, 'nickname', 'zmiti');


						$.ajax({
							url: 'http://api.zmiti.com/v2/weixin/getoauthurl/',
							type: 'post',
							data: {
								redirect_uri: redirect_uri,
								scope: 'snsapi_userinfo',
								worksid: worksid,
								state: new Date().getTime() + ''
							},
							error() {},
							success(dt) {
								if (dt.getret === 0) {
									window.location.href = dt.url;
								}
							}
						})
					} else {}
				}
			}
		});
	}
	changeURLPar(url, arg, val) {
		var pattern = arg + '=([^&]*)';
		var replaceText = arg + '=' + val;
		return url.match(pattern) ? url.replace(eval('/(' + arg + '=)([^&]*)/gi'), replaceText) : (url.match('[\?]') ? url + '&' + replaceText : url + '?' + replaceText);
	}
	componentDidMount() {
		var s = this;
		var file = s.getQueryString('file');
		var border = s.getQueryString('border');
		var wish = s.getQueryString('wish');
		var transX = s.getQueryString('transX');
		var transY = s.getQueryString('transY');
		if (file && border && wish) {
			this.setState({
				file,
				border,
				wish,
				transX,
				transY
			});
		}
		this.wxConfig(document.title, window.share.desc, 'http://h5.zmiti.com/public/teacherday/assets/images/300.jpg');
		this.getOauthurl();
	}
	isWeiXin() {
		var ua = window.navigator.userAgent.toLowerCase();
		if (ua.match(/MicroMessenger/i) == 'micromessenger') {
			return true;
		} else {
			return false;
		}
	}

}


ReactDOM.render(<App></App>, document.getElementById('fly-main-ui'));