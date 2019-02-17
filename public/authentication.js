const { app, BrowserWindow } = require('electron'); // eslint-disable-line import/no-extraneous-dependencies
const SpotifyAuthentication = require('spotify-authentication');
const http = require('http');
const spotifyContext = require('./spotifyContext');
const store = require('./store');

const spotifyAuthentication = new SpotifyAuthentication();
let window;

class Authentication {
    constructor() {
        spotifyAuthentication.setHost('https://spotify-proxy-oauth2.herokuapp.com/');
    }

    static hasRefreshToken() {
        return store.has('refreshToken');
    }

    newAuthentication() {
        if (!window) {
            window = new BrowserWindow();

            // This means the user explicitly closed the window and most likely wants to quit
            // the app. Otherwise, the tokens were successfully retrieved.
            window.on('closed', () => {
                // Lose the reference after closing the window
                window = null;

                if (!Authentication.hasRefreshToken()) {
                    // The window was closed without getting the Spotify API tokens
                    app.quit();
                }
            });

            const loadUrl = () => window.loadURL(spotifyAuthentication.createAuthorizeURL().href);

            loadUrl();

            // Reload on error
            // It is used `loadURL` instead of `reload` just in case the user goes somewhere
            // with no return
            window.webContents.on('did-fail-load', () => loadUrl());
        }

        return new Promise((resolve, reject) => {
            const server = http.createServer((req, res) => {
                res.end();

                const codeRgx = req.url.match(/code=(.+)/);

                if (codeRgx.length > 0) {
                    this.getRefreshToken(codeRgx[1])
                        .then(() => {
                            window && window.close();
                            server.close();
                        })
                        .then(resolve, reject);
                }
            });

            server.on('error', (error) => {
                // An authentication is most likely in progress
                // (another process may be in the same door)
                if (error.code === 'EADDRINUSE') {
                    resolve();
                } else {
                    reject(error);
                }
            });

            server.listen(1995);
        });
    }

    getRefreshToken(code) {
        return spotifyAuthentication.authorizationCodeGrant(code)
            .then((res) => {
                store.set('refreshToken', res.refresh_token);
                this.setAccessToken(res);
            });
    }

    setAccessToken(res) {
        store.set('accessToken', res.access_token);
        spotifyContext.setAccessToken(res.access_token);

        // Update constantly the access token in the background
        setTimeout(() => this.updateAccessToken(), (res.expires_in - 5) * 1000);
    }

    updateAccessToken() {
        return spotifyAuthentication.refreshAccessToken(store.get('refreshToken'))
            .then(response => this.setAccessToken(response))
            .catch(() => {
                store.delete('refreshToken');
                return this.newAuthentication();
            });
    }

    authenticate() {
        let f = this.newAuthentication;

        if (Authentication.hasRefreshToken()) {
            f = this.updateAccessToken;
        }

        return f.bind(this)();
    }
}

module.exports = Authentication;
