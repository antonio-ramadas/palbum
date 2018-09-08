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
let spotifyApi;

function createServer() {
    callbackServer = http.createServer((req, res) => {
        const code = req.url.match(/code=(.+)/)[1];

        res.end();

        spotifyApi.authorizationCodeGrant(code).then(
            /* eslint-disable */
            (data) => {
                console.log(`The token expires in ${data.body.expires_in}`);
                console.log(`The access token is ${data.body.access_token}`);
                console.log(`The refresh token is ${data.body.refresh_token}`);

                // Set the access token on the API object to use it in later calls
                spotifyApi.setAccessToken(data.body.access_token);
                spotifyApi.setRefreshToken(data.body.refresh_token);
            },
            (err) => {
                console.log('Something went wrong!', err);
            },
            /* eslint-enable */
        );
        // TODO close browser window
        // TODO activate spotify api, but first grab what we want (token)
        // TODO close server
    });

    callbackServer.listen(1995); // TODO move this constant to a configuration file
}

function spotify() {
    const scopes = ['user-read-playback-state'];
    const credentials = {
        redirectUri: store.get('redirectUri'),
        clientId: store.get('clientId'),
        clientSecret: store.get('clientSecret'),
    };

    // Setting credentials can be done in the wrapper's constructor,
    // or using the API object's setters.
    spotifyApi = new SpotifyWebApi(credentials);

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
        store.set({
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            redirectUri: process.env.REDIRECT_URI,
        });
    }

    spotify();
}

app.on('ready', createTray);
