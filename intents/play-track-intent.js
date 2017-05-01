const Intent = require('../intent');
const Utils = require('../utils');
const _ = require('lodash');
const Spotify = require('../apps/spotify');

class PlayTrackIntent extends Intent {
  /**
   * Query Spotify to get the URI to play.   
   * XXX Need to build in search cascade with local library.
   *
   * @param {Object} player - The squeezeserver player.
   * @param {Object} intent - The intent object.
   */
  static process(squeezeserver, players, intent, session, callback) {

    const player = this.getPlayer(squeezeserver, players, intent, session);
    if (!player) {
      // Couldn't find the player, return an error response
      console.log("Player not found");
      callback(session.attributes, Utils.buildSpeechletResponse(intent.name, "Player not found", null, session.new));
    } else {
      try {
        console.log("In playTrack with intent %j", intent);
        var possibleSlots = ["Artist", "Album", "Track", "Playlist"];
        var intentSlots = _.mapKeys(_.get(intent, "slots"), (value, key) => {
          return key.charAt(0).toUpperCase() + key.toLowerCase().substring(1)
        });
        var values = {};

        // Transform our slot data into a friendlier object.

        _.each(possibleSlots, function(slotName) {
          values[slotName] = _.get(intentSlots, slotName + ".value")
        });


        // Convert to something we can work with... 
        const artist = null || values['Artist']
        const album = null || values['Album']
        const track = null || values['Track']

        const reply = function(result) { // XXX work on this eventually
          const text = (artist) ? "by " + artist : null;
          callback(session.attributes, Utils.buildSpeechletResponse("Play Track", "Playing " + track + text, null, true));
        }

        return Spotify.getTrackUri(track, artist, album)
          .then((uri) => {
            if (!uri) {
              return {
                result: 'ok'
              }; // XXX
            }
            return this.loadToPlaylist(player, uri)
          })
          .then(reply);
      } catch (ex) {
        console.log("Caught exception while reporting player count and names", ex);
        callback(session.attributes, Utils.buildSpeechletResponse("Name Players", "Caught exception trying to play track", null, true));
      }
    }
  }
}

module.exports = PlayTrackIntent;