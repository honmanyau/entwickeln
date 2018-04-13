function Entwickeln() {
  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function initialise(width, height) {
    // Create the game grid using user-specified width and height
    this.game = Array.from(Array(height)).map((row) => {
      return Array.from(Array(width)).map((cell) => ({
        state: 'dead',
        born: 0
      }));
    });

    return clone(this.game);
  }

  const publicAPI = {
    evolve: evolve,
    game: null,
    init: initialise,
  };

  return publicAPI;
}

export default Entwickeln();
