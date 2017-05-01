
class Utils {
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