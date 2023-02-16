/* eslint-disable indent */
import settings from './settings.js';
class pathfinderGame {
  constructor() {
    const thisGame = this;
    thisGame.activeTiles = [];
    thisGame.stage = 1;
    thisGame.startTile = null;
    thisGame.endTile = null;
    thisGame.size = 10;
    thisGame.getElements();
    thisGame.createBoard(thisGame.size, thisGame.size);
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
    thisGame.dom.button = container.querySelector(settings.select.gameButton);
  }

  initActions() {
    const thisGame = this;

    // handle click tile
    thisGame.dom.board.addEventListener('click', function (event) {
      const clickedElement = event.target;
      thisGame.handleBoardClick(clickedElement);
    });
    // handle click button
    thisGame.dom.button.addEventListener('click', function () {
      thisGame.handleButtonClick();
    });
  }

  activeTileSearch(tile) {
    const thisGame = this;
    const coords = [];
    // check square with tiles around and with this tile
    for (let rowPos = -1; rowPos < 2; rowPos++) {
      for (let colPos = -1; colPos < 2; colPos++) {
        // skip this tile
        if (rowPos === 0 && colPos === 0) {
          continue;
        }
        const tilePosRow = parseInt(tile.dataset.row) + rowPos;
        const tilePosCol = parseInt(tile.dataset.column) + colPos;
        if (
          // avoid borders
          tilePosRow > thisGame.size ||
          tilePosRow < 1 ||
          tilePosCol > thisGame.size ||
          tilePosCol < 1
        ) {
          continue;
        } else if (
          thisGame.gameBoardTiles[tilePosRow][tilePosCol].classList.contains(
            settings.classNames.activeTile
          )
        ) {
          // if active add
          coords.push(thisGame.gameBoardTiles[tilePosRow][tilePosCol]);
        }
      }
    }
    if (coords.length > 0) {
      // return object as truthy value for checking or array with nearest active tiles columns and rows
      return coords;
    } else {
      return false;
    }
  }

  searchRoute() {
    const thisGame = this;
    // add start as first to calculate cost of tiles around
    thisGame.startTile.dataset.cost = 0;
    let firstNextCost = 1;
    const firstCalculatedTiles = [];
    const firstTilesToCheck = [];
    firstCalculatedTiles.push(thisGame.startTile);
    thisGame.startTile.classList.add(settings.classNames.calculatedTile);

    // calculate tiles
    const calculatePath = function (calculatedTiles, tilesToCheck, nextCost) {
      for (const currentTile of calculatedTiles) {
        const adjacentTiles = [];
        // check if end tile is reached or if tile was calculated
        for (const adjacentTile of thisGame.activeTileSearch(currentTile) ||
          []) {
          if (adjacentTile === thisGame.endTile) {
            thisGame.endTile.classList.add(settings.classNames.solvedTile);
            return;
          } else if (
            !adjacentTile.classList.contains(settings.classNames.calculatedTile)
          ) {
            adjacentTiles.push(adjacentTile);
          }
        }
        tilesToCheck.push(...adjacentTiles);
      }
      // add current cost to tiles around last ones
      for (const tile of tilesToCheck) {
        tile.dataset.cost = nextCost;
        tile.classList.add(settings.classNames.calculatedTile);
      }
      // empty tiles to check and add checked tiles to calculated, increment cost
      nextCost += 1;
      calculatedTiles.splice(0, calculatedTiles.length, ...tilesToCheck);
      tilesToCheck.splice(0, tilesToCheck.length);
      calculatePath(calculatedTiles, firstTilesToCheck, nextCost);
    };
    // check next until endTile
    calculatePath(firstCalculatedTiles, firstTilesToCheck, firstNextCost);

    // set high cost for end tile, set endTile as optimal
    let firstOptimalTile = thisGame.endTile;
    thisGame.endTile.dataset.cost = 99999;
    const searchShortest = function (optimalTile) {
      const adjacentTiles = [];
      // if startTile is touched add class solved to startTile and finish else add calculated tiles
      for (const adjacentTile of thisGame.activeTileSearch(optimalTile) || []) {
        if (adjacentTile === thisGame.startTile) {
          thisGame.startTile.classList.add(settings.classNames.solvedTile);
          return;
        } else if (
          adjacentTile.classList.contains(settings.classNames.calculatedTile)
        ) {
          adjacentTiles.push(adjacentTile);
        }
      }
      // check adjacent tiles around optimal if cost is less if it is make it new optimal tile
      for (const tile of adjacentTiles) {
        if (parseInt(tile.dataset.cost) < parseInt(optimalTile.dataset.cost)) {
          optimalTile = tile;
        }
      }
      // add class solved check next tiles
      optimalTile.classList.add(settings.classNames.solvedTile);
      searchShortest(optimalTile);
    };
    searchShortest(firstOptimalTile);
  }

