const card = document.getElementById('card');
const cardInner = document.getElementById('card-inner');
const cardBack = document.querySelector('.card-back');
const messages = [
  "Message 1",
  "Message 2",
  "Message 3",
  // Add more messages
];
let flipCount = 0;

card.addEventListener('click', () => {
  if (flipCount < messages.length) {
    cardInner.style.transform = 'rotateY(180deg)';
    setTimeout(() => {
      cardBack.querySelector('p').textContent = messages[flipCount];
      cardInner.style.transform = 'rotateY(0deg)';
    }, 250);
    flipCount++;
  }
});
