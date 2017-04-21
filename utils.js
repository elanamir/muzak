
class Utils {
  // XXX shouldn't be here
  static giveHelp(session, callback) {
    console.log("In giveHelp");
    callback(session.attributes, Utils.buildSpeechletResponse("Help", "You can say things like. " +
      "start player X, " +
      "unpause player X, " +
      "randomize player X, " +
      "stop player X, " +
      "pause player X, " +
      "previous song on player X, " +
      "next song on player X, " +
      "synchronize player X with player Y, " +
      "unsynchronize player X, " +
      "increase volume on player X, " +
      "decrease volume on player X, " +
      "set volume on player X to one to one hundred, " +
      "what's playing on player X, " +
      "set player X, " +
      "what are my player names, " +
      "exit, " +
      "help.",
      "What do you want to do?", false));
  }


  /**
   * Format a response to send to the Echo
   *
   * @param title The title for the UI Card
   * @param output The speech output
   * @param repromptText The prompt for more information
   * @param shouldEndSession A flag to end the session
   * @returns A formatted JSON object containing the response
   */

  static buildSpeechletResponse(title, output, repromptText, shouldEndSession) {

    return {
      outputSpeech: {
        type: "PlainText",
        text: output
      },
      card: {
        type: "Simple",
        title: "Squeezebox Server - " + title,
        content: "Squeezebox Server - " + output
      },
      reprompt: {
        outputSpeech: {
          type: "PlainText",
          text: repromptText
        }
      },
      shouldEndSession: shouldEndSession
    }
  }

  /**
   * Return the response
   *
   * @param sessionAttributes The attributes for the current session
   * @param speechletResponse The response object
   * @returns A formatted object for the response
   */

  static buildResponse(sessionAttributes, speechletResponse) {

    return {
      version: "1.0",
      sessionAttributes: sessionAttributes,
      response: speechletResponse
    }
  }
}

module.exports = Utils;