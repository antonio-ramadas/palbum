import React, { Component } from 'react'; // eslint-disable-line import/no-extraneous-dependencies
import Fuse from 'fuse.js';
import Mousetrap from 'mousetrap';
// REVIEW: globalBind is not used, but changes the prototype of Mousetrap.
//         Improve the way thisis being done.
import globalBind from 'mousetrap-global-bind';
import './App.css';
import AlbumComponent from './AlbumComponent';
import { getClassNameTheme } from './Util';

// Another option would be to eject react and import electron as a plugin in webconfig
// https://stackoverflow.com/questions/44008674/how-to-import-the-electron-ipcrenderer-in-a-react-webpack-2-setup
const { ipcRenderer } = window.require('electron');

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            context: [],
            search: {
                results: [],
            },
            currentSelected: 0,
            isListeningToIpc: false,
            darkMode: false,
        };

        this.searchInputRef = React.createRef();
    }

    static handleKeyDown(event) {
        if (['Tab', 'ArrowUp', 'ArrowDown'].indexOf(event.key) > -1) {
            event.preventDefault();
        }
    }

    bindKeyListeners() {
        const move = (direction) => {
            const stateObj = this.state;

            const newPosition = stateObj.currentSelected + direction;

            this.updateSelection(newPosition, stateObj.search.results.length - 1);
        };

        const moveUp = () => move(-1);
        const moveDown = () => move(1);

        Mousetrap.bindGlobal('mod+d', () => ipcRenderer.send('toggle-dark-mode-state'));

        Mousetrap.bindGlobal('esc', () => ipcRenderer.send('hide-window'));

        Mousetrap.bindGlobal('tab', () => moveDown());
        Mousetrap.bindGlobal('shift+tab', () => moveUp());

        Mousetrap.bindGlobal('up', () => moveUp());
        Mousetrap.bindGlobal('down', () => moveDown());

        Mousetrap.bindGlobal('enter', () => {
            const stateObj = this.state;

            if (stateObj.currentSelected < stateObj.search.results.length) {
                App.play(stateObj.search.results[stateObj.currentSelected].context.uri);
            }
        });
    }

    updateSelection(newCurrentSelection, maxSize) {
        // 0 <= currentSelected <= maximumSize
        const maximumSize = Math.max(maxSize, 0);

        this.setState({
            currentSelected: Math.min(Math.max(0, newCurrentSelection), maximumSize),
        });
    }

    search(ctx) {
        const stateObj = this.state;

        const searchTerm = this.searchInputRef.current.value;
        const context = ctx || stateObj.context;

        const searchOptions = {
            keys: [{
                name: 'context.name',
                weight: 0.6,
            }, {
                name: 'track.name',
                weight: 0.3,
            }, {
                name: 'track.artists.name',
                weight: 0.1,
            }],
            shouldSort: true,
            threshold: 0.35,
        };

        let searchResults = context;

        if (searchTerm !== '') {
            const fuse = new Fuse(context, searchOptions);
            searchResults = fuse.search(searchTerm);
        }

        this.updateSelection(stateObj.currentSelected, searchResults.length - 1);

        this.setState({
            context,
            search: {
                results: searchResults,
            },
        });
    }

    updateDataFromIpc(event, arg) {
        this.search(arg);
    }

    componentDidMount() {
        if (!this.state.isListeningToIpc) {
            this.setState({
                isListeningToIpc: true,
            });

            ipcRenderer.on('update-data', (event, arg) => this.updateDataFromIpc(event, arg));

            ipcRenderer.on('dark-mode-state', (event, arg) => {
                this.setState({ darkMode: arg });
                document.body.className = getClassNameTheme(arg);
            });

            ipcRenderer.send('get-data');
            ipcRenderer.send('get-dark-mode-state');
        }

        this.bindKeyListeners();

        this.searchInputRef.current.focus();
    }

    componentWillUnmount() {
        if (this.state.isListeningToIpc) {
            ipcRenderer.removeAllListeners('update-data');
            ipcRenderer.removeAllListeners('dark-mode-state');
            // No need to update to not listening, because the state will be lost
        }

        Mousetrap.unbind(['mod+d', 'esc', 'tab', 'shift+tab', 'up', 'down']);
    }

    static play(uri) {
        ipcRenderer.send('play', uri);
    }

    handleInputChange(event) {
        this.search();
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
                    theme={getClassNameTheme(stateObj.darkMode)}
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
                <div id={'search'} className={getClassNameTheme(stateObj.darkMode)}>
                    <input
                        type="text"
                        id={'searchTerm'}
                        className={getClassNameTheme(stateObj.darkMode)}
                        placeholder="What do you want to hear?"
                        autoFocus={true}
                        onChange={() => this.search()}
                        onKeyDown={event => App.handleKeyDown(event)}
                        ref={this.searchInputRef}
                    />
                    <button
                        type="submit"
                        id="searchButton"
                        tabIndex="-1"
                    >
                        <span role="img" aria-label="Search emoji">&#128269;</span>
                    </button>
                </div>
                <table className={getClassNameTheme(stateObj.darkMode)}>
                    <tbody>
                        {table}
                    </tbody>
                </table>
            </>
        );
    }
}

export default App;
