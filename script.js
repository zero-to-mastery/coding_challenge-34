const gameQuestionCard = document.getElementById("questionCard");

gameQuestionCard.addEventListener("click", flipCard);

function flipCard() {
  gameQuestionCard.classList.toggle("flipCard");
}
