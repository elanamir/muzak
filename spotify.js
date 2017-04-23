const SqueezeServer = require('squeezenode-lordpengwin');
const _ = require('lodash');
const repromptText = "What do you want me to do";
const SpotifyWebApi = require('spotify-web-api-node');
const urlencode = require('urlencode');

const squeeze = new SqueezeServer('http://127.0.0.1', 9000);
const MAX_SEARCH = 20;
const spotifyApi = new SpotifyWebApi({
  clientId : '65e1c3401ab14b24921bc35fe31bbb3f',
  clientSecret : '72ca625592244fde80f74c6511c4318b',
});


class Spotify {

	static searchTracks(track, artist, album) {
		// Search tracks whose artist's name contains 'Kendrick Lamar', and track name contains 'Alright'
		let s = '';
		if (track) {
			s += "track:" + track;
		}

		if (artist) {
			s += " artist:" + artist;  // XXX url encode
		}

		if (s !== '') {
			return spotifyApi.searchTracks(s)
			.then((data) => {
				if (!data) {
					console.err(err);
					return null;
				}
				return data.body;
			})
		} else {
			return null;
		}
	}

	static getTrackUri(track, artist, album, position = 0) {
		return Spotify.searchTracks(track, artist)
		.then(body => {
			if (body.tracks && body.tracks.items && body.tracks.items.length > 0) {
				return body.tracks.items[position].uri;
			} else {
				return null;
			}
		});
	}
}

module.exports = Spotify;
