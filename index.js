module.change_code = 1;
'use strict';

var alexa = require( 'alexa-app' );
//var alexaresp = require( 'alexa-response' );
var app = new alexa.app( 'carni-skill' );
var schedulerClass = require('./scheduler');
var Scheduler = schedulerClass.Scheduler;


app.launch( function( request, response ) {
			//alexaresp.ask("ah what is your problem?").build();
	response.say( 'Hello, welcome to Carnival. Now that we are friends, I can tell you a secret. I will be your personal assistant on this cruise and will get you information about which activities are happening at what time, where you should eat or drink, wake you up with your favorite music in the morning, and even turn your lights on and off. Try me, say: "Alexa turn lights on" or "Alexa turn lights off" or "Alexa What is the schedule by the Pool today". For the full list of commands look at the brochure behind me.' ).reprompt( 'Are you still there?' ).shouldEndSession( false );


		//response.ask("what is your problem?").build();


    } );


app.error = function( exception, request, response ) {
    console.log(exception)
    console.log(request);
    console.log(response);
    response.say( 'Sorry an error occured ' + error.message);
};

app.intent('sayNumber',
	   {
	       "slots":{"number":"NUMBER"}
	       ,"utterances":[ 
			      "say the number {1-100|number}",
			      "give me the number {1-100|number}",
			      "tell me the number {1-100|number}",
			      "I want to hear you say the number {1-100|number}"]
		    },
	   function(request,response) {
	       var number = request.slot('number');
	       number = number * number;
	       response.say("Oh dear! You are looking for the number " + number + ". Anything else I can help you with?");
	       response.shouldEndSession(false);
	   }
);

app.intent('closeSessionQuestion',
	   {
	       "slots":{"answer":"LIST_OF_ANSWERS"}
	       ,"utterances":["{answer}"]
		    },
	   function(request,response) {
	       var answer = request.slot('answer');
	       if(answer == 'yes'){
	       		response.say("It was lovely conversing with you. Have fun on the ship! Goodbye!");
	       		response.shouldEndSession(true);
	       } else {
	       		response.say("Great! Would you want the schedule on other parts of the pool such as the Bar Lola, the restaurant, or the Pool?");
	       		response.shouldEndSession(false);
	   		}
	   }
);

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
	       console.log("location is " + location + " - time is " + time);
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
							resultats = "Absolutely! Here's the schedule by the " + location + " ... " + resultats + ". Come join Us!";
			console.log("resultats end is: " + resultats);
			response.say(resultats); 
			response.send();
			response.shouldEndSession(false);
						} else {
							resultats = "Absolutely! Sorry there are no activities scheduled by the " + location + "!";
			console.log("resultats end is: " + resultats);
			response.say(resultats); 
			response.send();
			response.shouldEndSession(false);
						}
					});	
			return false;
    
	   }
);
module.exports = app;

