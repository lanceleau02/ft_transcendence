import { keystatus, pause, player1, player2, buttonReplay, canvas, running, replayGame, ai, aimove } from './game.js';

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

export function players_input() {
    if (keystatus.w)
        player1.move_up();
    if (keystatus.s)
        player1.move_down();
    if (!ai) {
        if (keystatus.arrowUp)
            player2.move_up();
        if (keystatus.arrowDown)
            player2.move_down();
    }
    else {
        if (aimove == 1)
            player2.move_up();
        else if (aimove == 2)
            player2.move_down();
    }
}

export function getMouseCoord(e) {
    var rect = canvas.getBoundingClientRect();
    var x = (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
    var y = (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;
    console.log(x, ' ', y);
    console.log(buttonReplay.x, ' ', buttonReplay.y);
    if (!running && buttonReplay.isAt(x, y))
        replayGame();
}