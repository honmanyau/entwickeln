function Entwickeln() {
  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function countNeighbours(x0, y0, game) {
    const l = game.length;
    const xi = (x0 - 1 < 0) ? l - 1 : (x0 - 1);
    const xf = (x0 + 1 === l) ? 0 : (x0 + 1);
    const yi = (y0 - 1 < 0) ? l - 1 : (y0 - 1);
    const yf = (y0 + 1 === l) ? 0 : (y0 + 1);
    let numberOfNeighbours = 0;

    [yi, y0, yf].forEach((y) => {
      [xi, x0, xf].forEach((x) => {
        const self = x === x0 && y === y0;
        // Count only neighbours
        if (!self) {
          const cell = game[y][x];

          numberOfNeighbours += (cell.state !== 'dead');
        }
      });
    });

    return numberOfNeighbours;
  }

  // Public API functions
  function initialise(width, height, alpha = 0.25) {
    // Create the game grid using user-specified width and height
    this.width = width;
    this.height = height;
    this.alpha = alpha;
    this.generation = 0;
    this.game = Array.from(Array(height)).map((row) => {
      return Array.from(Array(width)).map((cell) => ({
        state: Math.random() < alpha ? 'new' : 'dead',
        born: 0
      }));
    });

    return clone(this.game);
  }

  function evolve(generations = 1) {
    const nextGeneration = clone(this.game);

    for (let generation = 0; generation < generations; generation++) {
      this.generation += 1;

      const referenceGeneration = clone(nextGeneration);

      nextGeneration.forEach((row, y) => {
        row.forEach((cell, x) => {
          const numberOfNeighbours = countNeighbours(x, y, referenceGeneration);
          const alive = cell.state !== 'dead';

          if (alive) {
            // "1. Any live cell with fewer than two live neighbours dies, as if
            // caused by underpopulation."
            if (numberOfNeighbours < 2) {
              cell.state = 'dead';
            }
            // "2. Any live cell with two or three live neighbours lives on to the
            // next generation."
            else if (numberOfNeighbours < 4) {
              cell.state = 'alive';
            }
            // "3. Any live cell with more than three live neighbours dies, as if
            // by overpopulation."
            else {
              cell.state = 'dead';
            }
          }
          else {
            // "4. Any dead cell with exactly three live neighbours becomes a
            // live cell, as if by reproduction."
            if (numberOfNeighbours === 3) {
              cell.state = 'new';
              cell.born = this.generation;
            }
          }
        });
      });
    }

    this.game = clone(nextGeneration);

    return clone(nextGeneration);
  }

  function restart() {
    return initialise(this.width, this.height, this.alpha);
  }

  const publicAPI = {
    width: 0,
    height: 0,
    alpha: 0,
    game: null,
    generation: 0,
    init: initialise,
    evolve: evolve,
    restart: restart
  };

  return publicAPI;
}

export default Entwickeln();