  startEndSelect(targetTile) {
    const thisGame = this;
    // check if there is end or start tile and if they are clicked
    if (!thisGame.startTile && targetTile != thisGame.endTile) {
      targetTile.classList.add(settings.classNames.startTile);
      thisGame.startTile = targetTile;
      return;
    } else if (thisGame.startTile === targetTile) {
      thisGame.startTile.classList.remove(settings.classNames.startTile);
      thisGame.startTile = null;
      return;
    } else if (thisGame.startTile && !thisGame.endTile) {
      targetTile.classList.add(settings.classNames.endTile);
      thisGame.endTile = targetTile;
      return;
    } else if (thisGame.endTile === targetTile) {
      thisGame.endTile.classList.remove(settings.classNames.endTile);
      thisGame.endTile = null;
    }
  }

  handleBoardClick(tile) {
    const thisGame = this;
    const cutItervalCallback = function () {
      thisGame.endTile.innerHTML = '';
      thisGame.endTile.classList.remove(settings.classNames.endTile);
      thisGame.endTile = null;
    };
    // check if argument is tile element with class tile
    if (tile.classList.contains(settings.classNames.tile)) {
      // check if some tile have interval for cut and it wasn't cut, initiate it faster
      if (
        thisGame.endTile &&
        thisGame.stage === 1 &&
        thisGame.endTile != tile
      ) {
        cutItervalCallback();
      }
      // check if there are adjacent active tiles or it's the first one
      const adjacents = thisGame.activeTileSearch(tile);
      // if no active or there are adjacent or there is one left for delete
      if (
        adjacents ||
        thisGame.activeTiles.length === 0 ||
        (thisGame.activeTiles.length === 1 &&
          tile.classList.contains(settings.classNames.activeTile))
      ) {
        switch (thisGame.stage) {
          case 1:
            // if tile don't have class active add active and push to active tiles array
            if (!tile.classList.contains(settings.classNames.activeTile)) {
              tile.classList.add(settings.classNames.activeTile);
              thisGame.activeTiles.push(tile);
              // if clicked tile is active
            } else {
              // check if path is cut
              let split = false;
              // remove class so current tile won't be traversed
              tile.classList.remove(settings.classNames.activeTile);
              // select one of two adjacent tiles add for traversing
              const traversedTiles = [
                thisGame.activeTileSearch(tile)
                  ? thisGame.activeTileSearch(tile)[0]
                  : tile,
              ];
              const compareArr = [...traversedTiles];
              // check active tiles length time to be sure that all tiles will be traversed at least once
              while (compareArr.length != 0) {
                compareArr.splice(0, compareArr.length, ...traversedTiles);
                // add adjacent tiles to traversed if they aren't added there already
                for (const toTraverse of compareArr) {
                  for (const adjacentTile of thisGame.activeTileSearch(
                    toTraverse
                  ) || []) {
                    if (!traversedTiles.includes(adjacentTile)) {
                      traversedTiles.push(adjacentTile);
                    }
                  }
                }
                // check only tiles that wasn't already traversed
                compareArr.splice(
                  0,
                  compareArr.length,
                  ...traversedTiles.filter(function (t) {
                    return !compareArr.includes(t);
                  })
                );
              }

              // add active class back to clicked tile
              tile.classList.add(settings.classNames.activeTile);

              // add tile to travesed so we can check if there are more cut active tiles or both lengths are same
              traversedTiles.push(tile);

              // check if traversed length is less than activeTiles length
              console.log(
                'traversed: ',
                traversedTiles,
                'active: ',
                thisGame.activeTiles
              );
              if (traversedTiles.length < thisGame.activeTiles.length) {
                split = true;
              }

              if (!split) {
                // if path is not split remove this tile
                tile.classList.remove(settings.classNames.activeTile);
                const index = thisGame.activeTiles.indexOf(tile);
                thisGame.activeTiles.splice(index, 1);
              } else {
                // remove prompt
                if (tile.classList.contains(settings.classNames.endTile)) {
                  tile.classList.remove(settings.classNames.endTile);
                  tile.innerHTML = '';
                  // if traversedTiles to cut have more tiles then cut smaller half of all active tiles
                  if (traversedTiles.length > thisGame.activeTiles.length / 2) {
                    traversedTiles.splice(
                      0,
                      traversedTiles.length,
                      ...thisGame.activeTiles.filter(function (t) {
                        return !traversedTiles.includes(t);
                      })
                    );
                    // add current tile as it is in both and was filtered
                    traversedTiles.push(tile);
                  }
                  for (const arrayTile of traversedTiles) {
                    // remove cut part of path
                    arrayTile.classList.remove(settings.classNames.activeTile);
                    const index = thisGame.activeTiles.indexOf(arrayTile);
                    thisGame.activeTiles.splice(index, 1);
                  }
                } else {
                  // give prompt if removing tile will cut path
                  tile.innerHTML = '<p>click again to cut path</p>';
                  tile.classList.add(settings.classNames.endTile);
                  thisGame.endTile = tile;
                  setTimeout(cutItervalCallback, 3000);
                }
              }
            }
            break;
          case 2:
            // set start and end tile on active one
            if (tile.classList.contains(settings.classNames.activeTile)) {
              thisGame.startEndSelect(tile);
            }
            break;
        }
      }
    }
  }

