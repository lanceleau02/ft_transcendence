import { wait2get, centerAndResizeBoard } from "./game_utils.js";
import { Batarang } from "./Batarang.js";
import { Ball } from "./Ball.js";
import { drawEndScreen, drawPauseMenu, renderGame, drawCountdown } from "./draw.js";
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

export let dict;
let dictEN = [ "Current match:", "Next match:", "winner", "Winner:", "Replay", "Next match" ];
let dictFR = [ "Match actuel:", "Match suivant:", "vaiqueur", "Vainqueur:", "Rejouer", "Match suivant" ];
let dictES = [ "Partido actual:", "Siguiente partido:", "ganador", "Ganador:", "Repetir", "Siguiente partido" ]

export let keystatus;
export let running = 1;
export let nInterval;

export let tournament;
export let match;
export let batarang1;
export let batarang2;
export let ball;
export let ai;
export let background;
let countdown;

export let buttonReplay;

let ctx;
export let canvas;
export let height = 1080;
export let width = 1920;
let langAct;

let currentUserId;
let csrfesse;

function submitMatchForm(winnerId, loserId, score, score_w, score_l) {
    $.ajax({
        url: "https://localhost:8000/batpong/",  // Update with the URL name of your view
        type: "POST",
        data: {
            'winner': winnerId,
            'loser': loserId,
            'score': score,
            'score_w': score_w,
            'score_l': score_l,
            'csrfmiddlewaretoken': csrfesse
        },
        success: function(response) {
            if (response.MatchForm) {
                console.log("Match saved! Winner: " + response.winner + ", Loser: " + response.loser + ", Score: " + response.score);
            } else {
                console.log("Error: " + response.errors);
            }
        },
        error: function(xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
}

function checkLang() {
    const langAct = document.querySelector('.active-lang').id;
    if (langAct == "en")
        dict = dictEN;
    else if (langAct == "fr")
        dict = dictFR;
    else
        dict = dictES;
    if (running == 2)
        return ;
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
        drawPauseMenu(ctx, countdown);
    }
}

function resetPoint(batarang, angle) {
    batarang.score++;
    ball.x = width / 2 - 30;
    ball.y = height / 2 - 30;
    ball.speed = ball.baseSpeed;
    ball.setAngle(angle);
    ai.frame = 30;
}

function checkScored(scored) {
    if (scored == 1)
        resetPoint(batarang1, 0);
    else if (scored == 2)
        resetPoint(batarang2, 180);
    else
        return;
    if (batarang1.score == 3) {
        drawEndScreen(ctx, match.p1.alias, match.p1.color);
        if (running && (match.p1.is_auth || match.p2.is_auth))
            if (match.p1.is_auth)
                submitMatchForm(currentUserId, '', batarang1.score + '-' + batarang2.score, batarang1.score, batarang2.score);
            else
                submitMatchForm('', currentUserId, batarang1.score + '-' + batarang2.score, batarang1.score, batarang2.score);
        running = 0;
    }
    else if (batarang2.score == 3) {
        drawEndScreen(ctx, match.p2.alias, match.p2.color);
        if (running && (match.p1.is_auth || match.p2.is_auth))
            if (match.p1.is_auth)
                submitMatchForm('', currentUserId, batarang2.score + '-' + batarang1.score, batarang2.score, batarang1.score);
            else
                submitMatchForm(currentUserId, '', batarang2.score + '-' + batarang1.score, batarang2.score, batarang1.score);
        running = 0;
    }
}

function startMatch() {
    checkLang();
    renderGame(canvas, ctx);
    drawCountdown(ctx, countdown);
    if (countdown >= 180) {
        clearInterval(nInterval);
        nInterval = setInterval(requestAnimationFrame, 14, update);
        return;
    }
    countdown++;
}

export function	update() {
    //check and execute enventual input, then let the ball move
    checkLang();
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
    ball.angle = 45 - Math.floor(Math.random() * 91);
    ball.speedX = ball.speed * Math.cos(ball.angle * (Math.PI / 180));
    ball.speedY = ball.speed * -Math.sin(ball.angle * (Math.PI / 180));
    ball.baseSpeed = ball.speed;
    ball.speedCap = ball.speed * 3;
    ball.lastTouched = 0;
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

export function startGame(aiparam, players, backgroundpath) {
    tournament = new Tournament(players);
    match = tournament.get_current_match();

    if (backgroundpath) {
        background = new Image();
		background.src = backgroundpath;
    }
    else
        background = 0;
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
    langAct = document.querySelector('.active-lang').id;

    checkLang();
    menu(canvas);
    centerAndResizeBoard(window.innerWidth, window.innerHeight);
}