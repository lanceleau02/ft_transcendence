import { wait2get, centerAndResizeBoard } from "./game_utils.js";
import { Batarang } from "./Batarang.js";
import { Ball } from "./Ball.js";
import { drawRotatedImage, drawBoard, drawEndScreen } from "./draw.js";
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
let ball;

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
        ball.setAngle(0);
    }
    else if (scored == 2) {
        player2.score++;
        ball.x = width / 2 - 30;
        ball.y = height / 2 - 30;
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

export function	update() {
    //check and execute enventual input, then let the ball move
    players_input();
    if (!running || running == 2)
        return;
    //draw the board, the players and the ball
    drawBoard(canvas, ctx);
	ctx.fillText(player1.x + ", " + player1.y + ' | ' + ball.angle, 10, 10);
    ctx.fillStyle = 'blue';
    ctx.fillRect(player1.x, player1.y, player1.w, player1.h);
    ctx.fillStyle = 'red';
    ctx.fillRect(player2.x, player2.y, player2.w, player2.h);
    drawRotatedImage(ctx, player1, 90, player1.x, player1.y);
    drawRotatedImage(ctx, player2, -90, player2.x, player2.y);
    drawRotatedImage(ctx, ball, ball.angle, ball.x, ball.y);
    checkScored(ball.move(player1, player2))
    requestAnimationFrame(update);
}

export function game_init() {
    player1 = new Batarang(30, height / 2 - 100, 90, 200, -1, "/static/img/game/batarang_blue.png", "Player 1");
	player2 = new Batarang(width - 30 - 90, height / 2 - 100, 90, 200, 1, "/static/img/game/batarang_red.png", "Player 2");
    ball = new Ball(width / 2 - 30, height / 2 - 30, 60, 60, 3, "/static/img/game/batsign.webp");

    buttonReplay = new Object(width / 2 - 80, height / 2 - 80, 160, 160, "/static/img/game/replayButton.png");

    keystatus = new Keystatus();
    document.addEventListener("keydown", keys_down);
    document.addEventListener("keyup", keys_up);
    document.addEventListener("click", getMouseCoord);
	requestAnimationFrame(update);
    console.log('prout');
}

export async function game() {
	canvas = await wait2get('boardpong');
    ctx = canvas.getContext('2d');

    canvas.style.display = 'none';

    menu(canvas);
    centerAndResizeBoard(window.innerWidth, window.innerHeight);
}