// import PropTypes from 'react'
import React from 'react'

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: true,
    };
    this._onCardClick = this._onCardClick.bind(this);
  }

  _onCardClick() {
    this.setState({
      selected: !this.state.selected
    }, () => {
      this.props.select(this.props.libraryId, this.state.selected);
    });
  }

  render() {
    let icon = null;
    if (this.state.selected) {
      icon = <i className="icon ion-checkmark-circled green"></i>;
    } else {
      icon = <i className="icon ion-close-circled red"></i>;
    }

    return (
      <div className="card" onClick={this._onCardClick}>
        {icon}
        <img className={"card-image " + (this.state.selected ? "" : "gray")}
             src={this.props.imagePath}
             alt={this.props.imageAltText}/>
      </div>
    )
  }

}

// Card.propTypes = {
//     libraryId: PropTypes.string,
//     imagePath: PropTypes.string,
//     imageAltText: PropTypes.string,
//     select: PropTypes.func,
// };

export default Card
