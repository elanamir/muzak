const Intent = require('../intent');
const Utils = require('../utils');

class PausePlayerIntent extends Intent {

  /**
   * Pause a player
   *
   * @param player The player to stop
   * @param session The current session
   * @param callback The callback to use to return the result
   */

  static process(squeezeserver, players, intent, session, callback) {

    try {
      console.log("In pausePlayer with player %s", player.name);
      const player = this.getPlayer(squeezeserver, players, intent, session);
      // Pause the player
      if (!player) {
        // Couldn't find the player, return an error response
        console.log("Player not found");
        callback(session.attributes, Utils.buildSpeechletResponse(intent.name, "Player not found", null, false));
      } else {
        player.pause(function(reply) {
          if (reply.ok)
            callback(session.attributes, Utils.buildSpeechletResponse("Pause Player", "Paused " + player.name + " squeezebox", null, false));
          else {
            console.log("Reply %j", reply);
            callback(session.attributes, Utils.buildSpeechletResponse("Pause Player", "Failed to pause player " + player.name + " squeezebox", null, false));
          }
        });
      }

    } catch (ex) {
      console.log("Caught exception in pausePlayer %j", ex);
      callback(session.attributes, Utils.buildSpeechletResponse("Pause Player", "Caught Exception", null, true));
    }
  }
}


module.exports = PausePlayerIntent;