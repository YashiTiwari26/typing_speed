// script.js

const textDisplay = document.getElementById("textDisplay");
const inputField = document.getElementById("inputField");

const timeTag = document.getElementById("time");
const wpmTag = document.getElementById("wpm");
const accuracyTag = document.getElementById("accuracy");
const mistakesTag = document.getElementById("mistakes");

const restartBtn = document.getElementById("restartBtn");

const resultBox = document.getElementById("resultBox");

const finalWpm = document.getElementById("finalWpm");
const finalAccuracy = document.getElementById("finalAccuracy");
const finalMistakes = document.getElementById("finalMistakes");

const wpmCircle = document.getElementById("wpmCircle");
const accuracyCircle = document.getElementById("accuracyCircle");

const resultChart = document.getElementById("resultChart");

const bestWpm = document.getElementById("bestWpm");
const bestAccuracy = document.getElementById("bestAccuracy");

const timeButtons = document.querySelectorAll(".time-btn");

let TEST_TIME = 60;

let timer = null;
let timeLeft = TEST_TIME;

let charIndex = 0;
let mistakes = 0;

let isTyping = false;

let chart = null;

let speedData = [];
let timeData = [];

function loadParagraph() {
  const randomText = getRandomParagraph();

  textDisplay.innerHTML = "";

  randomText.split("").forEach((char) => {
    const span = document.createElement("span");

    span.innerText = char;

    textDisplay.appendChild(span);
  });

  textDisplay.querySelector("span").classList.add("active");
}

function calculateWPM() {
  const timeSpent = TEST_TIME - timeLeft;

  if (timeSpent <= 0) return 0;

  const wordsTyped = (charIndex - mistakes) / 5;

  return Math.max(0, Math.round((wordsTyped / timeSpent) * 60));
}

function calculateAccuracy() {
  if (charIndex === 0) return 0;

  return Math.round(((charIndex - mistakes) / charIndex) * 100);
}

function updateStats() {
  const wpm = calculateWPM();

  wpmTag.innerText = wpm;

  mistakesTag.innerText = mistakes;

  accuracyTag.innerText = calculateAccuracy();

  return wpm;
}

function renderChart() {
  if (chart) {
    chart.destroy();
  }

  chart = new Chart(resultChart, {
    type: "line",

    data: {
      labels: timeData,

      datasets: [
        {
          label: "Typing Speed (WPM)",
          data: speedData,
          borderWidth: 3,
          tension: 0.3,
          fill: true,
        },
      ],
    },

    options: {
      responsive: true,

      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

function finishTest() {
  clearInterval(timer);

  inputField.disabled = true;

  const finalSpeed = calculateWPM();

  const accuracy = calculateAccuracy();

  resultBox.style.display = "block";

  finalWpm.innerText = finalSpeed;

  finalAccuracy.innerText = accuracy + "%";

  finalMistakes.innerText = mistakes;

  const wpmProgress = 314 - (Math.min(finalSpeed, 100) / 100) * 314;

  const accuracyProgress = 314 - (accuracy / 100) * 314;

  wpmCircle.style.strokeDashoffset = wpmProgress;

  accuracyCircle.style.strokeDashoffset = accuracyProgress;

  renderChart();

  const savedBestWpm = localStorage.getItem("bestWpm") || 0;

  const savedBestAccuracy = localStorage.getItem("bestAccuracy") || 0;

  if (finalSpeed > savedBestWpm) {
    localStorage.setItem("bestWpm", finalSpeed);
  }

  if (accuracy > savedBestAccuracy) {
    localStorage.setItem("bestAccuracy", accuracy);
  }

  bestWpm.innerText = localStorage.getItem("bestWpm");

  bestAccuracy.innerText = localStorage.getItem("bestAccuracy");
}

function initTyping() {
  const characters = textDisplay.querySelectorAll("span");

  const typedChar = inputField.value.charAt(charIndex);

  if (charIndex >= characters.length || timeLeft <= 0) {
    finishTest();
    return;
  }

  if (!isTyping) {
    timer = setInterval(initTimer, 1000);

    isTyping = true;
  }

  if (typedChar === "") {
    if (charIndex > 0) {
      charIndex--;

      if (characters[charIndex].classList.contains("wrong")) {
        mistakes--;
      }

      characters[charIndex].classList.remove("correct", "wrong");
    }
  } else {
    if (characters[charIndex].innerText === typedChar) {
      characters[charIndex].classList.add("correct");
    } else {
      characters[charIndex].classList.add("wrong");

      mistakes++;
    }

    charIndex++;
  }

  characters.forEach((span) => span.classList.remove("active"));

  if (charIndex < characters.length) {
    characters[charIndex].classList.add("active");
  }

  const currentWpm = updateStats();

  speedData.push(currentWpm);

  timeData.push(TEST_TIME - timeLeft);

  if (charIndex === characters.length) {
    finishTest();
  }
}

function initTimer() {
  if (timeLeft > 0) {
    timeLeft--;

    timeTag.innerText = timeLeft;
  } else {
    finishTest();
  }
}

function resetGame() {
  clearInterval(timer);

  timeLeft = TEST_TIME;

  charIndex = 0;

  mistakes = 0;

  isTyping = false;

  speedData = [];

  timeData = [];

  inputField.value = "";

  inputField.disabled = false;

  timeTag.innerText = TEST_TIME;

  wpmTag.innerText = 0;

  accuracyTag.innerText = 0;

  mistakesTag.innerText = 0;

  resultBox.style.display = "none";

  wpmCircle.style.strokeDashoffset = 314;

  accuracyCircle.style.strokeDashoffset = 314;

  if (chart) {
    chart.destroy();
  }

  loadParagraph();

  inputField.focus();
}

timeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    timeButtons.forEach((btn) => btn.classList.remove("active"));

    button.classList.add("active");

    TEST_TIME = Number(button.dataset.time);

    resetGame();
  });
});

document.addEventListener("keydown", () => {
  inputField.focus();
});

textDisplay.addEventListener("click", () => {
  inputField.focus();
});

inputField.addEventListener("input", initTyping);

restartBtn.addEventListener("click", resetGame);

bestWpm.innerText = localStorage.getItem("bestWpm") || 0;

bestAccuracy.innerText = localStorage.getItem("bestAccuracy") || 0;

loadParagraph();