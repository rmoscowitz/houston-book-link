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
    let labelClasses = 'library-short-name '
    let iconClasses = 'icon '
    if (this.state.selected) {
      iconClasses += 'ion-checkmark-circled green'
      labelClasses += 'selected'
    } else {
      iconClasses += 'ion-close-circled red'
    }

    return (
      <div className="card" onClick={this._onCardClick}>
        <i className={iconClasses}></i>
        <img className={"card-image " + (this.state.selected ? "" : "gray")}
             src={this.props.imagePath}
             alt={this.props.imageAltText}/>
        <div className={labelClasses}>{this.props.shortName}</div>
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
