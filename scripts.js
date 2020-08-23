const wrapper = document.querySelector(".container");
const stopwatchDisplay = document.querySelector("#stopwatch");
const replayButton = document.querySelector("#replay");
const averageTime = document.querySelector("#average");
const bestTime = document.querySelector("#bestTime");

const cardData = [
  {
    id: 0,
    text: "",
    background: "https://source.unsplash.com/1600x900/?lion",
  },
  {
    id: 1,
    text: "",
    background: "https://source.unsplash.com/1600x900/?tiger",
  },
  {
    id: 2,
    text: "",
    background: "https://source.unsplash.com/1600x900/?zebra",
  },
  {
    id: 3,
    text: "",
    background: "https://source.unsplash.com/1600x900/?elephant",
  },
  {
    id: 4,
    text: "",
    background: "https://source.unsplash.com/1600x900/?rhino",
  },
  {
    id: 5,
    text: "",
    background: "https://source.unsplash.com/1600x900/?bear",
  },
  {
    id: 6,
    text: "",
    background: "https://source.unsplash.com/1600x900/?shark",
  },
  {
    id: 7,
    text: "",
    background: "https://source.unsplash.com/1600x900/?deer",
  },
  {
    id: 0,
    text: "",
    background: "https://source.unsplash.com/1600x900/?lion",
  },
  {
    id: 1,
    text: "",
    background: "https://source.unsplash.com/1600x900/?tiger",
  },
  {
    id: 2,
    text: "",
    background: "https://source.unsplash.com/1600x900/?zebra",
  },
  {
    id: 3,
    text: "",
    background: "https://source.unsplash.com/1600x900/?elephant",
  },
  {
    id: 4,
    text: "",
    background: "https://source.unsplash.com/1600x900/?rhino",
  },
  {
    id: 5,
    text: "",
    background: "https://source.unsplash.com/1600x900/?bear",
  },
  {
    id: 6,
    text: "",
    background: "https://source.unsplash.com/1600x900/?shark",
  },
  {
    id: 7,
    text: "",
    background: "https://source.unsplash.com/1600x900/?deer",
  },
];

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

const shuffledList = shuffleCards(cardData);

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
    console.log("match" + matches);
  } else {
    match = false;
    shown.forEach((item) => {
      flipCard(item);
    }),
      console.log("no match");
  }
  shown = [];
  return match;
}

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

function formatAverageTime(timeString) {
  let time = parseInt(timeString);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  averageTime.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
}

function getAverageTime() {
  let times = historicalTimes;
  if (times.length > 0) {
    console.log("length: ", times.length);

    let averageTime = (arr) =>
      arr.reduce((a, b) => {
        return a + parseInt(b);
      }, 0) / arr.length;

    formatAverageTime(Math.floor(averageTime(times)));
  }
}

function updateHistory() {
  historicalTimes.push(secondsPassed);

  localStorage.setItem("historicalTimes", JSON.stringify(historicalTimes));
}

function formatBestTime(timeString) {
  let time = parseInt(timeString);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  bestTime.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
}

function getBestTime() {
  if (
    localStorage.getItem("bestTime") &&
    localStorage.getItem("bestTime") != "10000"
  ) {
    currentBest = JSON.parse(localStorage.getItem("bestTime"));
    formatBestTime(currentBest);
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
