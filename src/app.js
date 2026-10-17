// UI code: connects the quiz logic (quiz.js) to the page (index.html).

const BEST_SCORE_KEY = "dev-days-best-score";
const state = { questions: [], current: 0, score: 0, timerId: null, timeLeft: 15, answered: false };

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const progressText = document.getElementById("progress");
const questionText = document.getElementById("question-text");
const optionsList = document.getElementById("options");
const feedbackText = document.getElementById("feedback");
const nextButton = document.getElementById("next-btn");
const scoreText = document.getElementById("score-text");
const gradeText = document.getElementById("grade-text");
const timerText = document.getElementById("timer");
const bestScoreText = document.getElementById("best-score-text");
const bestScoreResultText = document.getElementById("best-score-result-text");
const newBestText = document.getElementById("new-best-text");
const resetBestScoreMessage = document.getElementById("reset-best-score-message");

function readBestScore() {
  try {
    const storedValue = window.localStorage.getItem(BEST_SCORE_KEY);
    if (storedValue === null) {
      return null;
    }
    const parsedValue = Number(storedValue);
    return Number.isFinite(parsedValue) ? parsedValue : null;
  } catch {
    return null;
  }
}

function saveBestScore(score) {
  try {
    window.localStorage.setItem(BEST_SCORE_KEY, String(score));
  } catch {
    // Ignore storage issues so the quiz still works.
  }
}

function updateBestScoreDisplay(score) {
  const bestText = score === null ? "Best score: —" : `Best score: ${score}%`;
  if (bestScoreText) {
    bestScoreText.textContent = bestText;
  }
  if (bestScoreResultText) {
    bestScoreResultText.textContent = bestText;
  }
}

function resetBestScore() {
  if (!window.confirm("Are you sure you want to reset your best score?")) {
    return;
  }

  try {
    window.localStorage.removeItem(BEST_SCORE_KEY);
  } catch {
    resetBestScoreMessage.textContent = "Could not reset best score. Please try again.";
    return;
  }

  updateBestScoreDisplay(null);
  resetBestScoreMessage.textContent = "Best score reset.";
}

function stopTimer() {
  if (state.timerId !== null) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
}

function updateTimer() {
  timerText.textContent = formatTimeLeft(state.timeLeft);
  timerText.classList.toggle("timer-low", state.timeLeft <= 5);
}

function startTimer() {
  state.timeLeft = 15;
  updateTimer();
  state.timerId = setInterval(() => {
    state.timeLeft--;
    updateTimer();
    if (state.timeLeft === 0) {
      finishAnswer(null, null, true);
    }
  }, 1000);
}

function showScreen(screenToShow) {
  [startScreen, quizScreen, resultScreen].forEach((screen) => {
    screen.hidden = screen !== screenToShow;
  });
}

function startQuiz() {
  stopTimer();
  state.questions = shuffle(QUESTIONS);
  state.current = 0;
  state.score = 0;
  updateBestScoreDisplay(readBestScore());
  showScreen(quizScreen);
  renderQuestion();
}

function renderQuestion() {
  stopTimer();
  state.answered = false;
  const question = state.questions[state.current];
  progressText.textContent = `Question ${state.current + 1} of ${state.questions.length}`;
  questionText.textContent = question.question;
  feedbackText.textContent = "";
  nextButton.hidden = true;
  startTimer();
  optionsList.innerHTML = "";

  question.options.forEach((option, index) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.className = "option";
    button.textContent = option;
    button.addEventListener("click", () => selectAnswer(index, button));
    item.appendChild(button);
    optionsList.appendChild(item);
  });
}

function selectAnswer(selectedIndex, selectedButton) {
  finishAnswer(selectedIndex, selectedButton, false);
}

function finishAnswer(selectedIndex, selectedButton, timedOut) {
  if (state.answered) return;
  state.answered = true;
  stopTimer();
  const question = state.questions[state.current];
  const buttons = optionsList.querySelectorAll("button");
  buttons.forEach((button) => (button.disabled = true));

  if (timedOut) {
    buttons[question.answer].classList.add("correct");
    feedbackText.textContent = "Time's up!";
  } else if (isCorrect(question, selectedIndex)) {
    state.score++;
    selectedButton.classList.add("correct");
    feedbackText.textContent = "Correct!";
  } else {
    selectedButton.classList.add("wrong");
    buttons[question.answer].classList.add("correct");
    feedbackText.textContent = "Not quite. The correct answer is highlighted.";
  }

  nextButton.hidden = false;
  nextButton.focus();
}

function nextQuestion() {
  stopTimer();
  state.current++;
  if (state.current < state.questions.length) {
    renderQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  const total = state.questions.length;
  const percentage = calculatePercentage(state.score, total);
  const currentBest = readBestScore();
  const becameNewBest = isNewBestScore(percentage, currentBest);
  if (becameNewBest) {
    saveBestScore(percentage);
  }

  const savedBest = readBestScore();
  scoreText.textContent = `You scored ${state.score} out of ${total} (${percentage}%)`;
  gradeText.textContent = `Grade: ${getGrade(percentage)}`;
  updateBestScoreDisplay(savedBest);

  if (newBestText) {
    newBestText.textContent = becameNewBest ? "🏆 New best score!" : "";
  }

  showScreen(resultScreen);
}

updateBestScoreDisplay(readBestScore());

document.getElementById("start-btn").addEventListener("click", startQuiz);
document.getElementById("restart-btn").addEventListener("click", startQuiz);
document.getElementById("reset-best-score-btn").addEventListener("click", resetBestScore);
nextButton.addEventListener("click", nextQuestion);
