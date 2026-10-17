// Tests use Node's built-in test runner, so nothing needs to be installed.
// Run them with:  npm test
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { shuffle, isCorrect, calculatePercentage, getGrade, formatTimeLeft, isNewBestScore } = require("../src/quiz.js");

test("isCorrect returns true for the right answer", () => {
  assert.equal(isCorrect({ answer: 2 }, 2), true);
});

test("isCorrect returns false for a wrong answer", () => {
  assert.equal(isCorrect({ answer: 2 }, 0), false);
});

test("calculatePercentage rounds to a whole number", () => {
  assert.equal(calculatePercentage(2, 3), 67);
});

test("calculatePercentage returns 0 when there are no questions", () => {
  assert.equal(calculatePercentage(0, 0), 0);
});

test("shuffle keeps every item and does not change the original array", () => {
  const original = [1, 2, 3, 4, 5];
  const result = shuffle(original);
  assert.deepEqual([...result].sort(), [1, 2, 3, 4, 5]);
  assert.deepEqual(original, [1, 2, 3, 4, 5]);
});

test("getGrade gives an A for exactly 90%", () => {
  assert.equal(getGrade(90), "A");
});

test("getGrade gives a B for exactly 75%", () => {
  assert.equal(getGrade(75), "B");
});

test("getGrade gives a C for exactly 50%", () => {
  assert.equal(getGrade(50), "C");
});

test("formatTimeLeft formats positive seconds when given a normal value", () => {
  assert.equal(formatTimeLeft(12), "⏱ 12s");
});

test("formatTimeLeft formats five seconds when at the warning threshold", () => {
  assert.equal(formatTimeLeft(5), "⏱ 5s");
});

test("formatTimeLeft formats zero seconds when the countdown expires", () => {
  assert.equal(formatTimeLeft(0), "⏱ 0s");
});

test("formatTimeLeft returns zero when given invalid values", () => {
  for (const seconds of [null, -1, "12", NaN, Infinity, -Infinity]) {
    assert.equal(formatTimeLeft(seconds), "⏱ 0s");
  }
});

test("isNewBestScore returns true when the current score is the first best score", () => {
  assert.equal(isNewBestScore(82, null), true);
});

test("isNewBestScore returns true only when the current score beats the previous best", () => {
  assert.equal(isNewBestScore(91, 90), true);
  assert.equal(isNewBestScore(90, 90), false);
  assert.equal(isNewBestScore(89, 90), false);
});

test("isNewBestScore ignores invalid best values and returns a safe comparison", () => {
  assert.equal(isNewBestScore(80, undefined), true);
  assert.equal(isNewBestScore(80, "90"), true);
  assert.equal(isNewBestScore(80, NaN), true);
});
