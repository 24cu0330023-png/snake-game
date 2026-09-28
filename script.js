const canvas = document.getElementById("game-board");
const context = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const messageDisplay = document.getElementById("game-message");
const restartButton = document.getElementById("restart-button");

const cellSize = 20;
const boardSize = canvas.width / cellSize;
const gameSpeed = 120;

let snake;
let food;
let direction;
let nextDirection;
let score;
let gameOver;
let gameTimer;

function startGame() {
  clearInterval(gameTimer);
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ];
  direction = { x: 1, y: 0 };
  nextDirection = { ...direction };
  score = 0;
  gameOver = false;
  scoreDisplay.textContent = score;
  messageDisplay.textContent = "Use the arrow keys to move.";
  placeFood();
  drawGame();
  gameTimer = setInterval(updateGame, gameSpeed);
}

function placeFood() {
  do {
    food = {
      x: Math.floor(Math.random() * boardSize),
      y: Math.floor(Math.random() * boardSize),
    };
  } while (snake.some((segment) => segment.x === food.x && segment.y === food.y));
}

function updateGame() {
  if (gameOver) return;

  direction = nextDirection;
  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };
  const eatingFood = head.x === food.x && head.y === food.y;
  const bodyToCheck = eatingFood ? snake : snake.slice(0, -1);
  const hitWall = head.x < 0 || head.x >= boardSize || head.y < 0 || head.y >= boardSize;
  const hitSelf = bodyToCheck.some((segment) => segment.x === head.x && segment.y === head.y);

  if (hitWall || hitSelf) {
    endGame();
    return;
  }

  snake.unshift(head);
  if (eatingFood) {
    score += 1;
    scoreDisplay.textContent = score;
    placeFood();
  } else {
    snake.pop();
  }

  drawGame();
}

function drawGame() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "#e24b3b";
  context.fillRect(food.x * cellSize, food.y * cellSize, cellSize, cellSize);

  snake.forEach((segment, index) => {
    context.fillStyle = index === 0 ? "#246b36" : "#3d9b50";
    context.fillRect(
      segment.x * cellSize + 1,
      segment.y * cellSize + 1,
      cellSize - 2,
      cellSize - 2,
    );
  });
}

function endGame() {
  gameOver = true;
  clearInterval(gameTimer);
  messageDisplay.textContent = `Game over! Your score: ${score}. Press Restart Game to play again.`;
}

document.addEventListener("keydown", (event) => {
  const keyDirections = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
  };
  const requestedDirection = keyDirections[event.key];

  if (!requestedDirection) return;
  event.preventDefault();

  const isOpposite =
    requestedDirection.x === -direction.x && requestedDirection.y === -direction.y;
  if (!isOpposite && !gameOver) {
    nextDirection = requestedDirection;
  }
});

restartButton.addEventListener("click", startGame);
startGame();