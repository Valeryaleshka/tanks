import { initGameField } from "./logic.js";
import { KEYBOARD } from "./keyboard.js";
import { Tank } from "./tank.js";
import { createStore } from "./redux/createStore.js";
import { rootReducer } from "./redux/rootReducer.js";

import { addPlayer, pauseGame, addEagle } from "./redux/actionCreater.js";
import { enemies } from "./enemies.js";
import { displayHud } from "./hud.js";

let KEYPRESSED = [];
let PRESSEDSPACE = [];
let store = createStore(rootReducer);

/**
 * в этой функции можно выполнить весь тот код, который необходим для старта игры
 * например, именно в этом месте можно нарисовать блоки стен на карте и подписаться на события нажатия кнопок управления
 */
gameInitialization();

let playerTank = document.querySelector(
  "#game-map > div.game-object.game-object__player-tank"
);

let eagle = document.getElementById("game-object__eagle");

let walls = document.getElementsByClassName("game-object__wall");

let player = new Tank(
  playerTank,
  document.getElementById("game-map"),
  walls,
  store,
  "player"
);

let enemy = enemies(document.getElementById("game-map"), walls, store);
store.dispatch(addPlayer(playerTank));
store.dispatch(addEagle(eagle));

gameLoop();

function gameInitialization() {
  initGameField(document.getElementById("game-map"));
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
  window.addEventListener("focus", () => store.dispatch(pauseGame()));
  window.addEventListener("blur", () => store.dispatch(pauseGame()));
  store.subscribe(() => displayHud(store));
}

function gameLoop() {
  if (!store.getState().IS_GAME_OVER && !store.getState().isPaused) {
    gameStep();
    requestAnimationFrame(gameLoop);
  }
  if (!store.getState().IS_GAME_OVER && store.getState().isPaused) {
    let a = setTimeout(gameLoop, 50);
  }
  if (store.getState().IS_GAME_OVER) {
  }
}

function gameStep() {
  if (
    store.getState().enemiesTanks.length < 3 &&
    store.getState().enemiesCount > 2
  ) {
    enemy.createEnemy();
  }
  if (KEYPRESSED.length > 0) {
    switch (KEYPRESSED[KEYPRESSED.length - 1]) {
      case KEYBOARD.KEY_A:
        player.moveLeft();
        break;
      case KEYBOARD.KEY_W:
        player.moveUp();
        break;
      case KEYBOARD.KEY_S:
        player.moveDown();
        break;
      case KEYBOARD.KEY_D:
        player.moveRight();
        break;
    }
  }
  if (PRESSEDSPACE.length > 0) {
    player.fire();
  }
}

function handleKeyDown(e) {
  if (
    e.keyCode === KEYBOARD.KEY_A ||
    e.keyCode === KEYBOARD.KEY_D ||
    e.keyCode === KEYBOARD.KEY_W ||
    e.keyCode === KEYBOARD.KEY_S
  ) {
    let index = KEYPRESSED.indexOf(e.keyCode);
    if (index === -1) {
      KEYPRESSED.push(e.keyCode);
    }
  }
  if (e.keyCode === KEYBOARD.KEY_SPACE) {
    let index = PRESSEDSPACE.indexOf(e.keyCode);
    if (index === -1) {
      PRESSEDSPACE.push(e.keyCode);
    }
  }
  if (e.keyCode === KEYBOARD.KEY_P) {
    store.dispatch(pauseGame());
  }
}

function handleKeyUp(e) {
  if (
    e.keyCode === 87 ||
    e.keyCode === 83 ||
    e.keyCode === 65 ||
    e.keyCode === 68
  ) {
    let index = KEYPRESSED.indexOf(e.keyCode);
    if (index > -1) {
      KEYPRESSED.splice(index, 1);
    }
  }
  if (e.keyCode === 32) {
    let index = PRESSEDSPACE.indexOf(e.keyCode);
    if (index > -1) {
      PRESSEDSPACE.splice(index, 1);
    }
  }
}
