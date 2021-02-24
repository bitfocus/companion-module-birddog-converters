const got = require('got');

class instance_api {

  constructor(instance) {
    this.instance = instance;
    this.device = {
      ip: this.instance.config.deviceIp,
      port: this.instance.config.devicePort,
      deviceName: '',
      source: '',
      sourcelist:'',
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
      source: ''
    };
  }

  aboutDevice() {
    const url = `http://${this.instance.config.deviceIp}:${this.instance.config.devicePort}/about`;
    const options = {
      json: true
    };
    got.get(url, options)
      .then(res => {
        if (res.body.MyHostName) {
          this.device.deviceName = res.body.MyHostName;
          this.instance.log('info', 'Connected to ' + this.device.deviceName);
          this.instance.status(this.instance.STATUS_OK);
        }
      })
      .catch(err => {
        console.log(err);
        this.instance.log('error', `Unable to connect to ${this.device.deviceName}. Please check the IP address and port in the config settings`);
        this.instance.status(this.instance.STATUS_ERROR,'Error');
      });
    return this.device;
  }

  getSourceList() {
    const url = `http://${this.instance.config.deviceIp}:${this.instance.config.devicePort}/List`;
    const options = {
      json: true
    };
    got.get(url, options)
      .then(res => {
        if (!res.body) {
          this.instance.log('warn', `Unable to retreive available sources for ${this.device.deviceName}`);
          return;
        }
        this.device.sourceslist = [];
        for (const [key, value] of Object.entries(res.body)) {
          var NDIName = key;
          var NDIIP = value; 
          this.device.sourceslist[NDIName] = NDIIP;
          this.device.sourceslist.push({ id: NDIName, label: NDIName});
        }
      })
      .catch(err => {
        this.instance.log('error', `Unable to connect to ${this.device.deviceName}. Please check the IP address and port in the config settings`);
        this.instance.status(this.instance.STATUS_ERROR);
      });
    return this.device.sourcelist;
  }

  getEncSettings() {
    const url = `http://${this.instance.config.deviceIp}:${this.instance.config.devicePort}/enc-settings`;
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
        this.instance.log('error', `Unable to connect to ${this.device.deviceName}. Please check the IP address and port in the config settings`);
        this.instance.status(this.instance.STATUS_ERROR);
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
        if (!res.body) {
          this.instance.log('warn', `Unable to retreive the decoding settings for ${this.device.deviceName}`);
          return;
        }
        this.device.decsettings = JSON.stringify(res.body);
      })
      .catch(err => {
        this.instance.log('error', `Unable to connect to ${this.device.deviceName}. Please check the IP address and port in the config settings`);
        this.instance.status(this.instance.STATUS_ERROR);
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
        if (!res.body) {
          this.instance.log('warn', `Unable to retreive AV settings for ${this.device.deviceName}`);
          return;
        }
        this.device.avsettings = JSON.stringify(res.body);
      })
      .catch(err => {
        this.instance.log('error', `Unable to connect to ${this.device.deviceName}. Please check the IP address and port in the config settings`);
        this.instance.status(this.instance.STATUS_ERROR);
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
        if (!res.body) {
          this.instance.log('warn', `Unable to retreive the NDI decode source for ${this.device.deviceName}`);
          return;
        }
        this.device.source = JSON.stringify(res.body);
      })
      .catch(err => {
        this.instance.log('error', `Unable to connect to ${this.device.deviceName}. Please check the IP address and port in the config settings`);
        this.instance.status(this.instance.STATUS_ERROR);
      });
    return this.device.source;
  }

  getDevice() {
    return this.device;
  }

  setNdiDecodeSource(ip, port, sourceName) {
    if (!ip || !port || !sourceName) {
      this.instance.log('warn', `Unable to change NDI decode source for ${this.device.deviceName}`);
      return false;
    }

    const url = `http://${this.instance.config.deviceIp}:${this.instance.config.devicePort}/connectTo`;
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
        } else {
          this.instance.log('warn', `Unable to change NDI decode source to ${sourceName} on ${this.device.deviceName}`);
        }
      })
      .catch(err => {
        this.instance.log('error', `Unable to connect to ${this.device.deviceName}. Please check the IP address and port in the config settings`);
        this.instance.status(this.instance.STATUS_ERROR);
      });

  }

}

exports = module.exports = instance_api;
