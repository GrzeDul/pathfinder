import settings from './settings.js';
class pathfinderGame {
  constructor() {
    const thisGame = this;
    thisGame.previousTiles = [];
    thisGame.getElements();
    thisGame.createBoard(10, 10);
    thisGame.initActions();
  }

  createBoard(rows, columns) {
    const thisGame = this;
    // set game board width
    thisGame.dom.board.style.width =
      columns * settings.attribute.tileWidth + 'px';
    // check if rows and colums can create even board
    thisGame.gameBoardTiles = {};
    for (let x = 1; x <= rows; x++) {
      thisGame.gameBoardTiles[x] = {};
      for (let y = 1; y <= columns; y++) {
        const element = document.createElement('div');
        element.classList.add(settings.classNames.tile);
        // add coordinates
        element.dataset.row = x.toString();
        element.dataset.column = y.toString();
        // add listener
        thisGame.gameBoardTiles[x][y] = element;
        thisGame.dom.board.appendChild(element);
      }
    }
  }

  getElements() {
    const thisGame = this;
    thisGame.dom = {};
    const container = document.querySelector(settings.select.gameContainer);
    thisGame.dom.text = container.querySelector(settings.select.gameText);
    thisGame.dom.board = container.querySelector(settings.select.gameBoard);
  }

  initActions() {
    const thisGame = this;

    const pickStarEnd = false;
    thisGame.dom.board.addEventListener('click', function (event) {
      if (pickStarEnd) {
        // add start and end choosing functionality
      } else {
        if (event.target.classList.contains(settings.classNames.tile)) {
          event.target.classList.add(settings.classNames.activeTile);
          thisGame.previousTiles.push(event.target);
        } else {
          event.target.classList.remove(settings.classNames.activeTile);
        }
      }
    });
  }
}

export default pathfinderGame;
