'use strict';

var express = require('express'),
	requestProxy = require('express-request-proxy'),
	cfg = require('./config/config'),
	secrets = require('./config/config-secrets'),
	EcoPlugGroup = require('ecoplugs'),
	Sensi = require('./lib/node-sensi'),
	WemoGroup = require('./lib/wemo-group'),
	app = express();

const config = Object.assign({}, cfg, secrets)

const sensi = new Sensi({
	username: config.sensiUsername,
	password: config.sensiPassword
});

const plugs = new EcoPlugGroup(config);
const wemos = new WemoGroup();

app.set('port', process.env.PORT || 8080);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/api/ping", function(req, res) {
	res.json("pong");
});

app.get("/api/thermostat", function(req, res) {
	sensi.getThermostatData().then(val => {
		res.json(val.M[0].A[1]);
	});
});

function getPlugState(res, plugsCollection, id) {
	if (plugsCollection[id]) {
		plugs.getPowerState(plugsCollection[id], (err, state) => {
			err ? res.status(500).send(err) : res.json(state ? "ON" : "OFF");
		});
	} else {
		res.status(404).send('"ECOPlug ' + id + ' could not be found."');
	}
}

function getSwitchState(res, switchCollection, reqId) {
	if (switchCollection[reqId]) {
		wemos.clients[reqId].getBinaryState((err, state) => {
			err ? res.status(500).send(err) : res.json(state !== "0" ? "ON" : "OFF");
		});
	} else {
		res.status(404).send('"Wemo Switch ' + reqId + ' could not be found."');
	}
}

function mapDeviceInfo(devices, newDevices, type) {
	newDevices.forEach((d, index) => devices.push({
		"name": d.name,
		"type": type,
		"route": "/api/" + type + "/" + index
	}));
	return devices;
}

app.get("/api/devices", function(req, res) {
	let devices = [];
	devices = mapDeviceInfo(devices, config.plugs, "ecoplug");
	devices = mapDeviceInfo(devices, config.switches, "wemo");
	devices.push({
		"name": "Garage Door",
		"type": "garage",
		"route": "/api/garage/door/1"
	});
	res.json(devices);
});

app.get("/api/ecoplug/:id", function(req, res) {
	getPlugState(res, config.plugs, req.params.id);
});

app.get("/api/wemo/:id", function(req, res) {
	getSwitchState(res, config.switches, req.params.id);
});

function setPlugState(res, plugsCollection, id) {
	if (plugsCollection[id]) {
		plugs.getPowerState(plugsCollection[id], (err, state) => {
	  	if (err) {
				res.status(500).send(err);
			} else {
				plugs.setPowerState(plugsCollection[id], !state, (err) => {
			  	err ? res.status(500).send(err) : res.json("OK");
				});
			}
		});
	} else {
		res.status(404).send('"ECOPlug ' + req.params.id + ' could not be found."');
	}
}

function setSwitchState(res, switchCollection, reqId) {
	if (switchCollection[reqId]) {
		wemos.clients[reqId].getBinaryState((err, state) => {
	  	if (err) {
				res.status(500).send(err);
		} else {
			wemos.clients[reqId].setBinaryState(state === "0" ? "1" : "0", (err) => {
				err ? res.status(500).send(err) : res.json("OK");
			});
		}
		});
	} else {
		res.status(404).send('"Wemo Switch ' + reqId + ' could not be found."');
	}
}

app.post("/api/ecoplug/:id", function(req, res) {
	setPlugState(res, config.plugs, req.params.id);
});

app.post("/api/wemo/:id", function(req, res) {
	setSwitchState(res, config.switches, req.params.id);
});

app.get("/api/garage/door/:id", requestProxy({
    url: config.garageDoorUrl + ":id",
}));

app.post("/api/garage/door/:id", requestProxy({
    url: config.garageDoorUrl + ":id",
}));

app.get("/api/video/0", requestProxy({
    url: config.cameras[0].url,
}));

app.get("/api/video/1", requestProxy({
    url: config.cameras[1].url,
}));

app.listen(app.get('port'));
