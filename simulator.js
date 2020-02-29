// world
var worldWidth = 1;
var worldHeight = 1;
var padding = 0.01;

// ball
var x = worldWidth / 2;
var y = 0;
var dx = 0.04;
var dy = 0.04;
var ballRadius = 0.1;

// left player paddle
var leftPaddleHeight = 0.3;
var leftPaddleWidth = 0.1;
var leftPaddleX = padding;
var leftPaddleY = worldHeight / 2 - leftPaddleHeight / 2;

// Right player paddle
var rightPaddleHeight = 0.3;
var rightPaddleWidth = 0.1;
var rightPaddleX = worldWidth - (rightPaddleWidth + padding);
var rightPaddleY = worldHeight / 2 - rightPaddleHeight / 2;

// boolean to handle direction changes
var leftUpPressed = false;
var leftDownPressed = false;
var rightUpPressed = false;
var rightDownPressed = false;

var leftScore = 0;
var rightScore = 0;


function handleInput({ leftPaddle, rightPaddle }){
    switch(leftPaddle.direction) {
        case 'UP':
            leftUpPressed = true;
            break;
        case 'DOWN':
            leftDownPressed = true;
            break;
        case 'STOP':
            leftUpPressed = false;
            leftDownPressed = false;
            break;
        default:
            break;
    }

    switch(rightPaddle.direction) {
        case 'UP':
            rightUpPressed = true;
            break;
        case 'DOWN':
            rightDownPressed = true;
            break;
        case 'STOP':
            rightUpPressed = false;
            rightDownPressed = false;
            break;
        default:
            break;
    }
    
}


function collisionsWithLeftPaddle() {
  if (x - ballRadius <= padding + leftPaddleWidth) {
    if (y > leftPaddleY && y < leftPaddleY + leftPaddleHeight) dx = -dx;
    else if (x - ballRadius <= 0) {
      rightScore++;
      x = worldWidth / 2;
      y = worldHeight / 2;
      dx = -dx;
      dy = -dy;
    }
  }
}

function collisionsWithRightPaddle() {
  if (x + ballRadius >= worldWidth - (rightPaddleWidth + padding)) {
    if (y > rightPaddleY && y < rightPaddleY + rightPaddleHeight) dx = -dx;
    else if (x + ballRadius >= worldWidth) {
      leftScore++;
      //alert("Game Over");
      x = worldWidth / 2;
      y = worldHeight / 2;
      dx = -dx;
      dy = -dy;
      //document.location.reload();
    }
  }
}

function computeCollisionsWithWallsAndPaddle() {
  collisionsWithLeftPaddle();
  collisionsWithRightPaddle();
  if (y - ballRadius <= 0 || y + ballRadius >= worldHeight) {
    dy = -dy;
  }
}

function updateLeftPaddle() {
  if (leftDownPressed && leftPaddleY < worldHeight - leftPaddleHeight) {
    leftPaddleY += 0.7;
  } else if (leftUpPressed && leftPaddleY > 0) {
    leftPaddleY -= 0.7;
  }
}

function updateRightPaddle() {
  if (rightDownPressed && rightPaddleY < worldHeight - rightPaddleHeight) {
    rightPaddleY += 0.7;
  } else if (rightUpPressed && rightPaddleY > 0) {
    rightPaddleY -= 0.7;
  }
}

export function simulate({ leftPaddleDirection, rightPaddleDirection }) {
  handleInput({ leftPaddleDirection, rightPaddleDirection });
  updateLeftPaddle();
  updateRightPaddle();
  computeCollisionsWithWallsAndPaddle();
  x += dx;
  y += dy;
  return { ballX: x, ballY: y, leftScore, rightScore };
}