import BoardGameGame from 'boardgame.io/game';
import shuffle from 'lodash/shuffle';
import data from './data';

function isVictory(cells) {
  // Return true if cells is in a winning configuration.
}

function isLegalMove(cells, id, currentCard) {
  let topCard = null,
    rightCard = null,
    bottomCard = null,
    leftCard = null;

  //Find neighbor indices
  let topIndex = id - data.width;
  let rightIndex = id + 1;
  let leftIndex = id - 1;
  let bottomIndex = id + data.width;

  //Set neighbor cards if within board
  if (topIndex >= 0) {
    topCard = cells[topIndex];
  }
  if (bottomIndex < cells.length) {
    bottomCard = cells[bottomIndex];
  }
  if (rightIndex % data.width !== 0 && rightIndex < cells.length - 1) {
    rightCard = cells[rightIndex];
  }
  if (leftIndex % data.width !== data.width - 1 && leftIndex >= 0) {
    leftCard = cells[leftIndex];
  }

  //Check for matching side
  if (
    (topCard !== null && currentCard.top === topCard.bottom) ||
    (rightCard !== null && currentCard.right === rightCard.left) ||
    (bottomCard !== null && currentCard.bottom === bottomCard.top) ||
    (leftCard !== null && currentCard.left === leftCard.right)
  ) {
    return true;
  }
  return false;
}

const Game = BoardGameGame({
  setup: () => ({
    cells: data.board,
    deck: shuffle(data.deck),
  }),

  moves: {
    clickCell(G, ctx, id) {
      // Clone cells and deck state so we don't mutate values
      const cells = [...G.cells];
      const deck = [...G.deck];
      const currentCard = deck[0];

      // Ensure we can't overwrite cells.
      if (cells[id] === null) {
        if (isLegalMove(cells, id, currentCard)) {
          cells[id] = currentCard;
          deck.shift();
        }
      }

      // Return a copy of game state, along with updated cells and deck
      return { ...G, cells, deck };
    },
    pass(G, ctx, id) {
      // Clone deck state so we don't mutate values
      const deck = [...G.deck];

      // Place top card to bottom of deck
      deck.push(deck.shift());

      // Return a copy of game state, along with updated cells and deck
      return { ...G, deck };
    },
  },

  victory: (G, ctx) => {
    return isVictory(G.cells) ? ctx.currentPlayer : null;
  },
});

export default Game;