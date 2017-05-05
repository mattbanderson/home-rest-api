'use strict';

const Wemo = require('wemo-client');
const wemo = new Wemo();

class WemoGroup {
  constructor() {
    this.clients = [];
    wemo.discover(this._getClient.bind(this));
  }

  _getClient(deviceInfo) {
  	// Get the client for the found device
  	let client = wemo.client(deviceInfo);

  	// Handle BinaryState events
  	client.on('binaryState', function(value) {
  		console.log('Binary State changed to: %s', value);
  	});
  	this.clients.push(client);
  }

  search() {
    wemo.discover(this._getClient.bind(this));
  }
}

module.exports = WemoGroup;
