function formatNumber(num) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + "B";
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else {
    return num.toLocaleString();
  }
}

let score = 0;
let baseCookies = 1;
let upgrade1 = 0;
let upgrade2 = 0;
let upgrade3 = 0;
let upgrade4 = 0;
let upgrade5 = 0;

function loadGame() {
  score     = parseFloat(localStorage.getItem("score"))    || 0;
  upgrade1  = parseFloat(localStorage.getItem("upgrade1")) || 0;
  upgrade2  = parseFloat(localStorage.getItem("upgrade2")) || 0;
  upgrade3  = parseFloat(localStorage.getItem("upgrade3")) || 0;
  upgrade4  = parseFloat(localStorage.getItem("upgrade4")) || 0;
  upgrade5  = parseFloat(localStorage.getItem("upgrade5")) || 0;
  updateDisplay();
}

function saveGame() {
  localStorage.setItem("score",    score);
  localStorage.setItem("upgrade1", upgrade1);
  localStorage.setItem("upgrade2", upgrade2);
  localStorage.setItem("upgrade3", upgrade3);
  localStorage.setItem("upgrade4", upgrade4);
  localStorage.setItem("upgrade5", upgrade5);
}

function getCPC() {
  return baseCookies + upgrade1 + upgrade2 + upgrade3 + upgrade4 + upgrade5;
}

function updateDisplay() {
  document.getElementById("score").innerText = "Cookies: " + formatNumber(score);
  document.getElementById("cpc").innerText = "Cookies per click: " + formatNumber(getCPC());
}

function addPoint() {
  score = score + getCPC();
  updateDisplay();
  saveGame();
}

function addUpgrade1() {
  if (score >= 10) {
    score = score - 10;
    upgrade1 = upgrade1 + 1;
    updateDisplay();
    saveGame();
  }
}

function addUpgrade2() {
  if (score >= 100) {
    score = score - 100;
    upgrade2 = upgrade2 + 5;
    updateDisplay();
    saveGame();
  }
}

function addUpgrade3() {
  if (score >= 500) {
    score = score - 500;
    upgrade3 = upgrade3 + 20;
    updateDisplay();
    saveGame();
  }
}

function addUpgrade4() {
  if (score >= 2000) {
    score = score - 2000;
    upgrade4 = upgrade4 + 100;
    updateDisplay();
    saveGame();
  }
}

function addUpgrade5() {
  if (score >= 10000) {
    score = score - 10000;
    upgrade5 = upgrade5 + 500;
    updateDisplay();
    saveGame();
  }
}

function reset() {
  score = 0;
  upgrade1 = 0;
  upgrade2 = 0;
  upgrade3 = 0;
  upgrade4 = 0;
  upgrade5 = 0;
  localStorage.clear();
  updateDisplay();
}

loadGame();
