'use strict';

var Sensi = require('sensi');
var request = require('request');
var Promise = require('bluebird');
request = Promise.promisify(request.defaults({ jar: true }));

Sensi.prototype.connect = function() {
  const opts = {
    url: this.baseUrl + '/realtime/connect',
    method: 'GET',
    qs: {
      transport: 'longPolling',
      connectionToken: this.connectionToken,
      connectionData: unescape('%5B%7B%22name%22%3A%22thermostat-v1%22%7D%5D'), // this works but [{"name":"thermostat-v1"}] does not
      tid: 0, // appears to not be required, not sure what it represents
      _: new Date().getTime() // appears to not be required
    }
  };
  return request(opts).spread((_, body) => {
    const json = JSON.parse(body);
    this.messageId = json['C']; // set messageId received from response, required for subsequent calls to work
    return json;
  });
}

Sensi.prototype.send = function() {
  const opts = {
    url: this.baseUrl + '/realtime/send',
    method: 'POST',
    qs: {
      transport: 'longPolling',
      connectionToken: this.connectionToken
    },
    form: {
      data: JSON.stringify({
        'H': 'thermostat-v1',
        'M': 'Subscribe',
        'A': ['36-6f-92-ff-fe-03-0b-7d'],
        'I': 0
      })
    }
  };

  return request(opts).spread((_, body) => {
    const json = JSON.parse(body);
    return json;
  });
}

Sensi.prototype.getData = function() {
  let opts = {
    url: this.baseUrl + '/realtime/poll',
    method: 'GET',
    headers: this.defaultHeaders,
    qs: {
      transport: 'longPolling',
      connectionToken: this.connectionToken,
      connectionData: unescape('%5B%7B%22name%22%3A%22thermostat-v1%22%7D%5D'), // this works but [{"name":"thermostat-v1"}] does not
      tid: 1, // appears to not be required, not sure what it represents
      _: new Date().getTime() // appears to not be required
    }
  };

  if (this.groupsToken) opts.qs.groupsToken = this.groupsToken; // if groupsToken was returned from a previous call, include it, appears to not be necessary
  if (this.messageId) opts.qs.messageId = this.messageId; // include messageId received from previous call(s)

  return request(opts).spread((_, body) => {
    const json = JSON.parse(body);
    this.messageId = json['C']; // set messageId received from response, required for subsequent calls to work
    this.groupsToken = json['G']; // set groupsToken received from response, does not appear to be necessary
    return json;
  });
};

Sensi.prototype.getThermostatData = function() {
  var prom =
    this.start()
      .then(() => this.connect().bind(this)
      .then(() => this.send().bind(this)
    	.then(() => this.getData().bind(this))))
  return prom;
}

module.exports = Sensi;
