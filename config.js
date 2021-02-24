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
      width: 6,
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
    }
  ]
};
