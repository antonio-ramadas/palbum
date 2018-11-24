const { app } = require('electron');
const menubar = require('menubar');
const path = require('path');
const Authentication = require('./authentication');

const authentication = new Authentication();

function createTray() {
    authentication.authenticate().then(console.log, console.error);

    menubar({
        index: 'http://localhost:3000/', // https://via.placeholder.com/400',
        icon: path.join(__dirname, 'resources/icons/PablumTemplate.png'),
        tooltip: 'Resume playing Spotify back where you left off',
        preloadWindow: true,
    });
}

app.on('ready', createTray);

// To prevent the login window when closed to quit the application
// https://github.com/electron/electron/blob/master/docs/api/app.md#event-window-all-closed
// app.on('window-all-closed', () => {});
