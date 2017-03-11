"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var weather = require('Openweather-Node');
//=========================================================
// Bot Setup
//=========================================================

weather.setAPPID("1ff765439d059bcf41aa3f7ffb586c84");
weather.setCulture("de");
weather.setForecastType("daily");


var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});


var bot = new builder.UniversalBot(connector, [
    function (session) {
        builder.Prompts.text(session, "Hello... What's your name?");
    },
    function (session, results) {
        session.userData.name = results.response;
        builder.Prompts.text(session, "Hi " + results.response + ", Where are you located?");
    },
    function (session, results) {
      weather.now(results.response,function(err, aData)
{
    if(err) console.log(err);
    else
    {
      builder.Prompts.text(session, "It is " + aData.getDegreeTemp()['temp'] + "°C in " + results.response  );
        console.log(aData.getDegreeTemp()['temp'])
    }
})
    },
    function (session, results) {

    }
]);

if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());    
} else {
    module.exports = { default: connector.listen() }
}



