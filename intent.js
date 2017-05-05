const _ = require('lodash');
const repromptText = "What do you want me to do";
const Utils = require('./utils');

class Intent {

  static process(squeezeserver, players, intent, session, callback) {
      callback(session.attributes, Utils.buildSpeechletResponse("Base Intent", "Intent not implemented", null, false));
  }

  static getPlayer(squeezeserver, players, intent, session) {

    let playerName;
    if (typeof intent.slots !== 'undefined' && typeof intent.slots.Player !== 'undefined' &&
      typeof intent.slots.Player.value !== 'undefined' && intent.slots.Player.value !== null) {
      playerName = intent.slots.Player.value;
    } else if (typeof session.attributes !== 'undefined' && typeof session.attributes.player !== 'undefined') {
      playerName = session.attributes.player;
    } else {
      playerName = '';
    }

    const player = this.findPlayerObject(squeezeserver, players, playerName);

    if (player) {
      console.log("Player is " + player.name);
      session.attributes = {
        player: player.name.toLowerCase()
      };
    }
    return player;
  }

  /**
   * Find a player object given its name. Player objects can be used to interact with the player
   *
   * @param squeezeserver The SqueezeServer to get the Player object from
   * @param players A list of players to search
   * @param name The name of the player to find
   * @returns The target player or undefined if it is not found
   */

  static findPlayerObject(squeezeserver, players, name) {

    name = this.normalizeName(name);
    console.log("In findPlayerObject with " + name);

    // Look for the player in the players list that matches the given name. Then return the corresponding player object
    // from the squeezeserver stored by the player's id

    // NOTE: For some reason squeezeserver.players[] is empty but you can still reference values in it. I think it
    //       is a weird javascript timing thing

    for (let pl in players) {
      if (
        players[pl].name.toLowerCase() === name || // name matches the requested player
        (name === "" && players.length === 1) // name is undefined and there's only one player,
        // so assume that's the one we want.
      ) {
        return squeezeserver.players[players[pl].playerid];
      }
    }

    console.log("Player %s not found", name);
    return null;
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

module.exports = Intent;