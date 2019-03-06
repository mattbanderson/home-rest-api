'use strict';

const Wemo = require('wemo-client');
const wemo = new Wemo();

class WemoGroup {
  constructor() {
    this.clients = [];
    wemo.discover(this._getClient.bind(this));
  }

  _sortByHost(a, b) {
    if (a.host < b.host) return -1;
    if (a.host > b.host) return 1;
    return 0
  }

  _getClient(deviceInfo) {
  	// Get the client for the found device
  	let client = wemo.client(deviceInfo);
    this.clients.push(client);
    this.clients = this.clients.sort(this._sortByHost);
  }

  search() {
    wemo.discover(this._getClient.bind(this));
  }
}

module.exports = WemoGroup;
