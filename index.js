module.change_code = 1;
'use strict';

var alexa = require( 'alexa-app' );
var app = new alexa.app( 'carni-skill' );


app.launch( function( request, response ) {
	response.say( 'Welcome to Carnival Eran! I am waiting for your instructions.' ).reprompt( 'By the way: Astounding job! You got it to run. Bad ass!' ).shouldEndSession( false );
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