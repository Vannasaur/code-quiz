// Set global variables

const timerEl = document.getElementById('countdown');
const start = document.querySelector('.start-screen');
const quiz = document.querySelector('.quiz');
const answers = document.getElementById('answers');
const finalScore = document.querySelector('.final-score-screen');
const userScore = document.getElementById('user-score');
const highScoreScreen = document.querySelector('.high-score-screen');
const restart = document.getElementById('restart');
const clearHighScores = document.getElementById('clear-high-scores');
const userInitials = document.getElementById('user-initials');
const viewHighScoresLink = document.querySelector("nav a");
const highScoreForm = document.getElementById("high-score-form");

let questionCount;
let scoreCount = 0;
let timeInterval;
let timeLeft = 0;
let remainingTime = 0;

//might need, user initials as a global variable?

// Quiz array

const quizArray = [
    {
        index: "0",
        question: "Who is not a member of the Smith family?",
        answers: ["Beth", "Jerry", "Summer", "Larry"],
        correct: "Larry"
    },
    {
        index: "1",
        question: "What did Snuffles rename himself when he gained sentience?",
        answers: ["Snowflake", "Snowball", "Marshmallow", "Fluff"],
        correct: "Snowball"
    },
    {
        index: "2",
        question: "Which phrase wasn't said by Rick?",
        answers: ["Wubba Lubba Dub Dub!", "Get Schwifty!", "Sorry Jerry, you're real", "I'm Pickle Rick!"],
        correct: "Sorry Jerry, you're real"
    },
    {
        index: "3",
        question: "Who is a side character in Rick & Morty?",
        answers: ["Mr. Poopybutthole", "Sleepy Barry", "Birdman", "Mr. Goldie"],
        correct: "Mr. Poopybutthole"
    },
    {
        index: "4",
        question: "Who is the ultimate villain in Rick & Morty?",
        answers: ["Mr. Nimbus", "Evil Morty", "King Jellybean", "The Galactic Federation"],
        correct: "Evil Morty"
    }
]

// Timer that counts down from 75

function countdown() {
    timeLeft = 75; // setInterval() method calls a function to be executed every 1000 milliseconds (one second)
    remainingTime = timeLeft;
    timeInterval = setInterval(function () { // As long as the timeLeft is greater than 1, then show the remaining seconds and decrement by one second
        if (timeLeft > 1) {
            timerEl.textContent = timeLeft + " seconds remaining";
            timeLeft--;
        } else if (timeLeft === 1) { // change from seconds to second when only 1 second is left
            timerEl.textContent = timeLeft + " second remaining";
            --timeLeft;
        } else { // once timeLeft goes to 0, set timerEl to empty string
            timerEl.textContent = "";
            clearInterval(timeInterval); // stops the timer
            remainingTime = 0;
            quiz.classList.add("hide");
            finalScore.classList.remove("hide");
            userScore.textContent = `Your final score: ${scoreCount}`;
            timerEl.textContent = "No time remaining";
        }
    }, 1000);
    timerEl.textContent = timeLeft + " seconds remaining";
}

//Quiz functionality

function showQuestion(index) {
    const currentQuestion = quizArray[index];
    document.getElementById("question").textContent = currentQuestion.question;

    const answerContainer = document.getElementById("answers"); // element holding all answers for the question
    answerContainer.innerHTML = ""; // Clear previous answer choices

    for (let i = 0; i < currentQuestion.answers.length; i++) {
        const answer = currentQuestion.answers[i];

        const answerButton = document.createElement("button"); // makes each answer option a button, so when one is clicked, you move to the next question without a next button
        answerButton.classList.add("ans");
        answerButton.textContent = answer;
        answerContainer.appendChild(answerButton); // adds each answer to be a child of the parent element answerContainer
    };
}

// Local Storage for high scores

