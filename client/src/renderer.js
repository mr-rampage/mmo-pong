const gameState = {
    p1: {
        x: 0,
        y: 0.5,
        l: 0.1
    },
    p2: {
        x: 1,
        y: 0.5,
        l: 0.1
    },
    ball: {
        x: 0.5,
        y: 0.5,
        r: 0.01
    },
    players: {
        left: [],
        right: []
    }
};

function init(gameState) {
    renderPaddle('#paddle-left', gameState.p1);
    renderPaddle('#paddle-right', gameState.p2);
    renderBall('#ball', gameState.ball);
}

function renderBall(selector, state) {
    const ball = document.querySelector(selector);
    ball.setAttribute('height', state.r);
    ball.setAttribute('width', state.r);
    ball.setAttribute('x', state.x);
    ball.setAttribute('y', state.y);
}

function renderPaddle(selector, state) {
    const paddle = document.querySelector(selector);
    paddle.setAttribute('height', state.l);
    paddle.setAttribute('x', state.x);
    paddle.setAttribute('y', state.y);
}

export function render({p1, p2, ball, players}) {
    document.querySelector('#paddle-left').setAttribute('y', p1.y);
    document.querySelector('#paddle-right').setAttribute('y', p2.y);
    document.querySelector('#ball').setAttribute('x', ball.x);
    document.querySelector('#ball').setAttribute('y', ball.y);
    renderPlayers(players);
}

function renderPlayers(players = { left: [], right: [] }) {
    document.querySelector('#left-count').textContent = players.left.length;
    document.querySelector('#right-count').textContent = players.right.length;
}

function renderScore({leftScore = '-', rightScore = '-'}) {
    document.querySelector('#left-score').textContent = leftScore;
    document.querySelector('#right-score').textContent = rightScore;
}


export default () => init(gameState);