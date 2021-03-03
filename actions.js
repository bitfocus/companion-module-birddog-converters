exports.getActions = function() {
  return {
    changeNDISource: {
      label: 'Change Decode Source',
      options: [{
          type: 'dropdown',
          label: 'Source',
          id: 'source',
          choices: this.api.sourcelist
        }
      ]
    },
    changeNDISourceIP: {
      label: 'Change Decode Source by IP',
      options: [{
          type: 'textinput',
          label: 'NDI Source Name',
          id: 'ndiSource',
          width: 12,
          regex: this.REGEX_TEXT
        },
        {
          type: 'textinput',
          label: 'NDI Source IP',
          id: 'ndiSourceIp',
          width: 8,
          default: "127.0.0.1",
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
        }
      ]
    },
    resfreshNDISourceList: {
      label: 'Resfresh NDI Source List',
    },
  };
};

exports.executeAction = function(action) {
  if (action.action === 'changeNDISource') {
     if (action.options.source !=undefined) {
        var urlAddressSplit = this.api.sourcelist[action.options.source].split(':');
        var name = action.options.source;
      this.api.setNDIDecodeSource(urlAddressSplit[0], urlAddressSplit[1], name);
      } else {
        this.log('error', 'Unable to find the configured NDI source. Please check the NDI source info in the action configuration');
      }
  } else if (action.action === 'changeNDISourceIP') {
    if (action.options.ndiSource && action.options.ndiSourceIp && action.options.ndiSourcePort) {
      this.api.setNDIDecodeSource(action.options.ndiSourceIp, action.options.ndiSourcePort, action.options.ndiSource);
    } else {
      this.log('error', 'Unable to find the configured NDI source. Please check the NDI source info in the action configuration');
    }
  } else if (action.action === 'resfreshNDISourceList') {
      this.api.getSourceList();
  }
};
