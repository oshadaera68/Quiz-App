import QuestionArray from './QuestionArray.js';

const startBtn = document.getElementById('start-btn');
const startPage = document.getElementById('start-page');
const quizPage = document.getElementById('quiz-page');
const endPage = document.getElementById('end-page');
const restartBtn = document.getElementById('restart-btn');
const darkModeToggle = document.getElementById('darkModeToggle');

const questionElement = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const timerText = document.getElementById('time-left-text');
const nextBtn = document.getElementById('next-btn');
const finalScore = document.getElementById('final-score');
const highScoreText = document.getElementById('high-score');
const totalTimeText = document.getElementById('total-time');
const globalTimerEl = document.getElementById('global-timer');

const circle = document.querySelector('.progress-ring__circle');
const radius = circle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;

circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = 0;

let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 30;
let acceptingAnswers = false;
let answered = false;

let globalTime = 0;
let globalTimer;

startBtn.addEventListener('click', () => {
    transition(startPage, quizPage);
    startQuiz();
});

restartBtn.addEventListener('click', () => {
    transition(endPage, startPage);
});

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

function transition(fromPage, toPage) {
    fromPage.classList.add('fade-out');
    fromPage.addEventListener('animationend', () => {
        fromPage.classList.add('hidden');
        fromPage.classList.remove('fade-out');

        toPage.classList.remove('hidden');
        toPage.classList.add('fade-in');

        toPage.addEventListener('animationend', () => {
            toPage.classList.remove('fade-in');
        }, { once: true });
    }, { once: true });
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    globalTime = 0;
    startGlobalTimer();
    showQuestion();
}

function startGlobalTimer() {
    globalTimer = setInterval(() => {
        globalTime++;
        updateGlobalTimer();
    }, 1000);
}

function updateGlobalTimer() {
    const minutes = Math.floor(globalTime / 60);
    const seconds = globalTime % 60;
    globalTimerEl.innerText = `Total Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function showQuestion() {
    resetState();
    const currentQuestion = QuestionArray[currentQuestionIndex];
    questionElement.innerText = currentQuestion.question;

    choices[0].innerText = currentQuestion.answer1;
    choices[1].innerText = currentQuestion.answer2;
    choices[2].innerText = currentQuestion.answer3;
    choices[3].innerText = currentQuestion.answer4;

    progressText.innerText = `Question ${currentQuestionIndex + 1}/${QuestionArray.length}`;
    scoreText.innerText = `Score: ${score}`;

    acceptingAnswers = true;
    answered = false;
    resetTimer();
    startTimer();
}

choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if (!acceptingAnswers) return;
        acceptingAnswers = false;
        answered = true;

        const selectedAnswer = e.target.innerText;
        const currentQuestion = QuestionArray[currentQuestionIndex];

        clearInterval(timer);

        if (selectedAnswer === currentQuestion.correctAnswer) {
            score++;
            e.target.parentElement.classList.add('correct');
        } else {
            e.target.parentElement.classList.add('incorrect');
        }

        scoreText.innerText = `Score: ${score}`;
    });
});

nextBtn.addEventListener('click', () => {
    if (!answered) return;

    currentQuestionIndex++;
    if (currentQuestionIndex < QuestionArray.length) {
        showQuestion();
    } else {
        showEndPage();
    }
});

function startTimer() {
    timeLeft = 30;
    updateTimer();
    setProgress(timeLeft);

    timer = setInterval(() => {
        timeLeft--;
        updateTimer();
        setProgress(timeLeft);

        if (timeLeft <= 0) {
            clearInterval(timer);
            acceptingAnswers = false;
            answered = true;
            autoSelectAnswer();
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    timeLeft = 30;
    updateTimer();
    setProgress(timeLeft);
}

function updateTimer() {
    timerText.innerText = timeLeft;
}

function setProgress(timeLeft) {
    const percent = timeLeft / 30;
    const offset = circumference - percent * circumference;
    circle.style.strokeDashoffset = offset;
}

function autoSelectAnswer() {
    choices.forEach(choice => {
        choice.parentElement.classList.add('incorrect');
    });
}

function resetState() {
    choices.forEach(choice => {
        choice.parentElement.classList.remove('correct', 'incorrect');
    });
}

function showEndPage() {
    transition(quizPage, endPage);
    finalScore.innerText = `Your score: ${score} / ${QuestionArray.length}`;

    clearInterval(globalTimer);

    const highScore = localStorage.getItem('highScore') || 0;
    if (score > highScore) {
        localStorage.setItem('highScore', score);
    }
    highScoreText.innerText = `High score: ${localStorage.getItem('highScore')}`;
    totalTimeText.innerText = `Total time: ${Math.floor(globalTime / 60)}:${globalTime % 60 < 10 ? '0' : ''}${globalTime % 60}`;
}
