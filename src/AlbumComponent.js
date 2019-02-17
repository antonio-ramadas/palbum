import React, { Component } from 'react'; // eslint-disable-line import/no-extraneous-dependencies
import './AlbumComponent.css';

class AlbumComponent extends Component {
    constructor(props) {
        super(props);

        this.rowRef = React.createRef();
    }

    componentDidUpdate() {
        if (this.props.isSelected) {
            this.rowRef.current.scrollIntoView({
                block: 'nearest',
            });

            const distanceToTop = this.rowRef.current.getBoundingClientRect().top;

            // `scrollIntoView` does not scroll completely an element into view
            // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView#Notes
            // This condition provides the necessary assistance
            // 36 is the height of the search bar
            if (distanceToTop < 36) {
                window.scrollBy(0, distanceToTop - 36 - 2);
            }
        }
    }

    render() {
        const selected = this.props.isSelected ? 'selected' : '';
        const { theme } = this.props;

        return (
            <tr
                onClick={() => this.props.onClick()}
                id={selected}
                className={theme}
                onMouseOver={() => this.props.onMouseOver()}
                ref={this.rowRef}
            >
                <td className="img-cell">
                    <img src={this.props.url} alt={`${this.props.albumTitle}'s Icon`}/>
                </td>
                <td>
                    <div>
                        <h3 className={theme}>{this.props.albumTitle}</h3>
                        <p className={theme}>{this.props.song}</p>
                    </div>
                </td>
            </tr>
        );
    }
}

export default AlbumComponent;
