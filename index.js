const instance_skel  = require('../../instance_skel');
const { executeAction, getActions } = require('./actions');

const { getConfigFields } = require('./config');

/**
 * Companion instance class for BirdDog Studio/Mini
 */
class BirdDogInstance extends instance_skel {

  /**
   * Create an instance of a BirdDog module.
   *
   * @param {EventEmitter} system - the brains of the operation
   * @param {string} id - the instance ID
   * @param {Object} config - saved user configuration parameters
   * @since 1.0.1
   */
  constructor(system, id, config) {

    super(system, id, config);

  }

  /**
   * Main initialization function called once the module
   * is OK to start doing things.
   *
   * @access public
   * @since 1.0.1
   */
  init() {
		this.status(this.STATUS_UNKNOWN);
  }


  /**
   * Process an updated configuration array.
   *
   * @param {Object} config - the new configuration
   * @access public
   * @since 1.0.1
   */
  updateConfig(config) {
      this.config = config;

      this.actions();
  }

  /**
   * Set fields for instance configuration in the web
   *
   * @access public
   * @since 1.0.1
   */
	config_fields() {
		return getConfigFields();
	}

  /**
   * Clean up the instance before it is destroyed.
   *
   * @access public
   * @since 1.0.1
   */
  destroy() {
    this.debug("destroy", this.id);
  }

  /**
   * Set available actions
   *
   * @access public
   * @since 1.0.1
   */
  actions() {
    this.system.emit('instance_actions', this.id, getActions.bind(this)());
  }

  /**
   * Set available actions
   *
   * @param {Object} action - the action to be executed
   * @access public
   * @since 1.0.1
   */
  action(action) {
    executeAction.bind(this)(action);
  }

}
module.exports = BirdDogInstance;
