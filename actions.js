let sourceIndex = 0


exports.getActions = function () {
	return {
		changeNDISource: {
			label: 'Change Decode Source',
			options: [
				{
					type: 'dropdown',
					label: 'Source',
					id: 'source',
					choices:
						this.api.sourceList?.length > 1
							? this.api.sourceList
							: [{ id: 'No sources found', label: 'No sources found' }],
					default: this.api.sourceList?.length > 1 ? this.api.sourceList[0].id : 'No sources found',
				},
			],
		},
		changeNDISourceIP: {
			label: 'Change Decode Source by IP',
			options: [
				{
					type: 'textinput',
					label: 'NDI Source Name',
					id: 'ndiSource',
					width: 12,
					regex: this.REGEX_TEXT,
				},
				{
					type: 'textinput',
					label: 'NDI Source IP',
					id: 'ndiSourceIp',
					width: 8,
					default: '127.0.0.1',
					regex: this.REGEX_IP,
				},
				{
					type: 'number',
					label: 'NDI Source Port',
					id: 'ndiSourcePort',
					width: 3,
					regex: this.REGEX_PORT,
					min: 1,
					max: 65535,
					default: 5961,
				},
			],
		},
		refreshNDISourceList: {
			label: 'Refresh NDI Source List',
		},
		sicleTroughSources: {
			label: 'Sicle Trough Sources',
			options: [
				{
					 type: 'dropdown',
					 label: 'Direction',
					 id: 'direction',
					 default: 1,
					 choices: [
					   { id: 1, label: 'Up' },
					   { id: -1, label: 'Down' }
					 ]
}
			]
		},
	}
}


exports.executeAction = function (action) {
	


	if (action.action === 'changeNDISource') {
		if (action.options.source != undefined && action.options.source != 'No sources found') {
			let urlSplit = this.api.sourceList[action.options.source].split(':')
			let ip = urlSplit[0]
			let port = urlSplit[1]
			let name = action.options.source
			this.api.setNDIDecodeSource(ip, port, name)
			
			let sourceList = this.api.sourceList

			sourceIndex = sourceList.findIndex((item) => {
			  return item.id === name
			})
			
			this.log('error','sourceIndex = ' + sourceIndex)

		} else {
			this.log(
				'error',
				'Unable to find the configured NDI source. Please check the NDI source info in the action configuration'
			)
		}
	} else if (action.action === 'changeNDISourceIP') {
		if (action.options.ndiSource && action.options.ndiSourceIp && action.options.ndiSourcePort) {
			this.api.setNDIDecodeSource(action.options.ndiSourceIp, action.options.ndiSourcePort, action.options.ndiSource)
		} else {
			this.log(
				'error',
				'Unable to find the configured NDI source. Please check the NDI source info in the action configuration'
			)
		}
	} else if (action.action === 'refreshNDISourceList') {
		this.api.getSourceList()
	}else if (action.action === 'sicleTroughSources') {
		//this.log('error', 'currentSource = ' + this.api.currentSource)

		
		sourceIndex = sourceIndex + action.options.direction

		if (sourceIndex <= -1){
			this.log('error','Pase al Ultimo')
			sourceIndex = this.api.sourceList.length - 1
		}else if (sourceIndex >= this.api.sourceList.length){
			this.log('error','Pase al Primero')
			sourceIndex = 0
		}


		this.log('error','sourceIndex = ' + sourceIndex)
		
		

		let sourceList = this.api.sourceList
		this.log('error','PASE sourceList')

		
		
		let selectedSourceID = sourceList[sourceIndex].id
		this.log('error', 'selectedSourceID =' + selectedSourceID)
		
		let selectedSource = sourceList[selectedSourceID]
		this.log('error', 'selectedSource =' + selectedSource)
		
		
		if (selectedSource != undefined) {
			let urlSplit = selectedSource.split(':')
			let ip = urlSplit[0]
			let port = urlSplit[1]
			let name = selectedSourceID
			this.api.setNDIDecodeSource(ip, port, name)
			this.log('error','------Setie el source------')
		} else {
			this.log(
				'error',
				'Unable to find the configured NDI source. Please check the NDI source info in the action configuration'
			)
		}
	}
}
