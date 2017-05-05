const PlayTrackIntent = require('./intents/play-track-intent');
const HelpIntent = require('./intents/help-intent');
const PausePlayerIntent = require('./intents/pause-player-intent');
const StartPlayerIntent = require('./intents/start-player-intent');
const NamePlayersIntent = require('./intents/name-players-intent');
const PowerDownPlayerIntent = require('./intents/power-down-player-intent');
const IncreaseVolumeIntent = require('./intents/increase-volume-intent');
const DecreaseVolumeIntent = require('./intents/decrease-volume-intent');
const SelectPlayerIntent = require('./intents/select-player-intent');
const PlayLocalPlaylistIntent = require('./intents/play-local-playlist-intent');
const PreviousTrackIntent = require('./intents/previous-track-intent');
const NextTrackIntent = require('./intents/next-track-intent');
const SyncPlayersIntent = require('./intents/sync-players-intent');
const UnSyncPlayersIntent = require('./intents/unsync-players-intent');
const WhatsPlayingIntent = require('./intents/whats-playing-intent');


const intentMap = {
	'PlayTrack': PlayTrackIntent,
	'Help': HelpIntent,
	'PausePlayer': PausePlayerIntent,
	'StartPlayer': StartPlayerIntent,
	'NamePlayers': NamePlayersIntent,
	'PowerDownPlayer': PowerDownPlayerIntent, 
	'IncreaseVolume': IncreaseVolumeIntent,
	'DecreaseVolume': DecreaseVolumeIntent,
	'SelectPlayer': SelectPlayerIntent,
	'PlayLocalPlaylist': PlayLocalPlaylistIntent,
	'PreviousTrack': PreviousTrackIntent,
	'NextTrack': NextTrackIntent,
	'SyncPlayers': SyncPlayersIntent,
	'UnSyncPlayers': UnSyncPlayersIntent,
	'WhatsPlaying': WhatsPlayingIntent,
};

module.exports = intentMap;