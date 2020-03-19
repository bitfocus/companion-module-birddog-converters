const got = require('got');

class instance_api {

		constructor(instance) {
				this.instance = instance;
				this.device  = {
						ip:								this.instance.config.deviceIp,
						port:							this.instance.config.devicePort,
						deviceName:       '',
						source:						'',
						encsettings:      {
								ndiaudio:					'',
								nditally:					'',
								ndivideoq:				''
						},
						decsettings: 			{
								decss:						'',
								delfs:						''
						},
						avsettings:				{
								ainputsel:				'',
								ajingain:					'',
								ajoutput:					'',
								avtallyh:					'',
								avtallys:					'',
								videoin:					'',
								videoincs:				'',
								videoout:					'',
								videoouth:				'',
								videoouts:				'',
								vidinsel:					'',
						},
						source:						''
				};}

		aboutDevice() {
				const url = `http://${this.instance.config.deviceIp}:${this.instance.config.devicePort}/about`;
				const options = {
						json: true
				};
				got.get(url, options)
						.then(res => {
								if(res.body.MyHostName) {
										this.device.deviceName = res.body.MyHostName;
								}
						})
						.catch(err => {
								console.log(err);
								this.instance.log('warn', 'Please check the device status or the ip and port of the device');
						});
				return this.device;
		}

		getEncSettings() {
				const url = `http://${this.instance.config.deviceIp}:${this.instance.config.devicePort}/enc-settings`;
				const options = {
						json: true
				};
				got.get(url, options)
						.then(res => {
								if(!res.body) {
										this.instance.log('warn', 'Retrieving the encoding settings failed!');
										return;
								}
								this.device.encsettings = JSON.stringify(res.body);
						})
						.catch(err => {
								this.instance.log('warn', 'Please check the device status or the ip and port of the device');
						});
				return this.device.encsettings;
		}

		getDecSettings() {
				const url = `http://${this.instance.config.deviceIp}:${this.instance.config.devicePort}/dec-settings`;
				const options = {
						json: true
				};
				got.get(url, options)
						.then(res => {
								if(!res.body) {
										this.instance.log('warn', 'Retrieving the decoding settings failed!');
										return;
								}
								this.device.decsettings = JSON.stringify(res.body);
						})
						.catch(err => {
								this.instance.log('warn', 'Please check the device status or the ip and port of the device');
						});
				return this.device.decsettings;
		}

		getAVSettings() {
				const url = `http://${this.instance.config.deviceIp}:${this.instance.config.devicePort}/av-settings`;
				const options = {
						json: true
				};
				got.get(url, options)
						.then(res => {
								if(!res.body) {
										this.instance.log('warn', 'Retrieving the AV settings failed!');
										return;
								}
								this.device.avsettings = JSON.stringify(res.body);
						})
						.catch(err => {
								this.instance.log('warn', 'Please check the device status or the ip and port of the device');
						});
				return this.device.avsettings;
		}

		getAktiveSource() {
				const url = `http://${this.instance.config.deviceIp}:${this.instance.config.devicePort}/connectTo`;
				const options = {
						json: true
				};
				got.get(url, options)
						.then(res => {
								if(!res.body) {
										this.instance.log('warn', 'Retrieving the NDI decoding source failed!');
										return;
								}
								this.device.source = JSON.stringify(res.body);
						})
						.catch(err => {
								this.instance.log('warn', 'Please check the device status or the ip and port of the device');
						});
				return this.device.source;
		}

		getDevice() {
				return this.device;
		}

		setNdiDecodeSource(ip, port, sourceName) {
				if(!ip || !port || !sourceName) {
					this.instance.log('warn', `The Ndi decoding source could not be changed!!`);
						return false;
				}

				const url = `http://${this.instance.config.deviceIp}:${this.instance.config.devicePort}/connectTo`;
				const sourceNameSplit = sourceName.split(" ");
				const sourceJson = {connectToIp: ip, port: port, sourceName: sourceName, sourcePcName: sourceNameSplit[0]};

				const options = {
						body: sourceJson,
						json: true
				};

				got.post(url, options)
						.then(res => {
								if(!res.body) {
									  this.instance.log('warn', `The Ndi decoding source could not be changed to: ${sourceName} on Devicce: ${this.device.devicenName}`);
										return;
								}
								if(JSON.stringify(res.body) == JSON.stringify(sourceJson)) {
										this.device.source = sourceName;

										this.instance.log('info', `Change NDI Decode Source to: ${this.device.source} on Device: ${this.device.deviceName}!!!`);
								}else {
										this.instance.log('warn', `The Ndi decoding source could not be changed to: ${sourceName} on Devicce: ${this.device.devicenName}`);
								}
						})
						.catch(err => {
								this.instance.log('warn', 'Please check the device status or the ip and port of the device');
						});

		}

}

exports = module.exports = instance_api;
