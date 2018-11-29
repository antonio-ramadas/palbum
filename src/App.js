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
            context: [
                {
                    albumTitle: 'Bananas',
                    song: 'Monkey',
                    url: 'https://via.placeholder.com/40',
                },
                {
                    albumTitle: 'Apple',
                    song: 'Steve Jobs',
                    url: 'https://via.placeholder.com/40',
                },
                {
                    albumTitle: 'Tomato',
                    song: 'Timer',
                    url: 'https://via.placeholder.com/40',
                },
                {
                    albumTitle: 'Grapes',
                    song: 'Egypt',
                    url: 'https://via.placeholder.com/40',
                },
            ],
            isListeningToIpc: false,
        };

        this.updateDataFromIpc = this.updateDataFromIpc.bind(this);
    }

    updateDataFromIpc(event, arg) {
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
            table.push((
                <AlbumComponent
                    key={element.albumTitle}
                    albumTitle={element.albumTitle}
                    song={element.song}
                    url={element.url}
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
