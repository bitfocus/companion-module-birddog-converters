const instance_skel			= require('../../instance_skel');
const instance_api			= require('./birddogapi');
const { executeAction, getActions } 	= require('./actions');

class BirdDogInstance extends instance_skel {

  constructor(system, id, config) {

    super(system, id, config);

    this.api = new instance_api(this);
    this.getActions = getActions;

  }

  init() {

    this.status(this.STATUS_WARNING,'Connecting');

    this.api.aboutDevice();
    this.api.getSourceList();
    this.api.getActiveSource();
    this.api.getAVSettings();
    this.actions();
    this.initVariables();
  }

  updateConfig(config) {
    
    this.config = config;
    this.init();
  }

  config_fields() {
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
        }
      ]
  }

  destroy() {
    this.debug("destroy", this.id);
  }

  actions() {
    this.system.emit('instance_actions', this.id, getActions.bind(this)());
  }

  action(action) {
    executeAction.bind(this)(action);
  }

  initVariables() {
		var variables = [];

		variables.push({
			label: 'Label of current decode source',
			name: 'decode_source'
		});

		this.setVariable('decode_source', this.api.device.currentSource);

    variables.push({
			label: 'Current mode (encode/decode) of the device',
			name: 'current_mode'
		});

		this.setVariable('current_mode', this.api.decodeMode);

    variables.push({
			label: 'Video format in encode mode',
			name: 'video_format'
		});

		this.setVariable('video_format', this.api.videoFormat);

		this.setVariableDefinitions(variables);
	}

}
module.exports = BirdDogInstance;
