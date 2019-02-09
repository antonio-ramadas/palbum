import React, { Component } from 'react'; // eslint-disable-line import/no-extraneous-dependencies
import Fuse from 'fuse.js';
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
            search: {
                term: '',
                results: [],
            },
            currentSelected: 0,
            isListeningToIpc: false,
        };

        this.searchInputRef = React.createRef();
    }

    handleKeyDown(event) {
        const stateObj = this.state;

        if (event.key === 'Tab') {
            const currentSelected = stateObj.currentSelected + (event.shiftKey ? -1 : 1);

            this.updateSelection(currentSelected, stateObj.search.results.length - 1);

            event.preventDefault();
        } else if (event.key === 'Enter') {
            if (stateObj.currentSelected < stateObj.search.results.length) {
                App.play(stateObj.search.results[stateObj.currentSelected].context.uri);
            }
        } else if (event.key === 'ArrowUp') {
            this.updateSelection(stateObj.currentSelected - 1, stateObj.search.results.length - 1);
            event.preventDefault();
        } else if (event.key === 'ArrowDown') {
            this.updateSelection(stateObj.currentSelected + 1, stateObj.search.results.length - 1);
            event.preventDefault();
        }
    }

    updateSelection(newCurrentSelection, maxSize) {
        // 0 <= currentSelected <= maximumSize
        const maximumSize = Math.max(maxSize, 0);

        this.setState({
            currentSelected: Math.min(Math.max(0, newCurrentSelection), maximumSize),
        });
    }

    search(term, ctx) {
        const stateObj = this.state;

        const searchTerm = term || stateObj.search.term;
        const context = ctx || stateObj.context;

        const searchOptions = {
            keys: [{
                name: 'context.name',
                weight: 0.7,
            }, {
                name: 'track.name',
                weight: 0.3,
            }],
            shouldSort: true,
            threshold: 0.35,
        };

        const fuse = new Fuse(context, searchOptions);

        let searchResults = fuse.search(searchTerm);

        if (term === '' || searchTerm === '') {
            searchResults = context;
        }

        this.updateSelection(stateObj.currentSelected, searchResults.length - 1);

        this.setState({
            context,
            search: {
                term: searchTerm,
                results: searchResults,
            },
        });
    }

    updateDataFromIpc(event, arg) {
        this.search(null, arg);
    }

    componentDidMount() {
        if (!this.state.isListeningToIpc) {
            this.setState({
                isListeningToIpc: true,
            });

            ipcRenderer.on('update-data', (event, arg) => this.updateDataFromIpc(event, arg));

            ipcRenderer.on('dark-mode-state', (event, arg) => this.setState({ darkMode: arg }));

            ipcRenderer.send('get-data');
        }

        this.searchInputRef.current.focus();
    }

    componentWillUnmount() {
        if (this.state.isListeningToIpc) {
            ipcRenderer.removeListener('update-data', (event, arg) => this.updateDataFromIpc(event, arg));
            // No need to update to not listening, because the state will be lost
        }
    }

    static play(uri) {
        ipcRenderer.send('play', uri);
    }

    handleInputChange(event) {
        this.search(event.target.value, null);
    }

    handleAlbumComponentClick(uri) {
        App.play(uri);
        this.searchInputRef.current.focus();
    }

    render() {
        const table = [];
        const stateObj = this.state;

        stateObj.search.results.forEach((element, index) => {
            const artists = Object.values(element.track.artists).map(val => val.name);

            table.push((
                <AlbumComponent
                    key={element.context.id + element.track.id}
                    albumTitle={element.context.name}
                    song={`${artists.join(', ')} - ${element.track.name}`}
                    url={element.context.images[0].url}
                    onMouseOver={() => this.setState({ currentSelected: index })}
                    onClick={() => this.handleAlbumComponentClick(element.context.uri)}
                    isSelected={index === stateObj.currentSelected}
                />
            ));
        });

        // Search bar adapted from: https://codepen.io/huange/pen/rbqsD
        // Table adapted from: https://stackoverflow.com/a/17029347
        return (
            <>
                <div className="search">
                    <input
                        type="text"
                        className="searchTerm"
                        placeholder="What do you want to hear?"
                        autoFocus={true}
                        onChange={event => this.handleInputChange(event)}
                        onKeyDown={event => this.handleKeyDown(event)}
                        ref={this.searchInputRef}
                    />
                    <button
                        type="submit"
                        className="searchButton"
                        tabIndex="-1"
                    >
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
