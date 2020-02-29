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

export function render(gameState) {
    document.querySelector('#paddle-left').setAttribute('y', gameState.p1.y);
    document.querySelector('#paddle-right').setAttribute('y', gameState.p2.y);
    document.querySelector('#ball').setAttribute('x', gameState.ball.x);
    document.querySelector('#ball').setAttribute('y', gameState.ball.y);
}

export default () => init(gameState);