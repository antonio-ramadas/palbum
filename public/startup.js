const { app } = require('electron'); // eslint-disable-line import/no-extraneous-dependencies
const store = require('./store');

const settings = {
    openAtLogin: true,
    openAsHidden: true, // Only works on mac
};

function init() {
    if (!store.has('firstTime')) {
        store.set('firstTime', false);
        app.setLoginItemSettings(settings);
    }
}

/**
 * On all OS it is possible to open the application at login. By default, the application is
 * launched as hidden (does not show the tray/dock window). However, on mac, the users have
 * external controls to choose whether they want or not the application to launch as hidden.
 * This implementation follows this UX.
 *
 * If the application was not launched at login (i.e., was intentionally opened by the user), then
 * show the window to give feedback that everything worked properly.
 *
 * @returns {boolean} False if the application was at startup. True otherwise. This implementation
 *                    is not uniform. On mac, it is possible to the application start at login and
 *                    show the window if the user changes the settings.
 */
function shouldShowWindow() {
    const { wasOpenedAtLogin, wasOpenedAsHidden } = app.getLoginItemSettings();

    let shouldShow = !wasOpenedAtLogin;

    // Login item settings does not work properly on all OS
    if (process.platform === 'darwin') {
        shouldShow = shouldShow || (wasOpenedAtLogin && !wasOpenedAsHidden);
    }

    return shouldShow;
}

module.exports = { init, shouldShowWindow };
