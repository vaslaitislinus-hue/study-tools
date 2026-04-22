const toolTitle = document.querySelector("#toolTitle");
const navItems = document.querySelectorAll(".nav-item");
const panels = document.querySelectorAll(".tool-panel");

const calcDisplay = document.querySelector("#calcDisplay");
const calcKeys = document.querySelector(".calc-keys");
const clearCalculator = document.querySelector("#clearCalculator");
const clearHistory = document.querySelector("#clearHistory");
const calcHistory = document.querySelector("#calcHistory");

const textInput = document.querySelector("#textInput");
const clearText = document.querySelector("#clearText");
const lastOpened = document.querySelector("#lastOpened");
const textStatus = document.querySelector("#textStatus");
const wordTotal = document.querySelector("#wordTotal");
const charTotal = document.querySelector("#charTotal");
const sentenceTotal = document.querySelector("#sentenceTotal");
const readingTime = document.querySelector("#readingTime");

const unitCategory = document.querySelector("#unitCategory");
const unitValue = document.querySelector("#unitValue");
const fromUnit = document.querySelector("#fromUnit");
const toUnit = document.querySelector("#toUnit");
const resetConverter = document.querySelector("#resetConverter");
const conversionResult = document.querySelector("#conversionResult");
const commonConversions = document.querySelector("#commonConversions");
const arcadeScreen = document.querySelector("#arcadeScreen");
const closeArcade = document.querySelector("#closeArcade");
const gameSearch = document.querySelector("#gameSearch");
const categoryTabs = document.querySelector("#categoryTabs");
const gameGrid = document.querySelector("#gameGrid");
const gameBrowser = document.querySelector("#gameBrowser");
const gamePlayer = document.querySelector("#gamePlayer");
const activeGameCategory = document.querySelector("#activeGameCategory");
const activeGameTitle = document.querySelector("#activeGameTitle");
const gameFrame = document.querySelector("#gameFrame");
const closeGame = document.querySelector("#closeGame");
const fullscreenGame = document.querySelector("#fullscreenGame");

let expression = "";
let justEvaluated = false;
let history = [];
let secretBuffer = "";
let games = [];
let activeCategory = "All";

const fallbackGames = [
  {
    id: "bloxd",
    title: "Bloxd.io",
    category: "Minecraft",
    thumb: "https://imgs.crazygames.com/games/bloxdhop-io/cover_16x9-1709115453824.png?metadata=none&quality=80&width=675&fit=crop&dpr=1",
    url: "https://bloxd.io",
    status: "live",
    layout: "hero",
  },
  {
    id: "slope",
    title: "Slope",
    category: "Arcade",
    thumb: "assets/games/slope.jpeg",
    url: "games/slope/index.html",
    status: "live",
    layout: "wide",
  },
  {
    id: "2048",
    title: "2048",
    category: "Puzzle",
    thumb: "assets/games/2048.svg",
    url: "games/2048/index.html",
    status: "live",
  },
  {
    id: "hextris",
    title: "Hextris",
    category: "Puzzle",
    thumb: "assets/games/hextris.png",
    url: "https://hextris.github.io/hextris/",
    status: "live",
  },
  {
    id: "clumsy-bird",
    title: "Clumsy Bird",
    category: "Arcade",
    thumb: "assets/games/clumsy-bird.png",
    url: "games/clumsy-bird/index.html",
    status: "live",
  },
  {
    id: "radius-raid",
    title: "Radius Raid",
    category: "Shooter",
    thumb: "assets/games/radius-raid.jpeg",
    url: "games/radius-raid/index.html",
    status: "live",
    layout: "wide",
  },
  {
    id: "snake",
    title: "Flexi Snake",
    category: "Classic",
    thumb: "https://static.gamezop.com/SkQwnwnbK/cover.jpg",
    url: "https://zv1y2i8p.play.gamezop.com/g/SkQwnwnbK",
    status: "live",
  },
  {
    id: "tic-tac-toe",
    title: "Tic Tac Toe",
    category: "Classic",
    thumb: "assets/games/tic-tac-toe.png",
    url: "games/tic-tac-toe/index.html",
    status: "live",
  },
  {
    id: "clicker",
    title: "Clicker",
    category: "Clicker",
    thumb: "assets/games/clicker.svg",
    url: "games/clicker/index.html",
    status: "live",
  },
  {
    id: "memory",
    title: "Memory Match",
    category: "Puzzle",
    thumb: "assets/games/memory.png",
    url: "games/memory/index.html",
    status: "live",
  },
];

function getStoredValue(key, fallback = "") {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

function setStoredValue(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // The tools still work if storage is unavailable.
  }
}

function removeStoredValue(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // The tools still work if storage is unavailable.
  }
}

