import {
  PAUSE,
  ADD_ENEMY,
  DELETE_ENEMY,
  ADD_PLAYER,
  KILL_PLAYER,
  ADD_EAGLE,
  GAME_OVER,
} from "./types.js";

export function pauseGame() {
  return {
    type: PAUSE,
  };
}
export function deleteEnemy(enemy) {
  return {
    type: DELETE_ENEMY,
    tank: enemy,
  };
}
export function addEnemy(enemy) {
  return {
    type: ADD_ENEMY,
    tank: enemy,
  };
}
export function addPlayer(tank) {
  return {
    type: ADD_PLAYER,
    tank: tank,
  };
}
export function killPlayer() {
  return {
    type: KILL_PLAYER,
  };
}
export function addEagle(eagle) {
  return {
    type: ADD_EAGLE,
    eagle: eagle,
  };
}
export function gameOver() {
  return {
    type: GAME_OVER,
  };
}
