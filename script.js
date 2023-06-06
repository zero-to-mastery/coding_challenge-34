let middle = document.getElementById("secondCol");
let discard = document.getElementById("discard");
let cardFlip = document.getElementsByClassName("questionCardFlip");

const startDayCard = document.getElementById("startGmDayBtn");
startDayCard.addEventListener("click", startGame);

class Card {
  constructor(question) {
    this.question = question;
    this.completeCard = [];
    this.finished = [];
  }

  make() {
    let deck = this.question;
    let stack = this.completeCard;
    let finished = this.finished;

    for (let index = 0; index < deck.length; index++) {
      const qCard = deck[index];
      stack.push(qCard);
    }
    stack.forEach((element) => {
      let inside = document.createTextNode(element.question);
      const cardPaper = document.createElement("div");
      const backCardPaper = document.createElement("div");
      cardPaper.classList.add("side", "front");
      backCardPaper.classList.add("side", "back");
      backCardPaper.appendChild(inside);

      const cardWrapper = document.createElement("div");
      cardWrapper.classList.add("questionCard");
      cardWrapper.appendChild(cardPaper);
      cardWrapper.appendChild(backCardPaper);
      let cardNumber = parseInt(element.name.replace("dayCard", ""));
      // Set the z-index
      cardWrapper.style.zIndex = 1000 - cardNumber;

      cardWrapper.setAttribute("draggable", "true");
      cardWrapper.setAttribute("id", `card-${element.name}`); // You need to ensure this ID is unique for each card

      cardWrapper.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("text/plain", event.target.id);
      });

      finished.push(cardWrapper);
    });

    // Pop the last card in the stack and append it to the middle container
    this.showNextCard();
  }

  // Method to show the next card
  showNextCard() {
    if (this.finished.length > 0) {
      let current = this.finished.pop();
      current.style.zIndex = 1000;

      // Add click listener for the card
      current.addEventListener("click", () => {
        current.classList.toggle("flipCard");
      });

      middle.appendChild(current);
    }
  }
}
function allowDrop(ev) {
  ev.preventDefault();
}
function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  var newCard = document.getElementById(data);
  console.log(data);
  var discardPile = document.getElementById("discard");

  // Check if the discard pile already contains a card
  if (discardPile.firstChild) {
    // Remove the existing card
    discardPile.removeChild(discardPile.firstChild);
  }
  // Append the new card
  discardPile.appendChild(newCard);
}
let freshDayQues; // Declare a global variable for the Card instance

function startGame() {
  if (dayQues) {
    console.log("clicked");
    // Check if the data is fetched and available
    freshDayQues = new Card(dayQues); // Assign to global variable
    freshDayQues.make();
  } else {
    console.log("Data not available yet");
  }
}

discard.addEventListener("drop", (event) => {
  event.preventDefault();
  var data = event.dataTransfer.getData("text");
  var newCard = document.getElementById(data);
  var discardPile = discard;

  // Check if the discard pile already contains a card
  if (discardPile.firstChild) {
    // Remove the existing card
    discardPile.removeChild(discardPile.firstChild);
  }
  // Append the new card
  discardPile.appendChild(newCard);

  // Show the next card
  if (freshDayQues) {
    // Check if the Card instance exists
    freshDayQues.showNextCard(); // Use the existing Card instance to show the next card
  }
});

let dayQues;
fetch("dayQuestions.json")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    dayQues = data.dayBreakerQuestions; // Store the fetched data in the variable
  })
  .catch((err) => {
    console.log("Error loading question data:", err);
  });
