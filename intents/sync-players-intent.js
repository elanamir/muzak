const Intent = require('../intent');
const Utils = require('../utils');

class SyncPlayersIntent extends Intent {
  /**
   * Sync one player to another
   *
   * @param squeezeserver The handler to the SqueezeServer
   * @param players A list of players on the server
   * @param intent The target intent
   * @param session The current session
   * @param callback The callback to use to return the result
   */

  static process(squeezeserver, players, intent, session, callback) {

    //// TODO: Need to make sure that both players are turned on.

    var player1 = null;
    var player2 = null;
    try {

      console.log("In syncPlayers with intent %j", intent);

      // Try to find the target players. We need the sqeezeserver player object for the first, but only the player info
      // object for the second.

      player1 = Intent.getPlayer(squeezeserver, players, intent, session)
      if (!player1) {

        // Couldn't find the player, return an error response

        console.log("Player not found: " + intent.slots.FirstPlayer.value);
        callback(session.attributes, Utils.buildSpeechletResponse(intentName, "Player not found", null, true));   // clean up the session in case of error
      }

      session.attributes = {
        player: player1.name.toLowerCase()
      };
      player2 = null;
      for (var pl in players) {
        if (players[pl].name.toLowerCase() === Intent.normalizePlayer(intent.slots.SecondPlayer.value))
          player2 = players[pl];
      }

      // If we found the target players, sync them

      if (player1 && player2) {
        console.log("Found players: %j and player2", player1, player2);
        player1.sync(player2.playerindex, function(reply) {
          if (reply.ok)
            callback(session.attributes, Utils.buildSpeechletResponse("Sync Players", "Synced " + player1.name + " to " + player2.name, null, false));
          else {
            console.log("Failed to sync %j", reply);
            callback(session.attributes, Utils.buildSpeechletResponse("Sync Players", "Failed to sync players " + player1.name + " and " + player2.name, null, true));
          }
        });
      } else {
        console.log("Player not found: ");
        callback(session.attributes, Utils.uildSpeechletResponse("Sync Players", "Player not found", null, false));
      }

    } catch (ex) {
      console.log("Caught exception in syncPlayers %j for " + player1 + " and " + player2, ex);
      callback(session.attributes, Utils.buildSpeechletResponse("Sync Players", "Caught Exception", null, true));
    }
  }
}

module.exports = SyncPlayersIntent;