try {
  history = JSON.parse(getStoredValue("studyToolsHistory", "[]"));
} catch {
  history = [];
  removeStoredValue("studyToolsHistory");
}

const toolNames = {
  calculator: "Calculator",
  "word-count": "Word Count",
  "unit-converter": "Unit Converter",
};

const unitData = {
  length: {
    base: "meter",
    units: {
      millimeter: 0.001,
      centimeter: 0.01,
      meter: 1,
      kilometer: 1000,
      inch: 0.0254,
      foot: 0.3048,
      yard: 0.9144,
      mile: 1609.344,
    },
    common: [
      ["1 meter", "meter", "centimeter", 1],
      ["1 inch", "inch", "centimeter", 1],
      ["1 mile", "mile", "kilometer", 1],
    ],
  },
  mass: {
    base: "gram",
    units: {
      milligram: 0.001,
      gram: 1,
      kilogram: 1000,
      ounce: 28.349523125,
      pound: 453.59237,
    },
    common: [
      ["1 kilogram", "kilogram", "pound", 1],
      ["1 pound", "pound", "kilogram", 1],
      ["100 grams", "gram", "ounce", 100],
    ],
  },
  temperature: {
    base: "celsius",
    units: {
      celsius: "celsius",
      fahrenheit: "fahrenheit",
      kelvin: "kelvin",
    },
    common: [
      ["0 Celsius", "celsius", "fahrenheit", 0],
      ["32 Fahrenheit", "fahrenheit", "celsius", 32],
      ["273.15 Kelvin", "kelvin", "celsius", 273.15],
    ],
  },
};

