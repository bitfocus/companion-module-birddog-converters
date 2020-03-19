exports.getActions = function() {
  return {
    changeNdiSource: {
      label: 'Change NDI Decode Source',
      options: [{
          type: 'dropdown',
          label: 'Source',
          id: 'source',
          default: 'custom',
          choices: this.ndi.getSourceDropdown()
        },
        {
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
          default: 8080,
        }
      ]
    },
    removeNdiSource: {
      label: 'Remove NDI Decode Source from DB',
      options: [{
        type: 'dropdown',
        label: 'Source',
        id: 'source',
        default: 'custom',
        choices: this.ndi.getSourceDropdown()
      }, ]
    }
  };
};

exports.executeAction = function(action) {
  if (action.action === 'changeNdiSource') {
    if (action.options.source == 'custom') {
      if (action.options.ndiSource && action.options.ndiSourceIp && action.options.ndiSourcePort) {
        this.api.setNdiDecodeSource(action.options.ndiSourceIp, action.options.ndiSourcePort, action.options.ndiSource);
      } else {
        this.log('error', 'The Ndi decoding source could not be changed!!! <h4>Check Action Config!!!</h4>');
      }
    } else {
      if (action.options.source) {
        (async () => {
          var sourceSize = await this.ndi.getDb().get('source').filter({
            name: action.options.source
          }).size().value();
          if (sourceSize > 0) {
            var sourceDb = await this.ndi.getDb().get('source').filter({
              name: action.options.source
            }).value();
            var urlAddressSplit = sourceDb[0].urlAddress.split(':');

            this.api.setNdiDecodeSource(urlAddressSplit[0], urlAddressSplit[1], sourceDb[0].name);
          } else {
            this.log('error', 'The Ndi decoding source could not be changed!!! <h4>Check Action Config!!!</h4>');
          }
        })();
      } else {
        this.log('error', 'The Ndi decoding source could not be changed!!! <h4>Check Action Config!!!</h4>');
      }
    }
  } else if (action.action === 'removeNdiSource') {
    if (action.options.source) {
      (async () => {
        var sourceSize = await this.ndi.getDb().get('source').filter({
          name: action.options.source
        }).size().value();
        if (sourceSize > 0) {
          await this.ndi.getDb().get('source').remove({
            name: action.options.source
          }).write();
          this.log('info', `Remove NDI Decode Source: ${action.options.source}!!!`);
        } else {
          this.log('error', 'The Ndi decoding source could not be removed!!! <h4>Check Action Config!!!</h4>');
        }
      })();
    } else {
      this.log('error', 'The Ndi decoding source could not be removed!!! <h4>Check Action Config!!!</h4>');
    }
  }
};
