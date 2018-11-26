import React, { Component } from 'react';
import './AlbumComponent.css'

class AlbumComponent extends Component {
    render() {
        return (
            <tr>
                <td className="img-cell">
                    <img src={this.props.url} alt={this.props.albumTitle + "'s Icon"}/>
                </td>
                <td>
                    <div>
                        <h3>{this.props.albumTitle}</h3>
                        <p>{this.props.song}</p>
                    </div>
                </td>
            </tr>
        );
    }
}

export default AlbumComponent;
