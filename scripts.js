import { cardData } from "./data.js";

const wrapper = document.querySelector(".container");
const stopwatchDisplay = document.querySelector("#stopwatch");
const replayButton = document.querySelector("#replay");
const averageTime = document.querySelector("#average");
const bestTime = document.querySelector("#bestTime");

let shown = [];
let click = 0;
let playing = false;
let matches = 0;
let timer;
let pause = false;
let secondsPassed = 0;
let currentBest = JSON.parse(localStorage.getItem("bestTime")) || 10000;
let historicalTimes = JSON.parse(localStorage.getItem("historicalTimes")) || [];

function shuffleCards(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (0 != currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function setBoard() {
  const newBoard = shuffleCards(cardData);

  const cardList = newBoard
    .map((card) => {
      return `
    <div class="card" >
      <div class="card-inner" data-id="${card.id}">
        <div class="card-front">
        </div>
        <div class="card-back" style="background: center / cover no-repeat url('${card.background} #eee')">
        </div>
      </div>
    </div>`;
    })
    .join("");

  wrapper.innerHTML = cardList;
}

function flipCard(card) {
  if (card.style.transform === "rotateY(180deg)") {
    card.style.transform = "rotateY(0deg)";
  } else {
    card.style.transform = "rotateY(180deg)";
  }
}

function disableCards() {
  shown.forEach((item) => {
    item.children[1].style.filter = "brightness(80%)";
    item.children[1].style.filter = "grayscale(80%)";

    item.removeEventListener("click", handleClick);
  });
}

function compareCards(list) {
  toggleEvents();
  let match;

  if (list[0].dataset.id === list[1].dataset.id) {
    match = true;
    disableCards();
    matches++;
    if (matches === 8) {
      stopPlaying();
    }
  } else {
    match = false;
    shown.forEach((item) => {
      flipCard(item);
    });
  }
  shown = [];
  return match;
}

// this isn't great but it works for now. Shouldn't have to request the page again.
function restart() {
  location.reload();
}

function stopPlaying() {
  console.log("YOU WIN!!!");
  playing = false;
  toggleStopwatch(playing);
  setBestTime();
  getBestTime();
  updateHistory();
  getAverageTime();
  replayButton.style.visibility = "visible";
}

function formatTime(string, element) {
  let time = parseInt(string);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  element.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
}

function getAverageTime() {
  let times = historicalTimes;
  if (times.length > 0) {
    console.log("length: ", times.length);

    let avg = (arr) =>
      arr.reduce((a, b) => {
        return a + parseInt(b);
      }, 0) / arr.length;

    formatTime(Math.floor(avg(times)), averageTime);
  }
}

function updateHistory() {
  historicalTimes.push(secondsPassed);

  localStorage.setItem("historicalTimes", JSON.stringify(historicalTimes));
}

function getBestTime() {
  if (
    localStorage.getItem("bestTime") &&
    localStorage.getItem("bestTime") != "10000"
  ) {
    currentBest = JSON.parse(localStorage.getItem("bestTime"));
    formatTime(currentBest, bestTime);
  } else {
    localStorage.setItem("bestTime", "10000");
  }
}

function setBestTime() {
  let currentBest = parseInt(JSON.parse(localStorage.getItem("bestTime")));
  console.log("current best: ", currentBest);

  if (secondsPassed < currentBest) {
    console.log("compare: ", secondsPassed, currentBest);
    localStorage.setItem("bestTime", JSON.stringify(secondsPassed));
  }

  getBestTime();
}

function startPlaying() {
  if (!playing) {
    playing = true;
    toggleStopwatch(playing);
  }
}

function handleClick(e) {
  startPlaying();

  let classes = [...e.target.classList];

  const el = this;

  if (shown.length > 0 && this === shown[0]) {
    console.log("click something else");
  } else if (classes.includes("card-back")) {
    return;
  } else {
    shown.push(this);
    if (shown.length > 2) {
      return;
    } else {
      flipCard(el);
      if (click === 0) {
        click++;
      } else {
        click = 0;
        toggleEvents();
        setTimeout(function () {
          compareCards(shown);
        }, 1000);
      }
    }
  }
}

function toggleStopwatch(gameState) {
  clearInterval(timer);
  if (gameState) {
    const start = Date.now();

    timer = setInterval(() => {
      const now = Date.now();
      secondsPassed = Math.round((now - start) / 1000);

      const minutes = Math.floor(secondsPassed / 60);
      const seconds = secondsPassed % 60;

      const display = `${minutes < 10 ? "0" : ""}${minutes}:${
        seconds < 10 ? "0" : ""
      }${seconds}`;
      stopwatchDisplay.textContent = display;
    }, 1000);
  }
}

function toggleEvents() {
  pause = !pause;
  if (pause) {
    cards.forEach((card) => card.removeEventListener("click", handleClick));
  } else {
    cards.forEach((card) => card.addEventListener("click", handleClick));
  }
}

setBoard();
getBestTime();
getAverageTime();

const cards = document.querySelectorAll(".card-inner");

cards.forEach((card) => card.addEventListener("click", handleClick));
replayButton.addEventListener("click", restart);
