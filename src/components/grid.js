import React from 'react';
import PropTypes from 'prop-types';
import Cell from './cell';

class Grid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      speed: 1,
      pause: true,
      grid: this.createGrid()
    };

    this.adjustSpeed = this.adjustSpeed.bind(this);
    this.toggleGameState = this.toggleGameState.bind(this);
    this.createGrid = this.createGrid.bind(this);
    this.renderGrid = this.renderGrid.bind(this);
    this.stepInTime = this.stepInTime.bind(this);
    this.toggleCellLife = this.toggleCellLife.bind(this);

    this.timeInterval = null;
  }

  createGrid() {
    return new Array(this.props.rows)
      .fill(undefined)
      .map(() => new Array(this.props.cols).fill(0));
  }

  toggleCellLife(rowIndex, columnIndex) {
    return () => {
      const { grid } = this.state;
      grid[rowIndex][columnIndex] = grid[rowIndex][columnIndex] === 1 ? 0 : 1;
      this.setState({ grid });
    }
  }

  renderGrid() {
    return (
      <table>
        <tbody>
          { this.state.grid.map((slots, rowIndex) => (
              <tr>
              { slots.map((slot, columnIndex) => (
                  <Cell
                    alive={ slot === 1 }
                    toggleLife={ this.toggleCellLife(rowIndex, columnIndex) }
                    gamePaused={ this.state.pause } />
                )) }
              </tr>
          )) }
        </tbody>
      </table>
    );
  }

  adjustSpeed() {
    this.setState({
      speed: this.state.speed + 1 > 4 ? 1 : this.state.speed + 1
    })
  }

  toggleGameState() {
    this.setState({
      pause: !this.state.pause
    }, () => {
      if (!this.state.pause) {
        this.timeInterval = setInterval(this.stepInTime, 500);
      } else {
        clearInterval(this.timeInterval);
      }
    });
  }

  stepInTime() {
    /* The universe of the Game of Life is an infinite, two-dimensional orthogonal grid of square cells,
    each of which is in one of two possible states, alive or dead, (or populated and unpopulated, respectively).
    Every cell interacts with its eight neighbours, which are the cells that are horizontally, vertically,
    or diagonally adjacent. At each step in time, the following transitions occur:
      Any live cell with fewer than two live neighbours dies, as if by underpopulation.
      Any live cell with two or three live neighbours lives on to the next generation.
      Any live cell with more than three live neighbours dies, as if by overpopulation.
      Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction. */

    const newGrid = JSON.parse(JSON.stringify(this.state.grid));
    this.state.grid.forEach((slots, rowIndex) => {
      slots.forEach((slot, columnIndex) => {
        let aliveNeighbours = 0;
        if (this.state.grid[rowIndex - 1]) {
          aliveNeighbours +=
            (this.state.grid[rowIndex - 1][columnIndex - 1] || 0) +
            this.state.grid[rowIndex - 1][columnIndex] +
            (this.state.grid[rowIndex - 1][columnIndex + 1] || 0);
        }
        aliveNeighbours +=
          (this.state.grid[rowIndex][columnIndex - 1] || 0) +
          (this.state.grid[rowIndex][columnIndex + 1] || 0);
        if (this.state.grid[rowIndex + 1]) {
          aliveNeighbours +=
            (this.state.grid[rowIndex + 1][columnIndex - 1] || 0) +
            this.state.grid[rowIndex + 1][columnIndex] +
            (this.state.grid[rowIndex + 1][columnIndex + 1] || 0);
        }

        if (slot === 1 && aliveNeighbours < 2) {
          // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
          newGrid[rowIndex][columnIndex] = 0;
        } else if (slot === 1 && [2,3].includes(aliveNeighbours)) {
          // Any live cell with two or three live neighbours lives on to the next generation.
          newGrid[rowIndex][columnIndex] = 1;
        } else if (slot === 1 && aliveNeighbours > 3) {
          // Any live cell with more than three live neighbours dies, as if by overpopulation.
          newGrid[rowIndex][columnIndex] = 0;
        } else if (slot === 0 && aliveNeighbours === 3) {
          // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
          newGrid[rowIndex][columnIndex] = 1;
        }
      });
    });

    this.setState({ grid: newGrid });
  }

  render() {
    return (
      <>
        <div>
          <button onClick={ this.toggleGameState }>{ this.state.pause ? 'play' : 'pause' }</button>
          <button onClick={ this.adjustSpeed }>speed * { this.state.speed }</button>
        </div>
        <div className="grid">
          { this.renderGrid() }
        </div>
      </>
    );
  }
}

Grid.propTypes = {
  cols: PropTypes.number.isRequired,
  rows: PropTypes.number.isRequired
}

Grid.defaultProps = {
  cols: 4,
  rows: 4
};

export default Grid;
