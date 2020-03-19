// Config fields for the web interface
exports.getConfigFields = () => {
  return [{
      type: 'text',
      id: 'info',
      width: 12,
      label: 'Information',
      value: 'This module supports BirdDog Studio and Mini!'
    },
    {
      type: 'textinput',
      label: 'Target IP',
      id: 'deviceIp',
      width: 8,
      default: "127.0.0.1",
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
    {
      type: 'checkbox',
      label: 'NDI Source Detection Mode',
      id: 'nsdMode',
      width: 3,
      default: true,
      required: true
    },
    {
      type: 'number',
      label: 'NDI Source Detection Interval (ms)',
      id: 'nsdInt',
      width: 4,
      regex: this.REGEX_NUMBER,
      default: 10000,
      min: 5000,
      max: 60000,
      required: true
    }
  ]
};
