require('dotenv').config();

const Dispatcher = require('./dispatcher');
const Utils = require('./utils');

/**
 * Route the incoming request based on type (LaunchRequest, IntentRequest,
 * etc.) The JSON body of the request is provided in the event parameter.
 *
 * @param event
 * @param context
 */

exports.handler = function (event, context) {

    try {

        console.log("Event is %j", event);

        if (event.session.new) {
            Dispatcher.onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            Dispatcher.onLaunch(event.request,
                     event.session,
                     function callback(sessionAttributes, speechletResponse) {
                        context.succeed(Utils.buildResponse(sessionAttributes, speechletResponse));
                     });
        }  else if (event.request.type === "IntentRequest") {
            Dispatcher.onIntent(event.request,
                     event.session,
                     function callback(sessionAttributes, speechletResponse) {
                         context.succeed(Utils.buildResponse(sessionAttributes, speechletResponse));
                     });
        } else if (event.request.type === "SessionEndedRequest") {
            Dispatcher.onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        console.log("Caught exception %j", e);
        context.fail("Exception: " + e);
    }
};
