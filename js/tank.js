import { SETTINGS } from "./settings.js";
import {
  addEnemy,
  pauseGame,
  deleteEnemy,
  killPlayer,
  gameOver,
} from "./redux/actionCreater.js";

export class Tank {
  constructor(element, field, blocks, store, tankType) {
    this.store = store;
    this.element = element;
    this.isFire = false;
    this.field = field;
    this.isFire = false;
    this.blocks = Array.from(blocks);
    this.barrelDirection = "top";
    this.store = store;
    this.tankType = tankType;
  }

  moveUp = () => {
    this.element.style.transform = "rotate(0deg)";
    this.barrelDirection = "top";
    if (
      this.element.offsetTop > 0 &&
      this._testTankWallCollisions(this.blocks, this.barrelDirection) &&
      this._testTankWallCollisions(
        this.store.getState().enemiesTanks,
        this.barrelDirection
      ) &&
      this._testTankPlayerTankCollisions(
        this.store.getState().playerTank,
        this.barrelDirection
      )
    ) {
      this.element.style.top =
        this.element.offsetTop - SETTINGS.MOVE_SPEED + "px";
    }
  };
  moveDown = () => {
    this.element.style.transform = "rotate(180deg)";
    this.barrelDirection = "bottom";
    if (
      this.element.offsetTop < 832 &&
      this._testTankWallCollisions(this.blocks, this.barrelDirection) &&
      this._testTankWallCollisions(
        this.store.getState().enemiesTanks,
        this.barrelDirection
      ) &&
      this._testTankPlayerTankCollisions(
        this.store.getState().playerTank,
        this.barrelDirection
      )
    ) {
      this.element.style.top =
        this.element.offsetTop + SETTINGS.MOVE_SPEED + "px";
    }
  };

  moveLeft = () => {
    this.element.style.transform = "rotate(270deg)";
    this.barrelDirection = "left";
    if (
      this.element.offsetLeft > 0 &&
      this._testTankWallCollisions(this.blocks, this.barrelDirection) &&
      this._testTankWallCollisions(
        this.store.getState().enemiesTanks,
        this.barrelDirection
      ) &&
      this._testTankPlayerTankCollisions(
        this.store.getState().playerTank,
        this.barrelDirection
      )
    ) {
      this.element.style.left =
        this.element.offsetLeft - SETTINGS.MOVE_SPEED + "px";
    }
  };
  moveRight = () => {
    this.element.style.transform = "rotate(90deg)";
    this.barrelDirection = "right";
    if (
      this.element.offsetLeft < 768 &&
      this._testTankWallCollisions(this.blocks, this.barrelDirection) &&
      this._testTankWallCollisions(
        this.store.getState().enemiesTanks,
        this.barrelDirection
      ) &&
      this._testTankPlayerTankCollisions(
        this.store.getState().playerTank,
        this.barrelDirection
      )
    ) {
      this.element.style.left =
        this.element.offsetLeft + SETTINGS.MOVE_SPEED + "px";
    }
  };

  fire = () => {
    if (!this.isFire) {
      this.isFire = true;

      let bullet = document.createElement("div");
      bullet.classList.add("bullet");

      switch (this.barrelDirection) {
        case "top":
          bullet.style.left =
            this.element.offsetLeft + this.element.offsetWidth / 2 + "px";
          bullet.style.top = this.element.offsetTop - 1 + "px";
          break;
        case "bottom":
          bullet.style.left =
            this.element.offsetLeft + this.element.offsetWidth / 2 + "px";
          bullet.style.top =
            this.element.offsetTop + this.element.offsetHeight + 1 + "px";
          break;
        case "left":
          bullet.style.left = this.element.offsetLeft + 1 + "px";
          bullet.style.top =
            this.element.offsetTop + this.element.offsetHeight / 2 + "px";
          break;
        case "right":
          bullet.style.left =
            this.element.offsetLeft + this.element.offsetWidth + 1 + "px";
          bullet.style.top =
            this.element.offsetTop + this.element.offsetHeight / 2 + "px";
          break;
      }

      this.field.appendChild(bullet);

      this._poof(bullet, this.barrelDirection);
    }
  };

