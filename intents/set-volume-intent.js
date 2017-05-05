const Intent = require('../intent');
const Utils = require('../utils');


class SetVolumeIntent extends Intent {


  static process(squeezeserver, players, intent, session, callback) {
    try {
      const player = Intent.getPlayer(squeezeserver, players, intent, session);
      const volume = intents.slots.Volume
      if (!player) {
        // Couldn't find the player, return an error response
        console.log("Player not found");
        callback(session.attributes, Utils.buildSpeechletResponse(intent.name, "Player not found", null, true));
      } else if (typeof intents.slots.Volume === 'undefined' || typeof intents.slot.Volume.values == 'undefined') {
        console.log("Player not found");
        callback(session.attributes, Utils.buildSpeechletResponse(intent.name, "Volume not found ", null, true));
      } else {
        const volume = Number(intent.slots.Volume.value);
        SetVolumeIntent.setVolume(player, volume, session, callback);
      }
    } catch (ex) {
      console.log("Caught exception in setVolumeIntent %j", ex);
      callback(session.attributes, Utils.buildSpeechletResponse("Set Volume", "Caught Exception", null, true));
    }
  }

  /**
   * Get the current volume of a player and then perform a change function on it
   *
   * @param player The player to get the volume for
   * @param session The current session
   * @param callback The callback to use to return the result
   * @param delta The amount to change the player volume
   */
  static changeVolume(player, session, callback, delta) {

    console.log("In changeVolume with player %s", player.name);
    try {

      // Get the volume of the player

      player.getVolume(function(reply) {
        if (reply.ok) {
          var volume = Number(reply.result);
          SetVolumeIntent.setVolume(player, volume + delta, session, callback);
        } else {
          callback(session.attributes, Utils.buildSpeechletResponse("Change Player Volume", "Failed to get volume for player " + player.name, null, true));
        }
      });

    } catch (ex) {
      console.log("Caught exception in changeVolume %j", ex);
      callback(session.attributes, Utils.buildSpeechletResponse("Change Player Volume", "Caught Exception", null, true));
    }
  }

  /**
   * Set the volume of a player.
   *
   * @param player The target player
   * @param volume The level to set the volume to
   * @param session The current session
   * @param callback The callback to use to return the result
   */
  static setVolume(player, volume, session, callback) {

    // Make sure the volume is in the range 0 - 100

    if (volume > 100)
      volume = 100;
    else if (volume < 0)
      volume = 0;

    try {

      console.log("In setPlayerVolume with volume:" + volume);

      // Set the volume on the player

      player.setVolume(volume, function(reply) {
        if (reply.ok)
          callback(session.attributes, Utils.buildSpeechletResponse("Set Player Volume", "", null, false)); // No need to interrupt song for with response;
        else {
          console.log("Failed to set volume %j", reply);
          callback(session.attributes, Utils.buildSpeechletResponse("Set Player Volume", "Failed to set player volume", null, true));
        }
      });
    } catch (ex) {
      console.log("Caught exception in setPlayerVolume %j", ex);
      callback(session.attributes, Utils.buildSpeechletResponse("Set Player Volume", "Caught Exception", null, true));
    }
  }
}

module.exports = SetVolumeIntent;