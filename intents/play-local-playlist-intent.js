const Intent = require('../intent');
const Utils = require('../utils');
const _ = require('lodash');

class PlayLocalPlaylistIntent extends Intent {
  /**
   * Function for the PlayPlaylist intent, which is used to play specifically
   * requested content - an artist, album, genre, or playlist.
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

        console.log("In playLocalPlaylist with intent %j", intent);
        var possibleSlots = ["Artist", "Album", "Genre", "Playlist"];
        var intentSlots = _.mapKeys(_.get(intent, "slots"), (value, key) => {
          return key.charAt(0).toUpperCase() + key.toLowerCase().substring(1)
        });
        var values = {};

        // Transform our slot data into a friendlier object.

        _.each(possibleSlots, function(slotName) {
          values[slotName] = _.startCase( // TODO: omg the LMS api is friggin case sensitive
            _.get(intentSlots, slotName + ".value")
          );
        });

        console.log("before reply");
        var reply = function(result) {

          // Format the text of the response based on what sort of playlist was requested

          var text = "Whoops, something went wrong."

          if (_.get(result, "ok")) {
            // This is all gross and kludge-y, but w/e.
            text = "Playing ";
            if (values.playlist) {
              text += values.Playlist + " playlist."
            } else {

              if (values.Genre)
                text += "songs in the " + values.Genre + " genre";
              else {

                if (values.Album)
                  text += values.Album;
                if (values.Album && values.Artist)
                  text += ' by ';
                if (values.Artist)
                  text += values.Artist;
              }
            }
          }

          callback(session.attributes, Utils.buildSpeechletResponse("Play Local Playlist", text, null, true));
        };

        // If a value for playlist is present, ignore everything else and play that
        // playlist, otherwise play whatever artist and/or artist is present.

        if (values.Playlist) {
          player.callMethod({
            method: 'playlist',
            params: ['play', values.Playlist]
          }).then(reply);
        } else {
          player.callMethod({
            method: 'playlist',
            params: [
              'loadalbum',
              _.isEmpty(values.Genre) ? "*" : values.Genre, // LMS wants an asterisk if nothing if specified
              _.isEmpty(values.Artist) ? "*" : values.Artist,
              _.isEmpty(values.Album) ? "*" : values.Album
            ]
          }).then(reply);
        }
      };
    } catch (ex) {
      console.log("Caught exception in stopPlayer %j", ex);
      callback(session.attributes, Utils.buildSpeechletResponse("Play local playlist", "Caught Exception", null, true));
    }
  }
}

module.exports = PlayLocalPlaylistIntent;