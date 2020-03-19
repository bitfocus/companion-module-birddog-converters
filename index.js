const instance_skel			= require('../../instance_skel');
const { getConfigFields }		= require('./config');

const instance_api			= require('./birddogapi');
const ndi_api				= require('./ndiapi');

const { executeAction, getActions } 	= require('./actions');

var log;

class BirdDogInstance extends instance_skel {

  constructor(system, id, config) {

    super(system, id, config);

    this.api = new instance_api(this);
    this.ndi = new ndi_api(this);
    this.getActions = getActions;

  }

  init() {

    this.status(this.STATUS_UNKNOWN);

    if (this.config.nsdMode) {
      this.ndi.startNdiSourceInterval();
    }
    this.api.aboutDevice();
    this.actions();
  }

  updateConfig(config) {
    if (this.config.nsdMode != config.nsdMode) {
      if (config.nsdMode) {
        this.ndi.startNdiSourceInterval();
      } else {
        this.ndi.stopNdiSourceInterval();
      }
    }

    this.config = config;

    this.actions();
  }

  config_fields() {
    return getConfigFields();
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

}
module.exports = BirdDogInstance;
