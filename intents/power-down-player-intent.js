const Intent = require('../intent');
const Utils = require('../utils');

class PowerDownPlayerIntent extends Intent {
  /**
   * Stop a player
   *
   * @param player The player to power down
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
        console.log("In PowerDownPlayer with player %s", player.name);

        // Power down the player
        player.power(0, function(reply) {
          if (reply.ok)
            callback(session.attributes, Utils.buildSpeechletResponse("Turn Off Player", "Turned off " + player.name + " squeezebox", null, false));
          else {
            console.log("Reply %j", reply);
            callback(session.attributes, Utils.buildSpeechletResponse("Turn off Player", "Failed to turn off player " + player.name + " squeezebox", null, false));
          }
        });
      }
    } catch (ex) {
      console.log("Caught exception in power down player %j", ex);
      callback(session.attributes, Utils.buildSpeechletResponse("Turn Off Player", "Caught Exception", null, true));
    }
  }
}

module.exports = PowerDownPlayerIntent;