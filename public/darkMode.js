const { systemPreferences } = require('electron'); // eslint-disable-line import/no-extraneous-dependencies
const store = require('./store');

// Initial defaults
let isOn = false;
let shouldMatchMacOsDarkMode = true;

function save() {
    store.set({
        darkMode: {
            isOn,
            shouldMatchMacOsDarkMode,
        },
    });
}

function init() {
    isOn = store.get('darkMode.isOn', isOn);
    shouldMatchMacOsDarkMode = store.get('darkMode.shouldMatchMacOsDarkMode', shouldMatchMacOsDarkMode);
}

function toggleUser() {
    isOn = !isOn;
    shouldMatchMacOsDarkMode = false;

    save();
}

function toggleSystem() {
    if (shouldMatchMacOsDarkMode) {
        isOn = !isOn;
    }
}

function matchMacOsDarkMode() {
    // With `electron-builder`, macOs is the only OS that is possible to listen for dark mode
    // changes
    if (process.platform === 'darwin') {
        shouldMatchMacOsDarkMode = true;

        isOn = systemPreferences.isDarkMode();

        save();
    }
}

function isDarkMode() {
    if (process.platform === 'darwin' && shouldMatchMacOsDarkMode) {
        return systemPreferences.isDarkMode();
    }

    return isOn;
}

module.exports = {
    init, isDarkMode, toggleUser, toggleSystem,
};
