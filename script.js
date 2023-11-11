var questions;
var score = 0;
var questionTitle = 0;
var timerInterval;
var timer10Min = 10 // 10 minutes
var timerSec = 30; // Total quiz time in seconds

getData();

function getData() {
  fetch('https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple')
    .then(res => res.json())
    .then(res => {
      questions = res.results;
      var loadingElement = document.getElementById('loading');
      loadingElement.className = 'hide';
      var startBtn = document.getElementById('start-btn');
      startBtn.className = '';
    });
}

function startQuiz() {
  var option_Container = document.getElementById('question-container');
  option_Container.className = '';
  var startBtn = document.getElementById('start-btn');
  startBtn.className = 'hide';
  questionTitle = 0;
  score = 0;
  startTimer();
  render();
}

function startTimer() {

  var countElement = document.getElementById('count')
    countElement.innerHTML = formatTime(timer10Min, timerSec);
 // Display initial time

  timerInterval = setInterval(function () {
    if (timer10Min >= 0 && timerSec >= 0) {
      countElement.innerHTML = formatTime(timer10Min, timerSec);
      if (timerSec === 0) {
        timer10Min--;
        timerSec = 59;
      } else {
        timerSec--;
      }
    } else {
      clearInterval(timerInterval);
      countElement.innerHTML = 'Time\'s up!';
      showResult();
    }
  }, 1000);
}

function formatTime(minutes, seconds) {
  return `${minutes.toString().padStart(2, '0')} min ${seconds.toString().padStart(2, '0')} sec`;
}

function render() {
  var titleElement = document.getElementById('title');
  var titleText = questions[questionTitle].question;
  titleElement.innerHTML = titleText;

  var optionElement = document.getElementById('option');
  optionElement.innerHTML = '';

  var options = questions[questionTitle].incorrect_answers;
  var correctAnswer = questions[questionTitle].correct_answer;

  var index = options.indexOf(correctAnswer);
  if (index > -1) {
    options.splice(index, 1);
  }

  options = shuffle(options);
  options.push(correctAnswer);

  for (var i = 0; i < options.length; i++) {
    var inputElement = document.createElement('input');
    inputElement.type = 'radio';
    inputElement.value = options[i];
    inputElement.name = 'options';
    optionElement.append(inputElement);
    optionElement.append(options[i]);
  }
}

function checkScore() {
  var selectedOption = document.querySelector('input[name="options"]:checked');
  if (selectedOption && selectedOption.value === questions[questionTitle].correct_answer) {
    score += 10;
  }
}

function showResult() {
  clearInterval(timerInterval);
  var questionContainer = document.getElementById('question-container');
  questionContainer.className = 'hide';
  var result = document.getElementById('result');
  result.className = 'show';
  var text = document.getElementById('text');
  text.innerHTML = 'Your Score: ' + score;
}
function next() {
  // Add your code for handling the next question here
  checkScore();
  questionTitle++;
  if (questionTitle < questions.length) {
    render();
  } else {
    showResult();
  }
}

function restart() {
  score = 0;
  questionTitle = 0;
  var result = document.getElementById('result');
  result.className = 'hide';
  var questionContainer = document.getElementById('question-container');
  questionContainer.className = '';
  render();
  startTimer();
}

function shuffle(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

