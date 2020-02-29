export default class Game {
  constructor() {
    // world
    this.worldWidth = 1;
    this.worldHeight = 1;
    this.padding = 0.01;

    // ball
    this.x = worldWidth / 2;
    this.y = 0;
    this.dx = 0.04;
    this.dy = 0.04;
    this.ballRadius = 0.1;

    // left player paddle
    this.leftPaddleHeight = 0.3;
    this.leftPaddleWidth = 0.1;
    this.leftPaddleX = padding;
    this.leftPaddleY = worldHeight / 2 - leftPaddleHeight / 2;

    // Right player paddle
    this.rightPaddleHeight = 0.3;
    this.rightPaddleWidth = 0.1;
    this.rightPaddleX = worldWidth - (rightPaddleWidth + padding);
    this.rightPaddleY = worldHeight / 2 - rightPaddleHeight / 2;

    // boolean to handle direction changes
    this.leftUpPressed = false;
    this.leftDownPressed = false;
    this.rightUpPressed = false;
    this.rightDownPressed = false;

    // game score
    this.leftScore = 0;
    this.rightScore = 0;
  }

  handleInput({ leftDecision, rightDecision }) {
    switch (leftDecision.direction) {
      case "UP":
        this.leftUpPressed = true;
        break;
      case "DOWN":
        this.leftDownPressed = true;
        break;
      case "STOP":
        this.leftUpPressed = false;
        this.leftDownPressed = false;
        break;
      default:
        break;
    }

    switch (rightDecision.direction) {
      case "UP":
        this.rightUpPressed = true;
        break;
      case "DOWN":
        this.rightDownPressed = true;
        break;
      case "STOP":
        this.rightUpPressed = false;
        this.rightDownPressed = false;
        break;
      default:
        break;
    }
  }

  collisionsWithLeftPaddle() {
    if (this.x - this.ballRadius <= this.padding + this.leftPaddleWidth) {
      if (
        this.y > this.leftPaddleY &&
        this.y < this.leftPaddleY + this.leftPaddleHeight
      )
        this.dx = -this.dx;
      else if (this.x - this.ballRadius <= 0) {
        this.rightScore++;
        this.x = this.worldWidth / 2;
        this.y = worldHeight / 2;
        this.dx = -this.dx;
        this.dy = -this.dy;
      }
    }
  }

  collisionsWithRightPaddle() {
    if (
      this.x + this.ballRadius >=
      this.worldWidth - (this.rightPaddleWidth + this.padding)
    ) {
      if ( this.y > this.rightPaddleY && this.y < this.rightPaddleY + this.rightPaddleHeight)
        this.dx = -this.dx;
      else if (this.x + this.ballRadius >= this.worldWidth) {
        this.leftScore++;
        //alert("Game Over");
        this.x = worldWidth / 2;
        this.y = worldHeight / 2;
        this.dx = -dx;
        this.dy = -dy;
        //document.location.reload();
      }
    }
  }

  computeCollisionsWithWallsAndPaddle() {
    collisionsWithLeftPaddle();
    collisionsWithRightPaddle();
    if (
      this.y - this.ballRadius <= 0 ||
      this.y + this.ballRadius >= this.worldHeight
    ) {
      this.dy = -dy;
    }
  }

  updateLeftPaddle() {
    if (
      this.leftDownPressed &&
      this.leftPaddleY < this.worldHeight - this.leftPaddleHeight
    ) {
      this.leftPaddleY += 0.7;
    } else if (this.leftUpPressed && this.leftPaddleY > 0) {
      this.leftPaddleY -= 0.7;
    }
  }

  updateRightPaddle() {
    if (
      this.rightDownPressed &&
      this.rightPaddleY < this.worldHeight - this.rightPaddleHeight
    ) {
      this.rightPaddleY += 0.7;
    } else if (this.rightUpPressed && this.rightPaddleY > 0) {
      this.rightPaddleY -= 0.7;
    }
  }
  simulate({ leftPaddleDirection, rightPaddleDirection }) {
    handleInput({ leftPaddleDirection, rightPaddleDirection });
    updateLeftPaddle();
    updateRightPaddle();
    computeCollisionsWithWallsAndPaddle();
    this.x += dx;
    this.y += dy;
    return {
      ball: { x: this.x, y: this.y },
      p1: { x: this.leftPaddleX, y: this.leftPaddleY },
      p2: { x: this.rightPaddleX, y: this.rightPaddleY },
      leftScore: this.leftScore,
      rightScore: this.rightScore
    };
  }
}
