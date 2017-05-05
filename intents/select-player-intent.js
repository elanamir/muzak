const Intent = require('../intent');
const Utils = require('../utils');

class SelectPlayerIntent extends Intent {
  /**
   * Select the given player for an interactive session.
   *
   * @param player The player to select
   * @param session The current session
   * @param callback The callback to use to return the result
   */

  static process(squeezeserver, players, intent, session, callback) {
    try {
      const player = this.getPlayer(squeezeserver, players, intent, session);
      if (!player) {
        // Couldn't find the player, return an error response
        console.log("Player not found");
        callback(session.attributes, Utils.buildSpeechletResponse(intent.name, "Player not found", null, false));
      } else {
        callback(session.attributes, Utils.buildSpeechletResponse("Select Player", "Selected player " + player.name, null, false));
      }
    } catch (ex) {
      console.log("Caught exception in select player %j", ex);
      callback(session.attributes, Utils.buildSpeechletResponse("Select Player", "Caught Exception", null, true));
    }
  }
}

module.exports = SelectPlayerIntent;