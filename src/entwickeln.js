function Entwickeln() {
  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function countNeighbours(x0, y0, game) {
    const w = game[0].length;
    const h = game.length;
    const xi = (x0 - 1 < 0) ? w - 1 : (x0 - 1);
    const xf = (x0 + 1 === w) ? 0 : (x0 + 1);
    const yi = (y0 - 1 < 0) ? h - 1 : (y0 - 1);
    const yf = (y0 + 1 === h) ? 0 : (y0 + 1);
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
    // Handling unexpected inputs
    if (Number.isNaN(Number(width)) || Number.isNaN(Number(height))) {
      console.error([
        'entwickeln.initialise(width, height[, alpha]):\n\n',
        'The width and/or height argument entered is not a number.',
        ' The defualt value of 20 has been used.'
      ].join(''));
    }

    if (Number.isNaN(Number(alpha))) {
      console.error([
        'entwickeln.initialise(width, height[, alpha]):\n\n',
        'The optional argument alpha entered is not a number.',
        ' The defualt value of 0.25 has been used.'
      ].join(''));
    }

    // Clean up arguments
    width = Math.floor(Math.abs(width)) || 20;
    height = Math.floor(Math.abs(height)) || 20;
    alpha = Math.abs(alpha) || 0.25;

    // Update publicly available values and create the game grid
    this.width = width;
    this.height = height;
    this.alpha = alpha;
    this.generation = 0;
    this.game = Array.from(Array(height)).map((row) => {
      return Array.from(Array(width)).map((cell) => ({
        state: Math.random() < alpha ? 'new' : 'dead',
        gen: 0
      }));
    });

    return clone(this.game);
  }

  function evolve(generations = 1, target = this.game) {
    if (Number.isNaN(Number(generations))) {
      console.error([
        'entwickeln.evolve([generations]):\n\n',
        'The optional argument generations entered is not a number.',
        ' The defualt value of 1 has been used.'
      ].join(''));
    }
    else if (Number(generations) < 1) {
      console.error([
        'entwickeln.evolve([generations]):\n\n',
        'The optional argument generations entered is less than 1.',
        ' The defualt value of 1 has been used.'
      ].join(''));
    }

    generations = Math.floor(Math.abs(generations) || 1) || 1;

    const notCustomInput = target === this.game;
    const nextGeneration = clone(target);

    for (let generation = 0; generation < generations; generation++) {
      this.generation += 1;

      const referenceGeneration = clone(nextGeneration);

      nextGeneration.forEach((row, y) => {
        row.forEach((cell, x) => {
          const numberOfNeighbours = countNeighbours(x, y, referenceGeneration);
          const alive = cell.state !== 'dead';

          if (alive) {
            // "1. Any live cell with fewer than two live neighbours dies, as
            // if caused by underpopulation."
            if (numberOfNeighbours < 2) {
              cell.state = 'dead';
              cell.gen = this.generation;
            }
            // "2. Any live cell with two or three live neighbours lives on to
            // the next generation."
            else if (numberOfNeighbours < 4) {
              cell.state = 'alive';
              cell.gen = this.generation;
            }
            // "3. Any live cell with more than three live neighbours dies, as
            // if by overpopulation."
            else {
              cell.state = 'dead';
              cell.gen = this.generation;
            }
          }
          else {
            // "4. Any dead cell with exactly three live neighbours becomes a
            // live cell, as if by reproduction."
            if (numberOfNeighbours === 3) {
              cell.state = 'new';
              cell.gen = this.generation;
            }
          }
        });
      });
    }

    if (notCustomInput) {
      this.game = clone(nextGeneration);
    }

    return clone(nextGeneration);
  }

  function restart() {
    return initialise(this.width, this.height, this.alpha);
  }

  function edit(x, y, state) {
    if (Number.isNaN(Number(x)) || Number.isNaN(Number(y))) {
      return console.error([
        'entwickeln.edit(x, y, state):\n\n',
        'The argument x and y must be a number but the arguments received',
        ` are ${x} and ${y}, respectively. No cell was edited.`
      ].join(''));
    }

    const states = ['dead', 'alive', 'new'];

    if (states.indexOf(state) === -1) {
      return console.error([
        'entwickeln.edit(x, y, state):\n\n',
        `The state provided, ${state} is not a valid option. The valid options`,
        ` are "dead", "new" or "alive". The cell ${x}, ${y} was not edited.`
      ].join(''));
    }

    const { width, height } = this;

    // Allow the use of x and y that are outside the range specified
    // by the width and height of the game (periodic boundary conditions)
    x = ((x < 0) ? width - x : x) % width;
    y = ((y < 0) ? height - y : y) % height;

    const cell = this.game[y][x];

    cell.state = state;
    cell.gen = this.generation;

    return clone(this.game);
  }

  function toggle(x, y) {
    if (Number.isNaN(Number(x)) || Number.isNaN(Number(y))) {
      return console.error([
        'entwickeln.toggle(x, y):\n\n',
        'The argument x and y must be a number but the arguments received',
        ` are ${x} and ${y}, respectively. No cell was edited.`
      ].join(''));
    }

    const { width, height } = this;

    // Allow the use of x and y that are outside the range specified
    // by the width and height of the game (periodic boundary conditions)
    x = ((x < 0) ? width - x : x) % width;
    y = ((y < 0) ? height - y : y) % height;

    const cell = this.game[y][x];

    cell.state = (cell.state === 'dead') ? 'new' : 'dead';
    cell.gen = this.generation;

    return clone(this.game);
  }

  const publicAPI = {
    width: 0,
    height: 0,
    alpha: 0,
    game: null,
    generation: 0,
    init: initialise,
    evolve: evolve,
    restart: restart,
    edit: edit,
    toggle: toggle
  };

  return publicAPI;
}

export default Entwickeln();
