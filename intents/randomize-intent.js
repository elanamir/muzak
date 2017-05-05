const Intent = require('./intent');
const Utils = require('../utils');

class RandomizeIntent extends Intent {

  /**
   * Start a player to play random tracks
   *
   * @param player The player to start
   * @param session The current session
   * @param callback The callback to use to return the result
   */
  static process(squeezeserver, players, session, callback) {

    console.log("In randomizePlayer with player %s", player.name);

    try {

      // Start and radomize the player
      const player = Intent.getPlayer(squeezeserver, players, intent, session);
      if (!player) {
        callback(session.attributes, Utils.buildSpeechletResponse(intent.name, "Player not found", null, false));
      } else {
        console.log("In previousTrack with player %s", player.name);

        // Skip back 1 track on the player

        player.randomPlay("tracks", function(reply) {
          if (reply.ok)
            callback(session.attributes, Utils.buildSpeechletResponse("Randomizing Player", "Randomizing. Playing " + player.name + " squeezebox", null, session.new));
          else
            callback(session.attributes, Utils.buildSpeechletResponse("Randomizing Player", "Failed to randomize and play " + player.name + " squeezebox", null, true));
        });
      }

    } catch (ex) {
      console.log("Caught exception in randomizePlayer %j", ex);
      callback(session.attributes, Utils.buildSpeechletResponse("Randomize Player", "Caught Exception", null, true));
    }
  }
}

module.exports = RandomizeIntent;