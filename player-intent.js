const _ = require('lodash');
const repromptText = "What do you want me to do";
const Utils = require('./utils');
const Spotify = require('./spotify');

class PlayerIntent {

  /**
   * Start a player to play the last used playlist item(s)
   *
   * @param player The player to start
   * @param session The current session
   * @param callback The callback to use to return the result
   */
  static start(player, session, callback) {

    console.log("In startPlayer with player %s", player.name);

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

  /**
   * Function for the PlayPlaylist intent, which is used to play specifically
   * requested content - an artist, album, genre, or playlist.
   *
   * @param {Object} player - The squeezeserver player.
   * @param {Object} intent - The intent object.
   */

  static playLocalPlaylist(player, intent, session, callback) {

    console.log("In playPlaylist with intent %j", intent);
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

      callback(session.attributes, Utils.buildSpeechletResponse("Play Playlist", text, null, true));
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

/**
   * Function for the PlayItem which is used to play unspecified 
   * content.  We use heuristics to determine the best match, and then query 
   * Spotify to get the URI to play.   
   * XXX Need to build in search cascade with local library.
   *
   * @param {Object} player - The squeezeserver player.
   * @param {Object} intent - The intent object.
   */

  static playTrack(player, intent, session, callback) {

    console.log("In playItem with intent %j", intent);
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

    const reply = function (result) {  // XXX work on this eventually
      callback(session.attributes, Utils.buildSpeechletResponse("Play Item", "Spotify", null, true));
    }

    return Spotify.getTrackUri(track, artist, album)
    .then((uri) => {
      if (!uri) {
        return {result: 'ok'}; // XXX
      }
      return PlayerIntent.loadToPlaylist(player, uri)
    })
    .then(reply);
  };


  /**
   * Start a player to play random tracks
   *
   * @param player The player to start
   * @param session The current session
   * @param callback The callback to use to return the result
   */

  static randomize(player, session, callback) {

    console.log("In randomizePlayer with player %s", player.name);

    try {

      // Start and radomize the player

      player.randomPlay("tracks", function(reply) {
        if (reply.ok)
          callback(session.attributes, Utils.buildSpeechletResponse("Randomizing Player", "Randomizing. Playing " + player.name + " squeezebox", null, session.new));
        else
          callback(session.attributes, Utils.buildSpeechletResponse("Randomizing Player", "Failed to randomize and play " + player.name + " squeezebox", null, true));
      });

    } catch (ex) {
      console.log("Caught exception in randomizePlayer %j", ex);
      callback(session.attributes, Utils.buildSpeechletResponse("Randomize Player", "Caught Exception", null, true));
    }
  }

  /**
   * Select the given player for an interactive session.
   *
   * @param player The player to select
   * @param session The current session
   * @param callback The callback to use to return the result
   */

  static select(player, session, callback) {

    // The player is already selected

    callback(session.attributes, Utils.buildSpeechletResponse("Select Player", "Selected player " + player.name, null, false));
  }

  /**
   * Stop a player
   *
   * @param player The player to stop
   * @param session The current session
   * @param callback The callback to use to return the result
   */

  static stop(player, session, callback) {

    try {

      console.log("In stopPlayer with player %s", player.name);

      // Stop the player

      player.power(0, function(reply) {
        if (reply.ok)
          callback(session.attributes, Utils.buildSpeechletResponse("Stop Player", "Stopped " + player.name + " squeezebox", null, session.new));
        else {
          console.log("Reply %j", reply);
          callback(session.attributes, Utils.buildSpeechletResponse("Stop Player", "Failed to stop player " + player.name + " squeezebox", null, true));
        }
      });

    } catch (ex) {
      console.log("Caught exception in stopPlayer %j", ex);
      callback(session.attributes, Utils.buildSpeechletResponse("Stop Player", "Caught Exception", null, true));
    }
  }

  /**
   * Pause a player
   *
   * @param player The player to stop
   * @param session The current session
   * @param callback The callback to use to return the result
   */

  static pause(player, session, callback) {

    try {

      console.log("In pausePlayer with player %s", player.name);

      // Pause the player

      player.pause(function(reply) {
        if (reply.ok)
          callback(session.attributes, Utils.buildSpeechletResponse("Pause Player", "Paused " + player.name + " squeezebox", null, session.new));
        else {
          console.log("Reply %j", reply);
          callback(session.attributes, Utils.buildSpeechletResponse("Pause Player", "Failed to pause player " + player.name + " squeezebox", null, true));
        }
      });

    } catch (ex) {
      console.log("Caught exception in pausePlayer %j", ex);
      callback(session.attributes, Utils.buildSpeechletResponse("Pause Player", "Caught Exception", null, true));
    }
  }

  /**
   * Play previous track on player
   *
   * @param player The player to skip back 1 track
   * @param session The current session
   * @param callback The callback to use to return the result
   */

  static previousTrack(player, session, callback) {

    try {

      console.log("In previousTrack with player %s", player.name);

      // Skip back 1 track on the player

      player.previous(function(reply) {
        if (reply.ok)
          callback(session.attributes, Utils.buildSpeechletResponse("Skip Back", "Skipped back " + player.name + " squeezebox", null, session.new));
        else {
          console.log("Reply %j", reply);
          callback(session.attributes, Utils.buildSpeechletResponse("Skip Back", "Failed to skip back player " + player.name + " squeezebox", null, true));
        }
      });

    } catch (ex) {
      console.log("Caught exception in previousTrack %j", ex);
      callback(session.attributes, Utils.buildSpeechletResponse("Skip Back", "Caught Exception", null, true));
    }
  }

  /**
   * Play next track on player
   *
   * @param player The player to skip forward 1 track
   * @param session The current session
   * @param callback The callback to use to return the result
   */

  static nextTrack(player, session, callback) {

    try {

      console.log("In nextTrack with player %s", player.name);

      // Skip forward 1 track on the player

      player.next(function(reply) {
        if (reply.ok)
          callback(session.attributes, Utils.buildSpeechletResponse("Skip Forward", "Skipped forward " + player.name + " squeezebox", null, session.new));
        else {
          console.log("Reply %j", reply);
          callback(session.attributes, Utils.buildSpeechletResponse("Skip Forward", "Failed to skip forward player " + player.name + " squeezebox", null, true));
        }
      });

    } catch (ex) {
      console.log("Caught exception in nextTrack %j", ex);
      callback(session.attributes, Utils.buildSpeechletResponse("Skip Forward", "Caught Exception", null, true));
    }
  }

  /**
   * Sync one player to another
   *
   * @param squeezeserver The handler to the SqueezeServer
   * @param players A list of players on the server
   * @param intent The target intent
   * @param session The current session
   * @param callback The callback to use to return the result
   */

  static sync(squeezeserver, players, intent, session, callback) {

    //// TODO: Need to make sure that both players are turned on.

    var player1 = null;
    var player2 = null;
    try {

      console.log("In syncPlayers with intent %j", intent);

      // Try to find the target players. We need the sqeezeserver player object for the first, but only the player info
      // object for the second.

      player1 = findPlayerObject(squeezeserver, players, ((typeof intent.slots.FirstPlayer.value !== 'undefined') && (intent.slots.FirstPlayer.value != null) ? intent.slots.FirstPlayer.value : session.attributes.player));
      if (player1 == null) {

        // Couldn't find the player, return an error response

        console.log("Player not found: " + intent.slots.FirstPlayer.value);
        callback(session.attributes, Utils.buildSpeechletResponse(intentName, "Player not found", null, session.new));
      }

      session.attributes = {
        player: player1.name.toLowerCase()
      };
      player2 = null;
      for (var pl in players) {
        if (players[pl].name.toLowerCase() === normalizePlayer(intent.slots.SecondPlayer.value))
          player2 = players[pl];
      }

      // If we found the target players, sync them

      if (player1 && player2) {
        console.log("Found players: %j and player2", player1, player2);
        player1.sync(player2.playerindex, function(reply) {
          if (reply.ok)
            callback(session.attributes, Utils.buildSpeechletResponse("Sync Players", "Synced " + player1.name + " to " + player2.name, null, session.new));
          else {
            console.log("Failed to sync %j", reply);
            callback(session.attributes, Utils.buildSpeechletResponse("Sync Players", "Failed to sync players " + player1.name + " and " + player2.name, null, true));
          }
        });
      } else {
        console.log("Player not found: ");
        callback(session.attributes, Utils.uildSpeechletResponse("Sync Players", "Player not found", null, session.new));
      }

    } catch (ex) {
      console.log("Caught exception in syncPlayers %j for " + player1 + " and " + player2, ex);
      callback(session.attributes, Utils.buildSpeechletResponse("Sync Players", "Caught Exception", null, true));
    }
  }

  /**
   * Report player count and names
   *
   * @param players A list of players on the server
   * @param session The current session
   * @param callback The callback to use to return the result
   */

  static namePlayers(players, session, callback) {

    var playernames = null;
    var numplayers = 0;

    try {
      // Build a list of player names
      for (var pl in players) {
        numplayers = numplayers + 1;
        if (playernames == null) {
          playernames = PlayerIntent.normalizeName(players[pl].name.toLowerCase());
        } else {
          playernames = playernames + ". " + PlayerIntent.normalizeName(players[pl].name.toLowerCase());
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

  /**
   * Get the current volume of a player and then perform a change function on it
   *
   * @param player The player to get the volume for
   * @param session The current session
   * @param callback The callback to use to return the result
   * @param delta The amount to change the player volume
   */

  static getVolume(player, session, callback, delta) {

    console.log("In getPlayerVolume with player %s", player.name);
    try {

      // Get the volume of the player

      player.getVolume(function(reply) {
        if (reply.ok) {
          var volume = Number(reply.result);
          PlayerIntent.setVolume(player, volume + delta, session, callback);
        } else
          callback(session.attributes, Utils.buildSpeechletResponse("Get Player Volume", "Failed to get volume for player " + player.name, null, true));
      });

    } catch (ex) {
      console.log("Caught exception in stopPlayer %j", ex);
      callback(session.attributes, Utils.buildSpeechletResponse("Get Player Volume", "Caught Exception", null, true));
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
          callback(session.attributes, Utils.buildSpeechletResponse("Set Player Volume", "Player " + player.name + " set to volume " + volume, null, session.new));
        else {
          console.log("Failed to set volume %j", reply);
          callback(session.attributes, Utils.sbuildSpeechletResponse("Set Player Volume", "Failed to set player volume", null, true));
        }
      });

    } catch (ex) {
      console.log("Caught exception in setPlayerVolume %j", ex);
      callback(session.attributes, Utils.buildSpeechletResponse("Set Player", "Caught Exception", null, true));
    }
  }

  /**
   * Unsync a player
   *
   * @param player The player to unsync
   * @param session The current session
   * @param callback The callback to use to return the result
   */

  static unsync(player, session, callback) {

    console.log("In unsyncPlayer with player %s", player.name);

    try {

      // Unsynchronize the player

      player.unSync(function(reply) {
        if (reply.ok)
          callback(session.attributes, Utils.buildSpeechletResponse("Unsync Player", "Player " + player.name + " unsynced", null, session.new));
        else {
          console.log("Failed to sync %j", reply);
          callback(session.attributes, Utils.buildSpeechletResponse("Unsync Player", "Failed to unsync player " + player.name, null, true));
        }
      });

    } catch (ex) {
      console.log("Caught exception in unsyncPlayer %j", ex);
      callback(session.attributes, Utils.buildSpeechletResponse("Unsync Player", "Caught Exception", null, true));
    }
  }

  /**
   * Find out what is playing on a player.
   *
   * @param player The player to get the information for
   * @param session The current session
   * @param callback The callback to use to return the result
   */

  static whatsPlaying(player, session, callback) {

    console.log("In whatsPlaying with player %s", player.name);

    try {

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
                  callback(session.attributes, Utils.buildSpeechletResponse("What's Playing", "Player " + player.name + " is playing " + title + " by " + artist + " from " + album, null, session.new));
                } else {
                  console.log("Failed to get album");
                  callback(session.attributes, Utils.buildSpeechletResponse("What's Playing", "Player " + player.name + " is playing " + title + " by " + artist, null, session.new));
                }
              });
            } else {
              console.log("Failed to get current artist");
              callback(session.attributes, Utils.buildSpeechletResponse("What's Playing", "Player " + player.name + " is playing " + title, null, session.new));
            }
          });
        } else {
          console.log("Failed to getCurrentTitle %j", reply);
          callback(session.attributes, Utils.buildSpeechletResponse("What's Playing", "Failed to get current song for  " + player.name, null, true));
        }
      });

    } catch (ex) {
      console.log("Caught exception in whatsPlaying %j", ex);
      callback(session.attributes, Utils.buildSpeechletResponse("What's Playing", "Caught Exception", null, true));
    }
  }

  /**
   * Do any necessary clean up of player names
   *
   * @param playerName The name of the player to clean up
   * @returns The normalized player name
   */

  static normalizeName(playerName) {

    playerName || (playerName = ''); // protect against `playerName` being undefined

    // After the switch to custom slots multi name players like living room became living-room. Revert the string back to what it was

    playerName = playerName.replace("-", " ");
    if (playerName.toLowerCase() == "livingroom")
      playerName = "living room";

    return playerName;
  }

  static addToPlaylist(player, itemURI, callback) {
    return player.callMethod({
        method: 'playlist',
        params: ['load', itemURI],
        callback: callback,
    })
  }

  static loadToPlaylist(player, itemURI, callback) {
    return player.callMethod({
        method: 'playlist',
        params: ['load', itemURI],
        callback: callback,
    })
  }
}

module.exports = PlayerIntent;