
  const Intent = require('./intent');

  class RandomizeIntent extends Intent {

  /**
   * Start a player to play random tracks
   *
   * @param player The player to start
   * @param session The current session
   * @param callback The callback to use to return the result
   */
  static process(player, session, callback) {

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