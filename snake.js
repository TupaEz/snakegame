const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const canvasSize = 400;

let snake = [{x:80, y:80}];
let snakeDirection = 'RIGHT';
let dx = gridSize;
let dy = 0;

let food = [{x:160, y:160}];
let score = 0;
let hasEaten = false;

let lastRenderTime = 0;
const gameSpeed = 5;

function drawSnake() {
    snake.forEach(segment => {
        ctx.fillStyle = 'green';
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });
}

function moveSnake(){
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    
    if(!hasEaten) snake.pop();
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    drawScore();
}

function checkIfEaten() {
    if(snake[0].x === food[0].x && snake[0].y === food[0].y) {
        hasEaten = true;
        score++;
        spawnFood();
    } else hasEaten = false;
}

    function spawnFood() {
        let randomX, randomY;
        do {
        randomX = Math.floor(Math.random()*(canvas.width/gridSize))*gridSize;
        randomY = Math.floor(Math.random()*(canvas.height/gridSize))*gridSize;
        } while (isFoodOnSnake(randomX, randomY));
        food[0] = { x: randomX, y: randomY};
    }

function isFoodOnSnake(x, y) {
    return snake.some(segment => segment.x === x && segment.y === y);
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food[0].x, food[0].y, gridSize, gridSize);
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30)
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const UP_KEY = 38;
    const RIGHT_KEY = 39;
    const DOWN_KEY = 40;

    if(event.keyCode === LEFT_KEY && snakeDirection !== 'RIGHT') {
        dx = -gridSize;
        dy = 0;
        snakeDirection = 'LEFT';
    } else if (event.keyCode === UP_KEY && snakeDirection !== 'DOWN') {
        dx = 0
        dy = -gridSize;
        snakeDirection = 'UP';
    } else if (event.keyCode === RIGHT_KEY && snakeDirection !== 'LEFT') {
        dx = gridSize;
        dy = 0;
        snakeDirection = 'RIGHT';
    } else if (event.keyCode === DOWN_KEY && snakeDirection !== 'UP') {
        dx = 0;
        dy = gridSize;
        snakeDirection = 'DOWN';
    }
}

function checkCollisionsWithWalls() {
    const head = snake[0];

    if(head.x<0 || head.x >= canvas.width || head.y<0 || head.y>=canvas.height) {
        alert('Game Over');
        document.location.reload();
    }
}

function checkCollisionWithSelf() {
    const head = snake[0];
    for(let i = 3; i<snake.length; i++) {
        if(snake[i].x === head.x && snake[i].y === head.y) {
            alert('Game Over');
            document.location.reload();
        }
    }
}

document.addEventListener('keydown', changeDirection);

function gameLoop(currentTime) {
    if(currentTime - lastRenderTime >= 1000/ gameSpeed) {
    update()
    lastRenderTime = currentTime;
}
    requestAnimationFrame(gameLoop);
} 
gameLoop();

function update() {
    moveSnake();
    checkIfEaten();
    checkCollisionsWithWalls();
    checkCollisionWithSelf();

    drawGame();
}
