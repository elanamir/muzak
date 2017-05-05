const Intent = require('../intent');
const Utils = require('../utils');

class PreviousTrackIntent extends Intent {
  /**
   * Play previous track on player
   *
   * @param player The player to skip back 1 track
   * @param session The current session
   * @param callback The callback to use to return the result
   */

  static process(squeezeserver, players, intent, session, callback) {

    try {
      const player = Intent.getPlayer(squeezeserver, players, intent, session);
      if (!player) {
        callback(session.attributes, Utils.buildSpeechletResponse(intent.name, "Player not found", null, false));
      } else {
        console.log("In previousTrack with player %s", player.name);

        // Skip back 1 track on the player

        player.previous(function(reply) {
          if (reply.ok)
            callback(session.attributes, Utils.buildSpeechletResponse("Skip Back", "Skipped back " + player.name + " squeezebox", null, false));
          else {
            console.log("Reply %j", reply);
            callback(session.attributes, Utils.buildSpeechletResponse("Skip Back", "Failed to skip back player " + player.name + " squeezebox", null, false));
          }
        });
      }

    } catch (ex) {
      console.log("Caught exception in previousTrack %j", ex);
      callback(session.attributes, Utils.buildSpeechletResponse("Skip Back", "Caught Exception", null, true));
    }
  }
}


module.exports = PreviousTrackIntent;