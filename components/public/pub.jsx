import React, {
	Component
} from 'react';

import $ from 'jquery';

export let PubCom = ComponsedComponent => class extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}


	componentWillMount() {

	}

	log(opt) {
		$.ajax({
			url: window.baseUrl + 'msg/send_msg',
			data: {
				type: opt.key || 'log',
				content: JSON.stringify(opt),
			}
		})
	}


	render() {


		let methods = {
			log: this.log
				//fillFeilds:this.fillFeilds
		}

		return <ComponsedComponent {...methods} {...this.props} {...this.state} />;
	}
}