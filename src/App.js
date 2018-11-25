import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
      let inline = {
          width: '100%'
      };
    return (
        <table style={inline}>
            <tbody id="services-list">
            <tr>
                <td>
                    <img src="https://via.placeholder.com/40" alt="Album's Icon"/>
                </td>
                <td>
                    <div className="content">
                        <h3>Header</h3>
                        <p>text goes here</p>
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <img src="https://via.placeholder.com/40" alt="Facebook Icon"/>
                </td>
                <td>
                    <div className="content">
                        <h3>Header</h3>
                        <p>text goes here</p>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
    );
  }
}

export default App;
