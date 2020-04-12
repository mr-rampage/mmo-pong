const paddles = Object.seal({
  left: makeMoveable({ x: 0.025, y: 0.5 }, { width: 0.05, height: 0.3 }),
  right: makeMoveable({ x: 0.975, y: 0.5 }, { width: 0.05, height: 0.3 }),
});
const ball = ballPosition(paddles);

export function getGameState() {
  return ball.next().value;
}

function makeMoveable(position, dimension, velocity = { x: 0, y: 0 }) {
  return Object.seal({
    dimension: Object.freeze(dimension),
    position: Object.seal(position),
    velocity: Object.seal(velocity)
  });
}

function* ballPosition(paddles) {
  const ball = makeMoveable(
    { x: 0.5, y: 0.5 },
    { width: 0.1, height: 0.1 },
    { x: randomFloat() * 0.05, y: randomFloat() * 0.05 },
  );

  while (true) {
    if (collidesLeftPaddle(ball, paddles.left) || collidesRightPaddle(ball, paddles.right)) {
      ball.velocity = ballVelocityOnCollision(ball,
        ball.velocity.x < 0 ? paddles.left : paddles.right);
    } else {
      if (atTopEdge(ball) || atBottomEdge(ball)) {
        ball.velocity.y *= -1;
      }

      if (atRightEdge(ball) || atLeftEdge(ball)) {
        ball.velocity.x *= -1;
      }
    }

    ball.position.x += ball.velocity.x;
    ball.position.y += ball.velocity.y;

    yield {
      ball: { ...ball.position, ...ball.dimension }
    };
  }
}

function ballVelocityOnCollision(ball, paddle) {
  return {
    x: -ball.velocity.x,
    y: paddle.velocity.y ? (ball.velocity.y + paddle.velocity.y) / 2 : ball.velocity.y
  };
}

function collidesLeftPaddle(ball, paddle) {
  return ball.velocity.x < 0 &&
    leftEdge(ball) <= rightEdge(paddle) &&
    topEdge(ball) > bottomEdge(paddle) &&
    bottomEdge(ball) < topEdge(paddle)
}

function collidesRightPaddle(ball, paddle) {
  return ball.velocity.x > 0 &&
    rightEdge(ball) >= leftEdge(paddle) &&
    topEdge(ball) > bottomEdge(paddle) &&
    bottomEdge(ball) < topEdge(paddle)
}

function randomFloat() {
  return Math.random() * 2 - 1;
}

function topEdge({ position, dimension }) {
  return position.y + dimension.height / 2;
}

function bottomEdge({ position, dimension }) {
  return position.y - dimension.height / 2;
}

function rightEdge({ position, dimension }) {
  return position.x + dimension.width / 2;
}

function leftEdge({ position, dimension }) {
  return position.x - dimension.width / 2;
}

function atTopEdge(ball) {
  return ball.velocity.y > 0 && topEdge(ball) >= 1;
}

function atBottomEdge(ball) {
  return ball.velocity.y < 0 && bottomEdge(ball) <= 0;
}

function atRightEdge(ball) {
  return ball.velocity.x > 0 && rightEdge(ball) >= 1;
}

function atLeftEdge(ball) {
  return ball.velocity.x < 0 && leftEdge(ball) <= 0;
}