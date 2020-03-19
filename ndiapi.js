const events			= require('events');
const eventEmitter		= new events.EventEmitter();

const grandiose			= require('grandiose');

const low			= require('lowdb');
const FileAsync			= require('lowdb/adapters/FileAsync');
const adapter				= new FileAsync(__dirname + '/db.json');
const { setIntervalAsync }	= require('set-interval-async/dynamic');
const { clearIntervalAsync }	= require('set-interval-async');
var db;

class ndi_api {

  constructor(instance) {
    this.instance = instance;
    this.source = [];
    this.init = false;
    (async () => {
      db = await low(adapter);
      db.defaults({
        source: []
      }).write();
    })();
  }

  getSources() {
    return this.source;
  }

  getDb() {
    return db;
  }

  getSourceDropdown() {
    var sourceList = [];

    for (let i = 0; i < this.source.length; i++) {
      //sourceList.push({id: this.source[i].name+ '|' + this.source[i].urlAddress, label: this.source[i].name});
      sourceList.push({
        id: this.source[i].name,
        label: this.source[i].name
      });
    }
    sourceList.push({
      id: 'custom',
      label: 'Custom'
    });
    return sourceList;
  }

  startNdiSourceInterval() {
    if (!this.init) {
      this.timer = setIntervalAsync(
        async () => {
            try {
              this.source = await grandiose.find({}, this.instance.config.nsdInt);
              for (let i = 0; i < this.source.length; i++) {
                var sourceDb = await db.get('source').filter({
                  name: this.source[i].name
                }).value();
                if (sourceDb.length > 0) {
                  if (sourceDb.urlAddress != this.source[i].urlAddress) {
                    db.get('source').find({
                      name: this.source[i].name
                    }).assign({
                      urlAddress: this.source[i].urlAddress
                    }).write();
                  }
                } else {
                  await db.get('source').push(this.source[i]).write();
                }
              }
              this.instance.system.emit('instance_actions', this.instance.id, this.instance.getActions.bind(this.instance)());
            } catch (e) {
              var sourceSize = await db.get('source').size().value();
              if (sourceSize > 0) {
                this.source = await db.get('source').value();
              }
              this.instance.system.emit('instance_actions', this.instance.id, this.instance.getActions.bind(this.instance)());
            }
          },
          this.instance.config.nsdInt + 1000 || 10000
      )
      this.init = true;
      this.instance.log('debug', 'Start Ndi Source Interval');

    }
  }

  stopNdiSourceInterval() {
    clearIntervalAsync(this.timer);
    this.init = false;
    this.instance.log('debug', 'Stop Ndi Source Interval');
  }

}

exports = module.exports = ndi_api;
