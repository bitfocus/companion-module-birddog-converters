const instance_skel			= require('../../instance_skel');
const { getConfigFields }		= require('./config');

const instance_api			= require('./birddogapi');

const { executeAction, getActions } 	= require('./actions');

var log;

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
    this.actions();
  }

  updateConfig(config) {
    
    this.config = config;
    this.init();

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