  _poof = (bullet, burrelDirection) => {
    let bulletPosition, maxBorder, bulletDirection;
    let minBorder = 0;
    let interval = SETTINGS.BOOLET_SPEED;

    switch (burrelDirection) {
      case "top":
        bulletPosition = bullet.offsetTop;
        bulletDirection = "top";
        maxBorder = 896;
        break;

      case "bottom":
        bulletPosition = bullet.offsetTop;
        bulletDirection = "top";
        interval *= -1;
        maxBorder = 896;
        break;

      case "left":
        bulletPosition = bullet.offsetLeft;
        bulletDirection = "left";
        maxBorder = 832;
        break;

      case "right":
        bulletPosition = bullet.offsetLeft;
        bulletDirection = "left";
        interval *= -1;
        maxBorder = 832;
        break;
    }

    if (bulletPosition > minBorder && bulletPosition < maxBorder) {
      if (!this.store.getState().isPaused) {
        bullet.style[bulletDirection] = bulletPosition - interval + "px";

        this._testBulletCollisions(bullet, this.blocks);
        this._testBulletEnemyCollisions(bullet);

        if (bullet) {
          requestAnimationFrame(() => this._poof(bullet, burrelDirection));
        } else {
          this.isFire = false;
        }
      } else {
        setTimeout(() => this._poof(bullet, burrelDirection), 17);
      }
    } else {
      bullet.remove();
      this.isFire = false;
    }
  };

  _testBulletCollisions = (bullet, blocks) => {
    blocks.forEach((element) => {
      if (this._testBulletCollision(element, bullet)) {
        element.remove();
        bullet.remove();
        this.isShoted = false;
      }
    });

    if (this._testBulletCollision(this.store.getState().EAGLE, bullet)) {
      this.store.dispatch(gameOver());
    }
  };

  _testBulletEnemyCollisions = (bullet) => {
    if (this.tankType === "player") {
      this.store.getState().enemiesTanks.forEach((element) => {
        if (this._testBulletCollision(element, bullet)) {
          this.store.dispatch(deleteEnemy(element));
          element.remove();
          bullet.remove();
          this.isShoted = false;
        }
      });
    } else {
      let player = this.store.getState().playerTank;
      if (player && this._testBulletCollision(player, bullet)) {
        this.store.dispatch(killPlayer());
        bullet.remove();
        this.isShoted = false;
      }
    }
  };

  _testBulletCollision = (element, bullet) => {
    let i = element.getBoundingClientRect();
    let j = bullet.getBoundingClientRect();

    return (
      i.top + i.height > j.top &&
      i.left + i.width > j.left &&
      i.bottom - i.height < j.bottom &&
      i.right - i.width < j.right
    );
  };

  _testTankWallCollisions = (blocks, direction) => {
    let isColission = true;
    blocks.forEach((element) => {
      if (this._testTankCollision(element, direction)) {
        isColission = false;
      }
    });
    return isColission;
  };

  _testTankPlayerTankCollisions = (element, direction) => {
    let isColission = true;

    if (this._testTankCollision(element, direction)) {
      isColission = false;
    }

    return isColission;
  };

  _testTankCollision = (block, direction) => {
    let tank = this.element.getBoundingClientRect();
    let wall = block.getBoundingClientRect();

    switch (direction) {
      case "left":
        if (
          tank.left == wall.right &&
          tank.top < wall.bottom &&
          tank.bottom > wall.top
        ) {
          return true;
        }
        break;
      case "right":
        if (
          tank.right == wall.left &&
          tank.top < wall.bottom &&
          tank.bottom > wall.top
        ) {
          return true;
        }
        break;
      case "top":
        if (
          tank.top == wall.bottom &&
          tank.left < wall.right &&
          tank.right > wall.left
        ) {
          return true;
        }
        break;
      case "bottom":
        if (
          tank.bottom == wall.top &&
          tank.left < wall.right &&
          tank.right > wall.left
        ) {
          return true;
        }
        break;
    }
  };
}
