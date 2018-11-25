import React, { Component } from 'react';
import './App.css';

class App extends Component {
    render() {
        let inline = {
            width: '100%'
        };
        return (
            <>
                <div className="wrap">
                    <div className="search">
                        <input type="text" className="searchTerm" placeholder="What do you want to hear?"/>
                            <button type="submit" className="searchButton">
                                &#128269;
                            </button>
                    </div>
                </div>
                <table style={inline}>
                    <tbody>
                    <tr>
                        <td className="img-cell">
                            <img src="https://via.placeholder.com/40" alt="Album's Icon"/>
                        </td>
                        <td>
                            <div>
                                <h3>Header</h3>
                                <p>text goes here</p>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className="img-cell">
                            <img src="https://via.placeholder.com/40" alt="Album's Icon"/>
                        </td>
                        <td>
                            <div>
                                <h3>Header</h3>
                                <p>text goes here</p>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </>
        );
    }
}

export default App;
