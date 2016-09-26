module.change_code = 1;
'use strict';

var alexa = require( 'alexa-app' );
var app = new alexa.app( 'carni-skill' );
var schedulerClass = require('./scheduler');
var Scheduler = schedulerClass.Scheduler;
var moment = require('moment');

app.error = function( exception, request, response ) {
    console.log(exception)
    console.log(request);
    console.log(response);
    response.say( 'Sorry an error occured ' + error.message);
};

app.launch( function( request, response ) {
	//response.say( 'Hello, welcome to Carnival. Now that we are friends, I can tell you a secret. I will be your personal assistant on this cruise and will get you information about which activities are happening at what time, where you should eat or drink, wake you up with your favorite music in the morning, and even turn your lights on and off. Try me, say: "Alexa turn lights on" or "Alexa turn lights off" or "Alexa What is the schedule by the Pool today". For the full list of commands look at the brochure behind me.' ).reprompt( 'Are you still there?' ).shouldEndSession( false );
	response.say( 'Hello, welcome to Carnival! You have finally arrived in your cabin. Look at the brochure behind me, it will help us converse better!').reprompt( 'Still checking? Would you like to know the schedule by a specific location today? Say Alexa what is the schedule by the location today or tomorrow?' );
	response.shouldEndSession( false );
    } );
/*console.log("requesting alexa now");
app.request({
	         "session": {
	"application": {
      "applicationId": "amzn1.ask.skill.b5aae3fe-64e0-47d7-9297-d6df8d487195"
    },
    "attributes": {},
    "user": {
      	"userId": "amzn1.ask.account.AFHTTTJIGB73JYDW2LKXWVZVHR75Y3MCOXYLOMWJHWYDMVPMOWDPNDWQKEAN5COL27O7M6WEUITBWXCEHIRHMCWMENAOPPKYSFMBUTZ3ZGKEJ2JRKBSIQHAZXYQJNVSLTP2RE4YXSAWDFPPHVN2I4OTUYZGT3FU5JQONIM3J25RH7AVQA3J2YASCTKI7WHBS7AHIKZKLDI5UJTA"
	},
    "new": false
  },
  "request": {
    "type": "IntentRequest",
    "intent": {
      "name": "sayNumber",
      "slots": {
        "number": {
          "name": "number",
          "value": "4"
        }
      }
    }
  }
		    });*/





/*app.intent('sayNumber',
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
	       console.log("number is: " + number);
	       response.say("Oh dear! You are looking for the number " + number + ". Anything else I can help you with?");
response.say("Do you still need me?");
	       response.shouldEndSession(false);
	   }
);*/

app.intent('closeSessionQuestion',
	   {
	       "slots":{"answer":"LIST_OF_ANSWERS"}
	       ,"utterances":["{answer}"]
		    },
	   function(request,response) {
	       var answer = request.slot('answer');
	       console.log("answer is " + answer);
	       if(answer == 'no'){
	       		response.say("It was lovely conversing with you. Have fun on the ship! Goodbye!");
	       		response.shouldEndSession(true);
	       } else if(answer == 'yes'){
	       		response.say("Great! Would you want the schedule on other parts of the ship such as the Bar Lola, the restaurant, or the Pool?");
	       		response.shouldEndSession(false);
	       	} else {
				response.say("Hopefully i will be helpful to you soon! our conversation is about to end...").reprompt("it was lovely conversing with you! Goodbye!").shouldEndSession(true);
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
	       if(typeof time == "undefined"){
	       	time = new Date().toISOString();
	       }
	       console.log("location is " + location + " - time is " + moment(moment(), "MM-DD-YYYY") + " moment: " + moment());
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
								resultats = "Absolutely! Here's the schedule by the " + location + " on " + moment(time, "MM-DD-YYYY") + " ... " + resultats + ". Come join Us!";
							} else {
								resultats = "Absolutely! Here are all the schedules on " + moment(time, "MM-DD-YYYY") + " : ...." +  resultats + ". Join the fun!";
							}
							console.log("resultats end is: " + resultats);
							response.say(resultats).reprompt("There are many other scheduled activities today. Would you like to know about them?"); 
							response.send();
							response.shouldEndSession(false);
						} else {
							resultats = "Absolutely! Sorry there are no activities scheduled by the " + location + " on " + moment(time, "MM-DD-YYYY") + "!";
							console.log("resultats end is: " + resultats);
							response.say(resultats); 
							response.send();
							response.shouldEndSession(false);
						}
						response.say("Anything else i can help you with? otherwise Say 'Alexa Stop' to end our conversation").shouldEndSession(false);
					});	
			
			
		}
		
		

		


		/*setTimeout(function() {
			response.say("Oh it seems that you are on your way to a fun activity! At least I hope so. Otherwise: what can i help you with?").reprompt("it was lovely conversing with you! Goodbye!").shouldEndSession(true);
			response.send();
		},1000);*/

    
	   

app.intent('closeSessionQuestion',
	   {
	       "slots":{"answer":"LIST_OF_ANSWERS"}
	       ,"utterances":["{answer}"]
		    },
	   function(request,response) {
	       var answer = request.slot('answer');
	       console.log("answer is " + answer);
	       if(answer == 'no'){
	       		response.say("It was lovely conversing with you. Have fun on the ship! Goodbye!");
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

app.intent('carniHelp',
	   {},
	   function(request,response) {
	       		response.say("Sure. Hello there! I am your personal assistant on this cruise and will get you information about which activities are happening at what time, where you should eat or drink, wake you up with your favorite music in the morning, and even turn your lights on and off. Try me, say: 'Alexa All schedules today'. or. 'Alexa Pool today'. or. 'Alexa What\'s the schedule by the Pool tomorrow?'. or 'Alexa stop'. For the full list of commands look at the brochure behind me.'").reprompt("I hope these helped! what can i do you for?");
	       		response.shouldEndSession(false);
	   }
);

app.intent('AMAZON.StopIntent',
	   function(request,response) {
	       		response.say("It was lovely conversing with you. Have fun on the ship! Goodbye!").shouldEndSession(true);
	   }
);

app.intent('AMAZON.CancelIntent',
	   function(request,response) {
	       		response.say("It was lovely conversing with you. Have fun on the ship! Goodbye!").shouldEndSession(true);
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

module.exports = app;

