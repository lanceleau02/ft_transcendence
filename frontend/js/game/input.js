import { keystatus, pause, batarang1, batarang2, buttonReplay, canvas, running, replayGame, tournament, nextMatch, ai, buttonBack, gotoMenu } from './game.js';

export class   Keystatus {
    constructor() {
        this.w = false;
        this.s = false;
        this.arrowUp = false;
        this.arrowDown = false;
    }
}

export function	keys_down(e) {
    if (e.code == "KeyW")
        keystatus.w = true;
    if (e.code == "KeyS")
        keystatus.s = true;
    if (e.code == "ArrowUp")
        keystatus.arrowUp = true;
	if (e.code == "ArrowDown")
		keystatus.arrowDown = true;
    if (e.code == "KeyP")
        pause();
}

export function	keys_up(e) {
    if (e.code == "KeyW")
        keystatus.w = false;
    if (e.code == "KeyS")
        keystatus.s = false;
    if (e.code == "ArrowUp")
        keystatus.arrowUp = false;
	if (e.code == "ArrowDown")
		keystatus.arrowDown = false;
}

export function players_input(batarang1, batarang2) {
    if (keystatus.w)
        batarang1.move_up();
    if (keystatus.s)
        batarang1.move_down();
    if (!ai.isactive) {
        if (keystatus.arrowUp)
            batarang2.move_up();
        if (keystatus.arrowDown)
            batarang2.move_down();
    }
    else {
        if (ai.move < -1) {
            ai.move++;
            batarang2.move_up();
        }
        else if (ai.move > 1) {
            ai.move--;
            batarang2.move_down();
        }
    }
}

export function getMouseCoord(e) {
    var rect = canvas.getBoundingClientRect();
    var x = (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
    var y = (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;
    if (!running) {
        if (buttonReplay.isAt(x, y)) {
            if (tournament.get_next_match() || tournament.qualified.length) {
                tournament.send_result(batarang1.score > batarang2.score + 1);
                nextMatch();
            }
            else if (tournament.simple_match)
                replayGame();
        }
    }
    if ((!running || running == 2) && buttonBack.isAt(x, y))
        gotoMenu();
}