function saveHighScore() {
    // Save related form data as an object
    let highScoreInfo = {
        userInitials: userInitials.value,
        userScore: scoreCount
    };
    // Get existing high scores from localStoarage or create empty array
    let existingHighScores = JSON.parse(localStorage.getItem("highScores")) || [];
    // Add new score info to existing array
    existingHighScores.push(highScoreInfo);
    // Use .setItem() to store object in storage and JSON.stringify to conver it as a string
    localStorage.setItem("highScores", JSON.stringify(existingHighScores));
}

function renderHighScores() {
    // Use JSON.parse() to convert text to JavaScript object
    let highScores = JSON.parse(localStorage.getItem("highScores"));
    // Check if there is data, if not exit out of the function
    if (highScores !== null) {
        // Sort the high scores in descending order based on userScore
        highScores.sort(function(a, b) {
            return b.userScore - a.userScore
        });
        // Create a list of high scores to display
        let scoreList = "";
        for (let i = 0; i < highScores.length; i++) {
            // += allows to assign and concatenate
            scoreList += `${i +1}. ${highScores[i].userInitials} - ${highScores[i].userScore}<br>`;
        }
        document.getElementById("savedScoreInfo").innerHTML = scoreList;
    } else {
        document.getElementById("savedScoreInfo").innerHTML = "No high scores available";
    }
    //Display the high score screen
    finalScore.classList.add("hide");
    highScoreScreen.classList.remove("hide");
}
// Processes (Event Listeners)

quiz.addEventListener("click", function (event) {
    if (event.target.matches(".ans")) { // if they click on an answer option, then it will check if the answer is correct
        const selectedAnswer = event.target.textContent; // gets the text of the answer they chose
        const correctAnswer = quizArray[questionCount].correct; // gets the correct answer from the quiz array

        if (selectedAnswer === correctAnswer) { // if the answer they chose is correct, increase their score by one
            scoreCount++;
        } else {
            timeLeft -= 15; // Deduct 15 seconds from remaining time
            if (timeLeft < 0) {
                timeLeft = 0; // Ensures time doesn't go negative
            }
        }

        questionCount++; // once answer is chosen, the next question will pop up unless they finished the quiz
        if (questionCount < quizArray.length) {
            showQuestion(questionCount); // Show the next question
        } else { // Quiz is completed, show final score
            clearInterval(timeInterval); // stops the timer
            remainingTime = timeLeft; // store the remaining time
            quiz.classList.add("hide");
            finalScore.classList.remove("hide");
            userScore.textContent = `Your final score: ${scoreCount}`; // displays final score
            if (remainingTime > 0) {
                timerEl.textContent = `Time remaining: ${remainingTime} seconds`; // shows unused time
            }
        }
    }
});

start.addEventListener("click", function () {
    start.classList.add("hide"); // Hide start screen
    quiz.classList.remove("hide"); // Show quiz section
    questionCount = 0; // Initialize the question count
    showQuestion(questionCount); // Display the first question
    countdown();
});

highScoreForm.addEventListener("submit", function(event) {
    event.preventDefault();
    saveHighScore();
    renderHighScores();
    highScoreForm.reset();
});

viewHighScoresLink.addEventListener("click", function(event) {
    event.preventDefault();
    start.classList.add("hide"); // hide start screen
    finalScore.classList.add("hide"); // hide final score screen
    quiz.classList.add("hide"); // hide quiz screen
    highScoreScreen.classList.remove("hide"); // show high score screen
    renderHighScores();
});

restart.addEventListener("click", function (event) {
    clearInterval(timeInterval);
    countdown();
    questionCount = 0; //reset question count
    scoreCount = 0; //reset score
    showQuestion(questionCount); // displays first question
    quiz.classList.remove("hide"); // shows the quiz screen
    finalScore.classList.add("hide"); // hides final score screen
    highScoreScreen.classList.add("hide"); // Hides high score screen
});

clearHighScores.addEventListener("click", function (event) {
    localStorage.removeItem("highScores"); // remove high scores from local storage
    renderHighScores(); // update the score screen to have no scores
})