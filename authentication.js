const SpotifyAuthentication = require('spotify-authentication');
const Store = require('electron-store');
const http = require('http');
const { BrowserWindow } = require('electron');

const spotifyAuthentication = new SpotifyAuthentication();
let window;

class Authentication {
    constructor() {
        this.store = new Store(/* {
            defaults: {
                accessToken: '',
                refreshToken: '',
            },
        } */);

        spotifyAuthentication.setHost('https://spotify-proxy-oauth2.herokuapp.com/');
    }

    newAuthentication() {
        window = new BrowserWindow();
        window.loadURL(spotifyAuthentication.createAuthorizeURL().href);

        return new Promise((resolve, reject) => {
            const server = http.createServer((req, res) => {
                const code = req.url.match(/code=(.+)/)[1];

                res.end();

                if (code) {
                    window.close();
                    server.close();
                    this.getRefreshToken(code)
                        .then(resolve, reject);
                }
            }).listen(1995);
        });
    }

    getRefreshToken(code) {
        return spotifyAuthentication.authorizationCodeGrant(code)
            .then((res) => {
                this.store.set('refreshToken', res.refresh_token);
                this.setAccessToken.bind(this)(res);
            });
    }

    setAccessToken(res) {
        this.store.set('accessToken', res.access_token);

        // REVIEW: Should the access token be updated in the background constantly?
        setTimeout(this.updateAccessToken.bind(this), (res.expires_in - 5) * 1000);
    }

    updateAccessToken() {
        return spotifyAuthentication.refreshAccessToken(this.store.get('refreshToken'))
            .then(this.setAccessToken.bind(this))
            .catch(() => {
                this.store.delete('refreshToken');
                return this.newAuthentication();
            });
    }

    authenticate() {
        let f = this.newAuthentication;

        if (this.store.has('refreshToken')) {
            f = this.updateAccessToken;
        }

        return f.bind(this)();
    }
}

module.exports = Authentication;
