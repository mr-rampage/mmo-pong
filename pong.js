const ball = ballPosition();

export function updateState() {
  return {
    ball: ball.next().value
  }
}

function* ballPosition() {
  const dimensions = { width: 0.1, height: 0.1 }
  const position = { x: 0.5, y: 0.5 };
  const velocity = { x: randomFloat() * 0.05, y: randomFloat() * 0.05 };

  while(true) {
    position.x += velocity.x;
    position.y += velocity.y;


    if ((velocity.y < 0 && position.y <= dimensions.height / 2) || 
        (velocity.y > 0 && position.y >= 1 - dimensions.height / 2)) {
      velocity.y *= -1;
    }
    
    if ((velocity.x < 0 && position.x <= dimensions.width / 2) || 
        (velocity.x > 0 && position.x >= 1 - dimensions.width / 2)) {
      velocity.x *= -1;
    }

    yield position;
  }
}

function randomFloat() {
  return Math.random() * 2 - 1;
}