  handleButtonClick() {
    const thisGame = this;
    // texts for heading
    const texts = [
      'draw routes',
      'pick start and finish',
      'the best route is...',
    ];
    switch (thisGame.stage) {
      // finish drawing if there is more than 3 tiles, change text if not set text for current stage after timeout
      case 1:
        if (thisGame.activeTiles.length < 3) {
          thisGame.dom.text.innerText = 'select more tiles';
          setTimeout(function () {
            thisGame.dom.text.innerText = texts[thisGame.stage - 1];
          }, 3000);
        } else {
          thisGame.dom.text.innerText = 'pick start and finish';
          thisGame.dom.button.innerText = 'compute';
          thisGame.stage = 2;
        }
        break;
      // as the above but condition is start and end tile
      case 2:
        if (thisGame.startTile && thisGame.endTile) {
          thisGame.dom.text.innerText = 'the best route is...';
          thisGame.dom.button.innerText = 'finish';
          thisGame.searchRoute();
          thisGame.stage = 3;
        } else {
          thisGame.dom.text.innerText = 'you need two points';
          setTimeout(function () {
            thisGame.dom.text.innerText = texts[thisGame.stage - 1];
          }, 3000);
        }
        break;
      // finish game
      case 3:
        for (const tile of thisGame.activeTiles) {
          tile.className = '';
          tile.classList.add(settings.classNames.tile);
          thisGame.dom.text.innerText = 'draw routes';
          thisGame.dom.text.innerText = 'finish drawing';
        }
        thisGame.startTile = null;
        thisGame.endTile = null;
        thisGame.activeTiles.splice(0, thisGame.activeTiles.length);
        thisGame.stage = 1;
        break;
    }
  }
}

export default pathfinderGame;
