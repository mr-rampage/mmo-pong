const paddles = Object.seal({
  left: makeMoveable({ x: 0.025, y: 0.5 }, { width: 0.05, height: 0.3 }),
  right: makeMoveable({ x: 0.975, y: 0.5 }, { width: 0.05, height: 0.3 }),
});

const ball = makeMoveable(
  { x: 0.5, y: 0.5 },
  { width: 0.1, height: 0.1 },
  { x: randomFloat() * 0.05, y: randomFloat() * 0.05 },
);

export function getInitialState() {
  return { paddles, ball }
}

const state = main(ball, paddles);

export function getGameState() {
  return state.next().value;
}

function* main(ball, paddles) {
  while (true) {
    if (collidesRightPaddle(ball, paddles.right)) {
      ball.velocity = ballVelocityOnCollision(ball, paddles.right);
    }
    
    if (collidesLeftPaddle(ball, paddles.left)) {
      ball.velocity = ballVelocityOnCollision(ball, paddles.left)
    }
  
    if (atTopEdge(ball) || atBottomEdge(ball)) {
      ball.velocity.y *= -1;
    }

    if (atRightEdge(ball) || atLeftEdge(ball)) {
      ball.velocity.x *= -1;
    }

    ball.position.x += ball.velocity.x;
    ball.position.y += ball.velocity.y;

    yield {
      ball: { ...ball.position }
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

function makeMoveable(position, dimension, velocity = { x: 0, y: 0 }) {
  return Object.seal({
    dimension: Object.freeze(dimension),
    position: Object.seal(position),
    velocity: Object.seal(velocity)
  });
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
  return topEdge(ball) >= 1;
}

function atBottomEdge(ball) {
  return bottomEdge(ball) <= 0;
}

function atRightEdge(ball) {
  return rightEdge(ball) >= 1;
}

function atLeftEdge(ball) {
  return leftEdge(ball) <= 0;
}