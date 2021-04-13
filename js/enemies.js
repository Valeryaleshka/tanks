import { Tank } from "./tank.js";
import { addEnemy } from "./redux/actionCreater.js";

export function enemies(field, blocks, store) {
  const enemyPositions = [0, 384, 768];
  let count = 0;
  return {
    createEnemy() {
      let newTank = document.createElement("div");
      newTank.classList.add("game-object");
      newTank.classList.add("game-object__enemy-tank");
      newTank.style.transform = "rotate(180deg)";
      newTank.style.left = enemyPositions[count % 3] + "px";
      newTank.style.top = "0px";
      count++;
      field.appendChild(newTank);
      store.dispatch(addEnemy(newTank));
      let enemyTank = new Tank(newTank, field, blocks, store, "enemy");
      this._enemyMove(enemyTank);
      let b = setInterval(() => {
        let isTank = store
          .getState()
          .enemiesTanks.filter((elem) => elem === newTank);

        if (isTank.length < 1) {
          clearInterval(b);
        }
        if (!store.getState().isPaused) {
          this._enemyMove(enemyTank);
        }
      }, 1000);
    },

    _enemyMove(tank) {
      let moveNumber = Math.floor(Math.random() * 4);
      let fireNumber = 0; //Math.floor(Math.random() * 2);
      let counter = 0;
      let interval = 30;
      let maxCounter = 30;

      switch (moveNumber) {
        case 0:
          let up = setInterval(() => {
            if (counter > maxCounter) {
              clearInterval(up);
            }
            if (!store.getState().isPaused) {
              requestAnimationFrame(() => tank.moveUp(tank));
              counter++;
            }
          }, interval);

          break;
        case 1:
          let down = setInterval(() => {
            if (counter > maxCounter) {
              clearInterval(down);
            }
            if (!store.getState().isPaused) {
              requestAnimationFrame(() => tank.moveDown(tank));
              counter++;
            }
          }, interval);

          break;
        case 2:
          let left = setInterval(() => {
            if (counter > maxCounter) {
              clearInterval(left);
            }
            if (!store.getState().isPaused) {
              requestAnimationFrame(() => tank.moveLeft(tank));
              counter++;
            }
          }, interval);

          break;
        case 3:
          let right = setInterval(() => {
            if (counter > maxCounter) {
              clearInterval(right);
            }
            if (!store.getState().isPaused) {
              requestAnimationFrame(() => tank.moveRight(tank));
              counter++;
            }
          }, interval);
          break;
      }

      if (
        fireNumber === 0 &&
        store.getState().enemiesTanks.includes(tank.element)
      ) {
        tank.fire();
      }
    },
  };
}
