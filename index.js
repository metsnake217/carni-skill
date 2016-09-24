module.change_code = 1;
'use strict';

var alexa = require( 'alexa-app' );
var app = new alexa.app( 'carni-skill' );
var schedulerClass = require('./scheduler');
var Scheduler = schedulerClass.Scheduler;


app.launch( function( request, response ) {
	response.say( 'Hello, welcome to Carnival. Now that we are friends, I can tell you a secret. I will be your personal assistant on this cruise and will get you information about which activities are happening at what time, where you should eat or drink, wake you up with your favorite music in the morning, and even turn your lights on and off. Try me, say: "Alexa turn lights on" or "Alexa turn lights off". For the full list of commands look at the brochure behind me.' ).reprompt( 'By the way: I can still say numbers from 1 to 100!' ).shouldEndSession( false );
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
	       response.say("Oh dear! You asked for the number "+number + ". Anything else I can help you with?");
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
	       var scheduler = new Scheduler(location,time);
					scheduler.getMatchOfTheDay(function(error, match) {
						console.log("match is " + match);
						if (match != null && match.length > 0) {
							/*req.session.matches = match;
							res.render('index', {
								title : 'Today\'s Match',
								matches : match,
								scripts : [ '/javascripts/utils.js',
										'/javascripts/image_preload.js' ],
								loggedIn : true,
								betsMade : singleBetsMade,
								netlighter : req.session.user,
								user : req.session.userid,
								menu : 'today',
								moment : moment,
								now : moment(new Date).tz("Europe/Berlin")
										.format('YYYY-MM-DD HH:mm:ss')
										*/
							// '2014-06-09 HH:mm:ss'
							response.say("Absolutely! Here's the schedule by the " + match.location + " today: Stay dry at " + match.time + "!");
						} else {
							response.say("Absolutely! Sorry there are no activities scheduled by the " + match.location + "!");
						}
					});

	       
	   }
);
module.exports = app;

