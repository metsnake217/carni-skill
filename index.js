module.change_code = 1;
'use strict';

var alexa = require( 'alexa-app' );
var app = new alexa.app( 'carni-skill' );
var schedulerClass = require('./scheduler');
var Scheduler = schedulerClass.Scheduler;
var moment = require('moment');
var momentz = require('moment-timezone');
var max_questions = 4;
var questions = ["Anything else i can help you with? otherwise Say 'Alexa Stop' to end our conversation", "Fun is on the way! Just ask for more schedules", "There are many other scheduled activities today. Would you like to know about them?","Another schedule for the road?","how else can I help you today?"];

app.error = function( exception, request, response ) {
    console.log(exception)
    console.log(request);
    console.log(response);
    response.say( 'Sorry an error occured ' + error.message);
};

app.launch( function( request, response ) {
	response.say( 'Hello, welcome to Carnival! You have finally arrived in your cabin. Look at the brochure behind me, it will help us commmunicate better!').reprompt( 'Still checking?' );
	response.shouldEndSession( false );

				response.render('../../node_modules/alexa-app-server/views/index', {
					title : 'Carni Test',
					matches : null,
					loggedIn : true,
					netlighter : request.session.user,
					user : request.session.userid,
					menu : 'today',
					state : 'ended',
					userid : request.session.userid,
					now : moment(new Date).tz("Europe/Berlin").format(
							'YYYY-MM-DD HH:mm:ss')
				// '2014-06-09 HH:mm:ss'
				});

		app.intent('closeSessionQuestion',
	   		{
	       "slots":{"answer":"LIST_OF_ANSWERS"}
	       ,"utterances":["{answer}"]
		    },
	   function(request,response) {
	       var answer = request.slot('answer');
	       console.log("answer is " + answer);
	       if(answer == 'no'){
	       		response.say("Hopefully i will be helpful to you soon! Call me when you need me... Have fun on the ship! Goodbye!");
	       		response.shouldEndSession(true);
	       } else if(answer == 'yes'){
	       		response.say("Great!  Would you like to know the schedule by a specific location today? Bar Lola, Pool, or Restaurant? Say Alexa what is the schedule by the location today or tomorrow?");
	       		response.shouldEndSession(false);
	       	} else {
				response.say("Hopefully i will be helpful to you soon! our conversation is about to end...").reprompt("it was lovely conversing with you! Goodbye!").shouldEndSession(true);
			}
	   });

	} );


app.intent('findSchedule',
	   {
	       "slots":{"location":"LIST_OF_LOCATIONS", "time":"AMAZON.DATE"}
	       ,"utterances":[ 
			      "what is the schedule by the {location} {time}",
			      "find the schedule of the {location} {time}"]
		    },
	   function(request,response) {
	       var location = request.slot('location');
	       var time = request.slot('time');
	       if(typeof time == "undefined"){
	       	time = moment().tz("America/New_York").format("YYYY-MM-DD");
	       }
	       console.log("location is " + location + " - time is " + time + " moment: " + moment());
	       if(typeof time != "undefined"){
	       	var resultats = "";
	       
	       var scheduler = new Scheduler(location,time);
					scheduler.getMatchOfTheDay(function(error, match) {
						console.log("match is " + match);
						if (match != null && match.length > 0) {
							for (var prop in match) {
								if(resultats != "") {
									resultats = resultats + " Next. ";
								}
								resultats = resultats + match[prop].activity + ". Starts at " + match[prop].time + " for " + match[prop].duration + ". ";
								console.log("prop is " + match[prop].location + " - " + prop);
							}
							if(typeof location != "undefined"){
								resultats = "Absolutely! Here's the schedule by the " + location + " on " + moment(time).format("dddd, MMMM Do YYYY") + " ... " + resultats + ". Come join Us!";
							} else {
								resultats = "Absolutely! Here are all the schedules on " + moment(time).format("dddd, MMMM Do YYYY") + " : ...." +  resultats + ". Join the fun!";
							}
							console.log("resultats end is: " + resultats);
							response.say(resultats); 
							response.send();
							response.shouldEndSession(false);
						} else {
							resultats = "Absolutely! Sorry there are no activities scheduled by the " + location + " on " + moment(time).format("dddd, MMMM Do YYYY") + "!";
							console.log("resultats end is: " + resultats);
							response.say(resultats); 
							response.send();
							response.shouldEndSession(false);
						}
						var num = Math.floor(Math.random() * (max_questions + 1));
						console.log("random is: " + num);
						response.say(questions[num]).shouldEndSession(false);
					});
		}

app.intent('closeSessionQuestion',
	   {
	       "slots":{"answer":"LIST_OF_ANSWERS"}
	       ,"utterances":["{answer}"]
		    },
	   function(request,response) {
	       var answer = request.slot('answer');
	       console.log("answer is " + answer);
	       if(answer == 'no'){
	       		response.say("It was fun talking to you. Call me when you need me. Have fun on the ship! Goodbye!");
	       		response.shouldEndSession(true);
	       } else if(answer == 'yes'){
	       		response.say("Great! Say 'location' or 'Location today' or 'All schedules today'?");
	       		response.shouldEndSession(false);
	       	} else {
			response.say("Our conversation is coming to an end. Anything i can help you with before we end our conversation?").reprompt("it was lovely conversing with you! Goodbye!").shouldEndSession(true);
	   		}
	   }
);

		return false;

});

app.intent('AMAZON.StopIntent',
	   function(request,response) {
	       		response.say("It was fun talking to you. Call me when you need me. Goodbye!").shouldEndSession(true);
	   }
);

app.intent('AMAZON.CancelIntent',
	   function(request,response) {
	       		response.say("It was fun talking to you. Call me when you need me. Have fun on the ship! Goodbye!").shouldEndSession(true);
	   }
);

app.intent('AMAZON.PauseIntent',
	   function(request,response) {
	       		response.say("Of course! I will give you some time... I'll wait for your instructions.").shouldEndSession(false);
	   }
);

app.intent('AMAZON.ResumeIntent',
	   function(request,response) {
	       		response.say("Ah where were we?").shouldEndSession(false);
	   }
);

app.intent('AMAZON.StartOverIntent',
	   function(request,response) {
	       		response.say("Allright! Let's ask carni again!").shouldEndSession(false);
	   }
);

app.intent('AMAZON.YesIntent',
	   function(request,response) {
	       		response.say("Great!").shouldEndSession(false);
	   }
);

app.intent('AMAZON.NoIntent',
	   function(request,response) {
	       		response.say("Allright! What else can I help you with?").shouldEndSession(false);
	   }
);

app.intent('carniHelp',
	   {},
	   function(request,response) {
	       		response.say("Sure. Hello there! I am your personal assistant on this cruise and will get you information about which activities are happening at what time, where you should eat or drink, wake you up with your favorite music in the morning, and even turn your lights on and off. Try me, say: 'Alexa All schedules today'. or. 'Alexa Pool today'. or. 'Alexa What\'s the schedule by the Pool tomorrow?'. or 'Alexa stop'. For the full list of commands look at the brochure behind me.'").reprompt("I hope these helped! what can i do you for?");
	       		response.shouldEndSession(false);
				response.render('index', {
					title : 'results',
					matches : null,
					loggedIn : true,
					time : req.param("time"),
					state : 'ended',
					test: "testing from help"
				});
	   }
);

module.exports = app;

