// Game Configuration and State
const CONFIG = {
    emojis: ['🍎', '🍌', '🍓', '🥕', '🥑', '🎈', '🚗', '🧸', '🐱', '🐶'],
    feedbackDuration: 1800, // Time in milliseconds before the next round starts
    difficultyMaxValues: {
        easy: 5,
        medium: 10,
        hard: 20
    }
};

let gameState = {
    targetCount: 0,
    score: 0,
    streak: 0,
    isProcessing: false // Prevents multiple submissions during feedback
};

// DOM Elements
const DOM = {
    visualArea: document.getElementById('visualArea'),
    score: document.getElementById('score'),
    streak: document.getElementById('streak'),
    answerInput: document.getElementById('userAnswer'),
    feedback: document.getElementById('feedback'),
    difficulty: document.getElementById('difficulty'),
    submitBtn: document.getElementById('submitBtn')
};

/**
 * Generates a new round of the game based on the selected difficulty.
 */
function generateGame() {
    // Reset UI states
    DOM.visualArea.innerHTML = '';
    DOM.feedback.innerText = '';
    DOM.feedback.className = 'feedback';
    DOM.answerInput.value = '';
    DOM.answerInput.focus();
    gameState.isProcessing = false;

    // Determine difficulty constraints
    const currentDifficulty = DOM.difficulty.value;
    const maxNumber = CONFIG.difficultyMaxValues[currentDifficulty] || 10;

    // Setup targets
    gameState.targetCount = Math.floor(Math.random() * maxNumber) + 1;
    const randomEmoji = CONFIG.emojis[Math.floor(Math.random() * CONFIG.emojis.length)];

    // Render counting items
    for (let i = 0; i < gameState.targetCount; i++) {
        const itemSpan = document.createElement('span');
        itemSpan.className = 'count-item';
        itemSpan.innerText = randomEmoji;
        DOM.visualArea.appendChild(itemSpan);
    }
}

/**
 * Validates the user's answer and updates the score and streak.
 */
function checkAnswer() {
    if (gameState.isProcessing) return;

    const userAns = parseInt(DOM.answerInput.value, 10);
    
    // Check for empty or invalid input
    if (isNaN(userAns)) {
        DOM.feedback.innerText = "Please enter a number first! 🤔";
        DOM.feedback.className = "feedback";
        return;
    }

    gameState.isProcessing = true;
    DOM.submitBtn.disabled = true;

    // Process correctness
    if (userAns === gameState.targetCount) {
        gameState.score++;
        gameState.streak++;
        DOM.feedback.innerText = "Correct! Great job! 🎉";
        DOM.feedback.className = "feedback correct";
    } else {
        gameState.streak = 0;
        DOM.feedback.innerText = `Oops! That was ${gameState.targetCount}. Try the next one! ✨`;
        DOM.feedback.className = "feedback incorrect";
    }

    // Update stats UI
    DOM.score.innerText = gameState.score;
    DOM.streak.innerText = gameState.streak;

    // Advance game after a short pause
    setTimeout(() => {
        DOM.submitBtn.disabled = false;
        generateGame();
    }, CONFIG.feedbackDuration);
}

/**
 * Resets score metrics and triggers a fresh game loop.
 */
function resetGame() {
    gameState.score = 0;
    gameState.streak = 0;
    DOM.score.innerText = gameState.score;
    DOM.streak.innerText = gameState.streak;
    generateGame();
}

// --- Event Listeners ---

// Listen for Enter keypress inside the input box
DOM.answerInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        checkAnswer();
    }
});

// Watch for dropdown changes to instantly reset difficulty
DOM.difficulty.addEventListener('change', resetGame);

// Connect standard button click
DOM.submitBtn.addEventListener('click', checkAnswer);

// Kick off the game on initial load
document.addEventListener('DOMContentLoaded', generateGame);
