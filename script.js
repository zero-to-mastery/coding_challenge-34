document.addEventListener("DOMContentLoaded", function () {
  let discard = document.getElementById("discard");
  discard.addEventListener("dragover", allowDrop);
  discard.addEventListener("drop", drop);

  let cardFlip = document.getElementsByClassName("questionCardFlip");

  class Card {
    constructor(question, type, containerID) {
      this.question = question;
      this.type = type;
      this.containerID = containerID;
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
        cardPaper.classList.add(
          "side",
          this.type === "day" ? "front" : "frontNIGHT"
        );
        backCardPaper.classList.add("side", "back");
        backCardPaper.appendChild(inside);

        const cardWrapper = document.createElement("div");
        cardWrapper.classList.add("questionCard");
        cardWrapper.appendChild(cardPaper);
        cardWrapper.appendChild(backCardPaper);
        let cardNumber = parseInt(element.name.replace(this.type + "Card", ""));
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

        let container = document.getElementById(this.containerID);
        container.appendChild(current);
      }
    }
  }

  let nightQues;
  let dayQues;
  let freshDayQues;
  let freshNightQues; // Declare a global variable for the Card instance

  function startGame() {
    fetchQuestions().then(({ dayQues, nightQues }) => {
      if (dayQues) {
        console.log("clicked");
        freshDayQues = new Card(dayQues, "day", "secondCol");
        freshDayQues.make();
      } else {
        console.log("Data not available yet");
      }
    });
  }

  function startNightGame() {
    fetchQuestions().then(({ dayQues, nightQues }) => {
      if (nightQues) {
        console.log("clicked");
        freshNightQues = new Card(nightQues, "night", "nightContainerID");
        freshNightQues.make();
      } else {
        console.log("Data not available yet");
      }
    });
  }

  function allowDrop(ev) {
    ev.preventDefault();
  }
  function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var newCard = document.getElementById(data);

    var discardPile = document.getElementById("discard");

    // Check if the discard pile already contains a card
    if (discardPile.firstChild) {
      // Remove the existing card
      discardPile.removeChild(discardPile.firstChild);
    }
    // Append the new card
    discardPile.appendChild(newCard);
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
      // Check if the Day Card instance exists
      freshDayQues.showNextCard(); // Use the existing Day Card instance to show the next card
    }
    if (freshNightQues) {
      // Check if the Night Card instance exists
      freshNightQues.showNextCard(); // Use the existing Night Card instance to show the next card
    }
  });

  function fetchQuestions() {
    return new Promise((resolve, reject) => {
      fetch("gameQuestions.json")
        .then((response) => response.json())
        .then((data) => {
          console.log(data);

          let dayQues = data.dayBreakerQuestions;
          let nightQues = data.nightQuestions;
          resolve({ dayQues, nightQues });
        })
        .catch((err) => {
          console.log("Error loading question data:", err);
          reject(err);
        });
    });
  }

  const startDayCard = document.getElementById("startGmDayBtn");
  console.log(startDayCard);
  startDayCard && startDayCard.addEventListener("click", startGame);

  const beginNightGm = document.getElementById("testNight");
  console.log(beginNightGm);
  beginNightGm && beginNightGm.addEventListener("click", startNightGame);
});
