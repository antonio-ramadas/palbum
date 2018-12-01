import React, { Component } from 'react';
import './App.css';
import AlbumComponent from './AlbumComponent';

// Another option would be to eject react and import electron as a plugin in webconfig
// https://stackoverflow.com/questions/44008674/how-to-import-the-electron-ipcrenderer-in-a-react-webpack-2-setup
const { ipcRenderer } = window.require('electron');

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            context: [],
            isListeningToIpc: false,
        };

        this.updateDataFromIpc = this.updateDataFromIpc.bind(this);
    }

    updateDataFromIpc(event, arg) {
        console.log(arg);
        this.setState({
            context: arg,
        });
    }

    componentDidMount() {
        if (!this.state.isListeningToIpc) {
            ipcRenderer.on('update-data', this.updateDataFromIpc);

            ipcRenderer.send('get-data');

            this.setState({
                isListeningToIpc: true,
            });
        }
    }

    componentWillUnmount() {
        if (this.state.isListeningToIpc) {
            ipcRenderer.removeListener('update-data', this.updateDataFromIpc);
            // No need to update to not listening, because the state will be lost
        }
    }

    render() {
        const table = [];

        this.state.context.forEach((element) => {
            const artists = Object.values(element.track.artists).map(val => val.name);

            table.push((
                <AlbumComponent
                    key={element.context.id + element.track.id}
                    albumTitle={element.context.name}
                    song={`${artists.join(', ')} - ${element.track.name}`}
                    url={element.context.images[0].url}
                />
            ));
        });

        // Search bar adapted from: https://codepen.io/huange/pen/rbqsD
        // Table adapted from: https://stackoverflow.com/a/17029347
        return (
            <>
                <div className="search">
                    <input type="text" className="searchTerm" placeholder="What do you want to hear?" autoFocus={true}/>
                    <button type="submit" className="searchButton">
                        <span role="img" aria-label="Search emoji">&#128269;</span>
                    </button>
                </div>
                <table>
                    <tbody>
                        {table}
                    </tbody>
                </table>
            </>
        );
    }
}

export default App;
