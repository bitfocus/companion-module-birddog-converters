// Config fields for the web interface
exports.getConfigFields = () => {
	return [
		{
			type: 'text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'This module supports BirdDog Studio and Mini! <br  /> <h4 style="color:RED;">NDI source detection mode is not yet available!!!!</h4>'
		},
		{
			type: 'dropdown',
			id: 'modelType',
			label: 'Model Type',
			choices: [{id:'bdmini', label: 'Mini'}, {id:'bdstudio', label: 'Studio'}],
			width: 4,
			default: 'bdmini',
			required: true
		},
		{
			type: 'checkbox',
			label: 'NDI Source Detection Mode',
			id: 'nsdMode',
			width: 4,
			default: false
		},
		{
			type: 'textinput',
			label: 'Target IP',
			id: 'deviceIp',
			width: 8,
			regex: this.REGEX_IP,
			required: true
		},
		{
			type: 'number',
			label: 'Target Port',
			id: 'devicePort',
			width: 3,
			regex: this.REGEX_PORT,
			min: 1,
			max: 65535,
			default: 8080,
			required: true

		},
	]
};
