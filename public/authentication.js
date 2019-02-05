const SpotifyAuthentication = require('spotify-authentication');
const http = require('http');
const { BrowserWindow } = require('electron'); // eslint-disable-line import/no-extraneous-dependencies
const spotifyContext = require('./spotifyContext');
const store = require('./store');

const spotifyAuthentication = new SpotifyAuthentication();
let window;

class Authentication {
    constructor() {
        spotifyAuthentication.setHost('https://spotify-proxy-oauth2.herokuapp.com/');
    }

    newAuthentication() {
        window = new BrowserWindow();
        window.loadURL(spotifyAuthentication.createAuthorizeURL().href);

        return new Promise((resolve, reject) => {
            const server = http.createServer((req, res) => {
                res.end();

                const codeRgx = req.url.match(/code=(.+)/);

                if (codeRgx.length > 0) {
                    window.close();
                    server.close();
                    this.getRefreshToken(codeRgx[1])
                        .then(resolve, reject);
                }
            });

            server.on('error', reject);

            server.listen(1995);
        });
    }

    getRefreshToken(code) {
        return spotifyAuthentication.authorizationCodeGrant(code)
            .then((res) => {
                store.set('refreshToken', res.refresh_token);
                this.setAccessToken.bind(this)(res);
            });
    }

    setAccessToken(res) {
        store.set('accessToken', res.access_token);
        spotifyContext.setAccessToken(res.access_token);

        // REVIEW: Should the access token be updated in the background constantly?
        setTimeout(this.updateAccessToken.bind(this), (res.expires_in - 5) * 1000);
    }

    updateAccessToken() {
        return spotifyAuthentication.refreshAccessToken(store.get('refreshToken'))
            .then(this.setAccessToken.bind(this))
            .catch(() => {
                store.delete('refreshToken');
                return this.newAuthentication();
            });
    }

    authenticate() {
        let f = this.newAuthentication;

        if (store.has('refreshToken')) {
            f = this.updateAccessToken;
        }

        return f.bind(this)();
    }
}

module.exports = Authentication;
