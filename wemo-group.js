'use strict';

const Wemo = require('wemo-client');

const wemo = new Wemo();

let clients = [];

function getClient(deviceInfo) {
	console.log('Wemo Device Found: %j', deviceInfo);

	// Get the client for the found device
	let client = wemo.client(deviceInfo);

	// Handle BinaryState events
	client.on('binaryState', function(value) {
		console.log('Binary State changed to: %s', value);
	});
	clients.push(client);
}

wemo.discover(getClient);

module.exports = clients;
