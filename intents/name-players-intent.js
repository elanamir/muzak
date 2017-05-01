const Intent = require('../intent');
const Utils = require('../utils');

class NamePlayersIntent extends Intent {
  /**
   * Report player count and names
   *
   * @param players A list of players on the server
   * @param session The current session
   * @param callback The callback to use to return the result
   */
  static process(squeezeserver, players, intent, session, callback) {

    var playernames = null;
    var numplayers = 0;

    try {
      // Build a list of player names
      for (var pl in players) {
        numplayers = numplayers + 1;
        if (playernames == null) {
          playernames = this.normalizeName(players[pl].name.toLowerCase());
        } else {
          playernames = playernames + ". " + this.normalizeName(players[pl].name.toLowerCase());
        }
      }

      // Report back the player count and individual names
      if (playernames == null) {
        callback(session.attributes, Utils.buildSpeechletResponse("Name Players", "There are no squeezeboxes currently in your system", null, session.new));
      } else {
        var singleplural;
        if (numplayers > 1) {
          singleplural = " squeezeboxes. ";
        } else {
          singleplural = " squeezebox. ";
        }
        callback(session.attributes, Utils.buildSpeechletResponse("Name Players", "You have " + numplayers + singleplural + playernames, null, session.new));
      }

    } catch (ex) {
      console.log("Caught exception while reporting player count and names", ex);
      callback(session.attributes, Utils.buildSpeechletResponse("Name Players", "Caught exception while reporting squeezebox names", null, true));
    }
  }
}

module.exports = NamePlayersIntent;
