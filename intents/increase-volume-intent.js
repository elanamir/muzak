const Intent = require('../intent');
const Utils = require('../utils');
const SetVolumeIntent = require('./set-volume-intent');

class IncreaseVolumeIntent extends SetVolumeIntent {

  static process(squeezeserver, players, intent, session, callback) {
    try {
      const player = this.getPlayer(squeezeserver, players, intent, session);

      if (!player) {
        // Couldn't find the player, return an error response
        console.log("Player not found");
        callback(session.attributes, Utils.buildSpeechletResponse(intent.name, "Player not found", null, false));
      } else {
        const delta = parseInt(process.env.PLAYER_VOLUME_DELTA);
        SetVolumeIntent.changeVolume(player, session, callback, delta)
      }
    } catch (ex) {
      console.log("Caught exception while trying to increase volume", ex);
      callback(session.attributes, Utils.buildSpeechletResponse(intent.name, "Caught exception trying to increase volume", null, true));
    }
  }
}

module.exports = IncreaseVolumeIntent;