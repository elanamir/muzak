/**
 * Alexa Skills Kit program to expose the SqueezeServer to Alexa
 *
 */

//  Integration with the squeeze server

const SqueezeServer = require('squeezenode-lordpengwin');
const _ = require('lodash');
const repromptText = "What do you want me to do";
const Utils = require('./utils')
const PlayerIntent = require('./player-intent')

class Dispatcher {
    /**
     * Called when the session starts.
     */

    static onSessionStarted(sessionStartedRequest, session) {
        console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId + ", sessionId=" + session.sessionId);
    }

    /**
     * Called when the user launches the skill without specifying what they want. When this happens we go into a mode where
     * they can issue multiple requests
     *
     * @param launchRequest The request
     * @param session The current session
     * @param callback A callback used to return the result
     */

    static onLaunch(launchRequest, session, callback) {

        console.log("onLaunch requestId=" + launchRequest.requestId + ", sessionId=" + session.sessionId);

        // Connect to the squeeze server and wait for it to finish its registration.  We do this to make sure that it is online.

        const url = process.env.SQUEEZESERVER_URL;
        const port = process.env.SQUEEZESERVER_PORT;
        const user = process.env.SQUEEZESERVER_USER;
        const password = process.env.SQUEEZESERVER_PWD;

        const squeezeserver = new SqueezeServer(url, port, user, password);
        squeezeserver.on('register', function() {
            Dispatcher.startInteractiveSession(callback);
        });
    }

    /**
     * Called when the user specifies an intent for this skill.
     *
     * @param intentRequest The full request
     * @param session The current session
     * @param callback A callback used to return results
     */

    static onIntent(intentRequest, session, callback) {

        console.log("onIntent requestId=" + intentRequest.requestId + ", sessionId=" + session.sessionId);

        // Check for a Close intent

        if (intentRequest.intent.name == "Close") {
            Dispatcher.closeInteractiveSession(callback);
            return;
        }
        const url = process.env.SQUEEZESERVER_URL;
        const port = process.env.SQUEEZESERVER_PORT;
        const user = process.env.SQUEEZESERVER_USER;
        const password = process.env.SQUEEZESERVER_PWD;
        // Connect to the squeeze server and wait for it to finish its registration
        const squeezeserver = new SqueezeServer(url, port, user, password);

        squeezeserver.on('register', function() {

            // Get the list of players as any request will require them

            squeezeserver.getPlayers(function(reply) {
                if (reply.ok) {
                    console.log("getPlayers: %j", reply);
                    Dispatcher.dispatchIntent(squeezeserver, reply.result, intentRequest.intent, session, callback);
                } else
                    callback(session.attributes, Utils.buildSpeechletResponse("Get Players", "Failed to get list of players", null, true));
            });
        });
    }

    /**
     * Identify the intent and dispatch it to the target function
     *
     * @param squeezeserver The handler to the SqueezeServer
     * @param players A list of players on the server
     * @param intent The target intent
     * @param session The current session
     * @param callback The callback to use to return the result
     */

    static dispatchIntent(squeezeserver, players, intent, session, callback) {

        const intentName = intent.name;
        console.log("Got intent: %j", intent);
        console.log("Session is %j", session);

        if ("SyncPlayers" == intentName) {
            PlayerIntent.syncPlayers(squeezeserver, players, intent, session, callback);

        } else if ("NamePlayers" == intentName) {
            PlayerIntent.namePlayers(players, session, callback);

        } else if ("Help" == intentName) {
            Utils.giveHelp(session, callback); //XXX shouldn't really be in Utils.

        } else {
            let playerName;
            if (typeof intent.slots !== 'undefined' && typeof intent.slots.Player !== 'undefined' && 
                typeof intent.slots.Player.value !== 'undefined' && intent.slots.Player.value !== null) {
                playerName = intent.slots.Player.value;
            } else if (typeof session.attributes !== 'undefined' && typeof session.attributes.player !== 'undefined') {
                playerName = session.attributes.player;
            } else {
                playerName = '';
            }

            const player = Dispatcher.findPlayerObject(squeezeserver, players, playerName);

            if (!player) {
                // Couldn't find the player, return an error response
                 console.log("Player not found");
                 callback(session.attributes, Utils.buildSpeechletResponse(intentName, "Player not found", null, session.new));

            } else {

                console.log("Player is " + player);
                session.attributes = {player: player.name.toLowerCase()};

                // Call the target intent

                // XXX make this table driven

                if ("StartPlayer" == intentName) {
                    PlayerIntent.start(player, session, callback);
                } else if ("PlayPlaylist" == intentName) {
                    PlayerIntent.playPlaylist(player, intent, session, callback);
                } else if ("PlayItem" === intentName) {
                    PlayerIntent.playItem(player, intent, session, callback)
                } else if ("RandomizePlayer" == intentName) {
                    PlayerIntent.randomize(player, session, callback);
                } else if ("StopPlayer" == intentName) {
                    PlayerIntent.stop(player, session, callback);
                } else if ("PausePlayer" == intentName) {
                    PlayerIntent.pause(player, session, callback);
                } else if ("PreviousTrack" == intentName) {
                    PlayerIntent.previousTrack(player, session, callback);
                } else if ("NextTrack" == intentName) {
                    PlayerIntent.nextTrack(player, session, callback);
                } else if ("UnsyncPlayer" == intentName) {
                    PlayerIntent.unsync(player, session, callback);
                } else if ("SetVolume" == intentName) {
                    PlayerIntent.setVolume(player, Number(intent.slots.Volume.value), session, callback);
                } else if ("IncreaseVolume" == intentName) {
                    PlayerIntent.getVolume(player, session, callback, 10);
                } else if ("DecreaseVolume" == intentName) {
                    PlayerIntent.getVolume(player, session, callback, -10);
                } else if ("WhatsPlaying" == intentName) {
                    PlayerIntent.whatsPlaying(player, session, callback);
                } else if ("SelectPlayer" == intentName) {
                    PlayerIntent.select(player, session, callback);
                } else if ("PlayTrack" == intentName) {
                    PlayerIntent.playTrack(player, intent, session, callback)
                } else {
                    callback(session.attributes, Utils.buildSpeechletResponse("Invalid Request", intentName + " is not a valid request", repromptText, session.new));
                    throw " intent";
                }
            }
        }
    }

    /**
     * Called when the user ends the session.
     * Is not called when the skill returns shouldEndSession=true.
     */

    static onSessionEnded(sessionEndedRequest, session) {
        console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId + ", sessionId=" + session.sessionId);
    }

    /**
     * This is called when the user activates the service without arguments
     *
     * @param callback A callback to execute to return the response
     */

    static startInteractiveSession(callback) {

        // If we wanted to initialize the session to have some attributes we could add those here.

        const sessionAttributes = {};
        const cardTitle = "Control Started";
        const speechOutput = "Squeezebox control started";
        const shouldEndSession = false;

        // Format the default response

        callback(sessionAttributes, Utils.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }

    /**
     * Called to close an insteractive session
     *
     * @param callback A callback to execute to return the response
     */

    static closeInteractiveSession(callback) {

        const sessionAttributes = {};
        const cardTitle = "Control Ended";
        const speechOutput = "Squeezebox control ended";
        const shouldEndSession = true;

        // Format the default response

        callback(sessionAttributes, Utils.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }

    /**
     * Find a player object given its name. Player objects can be used to interact with the player
     *
     * @param squeezeserver The SqueezeServer to get the Player object from
     * @param players A list of players to search
     * @param name The name of the player to find
     * @returns The target player or undefined if it is not found
     */

    static findPlayerObject(squeezeserver, players, name) {

        name = PlayerIntent.normalizeName(name);
        console.log("In findPlayerObject with " + name);

        // Look for the player in the players list that matches the given name. Then return the corresponding player object
        // from the squeezeserver stored by the player's id

        // NOTE: For some reason squeezeserver.players[] is empty but you can still reference values in it. I think it
        //       is a weird javascript timing thing

        for (let pl in players) {
            if (
                players[pl].name.toLowerCase() === name || // name matches the requested player
                (name === "" && players.length === 1)      // name is undefined and there's only one player,
                                                           // so assume that's the one we want.
            ) {
                return squeezeserver.players[players[pl].playerid];
            }
        }

        console.log("Player %s not found", name);
        return null;
    }



}

module.exports = Dispatcher;
