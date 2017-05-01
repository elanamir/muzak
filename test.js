const Spotify = require('./spotify');
const SqueezeServer = require('squeezenode-lordpengwin');
const squeezeserver = new SqueezeServer('http://127.0.0.1', 9000);

const id = '98:5a:eb:8d:e9:66'

Spotify.searchTracks('paranoid android', 'radiohead')
.then(data => {
	console.log(data);
});

let player;

squeezeserver.on('register', function() {

        // Get the list of players as any request will require them

        squeezeserver.getPlayers(function(reply) {
         if (reply.ok) {
          		player = squeezeserver.players[id];
         }
        });
});


Spotify.getUri('paranoid android', 'radiohead')
.then(uri => { Spotify.play(player, uri) });

