'use strict';

var express = require('express'),
	requestProxy = require('express-request-proxy'),
	path = require('path'),
	cfg = require('./config'),
	secrets = require('./config-secrets'),
	async = require('async'),
	EcoPlugGroup = require('ecoplugs'),
	Sensi = require('./node-sensi'),
	app = express();

const config = Object.assign({}, cfg, secrets)

const sensi = new Sensi({
	username: config.sensiUsername,
	password: config.sensiPassword
});

const plugs = new EcoPlugGroup(config);

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

app.get("/api/ecoplug/:id", function(req, res) {
	if (config.plugs[req.params.id]) {
		plugs.getPowerState(config.plugs[req.params.id], (err, state) => {
	  	err ? res.status(500).send(err) : res.json(state ? "ON" : "OFF");
		});
	} else {
		res.status(404).send("ECOPlug " + req.params.id + " could not be found.");
	}
});

app.post("/api/ecoplug/:id", function(req, res) {
	if (config.plugs[req.params.id]) {
		plugs.getPowerState(config.plugs[req.params.id], (err, state) => {
	  	if (err) {
				res.status(500).send(err);
			} else {
				plugs.setPowerState(config.plugs[req.params.id], !state, (err) => {
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

app.listen(app.get('port'));
