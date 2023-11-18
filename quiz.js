document.addEventListener('DOMContentLoaded', () => {
    const startingPage = document.getElementById('starting-page');
    const quizPage = document.getElementById('quiz-page');
    const endView = document.getElementById('end-view');
    const questionContainer = document.getElementById('question-container');
    const nextBtn = document.getElementById('next-btn');
    const scoreboard = document.getElementById('scoreboard');
    const congratsMessage = document.getElementById('congrats-message');
    const retakeBtn = document.getElementById('retake-btn');
    const returnToStartBtn = document.getElementById('return-to-start-btn');
    const quizSelect = document.getElementById('quiz-select'); // New quiz select element

    let currentQuestionIndex = 0;
    let correctAnswers = 0;
    let startTime;
    let userName;
    let currentQuizData; // Variable to store the current quiz data

    // Hide the "Next" button, end view, and quiz page initially
    nextBtn.style.display = 'none';
    endView.style.display = 'none';
    quizPage.classList.add('hidden');

    // Populate the quiz select menu with options
    quizSelect.innerHTML = `
        <option value="quiz1">Quiz 1</option>
        <option value="quiz2">Quiz 2</option>
    `;

    // Handle starting the quiz
window.startQuiz = async () => {
    userName = document.getElementById('user-name').value;
    const selectedQuiz = quizSelect.value;

    // Set the current quiz data based on the selected quiz
    currentQuizData = await fetchQuizData(selectedQuiz);

    startingPage.style.display = 'none';
    quizPage.classList.remove('hidden');
    nextBtn.style.display = 'block';

    // Initialize scoreboard
    startTime = Date.now();
    updateScoreboard();

    renderQuestion();
};

// Function to fetch quiz data asynchronously
async function fetchQuizData(selectedQuiz) {
    try {
        const response = await fetch(`https://my-json-server.typicode.com/FairoozBintye/CUS1172Project3/${selectedQuiz}`);
        if (!response.ok) {
            throw new Error('Failed to fetch quiz data');
        }

        const quizData = await response.json();
        return quizData;
    } catch (error) {
        console.error(error);
        // Handle error, perhaps show a message to the user
        return [];
    }
}

    // Handle rendering questions
    window.renderQuestion = () => {
        if (currentQuestionIndex < currentQuizData.length) {
            const quizTemplate = Handlebars.compile(document.getElementById('quiz-template').innerHTML);
            questionContainer.innerHTML = quizTemplate(currentQuizData[currentQuestionIndex]);
        } else {
            // Quiz completed, show end view
            endView.style.display = 'block';
           // quizPage.classList.add('hidden');
            nextBtn.style.display = 'none';
            congratsMessage.innerHTML = calculateResult();

            questionContainer.innerHTML = '';
        }
    };

    // Handle moving to the next question
    window.nextQuestion = () => {
        const userAnswer = document.querySelector('input[name="user-answer"]:checked')?.value || document.getElementById('user-answer')?.value;
        const currentQuestion = currentQuizData[currentQuestionIndex];

        // Check the user's answer
        const isCorrect = currentQuestion.inputType === 'text'
            ? userAnswer.toLowerCase() === currentQuestion.correctAnswer.toLowerCase()
            : userAnswer === currentQuestion.correctAnswer;

        // Update correctAnswers and scoreboard
        if (isCorrect) {
            correctAnswers++;
            alert('Correct! Good job!');
        } else {
            // Display the correct answer
            alert(`Incorrect. The correct answer is: ${currentQuestion.correctAnswer}`);
        }
        

        currentQuestionIndex++;

        renderQuestion();
        updateScoreboard();
    };

    // Update the scoreboard
    window.updateScoreboard = () => {
        const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
        scoreboard.innerHTML = `Hello, ${userName}! | Questions answered: ${currentQuestionIndex} | Correct Answers: ${correctAnswers} | Elapsed Time: ${elapsedTime}s`;
    };

    // Calculate the quiz result
    window.calculateResult = () => {
        const scorePercentage = (correctAnswers / currentQuizData.length) * 100;
        if (scorePercentage > 80) {
            return `Congratulations ${userName}! You pass the quiz with a score of ${scorePercentage.toFixed(2)}%`;
        } else {
            return `Sorry ${userName}, you fail the quiz with a score of ${scorePercentage.toFixed(2)}%`;
        }
    };

    // Handle retaking the quiz
    window.retakeQuiz = () => {
        endView.style.display = 'none';
        quizPage.classList.remove('hidden');
        nextBtn.style.display = 'block';
        scoreboard.innerHTML = '';

        currentQuestionIndex = 0;
        correctAnswers = 0;
        renderQuestion();
        updateScoreboard();
    };

    // Handle returning to the starting page
    window.returnToStart = () => {
        endView.style.display = 'none';
        startingPage.style.display = 'block';
        questionContainer.innerHTML = ''; // Clear the question container
        scoreboard.innerHTML = '';

        currentQuestionIndex = 0;
        correctAnswers = 0;
        document.getElementById('user-name').value = '';
        quizSelect.value = 'quiz1';
        congratsMessage.innerHTML = '';

    };
});
