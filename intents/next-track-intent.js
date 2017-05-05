const Intent = require('../intent');
const Utils = require('../utils');

class NextTrackIntent extends Intent {

  /**
   * Play next track on player
   *
   * @param player The player to skip forward 1 track
   * @param session The current session
   * @param callback The callback to use to return the result
   */
  static process(player, session, callback) {

    try {
      console.log("In nextTrack with player %s", player.name);

      // Skip forward 1 track on the player
      const player = Intent.getPlayer(squeezeserver, players, intent, session);
      if (!player) {
        callback(session.attributes, Utils.buildSpeechletResponse(intent.name, "Player not found", null, false));
      } else {
        player.next(function(reply) {
          if (reply.ok)
            callback(session.attributes, Utils.buildSpeechletResponse("Skip Forward", "Skipped forward " + player.name + " squeezebox", null, false));
          else {
            console.log("Reply %j", reply);
            callback(session.attributes, Utils.buildSpeechletResponse("Skip Forward", "Failed to skip forward player " + player.name + " squeezebox", null, false));
          }
        });
      }

    } catch (ex) {
      console.log("Caught exception in nextTrack %j", ex);
      callback(session.attributes, Utils.buildSpeechletResponse("Skip Forward", "Caught Exception", null, true));
    }
  }
}

module.exports = NextTrackIntent;