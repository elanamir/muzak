const Intent = require('../intent');
const Utils = require('../utils');

class WhatsPlayingIntent extends Intent {
  /**
   * Find out what is playing on a player.
   *
   * @param player The player to get the information for
   * @param session The current session
   * @param callback The callback to use to return the result
   */

  static process(squeezeserver, players, intent, session, callback) {

    console.log("In whatsPlaying with player %s", player.name);

    try {
      const player = Intent.getPlayer(squeezeserver, players, intent, session);
      if (!player) {
        console.log("Player not found");
        callback(session.attributes, Utils.buildSpeechletResponse(intent.name, "Player not found", null, false));
      } else {

        // Ask the player it what it is playing. This is a series of requests for the song, artist and album

        player.getCurrentTitle(function(reply) {
          if (reply.ok) {

            // We got the title now get the artist

            var title = reply.result;
            player.getArtist(function(reply) {

              if (reply.ok) {
                var artist = reply.result;
                player.getAlbum(function(reply) {

                  if (reply.ok) {
                    var album = reply.result;
                    callback(session.attributes, Utils.buildSpeechletResponse("What's Playing", "Player " + player.name + " is playing " + title + " by " + artist + " from " + album, null, false));
                  } else {
                    console.log("Failed to get album");
                    callback(session.attributes, Utils.buildSpeechletResponse("What's Playing", "Player " + player.name + " is playing " + title + " by " + artist, null, false));
                  }
                });
              } else {
                console.log("Failed to get current artist");
                callback(session.attributes, Utils.buildSpeechletResponse("What's Playing", "Player " + player.name + " is playing " + title, null, false));
              }
            });
          } else {
            console.log("Failed to getCurrentTitle %j", reply);
            callback(session.attributes, Utils.buildSpeechletResponse("What's Playing", "Failed to get current song for  " + player.name, null, false));
          }
        });
      }
    } catch (ex) {
      console.log("Caught exception in whatsPlaying %j", ex);
      callback(session.attributes, Utils.buildSpeechletResponse("What's Playing", "Caught Exception", null, true));
    }
  }

}

module.exports = WhatsPlayingIntent;