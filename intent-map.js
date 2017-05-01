const PlayTrackIntent = require('./intents/play-track-intent');
const HelpIntent = require('./intents/help-intent');
const PausePlayerIntent = require('./intents/pause-player-intent');
const StartPlayerIntent = require('./intents/start-player-intent');
const NamePlayersIntent = require('./intents/name-players-intent');
const PowerDownPlayerIntent = require('./intents/power-down-player-intent');
const IncreaseVolumeIntent = require('./intents/increase-volume-intent');
const DecreaseVolumeIntent = require('./intents/decrease-volume-intent');
const SelectPlayerIntent = require('./intents/select-player-intent');

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
};

/**

const intentMap = {
	'SyncPlayers': SyncPlayersIntent,
	'NamePlayers': NamePlayersIntent,
	'Help': HelpIntent,
	'StartPlayer': StartPlayerIntent,
	'PlayLocalPlaylist': PlayLocalPlaylistIntent,
	'PlayTrack': PlayTrackIntent,
	'RandomizePlayer': RandomizePlayerIntent,
	'StopPlayer': StopPlayerIntent,
	'PausePlayer': PausePlayerIntent,
	'PreviousTrack': PreviousTrackIntent,
	'NextTrack': NextTrackIntent,
	'UnsyncPlayer': UnSyncPlayersIntent,
	'SetVolume': SetVolumeIntent,
	'IncreaseVolume': IncreaseVolumeIntent,
	'DecreaseVolume': DecreaseVolumeIntent,
	'WhatsPlaying': WhatsPlayingIntent,
	'SelectPlaying': SelectPlayingIntent,
	'PlayTrack': PlayTrackIntent,
};

*/

module.exports = intentMap;