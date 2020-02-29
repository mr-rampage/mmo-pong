export default class Game {
  constructor() {
    // world
    this.worldWidth = 1;
    this.worldHeight = 1;
    this.padding = 0;

    // ball
    this.x = this.worldWidth / 2;
    this.y = 0;
    this.dx = 0.04;
    this.dy = 0.04;
    this.ballRadius = 0.1;

    // left player paddle
    this.leftPaddleHeight = 0.3;
    this.leftPaddleWidth = 0;
    this.leftPaddleX = this.padding;
    this.leftPaddleY = this.worldHeight / 2 - this.leftPaddleHeight / 2;

    // Right player paddle
    this.rightPaddleHeight = 0.3;
    this.rightPaddleWidth = 0;
    this.rightPaddleX = this.worldWidth - (this.rightPaddleWidth + this.padding);
    this.rightPaddleY = this.worldHeight / 2 - this.rightPaddleHeight / 2;

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
    switch (leftDecision) {
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

    switch (rightDecision) {
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
        this.y = this.worldHeight / 2;
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
        this.x = this.worldWidth / 2;
        this.y = this.worldHeight / 2;
        this.dx = -this.dx;
        this.dy = -this.dy;
        //document.location.reload();
      }
    }
  }

  computeCollisionsWithWallsAndPaddle() {
    this.collisionsWithLeftPaddle();
    this.collisionsWithRightPaddle();
    if (
      this.y - this.ballRadius <= 0 ||
      this.y + this.ballRadius >= this.worldHeight
    ) {
      this.dy = -this.dy;
    }
  }

  updateLeftPaddle() {
    if (
      this.leftDownPressed 
    ) {
      this.leftPaddleY += 0.07;
      this.leftPaddleY  = Math.min(1, this.leftPaddleY);
    } else if (this.leftUpPressed) {
      this.leftPaddleY -= 0.07;
      this.leftPaddleY = Math.max(0, this.leftPaddleY);
    }
  }

  updateRightPaddle() {
    if (
      this.rightDownPressed &&
      this.rightPaddleY < this.worldHeight - this.rightPaddleHeight
    ) {
      this.rightPaddleY -= 0.07;
    } else if (this.rightUpPressed && this.rightPaddleY > 0) {
      this.rightPaddleY += 0.07;
    }
  }
  simulate({ leftDecision, rightDecision }) {
    this.handleInput({ leftDecision, rightDecision });
    this.updateLeftPaddle();
    this.updateRightPaddle();
    this.computeCollisionsWithWallsAndPaddle();
    this.x += this.dx;
    this.y += this.dy;
    return {
      ball: { x: this.x, y: this.y },
      p1: { x: this.leftPaddleX, y: this.leftPaddleY },
      p2: { x: this.rightPaddleX, y: this.rightPaddleY },
      leftScore: this.leftScore,
      rightScore: this.rightScore
    };
  }
}
