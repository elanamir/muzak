const Intent = require('../intent');
const Utils = require('../utils');

class StartPlayerIntent extends Intent {

  /**
   * Start a player to play the last used playlist item(s)
   *
   * @param player The player to start
   * @param session The current session
   * @param callback The callback to use to return the result
   */
  static process(squeezeserver, players, intent, session, callback) {
    const player = this.getPlayer(squeezeserver, players, intent, session);
    console.log("In startPlayer with player %s", player.name);
    if (!player) {
      // Couldn't find the player, return an error response
      console.log("Player not found");
      callback(session.attributes, Utils.buildSpeechletResponse(intent.name, "Player not found", null, session.new));
    } else {
      try {

        // Start the player

        player.play(function(reply) {
          if (reply.ok)
            callback(session.attributes, Utils.buildSpeechletResponse("Start Player", "Playing " + player.name + " squeezebox", null, session.new));
          else
            callback(session.attributes, Utils.buildSpeechletResponse("Start Player", "Failed to start player " + player.name + " squeezebox", null, true));
        });

      } catch (ex) {
        console.log("Caught exception in startPlayer %j", ex);
        callback(session.attributes, Utils.buildSpeechletResponse("Start Player", "Caught Exception", null, true));
      }
    }
  }
}

module.exports = StartPlayerIntent;