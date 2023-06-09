//run the code only after the DOM has been fully parsed
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
      let discardBtn = this.discardBtn;

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
        cardWrapper.setAttribute("id", `card-${element.name}`); // Unique id for each card

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
  let freshNightQues; // Declared a global variable for the Card instance, for access throughout the code

  function startGame() {
    fetchQuestions().then(({ dayQues, nightQues }) => {
      // Check if the data is fetched and available
      if (dayQues) {
        console.log("clicked");
        freshDayQues = new Card(dayQues, "day", "secondCol"); // Assign to global variable
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

  //Drag and drop functionality
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

  //Fetch JSON data
  function fetchQuestions() {
    return new Promise((resolve, reject) => {
      fetch("gameQuestions.json")
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          //store data into variable
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
  //Checks if startCard exists/available and proceeds to add the eventlistener.Wont try to add an event listener to a non-existing element, which would cause an error.
  startDayCard && startDayCard.addEventListener("click", startGame);

  const beginNightGm = document.getElementById("testNight");

  beginNightGm && beginNightGm.addEventListener("click", startNightGame);

  //Click button to discard functionality. Only shows on viewports 480px max-width

  const discardDayCard = document.getElementById("discardDay");

  discardDayCard &&
    discardDayCard.addEventListener("click", () => {
      var dayCardCont = document.getElementById("secondCol");
      dayCardCont.removeChild(dayCardCont.firstChild);

      if (freshDayQues) {
        freshDayQues.showNextCard();
      }
    });

  const discardNightCard = document.getElementById("discardNight");
  discardNightCard &&
    discardNightCard.addEventListener("click", () => {
      let nightCardCont = document.getElementById("nightContainerID");
      nightCardCont.removeChild(nightCardCont.firstChild);
      if (freshNightQues) {
        freshNightQues.showNextCard();
      }
    });

  // Touch surface event of swipe right to discard. Only shows on tablets
  let touchsurface = document.getElementById("touchSwipeCont"),
    startX,
    startY,
    dist,
    threshold = 50, //required min distance traveled to be considered swipe
    allowedTime = 500, // maximum time allowed to travel that distance
    elapsedTime,
    startTime;

  function handleswipe(isrightswipe) {
    if (isrightswipe) {
      var dayCardCont = document.getElementById("secondCol");

      if (dayCardCont && freshDayQues) {
        dayCardCont.removeChild(dayCardCont.firstChild);
        freshDayQues.showNextCard();
      }
    } else {
      console.log("not swiped right");
    }
  }

  function handleswipeN(isrightswipe) {
    if (isrightswipe) {
      var nightCardCont = document.getElementById("nightContainerID");

      if (nightCardCont && freshNightQues) {
        nightCardCont.removeChild(nightCardCont.firstChild);
        freshNightQues.showNextCard();
      }
    } else {
      console.log("not swiped right");
    }
  }

  touchsurface &&
    touchsurface.addEventListener(
      "touchstart",
      function (e) {
        var touchobj = e.changedTouches[0];
        dist = 0;
        startX = touchobj.pageX;
        startY = touchobj.pageY;
        startTime = new Date().getTime(); // record time when finger first makes contact with surface
        e.preventDefault();
      },
      false
    );

  touchsurface &&
    touchsurface.addEventListener(
      "touchmove",
      function (e) {
        e.preventDefault(); // prevent scrolling when inside DIV
      },
      false
    );

  touchsurface &&
    touchsurface.addEventListener(
      "touchend",
      function (e) {
        var touchobj = e.changedTouches[0];
        dist = touchobj.pageX - startX; // get total dist traveled by finger while in contact with surface
        elapsedTime = new Date().getTime() - startTime; // get time elapsed
        // check that elapsed time is within specified, horizontal dist traveled >= threshold, and vertical dist traveled <= 100

        console.log("elapsedTime:", elapsedTime);
        console.log("dist:", dist);
        console.log("vertical dist:", Math.abs(touchobj.pageY - startY));
        console.log("threshold", threshold);

        var isDayPage = document.getElementById("secondCol") !== null;
        var isNightPage = document.getElementById("nightContainerID") !== null;

        var swiperightBol =
          elapsedTime <= allowedTime &&
          dist >= threshold &&
          Math.abs(touchobj.pageY - startY) <= 500;

        var swiperightBolN =
          elapsedTime <= allowedTime &&
          dist >= threshold &&
          Math.abs(touchobj.pageY - startY) <= 500;

        if (isDayPage) {
          handleswipe(swiperightBol);
        } else if (isNightPage) {
          handleswipeN(swiperightBolN);
        }

        e.preventDefault();
      },
      false
    );
});
