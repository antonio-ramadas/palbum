// Adapted rom: https://medium.freecodecamp.org/building-an-electron-application-with-create-react-app-97945861647c
const { Socket } = require('net');
const { exec } = require('child_process');

const port = 3000;

const client = new Socket();

let startedElectron = false;

exec('npm run react');

const tryConnection = () => client.connect({ port }, () => {
    client.end();
    if (!startedElectron) {
        startedElectron = true;
        exec('npm run electron');
    }
});

tryConnection();

client.on('error', () => {
    setTimeout(tryConnection, 1000);
});
