"use strict";

const cardFront = document.querySelector("#card-front h1");
const cardBack = document.querySelector("#card-back h1");
const flipCard = document.querySelector(".flip-card");
const usageExample = document.querySelector("#card-back span");
const currentWord = document.querySelector("#current-word");
const wordsProgress = document.querySelector("#words-progress");
const buttonBack = document.querySelector("#back");
const buttonNext = document.querySelector("#next");
const shuffleWords = document.querySelector("#shuffle-words");
const buttonExam = document.querySelector("#exam");
const studyCards = document.querySelector(".study-cards");
const examCards = document.querySelector("#exam-cards");
const studyModeElement = document.querySelector("#study-mode");
const examModeElement = document.querySelector("#exam-mode");
const correctPercent = document.querySelector("#correct-percent");
const examProgress = document.querySelector("#exam-progress");
const resultsModal = document.getElementById(".results-modal");
let min = document.querySelector("#time").textContent.split(":")[0];
let sec = document.querySelector("#time").textContent.split(":")[1];
let timerId;

// При клике на карточку
flipCard.addEventListener("click", () => {
  // по клику переварачиваются карточки
  flipCard.classList.toggle("active"); // добавили класс active
});

class Words {
  constructor(englishWord, russianWord, usageExample) {
    this.englishWord = englishWord;
    this.russianWord = russianWord;
    this.usageExample = usageExample;
  }
}

const words1 = new Words(
  "imagine",
  "воображать",
  "I don't imagine anything, darling."
);
const words2 = new Words(
  "opportunity",
  "возможность",
  "They call America the land of opportunity."
);
const words3 = new Words(
  "destiny",
  "судьба",
  "That will be her life, her destiny."
);
const words4 = new Words("unique", "уникальный", "This case is unique.");
const words5 = new Words(
  "amazing",
  "удивительный",
  "She was an amazing woman."
);

let i = 0;
const arrOfWords = [words1, words2, words3, words4, words5];

function makeCard(text) {
  cardFront.textContent = text.englishWord;
  cardBack.textContent = text.russianWord;
  usageExample.textContent = text.usageExample;
  currentWord.textContent = i + 1;
  wordsProgress.value = ((i + 1) / arrOfWords.length) * 100;
}
makeCard(arrOfWords[i]);

let currentWordIndex = 1;
currentWord.textContent = currentWordIndex;

buttonNext.addEventListener("click", () => {
  i++;
  currentWordIndex++;
  makeCard(arrOfWords[i]);
  buttonBack.removeAttribute("disabled");
  if (i === 4) {
    buttonNext.setAttribute("disabled", "");
  }
});

buttonBack.addEventListener("click", () => {
  i--;
  currentWordIndex--;
  makeCard(arrOfWords[i]);
  buttonNext.removeAttribute("disabled");
  if (i === 0) {
    buttonBack.setAttribute("disabled", "");
  }
});

function shuffle() {
  arrOfWords.sort(() => Math.random() - 0.5);
  return makeCard(arrOfWords[i]);
}

shuffleWords.addEventListener("click", shuffle);

buttonExam.addEventListener("click", startExam);

function startExam() {
  studyModeElement.classList.add("hidden");
  examModeElement.classList.remove("hidden");
  buttonBack.classList.add("hidden");
  buttonNext.classList.add("hidden");
  buttonExam.classList.add("hidden");
  studyCards.classList.add("hidden");

  insertingTestCard();

  function randomCard(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function insertingTestCard() {
    const fragment = new DocumentFragment();
    const arrOfTestWords = [];
    arrOfWords.forEach((item) => {
      const cardWordElement = makeTestCard(item.englishWord, item.russianWord);
      const cardTranslationElement = makeTestCard(
        item.russianWord,
        item.englishWord
      );

      arrOfTestWords.push(cardWordElement);
      arrOfTestWords.push(cardTranslationElement);
    }),
      randomCard(arrOfTestWords);
    fragment.append(...arrOfTestWords);
    examCards.innerHTML = "";
    examCards.append(fragment);
  }

  function makeTestCard(englishWord, russianWord) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");

    const wordElement = document.createElement("div");
    wordElement.classList.add("card-word");
    wordElement.textContent = englishWord;

    const translationElement = document.createElement("div");
    translationElement.classList.add("card-translation");
    translationElement.textContent = russianWord;

    cardElement.append(wordElement);
    cardElement.append(translationElement);
    translationElement.classList.add("hidden");

    let firstClickedCard = null;
    let correctAnswersCount = 0;
    let curAnswer = 0;
    let countAnswer = arrOfWords.length;

    function timerStart() {
      sec++;
      if (sec === 60) {
        min++;
        sec = sec - 60;
      }
      console.log(min, sec);

      function format(value) {
        if (value < 10) {
          return `0${value}`;
        }
        return value;
      }
      document.querySelector("#time").textContent = `${format(min)}:${format(
        sec
      )}`;
    }

    examCards.addEventListener("click", function (event) {
      const cardElement = event.target.closest(".card");
      timerId = setInterval(timerStart, 1000);

      if (cardElement) {
        if (firstClickedCard === null) {
          firstClickedCard = cardElement;
          firstClickedCard.classList.add("correct");
        } else {
          const firstCardWord =
            firstClickedCard.querySelector(".card-word").textContent;
          const secondCardWord =
            cardElement.querySelector(".card-word").textContent;
          const firstCardTranslation =
            firstClickedCard.querySelector(".card-translation").textContent;
          const secondCardTranslation =
            cardElement.querySelector(".card-translation").textContent;

          if (
            (firstCardWord === secondCardTranslation &&
              firstCardTranslation === secondCardWord) ||
            (firstCardTranslation === secondCardWord &&
              firstCardWord === secondCardTranslation)
          ) {
            cardElement.classList.add("correct");
            firstClickedCard.classList.add("fade-out");
            cardElement.classList.add("fade-out");
            firstClickedCard = null;
            correctAnswersCount++;
            let percent = Math.round((correctAnswersCount / countAnswer) * 100);
            correctPercent.textContent = `${percent}%`;
            examProgress.value = percent;
          } else {
            cardElement.classList.add("wrong");

            setTimeout(() => {
              cardElement.classList.remove("wrong");
              firstClickedCard.classList.remove("correct");
              firstClickedCard = null;
            }, 500);
          }
        }
      }

      if (correctAnswersCount === countAnswer) {
        setTimeout(() => {
          alert("Вы успешно прошли тестирование!");
          const resulTime = clearInterval(timerId);
          return resulTime;
        }, 500);
      }
    });

    return cardElement;
  }
}
