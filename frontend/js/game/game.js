import { wait2get, centerAndResizeBoard } from "./game_utils.js";
import { Batarang } from "./Batarang.js";
import { Ball } from "./Ball.js";
import { drawBoard, drawEndScreen, renderGame } from "./draw.js";
import { Keystatus, keys_down, keys_up, players_input, getMouseCoord } from "./input.js";
import { menu } from './menu.js'
import { Object } from "./Object.js";

// Global variables
let mode = "";
let map = "";
let colors = "";

export let keystatus;
export let running = 1;

export let player1;
export let player2;
export let ball;
export let ai = 0;
export let aimove = 0;
let frame = 0;

export let buttonReplay;

let ctx;
export let canvas;
export let height = 1080;
export let width = 1920;

export function pause() {
    if (running == 2) {
        running = 1;
        requestAnimationFrame(update);
    }
    else if (running == 1)
        running = 2
}

function checkScored(scored) {
    if (scored == 1) {
        player1.score++;
        ball.x = width / 2 - 30;
        ball.y = height / 2 - 30;
        ball.speed = ball.baseSpeed;
        ball.setAngle(0);
    }
    else if (scored == 2) {
        player2.score++;
        ball.x = width / 2 - 30;
        ball.y = height / 2 - 30;
        ball.speed = ball.baseSpeed;
        ball.setAngle(180);
    }
    if (player1.score == 3) {
        running = 0;
        drawEndScreen(ctx, "caa");
    }
    else if (player2.score == 3) {
        running = 0;
        drawEndScreen(ctx, "caa");
    }
}

function aiThink() {
    var dY = ball.intersectY(player2);
    if (dY > 200)
        aimove = 1;
    else if (dY < -200)
        aimove = 2;
    else
        aimove = 0;
    frame = 0;
}

export function	update() {
    //check and execute enventual input, then let the ball move
    if (ai && frame == 30)
        aiThink();
    players_input();
    //draw the board, the players and the ball
    checkScored(ball.move(player1, player2))
    if (!running || running == 2)
        return;
    frame++;
    renderGame(canvas, ctx);
    requestAnimationFrame(update);
}

export function replayGame() {
    player1.y = height / 2 - 100;
    player1.score = 0;
    player1.speed = 10;
    player2.y = height / 2 - 100;
    player2.score = 0;
    player2.speed = 10;
    ball.x = width / 2 - 30;
    ball.y = height / 2 - 30;
    ball.baseSpeed = 12;
    ball.speed = 12;
    ball.speedCap = 48;
    ball.lastTouched = 0;
    ball.setAngle(45);
    running = 1;
    frame = 0;
    requestAnimationFrame(update);
}

function game_init(colorp1, colorp2) {
    player1 = new Batarang(30, height / 2 - 100, 90, 200, -1, "/static/img/game/batarang_" + colorp1 + ".png", "Player 1");
	player2 = new Batarang(width - 30 - 90, height / 2 - 100, 90, 200, 1, "/static/img/game/batarang_" + colorp2 + ".png", "Player 2");
    ball = new Ball(width / 2 - 30, height / 2 - 30, 60, 60, 3, "/static/img/game/batsign.webp");

    buttonReplay = new Object(width / 2 - 80, height / 2 - 80, 160, 160, "/static/img/game/replayButton.png");

    keystatus = new Keystatus();
    document.addEventListener("keydown", keys_down);
    document.addEventListener("keyup", keys_up);
    document.addEventListener("click", getMouseCoord);
	requestAnimationFrame(update);
}

export function startGame(aiparam, colorp1, colorp2) {
    game_init(colorp1, colorp2);
    ai = aiparam;
    canvas.style.display = '';
    requestAnimationFrame(update);
}

export async function game() {
	canvas = await wait2get('boardpong');
    ctx = canvas.getContext('2d');

    canvas.style.display = 'none';

    menu(canvas);
    centerAndResizeBoard(window.innerWidth, window.innerHeight);
}