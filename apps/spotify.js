const SqueezeServer = require('squeezenode-lordpengwin');
const _ = require('lodash');
const SpotifyWebApi = require('spotify-web-api-node');

const squeeze = new SqueezeServer(process.env.SQUEEZESERVER_URL, process.env.SQUEEZESERVER_PORT);
const MAX_SEARCH = 20;
const spotifyApi = new SpotifyWebApi({
  clientId : process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
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
