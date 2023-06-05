let middle = document.getElementById("secondCol");
let cardFlip = document.getElementsByClassName("questionCardFlip");

const startDayCard = document.getElementById("startGmDayBtn");
startDayCard.addEventListener("click", startGame);

function flipCard() {
  cardFlip.classList.toggle("flipCard");
}

class Card {
  constructor(question) {
    this.question = question;
    this.completeCard = [];
  }

  make() {
    let deck = this.question;

    const cardPaper = document.createElement("div");
    const backCardPaper = document.createElement("div");

    let cardQuestion = deck[2].question;
    let addCardQuestion = document.createTextNode(cardQuestion);
    cardPaper.classList.add("side", "front");
    backCardPaper.classList.add("side", "back");
    backCardPaper.appendChild(addCardQuestion);

    const cardWrapper = document.createElement("div");
    cardWrapper.classList.add("questionCard");
    cardWrapper.appendChild(cardPaper);
    cardWrapper.appendChild(backCardPaper);

    cardWrapper.addEventListener("click", () => {
      cardWrapper.classList.toggle("flipCard");
    });

    middle.appendChild(cardWrapper);
  }
}

let dayQues; // Declare the variable to store the fetched data

fetch("dayQuestions.json")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    dayQues = data.dayBreakerQuestions; // Store the fetched data in the variable
  })
  .catch((err) => {
    console.log("Error loading question data:", err);
  });

function startGame() {
  if (dayQues) {
    console.log("clicked");
    // Check if the data is fetched and available
    const freshDayQues = new Card(dayQues);
    freshDayQues.make();
  } else {
    console.log("Data not available yet");
  }
}
