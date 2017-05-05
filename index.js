'use strict';

var express = require('express'),
	requestProxy = require('express-request-proxy'),
	path = require('path'),
	cfg = require('./config/config'),
	secrets = require('./config/config-secrets'),
	async = require('async'),
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
		res.status(404).send("ECOPlug " + id + " could not be found.");
	}
}

app.get("/api/ecoplug/:id", function(req, res) {
	if (isNaN(req.params.id)) {
		getPlugState(res, config.plugsMap, req.params.id);
	} else {
		getPlugState(res, config.plugs, req.params.id);
	}
});

app.get("/api/wemo/:id", function(req, res) {
	if (config.switches[req.params.id] && wemos.clients[req.params.id]) {
		wemos.clients[req.params.id].getBinaryState((err, state) => {
			err ? res.status(500).send(err) : res.json(state !== "0" ? "ON" : "OFF");
		});
	} else {
		res.status(404).send("Wemo Switch " + req.params.id + " could not be found.");
	}
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
		res.status(404).send("ECOPlug " + req.params.id + " could not be found.");
	}
}

app.post("/api/ecoplug/:id", function(req, res) {
	if (isNaN(req.params.id)) {
		setPlugState(res, config.plugsMap, req.params.id);
	} else {
		setPlugState(res, config.plugs, req.params.id);
	}
});

app.post("/api/wemo/:id", function(req, res) {
	if (config.switches[req.params.id] && wemos.clients[req.params.id]) {
		wemos.clients[req.params.id].getBinaryState((err, state) => {
	  	if (err) {
				res.status(500).send(err);
			} else {
				wemos.clients[req.params.id].setBinaryState(state === "0" ? "1" : "0", (err) => {
			  	err ? res.status(500).send(err) : res.json("OK");
				});
			}
		});
	} else {
		res.status(404).send("ECOPlug " + req.params.id + " could not be found.");
	}
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
