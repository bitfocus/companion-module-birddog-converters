const fetch = require('node-fetch')

class instance_api {
	constructor(instance) {
		this.instance = instance
		this.device = {
			ip: this.instance.config.deviceIp,
			port: 8080,
			deviceName: '',
			encodeSettings: {
				ndiaudio: '',
				nditally: '',
				ndivideoq: '',
			},
			decodeSettings: {
				decss: '',
				delfs: '',
			},
			avSettings: {
				ainputsel: '',
				ajingain: '',
				ajoutput: '',
				avtallyh: '',
				avtallys: '',
				videoin: '',
				videoincs: '',
				videoout: '',
				videoouth: '',
				videoouts: '',
				vidinsel: '',
			},
		}
	}

	sendCommand(cmd, type, params) {
		let url = `http://${this.instance.config.deviceIp}:8080/${cmd}`
		let options = {}
		if (type == 'PUT' || type == 'POST') {
			options = {
				method: type,
				body: params != undefined ? JSON.stringify(params) : null,
				headers: { 'Content-Type': 'application/json' },
			}
		} else {
			options = {
				method: type,
				headers: { 'Content-Type': 'application/json' },
			}
		}

		fetch(url, options)
			.then((res) => {
				if (res.ok) {
					if (this.instance.currentStatus !== 0) {
						this.instance.status(this.instance.STATUS_OK)
					}
					return res.json()
				}
			})
			.then((json) => {
				if (json) {
					this.processData(decodeURI(url), json)
				}
			})
			.catch((err) => {
				this.instance.debug('Device Error: ' + err)

				let errorText = String(err)
				if (this.instance.currentStatus !== 2) {
					if (errorText.match('ECONNREFUSED') || errorText.match('ENOTFOUND') || errorText.match('ETIMEDOUT')) {
						this.instance.log(
							'error',
							`Unable to connect${
								this.device.deviceName ? ' to ' + this.device.deviceName : ''
							}. Please check the device IP address in the config settings`
						)
					}
					this.instance.status(this.instance.STATUS_ERROR)
				}
			})
	}

	processData(cmd, data) {
		if (cmd.match('/about')) {
			if (data.MyHostName) {
				if (this.instance.currentStatus !== 0 && this.device.deviceName != data.MyHostName) {
					this.instance.log('info', `Connected to ${data.MyHostName}`)
				}
				this.instance.status(this.instance.STATUS_OK)
				this.device.deviceName = data.MyHostName
			}
		} else if (cmd.match('/list')) {
			this.sourceList = []
			for (let [key, value] of Object.entries(data)) {
				let NDIName = key
				let NDIIP = value
				this.sourceList[NDIName] = NDIIP
				this.sourceList.push({ id: NDIName, label: NDIName })
			}
			this.instance.system.emit('instance_actions', this.instance.id, this.instance.getActions.bind(this.instance)())
		} else if (cmd.match('/enc-settings')) {
			this.device.encodeSettings = data
		} else if (cmd.match('/dec-settings')) {
			this.device.decodeSettings = data
		} else if (cmd.match('/av-settings')) {
			this.device.avSettings = data

			this.currentMode = data.videoout == 'videooutd' ? 'Decode' : 'Encode'
			this.instance.setVariable('current_mode', this.currentMode)

			this.videoFormat = data.videoin == 'AUTO' ? 'Auto' : data.videoin
			this.instance.setVariable('video_format', this.videoFormat)
		} else if (cmd.match('/connectTo')) {
			this.device.connection = data
			this.instance.setVariable('decode_source', data.sourceName)
		}
	}
	getDeviceInfo() {
		this.sendCommand('about', 'GET')
		this.sendCommand('enc-settings', 'GET')
		this.sendCommand('dec-settings', 'GET')
		this.sendCommand('av-settings', 'GET')
	}

	getSourceList() {
		this.sendCommand('list', 'GET')
	}

	getActiveSource() {
		this.sendCommand('connectTo', 'GET')
	}

	setNDIDecodeSource(ip, port, sourceName) {
		let sourceNameSplit = sourceName.split(' ')
		let sourceJson = {
			connectToIp: ip,
			port: port,
			sourceName: sourceName,
			sourcePcName: sourceNameSplit[0],
		}
		this.sendCommand('connectTo', 'POST', sourceJson)
	}
}

exports = module.exports = instance_api
