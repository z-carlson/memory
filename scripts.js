const wrapper = document.querySelector(".container");

const cardData = [
  {
    id: 0,
    text: "pizza",
    background: "https://source.unsplash.com/1600x900/?pizza",
  },
  {
    id: 1,
    text: "drink",
    background: "https://source.unsplash.com/1600x900/?drink",
  },
  {
    id: 2,
    text: "pasta",
    background: "https://source.unsplash.com/1600x900/?pasta",
  },
  {
    id: 3,
    text: "hamburger",
    background: "https://source.unsplash.com/1600x900/?hamburger",
  },
  {
    id: 4,
    text: "cheese",
    background: "https://source.unsplash.com/1600x900/?cheese",
  },
  {
    id: 5,
    text: "sausage",
    background: "https://source.unsplash.com/1600x900/?sausage",
  },
  {
    id: 6,
    text: "hotdog",
    background: "https://source.unsplash.com/1600x900/?hotdog",
  },
  {
    id: 7,
    text: "ice cream",
    background: "https://source.unsplash.com/1600x900/?icecream",
  },
  {
    id: 0,
    text: "pizza",
    background: "https://source.unsplash.com/1600x900/?pizza",
  },
  {
    id: 1,
    text: "drink",
    background: "https://source.unsplash.com/1600x900/?drink",
  },
  {
    id: 2,
    text: "pasta",
    background: "https://source.unsplash.com/1600x900/?pasta",
  },
  {
    id: 3,
    text: "hamburger",
    background: "https://source.unsplash.com/1600x900/?hamburger",
  },
  {
    id: 4,
    text: "cheese",
    background: "https://source.unsplash.com/1600x900/?cheese",
  },
  {
    id: 5,
    text: "sausage",
    background: "https://source.unsplash.com/1600x900/?sausage",
  },
  {
    id: 6,
    text: "hotdog",
    background: "https://source.unsplash.com/1600x900/?hotdog",
  },
  {
    id: 7,
    text: "ice cream",
    background: "https://source.unsplash.com/1600x900/?icecream",
  },
];

// TODO: Shuffle the data first

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
console.log(shuffledList);

const cardList = cardData
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

let shown = [];
let click = 0;

function flipCard(card) {
  if (card.style.transform === "rotateY(180deg)") {
    card.style.transform = "rotateY(0deg)";
  } else {
    card.style.transform = "rotateY(180deg)";
  }
}

function compareCards(list) {
  let match;

  console.clear();
  console.log(list);

  if (list[0].dataset.id === list[1].dataset.id) {
    match = true;
    shown.forEach((item) => {
      item.children[1].style.filter = "grayscale(50%)";
      item.removeEventListener("click", handleClick);
    });
    console.log("match");
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

function handleClick(e) {
  console.log("fired");
  const el = this;

  if (shown.length > 0 && this === shown[0]) {
    console.log("click something else");
  } else {
    if (click === 0) {
      flipCard(el);
      shown.push(this);
      click++;
    } else {
      flipCard(el);
      shown.push(this);
      setTimeout(function () {
        compareCards(shown);
      }, 1000);
      click = 0;
    }
  }
}

wrapper.innerHTML = cardList;

const cards = document.querySelectorAll(".card-inner");

cards.forEach((card) => card.addEventListener("click", handleClick));
