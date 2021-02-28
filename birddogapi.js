const got = require('got');

class instance_api {

  constructor(instance) {
    this.instance = instance;
    this.device = {
      ip: this.instance.config.deviceIp,
      port: 8080,
      deviceName: '',
      source: '',
      encsettings: {
        ndiaudio: '',
        nditally: '',
        ndivideoq: ''
      },
      decsettings: {
        decss: '',
        delfs: ''
      },
      avsettings: {
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
    };
  }

  aboutDevice() {
    const url = `http://${this.instance.config.deviceIp}:8080/about`;
    const options = {
      json: true
    };
    got.get(url, options)
      .then(res => {
        if (res.body.MyHostName) {
          this.device.deviceName = res.body.MyHostName;
          this.instance.log('info', `Connected to ${this.device.deviceName}`);
          this.instance.status(this.instance.STATUS_OK);
        }
      })
      .catch(err => {
        console.log(err);
        this.instance.log('error', `Unable to connect to ${this.device.deviceName}. Please check the device IP address in the config settings`);
        this.instance.status(this.instance.STATUS_ERROR,'Error');
      });
    return this.device;
  }

  getSourceList() {
    const url = `http://${this.instance.config.deviceIp}:8080/List`;
    const options = {
      json: true
    };
    got.get(url, options)
      .then(res => {
        if (!res.body) {
          this.instance.log('warn', `Unable to retreive available sources for ${this.device.deviceName}`);
          return;
        }
        this.sourcelist = [];
        for (const [key, value] of Object.entries(res.body)) {
          const NDIName = key;
          const NDIIP = value; 
          this.sourcelist[NDIName] = NDIIP;
          this.sourcelist.push({ id: NDIName, label: NDIName});
        }
        this.instance.system.emit('instance_actions', this.instance.id, this.instance.getActions.bind(this.instance)());
      })
      .catch(err => {
        this.instance.log('error', `Unable to connect to ${this.device.deviceName}. Please check the device IP address in the config settings`);
        this.instance.status(this.instance.STATUS_ERROR);
      });
    return this.sourcelist;
  }

  getEncSettings() {
    const url = `http://${this.instance.config.deviceIp}:8080/enc-settings`;
    const options = {
      json: true
    };
    got.get(url, options)
      .then(res => {
        if (!res.body) {
          this.instance.log('warn', `Unable to retreive the encoding settings for ${this.device.deviceName}`);
          return;
        }
        this.device.encsettings = JSON.stringify(res.body);
      })
      .catch(err => {
        this.instance.log('error', `Unable to connect to ${this.device.deviceName}. Please check the device IP address in the config settings`);
        this.instance.status(this.instance.STATUS_ERROR);
      });
    return this.device.encsettings;
  }

  getDecSettings() {
    const url = `http://${this.instance.config.deviceIp}:8080/dec-settings`;
    const options = {
      json: true
    };
    got.get(url, options)
      .then(res => {
        if (!res.body) {
          this.instance.log('warn', `Unable to retreive the decoding settings for ${this.device.deviceName}`);
          return;
        }
        this.device.decsettings = JSON.stringify(res.body);
        this.instance.log('warn', this.device.decsettings);
      })
      .catch(err => {
        this.instance.log('error', `Unable to connect to ${this.device.deviceName}. Please check the device IP address in the config settings`);
        this.instance.status(this.instance.STATUS_ERROR);
      });
    return this.device.decsettings;
  }

  getAVSettings() {
    const url = `http://${this.instance.config.deviceIp}:8080/av-settings`;
    const options = {
      json: true
    };
    got.get(url, options)
      .then(res => {
        if (!res.body) {
          this.instance.log('warn', `Unable to retreive AV settings for ${this.device.deviceName}`);
          return;
        }
        this.device.avsettings = JSON.stringify(res.body);
        this.decodeMode = 'Updating';
        if (res.body.videoout === 'videooutd') {
          this.decodeMode = 'Decode'
        } else {
          this.decodeMode = 'Encode'
        }
        this.instance.setVariable('current_mode', this.decodeMode);
        this.videoFormat = 'Updating';
        if (res.body.videoin !='AUTO') {
          this.videoFormat = res.body.videoin;
        } else {
          this.videoFormat = 'Auto'
        }
        this.instance.setVariable('video_format', this.videoFormat);
      })
      .catch(err => {
        this.instance.log('error', `Unable to connect to ${this.device.deviceName}. Please check the device IP address in the config settings`);
        this.instance.status(this.instance.STATUS_ERROR);
      });
    return this.device.avsettings;
  }

  getActiveSource() {
    const url = `http://${this.instance.config.deviceIp}:8080/connectTo`;
    const options = {
      json: true
    };
    got.get(url, options)
      .then(res => {
        if (!res.body) {
          this.instance.log('warn', `Unable to retreive the NDI decode source for ${this.device.deviceName}`);
          return;
        } else if (res.body.sourceName) {
          this.device.currentSource = res.body.sourceName;
        }
        this.instance.setVariable('decode_source', this.device.currentSource);
      })
      .catch(err => {
        this.instance.log('error', `Unable to connect to ${this.device.deviceName}. Please check the device IP address in the config settings`);
        this.instance.status(this.instance.STATUS_ERROR);
      });
    return this.device.currentSource;
  }

  getDevice() {
    return this.device;
  }

  setNDIDecodeSource(ip, port, sourceName) {
    if (!ip || !port || !sourceName) {
      this.instance.log('warn', `Unable to change NDI decode source for ${this.device.deviceName}`);
      return false;
    }

    const url = `http://${this.instance.config.deviceIp}:8080/connectTo`;
    const sourceNameSplit = sourceName.split(" ");
    const sourceJson = {
      connectToIp: ip,
      port: port,
      sourceName: sourceName,
      sourcePcName: sourceNameSplit[0]
    };

    const options = {
      body: sourceJson,
      json: true
    };
    got.post(url, options)
      .then(res => {
        if (!res.body) {
          this.instance.log('warn', `Unable to change NDI decode source to ${sourceName} on ${this.device.deviceName}`);
          return;
        }
        if (JSON.stringify(res.body) == JSON.stringify(sourceJson)) {
          this.device.source = sourceName;

          this.instance.log('info', `Changed NDI decode source to ${this.device.source} on ${this.device.deviceName}`);
          this.getActiveSource();
        } else {
          this.instance.log('warn', `Unable to change NDI decode source to ${sourceName} on ${this.device.deviceName}`);
        }
      })
      .catch(err => {
        this.instance.log('error', `Unable to connect to ${this.device.deviceName}. Please check the device IP address in the config settings`);
        this.instance.status(this.instance.STATUS_ERROR);
      });

  }

}

exports = module.exports = instance_api;
