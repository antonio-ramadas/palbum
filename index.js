const { app, Menu, Tray } = require('electron');
const path = require('path');
const SpotifyWebApi = require('spotify-web-api-node');
const http = require('http');
const Store = require('electron-store');

const store = new Store({
    defaults: {
        clientId: '',
        clientSecret: '',
        redirectUri: '',
    },
});

let tray;
let callbackServer;

function createServer() {
    callbackServer = http.createServer((req, res) => {
        res.end();
        // TODO close browser window
        // TODO activate spotify api, but first grab what we want (token)
        // TODO close server
    });

    callbackServer.listen(1995); // TODO move this constant to a configuration file
}

function spotify() {
    const scopes = ['user-read-playback-state'];

    // Setting credentials can be done in the wrapper's constructor,
    // or using the API object's setters.
    const spotifyApi = new SpotifyWebApi({
        redirectUri: store.get('redirectUri'),
        clientId: store.get('clientId'),
    });

    // Create the authorization URL
    const authorizeURL = spotifyApi.createAuthorizeURL(scopes);

    /* eslint-disable */
    // https://accounts.spotify.com:443/authorize?client_id=5fe01282e44241328a84e7c5cc169165&response_type=code&redirect_uri=https://example.com/callback&scope=user-read-private%20user-read-email&state=some-state-of-my-choice
    console.log(authorizeURL);
    /* eslint-enable */

    createServer();
}

function createTray() {
    tray = new Tray(path.join(__dirname, 'resources/icons/PablumTemplate.png'));

    const contextMenu = Menu.buildFromTemplate([
        { label: 'Quit', click: () => app.quit() },
    ]);

    tray.setContextMenu(contextMenu);

    // TODO this should be a pop-up to the user
    // In the meantime use environment variables
    if (!store.get('clientId')) {
        store.set('clientId', process.env.CLIENT_ID);
        store.set('clientSecret', process.env.CLIENT_SECRET);
        store.set('redirectUri', process.env.REDIRECT_URI);
    }

    spotify();
}

app.on('ready', createTray);
