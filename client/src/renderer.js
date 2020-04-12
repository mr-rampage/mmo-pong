export function init(gameState) {
    renderBall('#ball', gameState.ball);
    renderPaddle('#paddle-left', gameState.paddles.left);
    renderPaddle('#paddle-right', gameState.paddles.right);
}

function renderBall(selector, state) {
    const ball = document.querySelector(selector);
    ball.setAttribute('height', state.dimension.height);
    ball.setAttribute('width', state.dimension.width);
    ball.setAttribute('x', state.position.x);
    ball.setAttribute('y', state.position.y);
    ball.setAttribute('transform', `translate(${-state.dimension.width / 2}, ${-state.dimension.height / 2})`);
}

function renderPaddle(selector, state) {
    const paddle = document.querySelector(selector);
    paddle.setAttribute('height', state.dimension.height);
    paddle.setAttribute('width', state.dimension.width);
    paddle.setAttribute('x', state.position.x);
    paddle.setAttribute('y', state.position.y);
    paddle.setAttribute('transform', `translate(${-state.dimension.width / 2}, ${-state.dimension.height / 2})`);
}

export function updateGameState(gameState) {
    window.requestAnimationFrame(() => render(gameState));
}

export function render(gameState) {
//    updatePaddles(gameState);
    updateBall(gameState);
//    updatePlayerCounts(gameState.players, gameState.youAreLeft);
//    updateScores(gameState);
}

function updateBall({ball}) {
    document.querySelector('#ball').setAttribute('x', ball.x);
    document.querySelector('#ball').setAttribute('y', ball.y);
}

function updatePaddles({p1, p2}) {
    document.querySelector('#paddle-left').setAttribute('y', p1.y);
    document.querySelector('#paddle-right').setAttribute('y', p2.y);
}

function updatePlayerCounts(players = { left: [], right: [] }, youAreLeft = false) {
    document.querySelector('#left-count').textContent = `${youAreLeft ? '->' : ''} ${players.left.length}`;
    document.querySelector('#right-count').textContent = `${youAreLeft ? '' : '->'} ${players.right.length}`;
}

function updateScores({leftScore, rightScore}) {
    document.querySelector('#left-score').textContent = leftScore.toString();
    document.querySelector('#right-score').textContent = rightScore.toString();
}