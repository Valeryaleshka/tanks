export function rootReducer(state, action) {
  if (action.type === "PAUSE") {
    let pause = document.querySelector(".paused_screen");
    pause.classList.toggle("hiden");
    return { ...state, isPaused: !state.isPaused };
  }

  if (action.type === "ADD_ENEMY") {
    let temp = state.enemiesTanks.slice(0);
    temp.push(action.tank);

    return { ...state, enemiesTanks: temp };
  }

  if (action.type === "ADD_PLAYER") {
    return { ...state, playerTank: action.tank };
  }

  if (action.type === "KILL_PLAYER") {
    let temp = state.playerTank;
    temp.style.top = "832px";
    temp.style.left = "256px";

    let currentLives = state.lives - 1;

    if (currentLives === 0) {
      alert("gameOver");
      window.location.reload();
      return { ...state, isPaused: true };
    } else {
      return { ...state, playerTank: temp, lives: currentLives };
    }
  }

  if (action.type === "DELETE_ENEMY") {
    let temp = state.enemiesTanks
      .slice(0)
      .filter((elem) => elem !== action.tank);

    return {
      ...state,
      enemiesTanks: temp,
      enemiesCount: state.enemiesCount - 1,
    };
  }

  if (action.type === "INIT") {
    return {
      isPaused: false,
      enemiesTanks: [],
      enemiesCount: 21,
      playerTank: null,
      lives: 3,
      IS_GAME_OVER: false,
      EAGLE: null,
    };
  }

  if (action.type === "ADD_EAGLE") {
    return { ...state, EAGLE: action.eagle };
  }
  if (action.type === "GAME_OVER") {
    return { ...state, IS_GAME_OVER: true };
  }
}
