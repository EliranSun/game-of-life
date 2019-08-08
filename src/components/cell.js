import React from 'react';
import PropTypes from 'prop-types';

class Cell extends React.Component {
  constructor(props) {
    super(props);

    this.toggleStateLife = this.toggleStateLife.bind(this);
  }

  toggleStateLife() {
    if (!this.props.gamePaused) {
      return;
    }

    this.props.toggleLife();
  }

  render() {
    const className = ['cell', this.props.alive ? 'alive' : 'dead'].join(' ');

    return (
      <td
        onClick={ this.toggleStateLife }
        className={ className } />
    );
  }
};

Cell.propTypes = {
  gamePaused: PropTypes.bool.isRequired,
  alive: PropTypes.bool,
  updateState: PropTypes.func.isRequired
}

Cell.defaultProps = {
  alive: false
};

export default Cell;
