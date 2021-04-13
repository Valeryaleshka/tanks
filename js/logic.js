import { MAP_LEGEND, LEVEL1 } from "./map.js";

function initGameField(gameField) {
  let posX = 0;
  let posY = 0;

  for (let subArr of LEVEL1) {
    for (let elemType of subArr) {
      let element = createGameElement(elemType);
      element.style.top = posY + "px";
      element.style.left = posX + "px";
      gameField.appendChild(element);
      if (posX > 767) {
        posX = 0;
        posY = posY + 64;
      } else {
        posX = posX + 64;
      }
    }
  }
}

function createGameElement(elemType) {
  let div = document.createElement("div");
  div.classList.add("game-object");

  if (elemType === MAP_LEGEND.PLAYER_BASE) {
    div.classList.add("game-object__player-tank");
  }
  if (elemType === MAP_LEGEND.ENEMY_BASE) {
    div.classList.add("game-object__enemy-tank");
  }
  if (elemType === MAP_LEGEND.WALL) {
    div.classList.add("game-object__wall");
  }
  if (elemType === MAP_LEGEND.EAGLE) {
    div.classList.add("game-object__eagle");
    div.id = "game-object__eagle";
  }
  return div;
}

export { initGameField };
