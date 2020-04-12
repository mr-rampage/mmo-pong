const players = {};

const paddles = Object.seal({
  left: makeMoveable({ x: 0.025, y: 0.5 }, { width: 0.05, height: 0.3 }),
  right: makeMoveable({ x: 0.975, y: 0.5 }, { width: 0.05, height: 0.3 }),
});

const ball = makeMoveable(
  { x: 0.5, y: 0.5 },
  { width: 0.05, height: 0.05 },
  randomVector()
);

export function updatePlayer(id, y) {
  if (!players[id]) {
    addPlayer(id, paddles);
  }
  players[id].y = y;
}

function addPlayer(id, paddles) {
  const team = Object.keys(paddles)[Math.round(Math.random())];
  players[id] = { team, y: 0.5 };
}

function updatePaddleVelocity(players, paddles) {
  const readings = Object.values(players)
    .reduce((velocity, {team, y}) => {
      velocity[team].count += 1;
      velocity[team].y += y;
      return velocity;
    }, {left: { count: 0, y: 0}, right: { count: 0, y: 0 }})

  const vector = {
    left: {y: (readings.left.y / readings.left.count) - paddles.left.position.y},
    right: {y: (readings.right.y / readings.right.count) - paddles.right.position.y}
  };

  paddles.left.velocity.y = isNaN(vector.left.y) ? 0 : Math.max(Math.min(vector.left.y, 0.16), -0.16);
  paddles.right.velocity.y = isNaN(vector.right.y) ? 0 : Math.max(Math.min(vector.right.y, 0.16), -0.16);
}

export function getInitialState() {
  return { paddles, ball }
}

const state = main(ball, paddles, players);

export function getGameState() {
  return state.next().value;
}

function* main(ball, paddles, players) {
  while (true) {
    updatePaddleVelocity(players, paddles);

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
      const velocity = randomVector();
      ball.velocity.x = velocity.x;
      ball.velocity.y = velocity.y;
      ball.position.x = 0.5;
      ball.position.y = 0.5;
    }

    paddles.left.position.y += paddles.left.velocity.y;
    paddles.left.position.y = Math.max(Math.min(paddles.left.position.y, 1), 0);

    paddles.right.position.y += paddles.right.velocity.y;
    paddles.right.position.y = Math.max(Math.min(paddles.right.position.y, 1), 0);

    ball.position.x += ball.velocity.x;
    ball.position.x = Math.max(Math.min(ball.position.x, 1), 0);

    ball.position.y += ball.velocity.y;
    ball.position.y = Math.max(Math.min(ball.position.y, 1), 0);

    yield {
      ball: { ...ball.position },
      paddles: {
        left: paddles.left.position,
        right: paddles.right.position
      }
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
  return Math.random() * 0.033 - 0.016;
}

function randomVector() {
  return {
    x: randomFloat() * 2,
    y: randomFloat()
  }
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