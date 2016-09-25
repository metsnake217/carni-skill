var pg = require("pg");
var moment = require('moment-timezone');
//var MailOptions = require('../config/emailClient').MailOptions;
var config = require("./config/database");
var conString = process.env.DATABASE_URL || "pg://" + config.username + ":"
		+ config.password + "@" + config.host + ":" + config.port + "/"
		+ config.database;
var client = new pg.Client(conString);
client.connect();

Scheduler = function(location,time) {
	this.location = location;
	this.time = time;
};

//MatchFinder.prototype.getMatchOfTheDay = function(callback) {
Scheduler.prototype.getMatchOfTheDay = function(callback) {
	var results;
	var location = this.location;
	var time = this.time;
	var query;

	if(location != "undefined"){
	query = client
			.query("SELECT * FROM public.\"findAlexaSchedule\" where location='" + location + "' and date='" + time + "' order by date");
	} else {
	query = client
			.query("SELECT * FROM public.\"findAlexaSchedule\" where date='" + time + "' order by date");		
	}
	query.on("row", function(row, result) {
		console.log("row is " + row);
		result.addRow(row);
	});
	query.on("end", function(result) {
		results = result.rows;
		console.log("results is " + results);
		callback(null, results)
	});
};




exports.Scheduler = Scheduler;