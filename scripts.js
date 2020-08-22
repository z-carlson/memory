const wrapper = document.querySelector(".container");
const stopwatchDisplay = document.querySelector("#stopwatch");
const replayButton = document.querySelector("#replay");
const averageTime = document.querySelector("#average");
const bestTime = document.querySelector("#bestTime");

const cardData = [
  {
    id: 0,
    text: "",
    background: "https://source.unsplash.com/1600x900/?forest",
  },
  {
    id: 1,
    text: "",
    background: "https://source.unsplash.com/1600x900/?ocean",
  },
  {
    id: 2,
    text: "",
    background: "https://source.unsplash.com/1600x900/?snow",
  },
  {
    id: 3,
    text: "",
    background: "https://source.unsplash.com/1600x900/?grass",
  },
  {
    id: 4,
    text: "",
    background: "https://source.unsplash.com/1600x900/?desert",
  },
  {
    id: 5,
    text: "",
    background: "https://source.unsplash.com/1600x900/?mountains",
  },
  {
    id: 6,
    text: "",
    background: "https://source.unsplash.com/1600x900/?tundra",
  },
  {
    id: 7,
    text: "",
    background: "https://source.unsplash.com/1600x900/?swamp",
  },
  {
    id: 0,
    text: "",
    background: "https://source.unsplash.com/1600x900/?forest",
  },
  {
    id: 1,
    text: "",
    background: "https://source.unsplash.com/1600x900/?ocean",
  },
  {
    id: 2,
    text: "",
    background: "https://source.unsplash.com/1600x900/?snow",
  },
  {
    id: 3,
    text: "",
    background: "https://source.unsplash.com/1600x900/?grass",
  },
  {
    id: 4,
    text: "",
    background: "https://source.unsplash.com/1600x900/?desert",
  },
  {
    id: 5,
    text: "",
    background: "https://source.unsplash.com/1600x900/?mountains",
  },
  {
    id: 6,
    text: "",
    background: "https://source.unsplash.com/1600x900/?tundra",
  },
  {
    id: 7,
    text: "",
    background: "https://source.unsplash.com/1600x900/?swamp",
  },
];

let shown = [];
let click = 0;
let playing = false;
let matches = 0;
let timer;
let pause = false;
let secondsPassed = 0;
let currentBest;
let avg;

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
  replayButton.style.visibility = "visible";
}

// function getAvg() {
//   let historicalTimes = [];

//   if (localStorage.getItem("history")) {
//     historicalTimes = parseInt(localStorage.getItem("history"));
//     console.log(historicalTimes);
//   } else {
//     localStorage.setItem("history", "0");
//   }
// }

// function setAvg() {

// }

function getBestTime() {
  if (localStorage.getItem("bestTime")) {
    currentBest = parseInt(localStorage.getItem("bestTime"));
  } else {
    localStorage.setItem("bestTime", secondsPassed.toString());
  }

  const minutes = Math.floor(currentBest / 60);
  const seconds = currentBest % 60;

  bestTime.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
}

function setBestTime() {
  let currentBest = parseInt(localStorage.getItem("bestTime"));

  if (secondsPassed < currentBest) {
    localStorage.setItem("bestTime", `${secondsPassed}`);
  }
  // getBestTime();
}

function startPlaying() {
  if (!playing) {
    playing = true;
    toggleStopwatch(playing);
  }
}

function handleClick(e) {
  startPlaying();

  const el = this;

  if (shown.length > 0 && this === shown[0]) {
    console.log("click something else");
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

const cards = document.querySelectorAll(".card-inner");

cards.forEach((card) => card.addEventListener("click", handleClick));
replayButton.addEventListener("click", restart);
