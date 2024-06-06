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

export let dict;
let dictEN = [ "Current match:", "Next match:", "winner", "Winner:", "Replay", "Next match" ];
let dictFR = [ "Match actuel:", "Match suivant:", "vaiqueur", "Vainqueur:", "Rejouer", "Match suivant" ];
let dictES = [ "Partido actual:", "Siguiente partido:", "ganador", "Ganador:", "Repetir", "Siguiente partido" ]

export let keystatus;
export let running = -1;
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
export let buttonBack;

let ctx;
export let canvas;
export let height = 1080;
export let width = 1920;
let langAct;

let currentUserId;
let csrftoken;

function submitMatchForm(winnerId, loserId, score, score_w, score_l, rival) {
    $.ajax({
        url: "https://localhost:8000/batpong/",  // Update with the URL name of your view
        type: "POST",
        data: {
            'winner': winnerId,
            'loser': loserId,
            'score': score,
            'score_w': score_w,
            'score_l': score_l,
            'rival' : rival,
            'csrfmiddlewaretoken': csrftoken
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
    if (running == 2 && countdown >= 180) {
        running = 1;
        if (countdown < 180)
            nInterval = setInterval(requestAnimationFrame, 14, startMatch);
        else
            nInterval = setInterval(requestAnimationFrame, 14, update);
    }
    else if (running == 1 && countdown >= 180) {
        clearInterval(nInterval);
        drawPauseMenu(ctx, countdown);
        running = 2
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
                submitMatchForm(currentUserId, '', batarang1.score + '-' + batarang2.score, batarang1.score, batarang2.score, match.p2.alias);
            else
                submitMatchForm('', currentUserId, batarang1.score + '-' + batarang2.score, batarang1.score, batarang2.score, match.p1.alias);
        running = 0;
    }
    else if (batarang2.score == 3) {
        drawEndScreen(ctx, match.p2.alias, match.p2.color);
        if (running && (match.p1.is_auth || match.p2.is_auth))
            if (match.p1.is_auth)
                submitMatchForm('', currentUserId, batarang2.score + '-' + batarang1.score, batarang2.score, batarang1.score, match.p2.alias);
            else
                submitMatchForm(currentUserId, '', batarang2.score + '-' + batarang1.score, batarang2.score, batarang1.score, match.p1.alias);
        running = 0;
    }
}

function startMatch() {
    running = 1;
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
    batarang1 = new Batarang(30, height / 2 - 100, 90, 200, -1, "/static/img/game/batarang_" + colorp1 + ".png", "Player 1");
	batarang2 = new Batarang(width - 30 - 90, height / 2 - 100, 90, 200, 1, "/static/img/game/batarang_" + colorp2 + ".png", "Player 2");
    ball = new Ball(width / 2 - 30, height / 2 - 30, 60, 60, "/static/img/game/batsign.webp");

    buttonReplay = new Object(width / 2 - 175, height / 2 + 200, 350, 120, "/static/img/game/button_template.png");
    buttonBack = new Object(50, 50, 150, 150, "/static/img/game/button_back.png");

    keystatus = new Keystatus();
    document.addEventListener("keydown", keys_down);
    document.addEventListener("keyup", keys_up);
    document.addEventListener("click", getMouseCoord);
    countdown = 0;
}

export function startGame(aiparam, players, backgroundpath) {
    if (nInterval > 0)
        clearInterval(nInterval);
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
    csrftoken = document.getElementById("csrftoken").firstChild.value;
    checkLang();

    canvas.style.display = 'none';
    if (running != -1) {
        document.getElementById('first-menu').style.display = 'none';
        document.getElementById('options-menu').style.display = 'none';
        canvas.style.display = '';
        centerAndResizeBoard(window.innerWidth, window.innerHeight);
        if (nInterval > 0)
            clearInterval(nInterval);
    }
    if (running == 2 && countdown >= 180) 
        drawPauseMenu(ctx, countdown);
    else if (running == 2 || (running == 1 && countdown < 180))
        nInterval = setInterval(requestAnimationFrame, 14, startMatch);
    else if (running == 0)
        drawEndScreen(ctx, batarang1.score > batarang2.score ? match.p1.alias : match.p2.alias, batarang1.score > batarang2.score ? match.p1.color : match.p2.color);
    else {
        menu(canvas);
        centerAndResizeBoard(window.innerWidth, window.innerHeight);
    }
}

export function gotoMenu() {
    if (nInterval > 0)
        clearInterval(nInterval);
    canvas.style.display = 'none';
    const modeButtons = document.querySelectorAll('.mode');
    modeButtons.forEach(btn => btn.classList.remove('active'));
    const mapButtons = document.querySelectorAll('.map');
    mapButtons.forEach(btn => btn.classList.remove('active'));
    document.getElementById('first-menu').style.display = '';
    document.getElementById('options-menu').style.display = '';
    running = -1;
    menu();
}

let batpong = document.getElementById("linktobatpong");
let batcave = document.getElementById("linktobatcave");
let batprofile = document.getElementById("linktobatprofile");

batpong.addEventListener("click", function(event) {
    if (running != -1 && running)
        running = 2;
    if (nInterval > 0)
        clearInterval(nInterval);
    console.log(running);
});

batcave.addEventListener("click", function(event) {
    if (running != -1 && running)
        running = 2;
    if (nInterval > 0)
        clearInterval(nInterval);
});

batprofile.addEventListener("click", function(event) {
    if (running != -1 && running)
        running = 2;
    if (nInterval > 0)
        clearInterval(nInterval);
    console.log(running);
});