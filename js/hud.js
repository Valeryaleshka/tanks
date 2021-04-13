function displayLives(count) {
  let playersLives = document.getElementById("players_lives_count");
  playersLives.innerHTML = "";
  let live = document.createElement("div");
  live.classList.add("players_lives_count_item");

  for (let i = 0; i < count; i++) {
    playersLives.appendChild(live.cloneNode());
  }
}

function displayEnemies(count) {
  let enemyCount = document.getElementById("enemies_count");
  enemyCount.innerHTML = "";
  let live = document.createElement("div");
  live.classList.add("enemies_count_item");

  for (let i = 0; i < count; i++) {
    enemyCount.appendChild(live.cloneNode());
  }
}

function displayHud(store) {
  displayEnemies(store.getState().enemiesCount);
  displayLives(store.getState().lives);
}

export { displayHud };
