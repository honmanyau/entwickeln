# Entwickeln

> A JavaScript library for Conway's Game of Life

## Table of Contents

* [Introduction](#introduction)
* [Installation](#installation)
* [Usage](#usage)
* [API](#api)

## Introduction

Entwickeln is a JavaScript library for Conway's Game of Life. The rules are
implemented as described in the
[Wikipedia entry](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)
of the game:

> 1. Any live cell with fewer than two live neighbours dies,
as if caused by underpopulation.
> 2. Any live cell with two or three live neighbours lives on to the next generation.
> 3. Any live cell with more than three live neighbours dies, as if by overpopulation.
> 4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

## Installation

## Usage

## API

### `entwickeln.game`

An array of arrays in which every value is an object representing the current
state of the cell, for example:

```javascript
{
  state: 'new'
  born: 0
}
```

The `state` property can take the a value of `'dead'`, `'new'` or `'alive'`:
* `'dead'`—an "unoccupied" cell
* `'new'`—a cell that became "occupied" during the last evolution/iteration
* `'alive'`—a cell that has been "occupied" for more than one generation

The `born` property holds a number that indicates when a cell became alive.

### `entwickeln.generation`

A number that indicates the current generation of the game.

### `entwickeln.init(width, height[, alpha])`

A function that initialises the game at generation 0 with the specified
`width` and `height` and randomly populates the cells. A cell populated
in this manner takes the form of `{ state: 'new', born: 0 }`.

#### `width`

An integer that specifies the length of the game, in number of cells.

#### `height`

An integer that specifies the height of the game, in number of cells.

#### `[alpha]`

An optional parameter that takes a value with a magnitude of less than 1; it
is used as the probability cutoff for randomly populating the game. A value of
`0` means that a game will be initialised without any living cells; a value of
`1` means that the game will be completely populated. The default value is 0.25.

#### Return value

An array of arrays, where the number of nested arrays corresponds to the
`height` of the game and the length of each nested array corresponds to
the `width` of the game.

### `entwickeln.evolve([generations])`

A function that calculates and return the next generation of the game.

#### `[generations]`

An optional parameter that is an integer greater than 1, it indicates
the number of generations to simulate. The default value is 1.

It is worth noting that generations are typically not "skipped" in a game of
life. The option to specify the number of generations to simulate is designed
for potentially creating reasonably time-accurate Game of Life, where rendering
may not necessarily occur for every generation.

#### Return value

An array of arrays that represents the latest generation, where the number
of nested arrays corresponds to the `height` of the game and the length of
each nested array corresponds to the `width` of the game.

### `entwickeln.restart()`

A function for restarting the game with the `width`, `height` and `alpha` used
to initialise the current game.

#### Return value

An array of arrays, where the number of nested arrays corresponds to the
`height` of the game and the length of each nested array corresponds to
the `width` of the game.