function setLastOpened() {
  const now = new Date();
  lastOpened.textContent = now.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function showTool(toolId) {
  navItems.forEach((item) => {
    item.classList.toggle("active", item.dataset.tool === toolId);
  });

  panels.forEach((panel) => {
    panel.classList.toggle("active", panel.id === toolId);
  });

  toolTitle.textContent = toolNames[toolId] || "Study Tools";
}

function openArcadeScreen() {
  arcadeScreen.classList.remove("is-hidden");
  secretBuffer = "";
  renderGameLibrary();
  gameSearch.focus();
}

function closeArcadeScreen() {
  arcadeScreen.classList.add("is-hidden");
  secretBuffer = "";
  closeGamePlayer();
}

function isTypingInField(target) {
  return ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

function updateDisplay(value = expression) {
  calcDisplay.textContent = value || "0";
}

function renderHistory() {
  calcHistory.innerHTML = "";

  if (!history.length) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "No calculations yet";
    calcHistory.append(emptyItem);
    return;
  }

  history.slice(0, 5).forEach((entry) => {
    const item = document.createElement("li");
    item.textContent = entry;
    calcHistory.append(item);
  });
}

function saveHistory(entry) {
  history = [entry, ...history].slice(0, 5);
  setStoredValue("studyToolsHistory", JSON.stringify(history));
  renderHistory();
}

function appendValue(value) {
  if (justEvaluated && /\d|\./.test(value)) {
    expression = "";
  }

  justEvaluated = false;

  if (value === "." && expression.split(/[+\-*/%]/).pop().includes(".")) {
    return;
  }

  if (/^[+*/%]$/.test(value) && (!expression || /[+\-*/%]$/.test(expression))) {
    return;
  }

  if (value === "-" && /-$/.test(expression)) {
    return;
  }

  expression += value;
  updateDisplay();
}

function calculate() {
  if (!expression || /[+\-*/%]$/.test(expression)) {
    return;
  }

  try {
    const originalExpression = expression;
    const result = Function(`"use strict"; return (${expression})`)();
    expression = Number.isFinite(result) ? String(Number(result.toFixed(10))) : "";
    updateDisplay(expression || "Error");
    if (expression) {
      saveHistory(`${originalExpression} = ${expression}`);
    }
    justEvaluated = true;
  } catch {
    expression = "";
    updateDisplay("Error");
    justEvaluated = true;
  }
}

function clearCalc() {
  expression = "";
  justEvaluated = false;
  updateDisplay();
}

function backspace() {
  expression = expression.slice(0, -1);
  updateDisplay();
}

function updateWordStats() {
  const text = textInput.value.trim();
  const words = text.match(/\b[\w'-]+\b/g) || [];
  const sentences = text.match(/[^.!?]+[.!?]+/g) || (text ? [text] : []);
  const minutes = words.length ? Math.max(1, Math.ceil(words.length / 220)) : 0;

  wordTotal.textContent = words.length;
  charTotal.textContent = textInput.value.length;
  sentenceTotal.textContent = sentences.length;
  readingTime.textContent = `${minutes} min`;
}

function formatUnitName(unit, value) {
  const labels = {
    celsius: "Celsius",
    fahrenheit: "Fahrenheit",
    kelvin: "Kelvin",
  };

  if (labels[unit]) {
    return labels[unit];
  }

  if (Math.abs(value) === 1) {
    return unit;
  }

  if (unit.endsWith("s")) {
    return unit;
  }

  return `${unit}s`;
}

function formatNumber(value) {
  if (!Number.isFinite(value)) {
    return "0";
  }

  return Number(value.toFixed(6)).toLocaleString(undefined, {
    maximumFractionDigits: 6,
  });
}

function convertTemperature(value, from, to) {
  let celsius = value;

  if (from === "fahrenheit") {
    celsius = (value - 32) * (5 / 9);
  } else if (from === "kelvin") {
    celsius = value - 273.15;
  }

  if (to === "fahrenheit") {
    return celsius * (9 / 5) + 32;
  }

  if (to === "kelvin") {
    return celsius + 273.15;
  }

  return celsius;
}

function convertUnits(value, category, from, to) {
  if (category === "temperature") {
    return convertTemperature(value, from, to);
  }

  const units = unitData[category].units;
  return (value * units[from]) / units[to];
}

function updateConverter() {
  const category = unitCategory.value;
  const value = Number.parseFloat(unitValue.value);

  if (!Number.isFinite(value)) {
    conversionResult.textContent = "Enter a number to convert";
    return;
  }

  const result = convertUnits(value, category, fromUnit.value, toUnit.value);
  const fromLabel = formatUnitName(fromUnit.value, value);
  const toLabel = formatUnitName(toUnit.value, result);

  conversionResult.textContent = `${formatNumber(value)} ${fromLabel} = ${formatNumber(result)} ${toLabel}`;
}

function populateUnitOptions() {
  const category = unitCategory.value;
  const units = Object.keys(unitData[category].units);
  const previousFrom = fromUnit.value;
  const previousTo = toUnit.value;

  fromUnit.innerHTML = "";
  toUnit.innerHTML = "";

  units.forEach((unit) => {
    const fromOption = new Option(unit, unit);
    const toOption = new Option(unit, unit);
    fromUnit.add(fromOption);
    toUnit.add(toOption);
  });

  const defaults = {
    length: ["meter", "centimeter"],
    mass: ["kilogram", "gram"],
    temperature: ["celsius", "fahrenheit"],
  };

  fromUnit.value = units.includes(previousFrom) ? previousFrom : defaults[category][0];
  toUnit.value = units.includes(previousTo) ? previousTo : defaults[category][1];

  if (fromUnit.value === toUnit.value && units.length > 1) {
    toUnit.value = units.find((unit) => unit !== fromUnit.value);
  }
}

function renderCommonConversions() {
  commonConversions.innerHTML = "";

  unitData[unitCategory.value].common.forEach(([label, from, to, value]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.addEventListener("click", () => {
      unitValue.value = value;
      fromUnit.value = from;
      toUnit.value = to;
      updateConverter();
    });
    commonConversions.append(button);
  });
}

function resetUnitConverter() {
  unitCategory.value = "length";
  unitValue.value = "1";
  populateUnitOptions();
  fromUnit.value = "meter";
  toUnit.value = "centimeter";
  renderCommonConversions();
  updateConverter();
}

async function loadGames() {
  try {
    const response = await fetch("games.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Unable to load game catalog");
    }

    games = await response.json();
  } catch {
    games = fallbackGames;
  }

  renderGameLibrary();
}

function getCategories() {
  return ["All", ...new Set(games.map((game) => game.category))];
}

function getFilteredGames() {
  const searchValue = gameSearch.value.trim().toLowerCase();

  return games.filter((game) => {
    const matchesCategory = activeCategory === "All" || game.category === activeCategory;
    const matchesSearch =
      !searchValue ||
      game.title.toLowerCase().includes(searchValue) ||
      game.category.toLowerCase().includes(searchValue);

    return matchesCategory && matchesSearch;
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderCategoryTabs() {
  categoryTabs.innerHTML = "";

  getCategories().forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = category;
    button.classList.toggle("active", category === activeCategory);
    button.addEventListener("click", () => {
      activeCategory = category;
      renderGameLibrary();
    });
    categoryTabs.append(button);
  });
}

function renderGameLibrary() {
  renderCategoryTabs();
  gameGrid.innerHTML = "";

  const filteredGames = getFilteredGames();

  if (!filteredGames.length) {
    const empty = document.createElement("p");
    empty.className = "empty-games";
    empty.textContent = "No games found.";
    gameGrid.append(empty);
    return;
  }

  filteredGames.forEach((game) => {
    const card = document.createElement("button");
    const thumbnail = document.createElement("img");
    const content = document.createElement("div");
    const category = document.createElement("p");
    const title = document.createElement("h3");
    const status = document.createElement("p");

    card.type = "button";
    card.className = "game-card";
    card.classList.toggle("hero", game.layout === "hero");
    card.classList.toggle("wide", game.layout === "wide");
    card.classList.toggle("live", game.status === "live");
    card.classList.toggle("placeholder", game.status !== "live");
    thumbnail.src = game.thumb;
    thumbnail.alt = "";
    category.textContent = game.category;
    title.textContent = game.title;
    status.textContent = game.status === "placeholder" ? "Game source coming soon" : "Click to play";

    content.append(category, title, status);
    card.append(thumbnail, content);
    card.addEventListener("click", () => openGame(game));
    gameGrid.append(card);
  });
}

function openGame(game) {
  gameBrowser.classList.add("is-hidden");
  gamePlayer.classList.remove("is-hidden");
  activeGameCategory.textContent = game.category;
  activeGameTitle.textContent = game.title;
  gameFrame.src = game.url || "about:blank";

  if (game.status === "placeholder") {
    const safeTitle = escapeHtml(game.title);

    gameFrame.srcdoc = `
      <!doctype html>
      <html>
        <body style="display:grid;place-items:center;min-height:100vh;margin:0;background:#050505;color:#fff;font-family:system-ui,sans-serif;">
          <div style="text-align:center;max-width:420px;padding:24px;">
            <h1 style="margin:0 0 10px;font-size:28px;">${safeTitle}</h1>
            <p style="margin:0;color:rgba(255,255,255,.62);line-height:1.5;">Add an official embed URL or local HTML5 game path in games.json to make this playable.</p>
          </div>
        </body>
      </html>
    `;
  }
}

function closeGamePlayer() {
  gamePlayer.classList.add("is-hidden");
  gameBrowser.classList.remove("is-hidden");
  gameFrame.removeAttribute("srcdoc");
  gameFrame.src = "about:blank";
}

navItems.forEach((item) => {
  item.addEventListener("click", () => showTool(item.dataset.tool));
});

calcKeys.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (!button) {
    return;
  }

  if (button.dataset.action === "clear") {
    clearCalc();
    return;
  }

  if (button.dataset.action === "backspace") {
    backspace();
    return;
  }

  if (button.dataset.action === "equals") {
    calculate();
    return;
  }

  appendValue(button.dataset.value);
});

clearCalculator.addEventListener("click", clearCalc);
clearHistory.addEventListener("click", () => {
  history = [];
  removeStoredValue("studyToolsHistory");
  renderHistory();
});

clearText.addEventListener("click", () => {
  textInput.value = "";
  removeStoredValue("studyToolsDraft");
  updateWordStats();
  textInput.focus();
});

textInput.value = getStoredValue("studyToolsDraft");
textStatus.textContent = textInput.value ? "Draft saved locally" : "Unsaved draft";

textInput.addEventListener("input", () => {
  setStoredValue("studyToolsDraft", textInput.value);
  textStatus.textContent = textInput.value ? "Draft saved locally" : "Unsaved draft";
  updateWordStats();
});

unitCategory.addEventListener("change", () => {
  populateUnitOptions();
  renderCommonConversions();
  updateConverter();
});

[unitValue, fromUnit, toUnit].forEach((input) => {
  input.addEventListener("input", updateConverter);
  input.addEventListener("change", updateConverter);
});

resetConverter.addEventListener("click", resetUnitConverter);
closeArcade.addEventListener("click", closeArcadeScreen);
gameSearch.addEventListener("input", renderGameLibrary);
closeGame.addEventListener("click", closeGamePlayer);
fullscreenGame.addEventListener("click", () => {
  if (gameFrame.requestFullscreen) {
    gameFrame.requestFullscreen();
  }
});

window.addEventListener("keydown", (event) => {
  const isArcadeShortcut =
    event.altKey &&
    event.shiftKey &&
    (event.key.toLowerCase() === "g" || event.code === "KeyG");

  if (isArcadeShortcut) {
    event.preventDefault();
    openArcadeScreen();
    return;
  }

  if (isTypingInField(event.target) || event.metaKey || event.ctrlKey || event.altKey) {
    return;
  }

  if (event.key.length !== 1) {
    return;
  }

  secretBuffer = `${secretBuffer}${event.key.toLowerCase()}`.slice(-6);

  if (secretBuffer === "arcade") {
    openArcadeScreen();
  }
});

setLastOpened();
renderHistory();
updateWordStats();
resetUnitConverter();
loadGames();
