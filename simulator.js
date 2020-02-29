
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 4;
var dy = -4;
var ballRadius = 10;

// left player paddle
var leftPaddleHeight = 90;
var leftPaddleWidth = 15;
var leftPaddleX = 5;
var leftPaddleY = canvas.height / 2 - leftPaddleHeight / 2;

// Right player paddle
var rightPaddleHeight = 90;
var rightPaddleWidth = 15;
var rightPaddleX = canvas.width - (rightPaddleWidth + 5);
var rightPaddleY = canvas.height / 2 - rightPaddleHeight / 2;

// boolean to handle pressed keys
var leftUpPressed = false;
var leftDownPressed = false;
var rightUpPressed = false;
var rightDownPressed = false;

var leftScore = 0;
var rightScore = 0;

function keyDownHandler(e) {
  if (e.keyCode == 90) {
    leftUpPressed = true;
  } else if (e.keyCode == 83) {
    leftDownPressed = true;
  }
  if (e.keyCode == 38) {
    rightUpPressed = true;
  } else if (e.keyCode == 40) {
    rightDownPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode == 90) {
    leftUpPressed = false;
  } else if (e.keyCode == 83) {
    leftDownPressed = false;
  }
  if (e.keyCode == 38) {
    rightUpPressed = false;
  } else if (e.keyCode == 40) {
    rightDownPressed = false;
  }
}

function collisionsWithLeftPaddle() {
  if (x - ballRadius <= 5 + leftPaddleWidth) {
    if (y > leftPaddleY && y < leftPaddleY + leftPaddleHeight) dx = -dx;
    else if (x - ballRadius <= 0) {
      rightScore++;
      x = canvas.width / 2;
      y = canvas.height / 2;
      dx = -dx;
      dy = -dy;
    }
  }
}

function collisionsWithRightPaddle() {
  if (x + ballRadius >= canvas.width - (rightPaddleWidth + 5)) {
    if (y > rightPaddleY && y < rightPaddleY + rightPaddleHeight) dx = -dx;
    else if (x + ballRadius >= canvas.width) {
      leftScore++;
      //alert("Game Over");
      x = canvas.width / 2;
      y = canvas.height / 2;
      dx = -dx;
      dy = -dy;
      //document.location.reload();
    }
  }
}

function computeCollisionsWithWallsAndPaddle() {
  collisionsWithLeftPaddle();
  collisionsWithRightPaddle();
  if (y - ballRadius <= 0 || y + ballRadius >= canvas.height) {
    dy = -dy;
  }
}

function updateLeftPaddle() {
  if (leftDownPressed && leftPaddleY < canvas.height - leftPaddleHeight) {
    leftPaddleY += 7;
  } else if (leftUpPressed && leftPaddleY > 0) {
    leftPaddleY -= 7;
  }
}

function updateRightPaddle() {
  if (rightDownPressed && rightPaddleY < canvas.height - rightPaddleHeight) {
    rightPaddleY += 7;
  } else if (rightUpPressed && rightPaddleY > 0) {
    rightPaddleY -= 7;
  }
}

function draw() {
  updateLeftPaddle();
  updateRightPaddle();
  computeCollisionsWithWallsAndPaddle();
  x += dx;
  y += dy;
}

setInterval(draw, 10);
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
