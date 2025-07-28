const QuestionArray = [{
    question: "What does HTML stand for?",
    answer1: "Hyper Text Markup Language",
    answer2: "Home Tool Markup Language",
    answer3: "Hyper Text Makeup Language",
    answer4: "Hyper Typed Markup Language",
    correctAnswer: "Hyper Text Markup Language"
}, {
    question: "What does CSS stand for?",
    answer1: "Cascading Style Sheets",
    answer2: "Computer Style Sheets",
    answer3: "Colorful Style Sheets",
    answer4: "Creative Style Sheets",
    correctAnswer: "Cascading Style Sheets"
}, {
    question: "What does JS stand for?",
    answer1: "JavaScript",
    answer2: "Java Source",
    answer3: "Java Style",
    answer4: "Java Script",
    correctAnswer: "JavaScript"
}, {
    question: "What does SQL stand for?",
    answer1: "Structured Query Language",
    answer2: "Scripted Query Language",
    answer3: "Structured Question Language",
    answer4: "Scripted Question Language",
    correctAnswer: "Structured Query Language"
}, {
    question: "What does PHP stand for?",
    answer1: "Hypertext Preprocessor",
    answer2: "Hypertext Programming",
    answer3: "Hypertext Preprocessor",
    answer4: "Hypertext Preprogram",
    correctAnswer: "Hypertext Preprocessor"
}, {
    question: "What does ASP stand for?",
    answer1: "Active Server Pages",
    answer2: "Application Server Pages",
    answer3: "Advanced Server Pages",
    answer4: "Advanced Server Preprocessor",
    correctAnswer: "Active Server Pages"
}, {
    question: "What is not a programming language?",
    answer1: "HTML",
    answer2: "CSS",
    answer3: "JS",
    answer4: "PHP",
    correctAnswer: "HTML"
}, {
    question: "What is the most popular Linux OS?",
    answer1: "Ubuntu",
    answer2: "Kali",
    answer3: "Fedora",
    answer4: "CentOS",
    correctAnswer: "Ubuntu"
}, {
    question: "Which is not a movie in Sailesh Kolanu’s HITVerse?",
    answer1: "RRR",
    answer2: "HIT: The First Case",
    answer3: "HIT: The Second Case",
    answer4: "HIT: The Third Case",
    correctAnswer: "RRR"
}, {
    question: "What is Tovino Thomas’s first 100cr movie?",
    answer1: "ARM",
    answer2: "Anweshippin Kandethum",
    answer3: "Lucifer 2: Empuraan",
    answer4: "Maari 2",
    correctAnswer: "ARM"
}];

const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const startPage = document.getElementById('start-page');
const quizPage = document.getElementById('quiz-page');
const endPage = document.getElementById('end-page');

const questionElement = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const progressBarFull = document.getElementById('progressBarFull');
const scoreText = document.getElementById('score');
const finalScore = document.getElementById('final-score');
const timerDisplay = document.getElementById('time');
const nextBtn = document.getElementById('next-btn');


let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
let timeLeft = 15;
let questionAnswered = false;

startBtn.addEventListener('click', startQuiz);
restartBtn.addEventListener('click', restartQuiz);
nextBtn.addEventListener('click', nextQuestion);

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < QuestionArray.length) {
        showQuestion();
        updateHUD();
    } else {
        endQuiz();
    }
}

function startQuiz() {
    startPage.classList.add('hidden');
    quizPage.classList.remove('hidden');
    currentQuestionIndex = 0;
    score = 0;
    showQuestion();
    updateHUD();
}

function showQuestion() {
    const currentQuestion = QuestionArray[currentQuestionIndex];
    questionElement.innerText = currentQuestion.question;

    choices[0].innerText = currentQuestion.answer1;
    choices[1].innerText = currentQuestion.answer2;
    choices[2].innerText = currentQuestion.answer3;
    choices[3].innerText = currentQuestion.answer4;

    startTimer();
    questionAnswered = false;
    nextBtn.classList.add('hidden');
}


choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if (questionAnswered) return; // Prevent multiple clicks
        clearInterval(timerInterval);

        const selectedAnswer = e.target.innerText;
        const currentQuestion = QuestionArray[currentQuestionIndex];

        if (selectedAnswer === currentQuestion.correctAnswer) {
            score += 10;
            alert("✅ Correct!");
        } else {
            alert(`❌ Wrong! Correct answer: ${currentQuestion.correctAnswer}`);
        }

        questionAnswered = true;
        nextBtn.classList.remove('hidden');
    });
});

function startTimer() {
    timeLeft = 30;
    timerDisplay.innerText = timeLeft;

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeUp();
        }
    }, 1000);
}

function handleTimeUp() {
    alert(`⏰ Time's up! Correct answer: ${QuestionArray[currentQuestionIndex].correctAnswer}`);
    currentQuestionIndex++;
    if (currentQuestionIndex < QuestionArray.length) {
        showQuestion();
        updateHUD();
    } else {
        endQuiz();
    }
    questionAnswered = true;
    nextBtn.classList.remove('hidden');
}

function updateHUD() {
    progressText.innerText = `Question ${currentQuestionIndex + 1}/${QuestionArray.length}`;
    progressBarFull.style.width = `${((currentQuestionIndex + 1) / QuestionArray.length) * 100}%`;
    scoreText.innerText = `Score: ${score}`;
}

function endQuiz() {
    clearInterval(timerInterval);
    quizPage.classList.add('hidden');
    endPage.classList.remove('hidden');
    finalScore.innerText = `Your final score is: ${score}`;

    // Feedback logic
    const feedbackEl = document.getElementById('feedback');
    let feedback = "";

    if (score === QuestionArray.length * 10) {
        feedback = "🎉 Excellent! You got a perfect score!";
    } else if (score >= (QuestionArray.length * 10 * 0.7)) {
        feedback = "👏 Great job! You did really well.";
    } else if (score >= (QuestionArray.length * 10 * 0.4)) {
        feedback = "👍 Not bad! A bit more practice and you'll ace it.";
    } else {
        feedback = "💡 Keep trying! Review the questions and try again.";
    }

    feedbackEl.innerText = feedback;
}

function restartQuiz() {
    endPage.classList.add('hidden');
    startPage.classList.remove('hidden');
}
