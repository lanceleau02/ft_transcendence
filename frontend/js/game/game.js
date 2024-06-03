import { wait2get, centerAndResizeBoard } from "./game_utils.js";
import { Batarang } from "./Batarang.js";
import { Ball } from "./Ball.js";
import { drawBoard, drawEndScreen, renderGame } from "./draw.js";
import { Keystatus, keys_down, keys_up, players_input, getMouseCoord } from "./input.js";
import { menu } from './menu.js'
import { Object } from "./Object.js";
import { Player } from "./Player.js";
import { Tournament } from "./Tournament.js";
import { AI } from "./AI.js";

// Global variables
let mode = "";
let map = "";
let colors = "";

export let keystatus;
export let running = 1;
export let nInterval;

export let tournament;
export let match;
export let batarang1;
export let batarang2;
export let ball;
export let ai;
let countdown;

export let buttonReplay;

let ctx;
export let canvas;
export let height = 1080;
export let width = 1920;

let currentUserId;
let csrfesse;

function submitMatchForm(winnerId, loserId, score) {
    $.ajax({
        url: "https://localhost:8000/batpong/",  // Update with the URL name of your view
        type: "POST",
        data: {
            'winner': winnerId,
            'loser': loserId,
            'score': score,
            'csrfmiddlewaretoken': csrfesse
        },
        success: function(response) {
            if (response.MatchForm) {
                alert("Match saved! Winner: " + response.winner + ", Loser: " + response.loser + ", Score: " + response.score);
            } else {
                alert("Error: " + response.errors);
            }
        },
        error: function(xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
}

export function pause() {
    if (running == 2) {
        running = 1;
        if (countdown < 180)
            nInterval = setInterval(requestAnimationFrame, 14, startMatch);
        else
            nInterval = setInterval(requestAnimationFrame, 14, update);
    }
    else if (running == 1) {
        running = 2
        clearInterval(nInterval);
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'yellow';
        ctx.fillRect(canvas.width - 150, 150, 20, 80);
        ctx.fillRect(canvas.width - 110, 150, 20, 80);
        ctx.textAlign = "center";
        ctx.font = "40px Comic Sans MS";
        ctx.fillStyle = 'yellow';
        ctx.fillText("Current match:", width / 2, height - 300, width / 2);
        var str = match.p1.alias + " vs " + match.p2.alias;
        ctx.fillText(str, width / 2, height - 250, width / 2);
        var nextmatch = tournament.get_next_match();
        if (!nextmatch && !tournament.qualified.length)
            return ;
        ctx.fillText("Next match:", width / 2, height - 100, width / 2);
        if (!nextmatch && tournament.qualified.length)
            str = tournament.qualified[0].alias + " vs winner";
        else
            str = nextmatch.p1.alias + " vs " + nextmatch.p2.alias;
        ctx.fillText(str, width / 2, height - 50, width / 2);
    }
}

function checkScored(scored) {
    if (scored == 1) {
        batarang1.score++;
        ball.x = width / 2 - 30;
        ball.y = height / 2 - 30;
        ball.speed = ball.baseSpeed;
        ball.setAngle(0);
        ai.frame = 30;
    }
    else if (scored == 2) {
        batarang2.score++;
        ball.x = width / 2 - 30;
        ball.y = height / 2 - 30;
        ball.speed = ball.baseSpeed;
        ball.setAngle(180);
    }
    if (batarang1.score == 3) {
        drawEndScreen(ctx, match.p1.alias, match.p1.color);
        if (running && (match.p1.is_auth || match.p2.is_auth))
            if (match.p1.is_auth)
                submitMatchForm(currentUserId, '', batarang1.score + '-' + batarang2.score);
            else
                submitMatchForm('', currentUserId, batarang1.score + '-' + batarang2.score);
        running = 0;
    }
    else if (batarang2.score == 3) {
        drawEndScreen(ctx, match.p2.alias, match.p2.color);
        if (running && (match.p1.is_auth || match.p2.is_auth))
            if (match.p1.is_auth)
                submitMatchForm('', currentUserId, batarang2.score + '-' + batarang1.score);
            else
                submitMatchForm(currentUserId, '', batarang2.score + '-' + batarang1.score);
        running = 0;
    }
}

function startMatch() {
    if (running == 2)
        return ;
    renderGame(canvas, ctx);
    if (countdown < 60)
        ctx.fillText("3", width / 2, height / 2, width / 2);
    else if (countdown < 120)
        ctx.fillText("2", width / 2, height / 2, width / 2);
    else if (countdown < 180)
        ctx.fillText("1", width / 2, height / 2, width / 2);
    else {
        clearInterval(nInterval);
        nInterval = setInterval(requestAnimationFrame, 14, update);
        return;
    }
    countdown++;
}

export function	update() {
    //check and execute enventual input, then let the ball move
    ai.check(batarang2, ball);
    players_input(batarang1, batarang2);
    //draw the board, the players and the ball
    checkScored(ball.move(batarang1, batarang2))
    if (!running || running == 2) {
        clearInterval(nInterval);
        nInterval = -1;
        return;
    }
    renderGame(canvas, ctx);
}

export function replayGame() {
    batarang1.y = height / 2 - 100;
    batarang1.score = 0;
    batarang1.speed = 10;
    batarang2.y = height / 2 - 100;
    batarang2.score = 0;
    batarang2.speed = 10;
    ball.x = width / 2 - 30;
    ball.y = height / 2 - 30;
    ball.speed = 10;
    ball.baseSpeed = ball.speed;
    ball.speedCap = ball.speed * 3;
    ball.lastTouched = 0;
    ball.angle = 45 - Math.floor(Math.random() * 91);
    running = 1;
    ai.frame = 0;
    ai.move = 0;
    countdown = 0;
    nInterval = setInterval(requestAnimationFrame, 14, startMatch);
}

export function nextMatch() {
    match = tournament.get_current_match();

    game_init(match.p1.color, match.p2.color);
    replayGame()
}

function game_init(colorp1, colorp2) {
    // players = { new Player() };
    batarang1 = new Batarang(30, height / 2 - 100, 90, 200, -1, "/static/img/game/batarang_" + colorp1 + ".png", "Player 1");
	batarang2 = new Batarang(width - 30 - 90, height / 2 - 100, 90, 200, 1, "/static/img/game/batarang_" + colorp2 + ".png", "Player 2");
    ball = new Ball(width / 2 - 30, height / 2 - 30, 60, 60, "/static/img/game/batsign.webp");

    buttonReplay = new Object(width / 2 - 175, height / 2 + 200, 350, 120, "/static/img/game/button_template.png");

    keystatus = new Keystatus();
    document.addEventListener("keydown", keys_down);
    document.addEventListener("keyup", keys_up);
    document.addEventListener("click", getMouseCoord);
    countdown = 0;
}

export function startGame(aiparam, players) {
    tournament = new Tournament(players);
    match = tournament.get_current_match();

    game_init(players[0].color, players[1].color);
    ai = new AI(aiparam);
    canvas.style.display = '';
    nInterval = setInterval(requestAnimationFrame, 14, startMatch);
}

export async function game() {
	canvas = await wait2get('boardpong');
    ctx = canvas.getContext('2d');
    currentUserId = document.getElementById("userid").textContent;
    csrfesse = document.getElementById("csrfesse").firstChild.value;

    canvas.style.display = 'none';

    menu(canvas);
    centerAndResizeBoard(window.innerWidth, window.innerHeight);
}