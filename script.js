const board = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('high-score');

const boardSize = 10; // 10x10 grid
const cellSize = 30; // Each cell is 30px
let snake = [{ x: 0, y: 0 }];
let apple = { x: 5, y: 5 };
let direction = { x: 1, y: 0 };
let score = 0;
let highScore = 0;
let gameInterval;

// Initialize the game
function initGame() {
    snake = [{ x: 0, y: 0 }];
    direction = { x: 1, y: 0 };
    apple = { x: 5, y: 5 };
    score = 0;
    updateScore();
    clearInterval(gameInterval);
    render();
    gameInterval = setInterval(moveSnake, 200);
}

// Render the game objects
function render() {
    // Clear the board
    board.innerHTML = '';

    // Render the snake
    snake.forEach(segment => {
        const snakeElement = document.createElement('div');
        snakeElement.classList.add('snake');
        snakeElement.style.transform = `translate(${segment.x * cellSize}px, ${segment.y * cellSize}px)`;
        board.appendChild(snakeElement);
    });

    // Render the apple
    const appleElement = document.createElement('div');
    appleElement.classList.add('apple');
    appleElement.style.transform = `translate(${apple.x * cellSize}px, ${apple.y * cellSize}px)`;
    board.appendChild(appleElement);
}

// Move the snake
function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Check for collision with walls
    if (head.x < 0 || head.x >= boardSize || head.y < 0 || head.y >= boardSize) {
        gameOver();
        return;
    }

    // Check for collision with itself
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    // Add the new head to the snake
    snake.unshift(head);

    // Check if the snake eats the apple
    if (head.x === apple.x && head.y === apple.y) {
        score++;
        updateScore();
        placeApple();
    } else {
        // Remove the tail if no apple is eaten
        snake.pop();
    }

    render();
}

// Update the score display
function updateScore() {
    scoreDisplay.textContent = score;
    if (score > highScore) {
        highScore = score;
        highScoreDisplay.textContent = highScore;
    }
}

// Place a new apple on the board
function placeApple() {
    do {
        apple = {
            x: Math.floor(Math.random() * boardSize),
            y: Math.floor(Math.random() * boardSize)
        };
    } while (snake.some(segment => segment.x === apple.x && segment.y === apple.y));
}

// Handle swipe input for mobile
let touchStartX = 0;
let touchStartY = 0;

window.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

window.addEventListener('touchend', e => {
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    const deltaY = e.changedTouches[0].clientY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0 && direction.x !== -1) direction = { x: 1, y: 0 }; // Swipe right
        else if (deltaX < 0 && direction.x !== 1) direction = { x: -1, y: 0 }; // Swipe left
    } else {
        if (deltaY > 0 && direction.y !== -1) direction = { x: 0, y: 1 }; // Swipe down
        else if (deltaY < 0 && direction.y !== 1) direction = { x: 0, y: -1 }; // Swipe up
    }
});

// Game over
function gameOver() {
    alert(`Game Over! Your score: ${score}`);
    initGame();
}

// Start the game
initGame();
