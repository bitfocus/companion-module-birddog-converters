import { InstanceBase, runEntrypoint } from '@companion-module/base'
import { getActions } from './actions.js'
import { getPresets } from './presets.js'
import { getVariables } from './variables.js'
import { getFeedbacks } from './feedbacks.js'
import { upgradeScripts } from './upgrades.js'
import { models } from './models.js'

import fetch from 'node-fetch'
import WebSocket from 'ws'

class BirdDogInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	async init(config) {
		this.config = config
		this.updateStatus('connecting')

		if (this.config?.host) {
			this.device = {}

			if (this.ws !== undefined) {
				this.ws.close(1000)
				delete this.ws
			}

			this.checkConnection()
		}
	}

	async destroy() {
		this.device = {}

		if (this.ws !== undefined) {
			this.ws.close(1000)
			delete this.ws
		}

		if (this.websocketPoll) {
			clearInterval(this.websocketPoll)
		}
	}

	async configUpdated(config) {
		this.config = config
		this.init(config)
	}

	getConfigFields() {
		return [
			{
				type: 'textinput',
				label: 'Device IP or Hostname',
				id: 'host',
				width: 6,
				required: true,
			},
		]
	}

	checkConnection() {
		fetch(`http://${this.config.host}:8080/about`)
			.then((res) => {
				if (res.status == 200) {
					return res.json()
				}
			})
			.then((data) => {
				if (data?.HostName) {
					this.device.about = data
					this.log('info', `Connected to ${data.HostName}`)
					this.updateStatus('ok')
					this.openConnection()
				} else if (data?.Version === '1.0') {
					this.log(
						'error',
						`Unable to connect to ${
							data.MyHostName ? data.MyHostName : 'BirdDog device'
						}, firmware must be updated to LTS version or newer`
					)
					this.updateStatus('connection_failure', 'Firmware Update Needed')
				}
			})
			.catch((error) => {
				let errorText = String(error)
				if (errorText.match('ETIMEDOUT') || errorText.match('ENOTFOUND') || errorText.match('ECONNREFUSED')) {
					this.updateStatus('bad_config')
					this.log('error', 'Unable to connect to BirdDog converter. Check your device address in the module settings')
				} else {
					this.log('debug', errorText)
				}
			})
	}

	openConnection() {
		//Gather device data
		this.sendCommand('about', 'GET')
		this.sendCommand('List', 'GET')
		this.sendCommand('connectTo', 'GET')

		//Initialize Companion components
		this.initVariables()
		this.initFeedbacks()
		this.initActions()
		this.initPresets()

		//Open Websocket
		this.initWebsocket()

		//Model Specific Requests
		let device = this.device.about.Format
		if (models.operationmode.available.find((converter) => converter == device)) {
			this.sendCommand('operationmode', 'GET')
		} else {
			let mode = models.operationmode.static[device]
			this.setVariableValues({ current_mode: mode ? mode : 'Unknown' })
		}
	}
	initVariables() {
		const variables = getVariables.bind(this)()
		this.setVariableDefinitions(variables)
	}

	initFeedbacks() {
		const feedbacks = getFeedbacks.bind(this)()
		this.setFeedbackDefinitions(feedbacks)
	}

	initPresets() {
		const presets = getPresets.bind(this)()
		this.setPresetDefinitions(presets)
	}

	initActions() {
		const actions = getActions.bind(this)()
		this.setActionDefinitions(actions)
	}

	sendCommand(cmd, type, params) {
		let url = `http://${this.config.host}:8080/${cmd}`
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
				//this.processStatus(res)
				if (res.status == 200) {
					if (cmd === 'operationmode') {
						this.processData(cmd, res.text())
					} else {
						return res.json()
					}
				}
			})
			.then((json) => {
				let data = json
				if (data?.success) {
					//ignore success messages that do not have data
				} else if (data?.success === false) {
					this.log('warn', `Command failed: ${data.error}`)
				} else {
					if (data) {
						this.processData(cmd, data)
					}
				}
			})
			.catch((error) => {
				this.log('debug', error)
			})
	}

	processData(cmd, data) {
		if (cmd.match('about')) {
			this.device.about = data
			this.setVariableValues({
				device_name: data.HostName,
			})
		} else if (cmd.match('List')) {
			this.device.list = []
			for (let [key, value] of Object.entries(data)) {
				let name = key
				this.device.list.push({ id: name, label: name })
				this.initActions()
				this.initFeedbacks()
				this.initPresets()
			}
		} else if (cmd.match('connectTo')) {
			this.device.decodeSource = data.sourceName
			this.setVariableValues({
				decode_source: data.sourceName,
			})
			this.checkFeedbacks('decodeSourceName')
		} else if (cmd.match('operationmode')) {
			console.log('here')
			this.device.operationMode = data.sourceName
			this.setVariableValues({
				current_mode: data.sourceName,
			})
		}
	}

	initWebsocket() {
		if (this.ws !== undefined) {
			this.ws.close(1000)
			delete this.ws
		}

		this.ws = new WebSocket(`ws://${this.config.host}:6790/`)

		this.ws.on('open', () => {
			this.log('debug', `WebSocket connection opened`)
		})

		this.ws.on('close', (code) => {
			this.log('debug', `WebSocket Connection closed with code ${code}`)
			if (code !== 1000) {
				this.updateStatus('connection_failure')
				this.websocketPoll = setInterval(this.initWebsocket.bind(this), 5000)
			}
		})

		this.ws.on('message', (message) => {
			let data
			try {
				data = JSON.parse(message.toString())
				this.processWebsocket(data)
			} catch (e) {
				this.log('debug', 'JSON Error:' + e)
			}
		})

		this.ws.on('error', (data) => {
			this.log('debug', `WebSocket error: ${data}`)
		})
	}

	processWebsocket(data) {
		let updates = {}
		for (const [key, value] of Object.entries(data)) {
			if (key === 'vid_str_name' && value && value != this.device.decodeSource) {
				this.device.decodeSource = value
				updates.decode_source = value
				this.checkFeedbacks('decodeSource')
			} else if (key === 'vid_disp' && value != this.device.videoFormat) {
				this.device.videoFormat = value
				updates.video_format = value
			} else if (key === 'src_stat' && value && value != this.device.sourceStatus) {
				this.device.sourceStatus = value
				updates.source_status = value
			} else if (key === 'vid_res' && value && value != this.device.videoResolution) {
				this.device.videoResolution = value
				updates.video_resolution = value
			} else if (key === 'vid_fr' && value && value != this.device.videoFrameRate) {
				this.device.videoFrameRate = value
				updates.video_framerate = value
			}
		}
		if (updates.video_format === '') {
			updates.video_format = `${updates.video_resolution ? updates.video_resolution : ''} ${
				updates.video_framerate ? updates.video_framerate : ''
			}`
		}
		this.setVariableValues(updates)
	}
}

runEntrypoint(BirdDogInstance, upgradeScripts)
