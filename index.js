module.change_code = 1;
'use strict';

var alexa = require( 'alexa-app' );
var app = new alexa.app( 'carni-skill' );


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

module.exports = app;

