import { keystatus, pause, player1, player2, buttonReplay, canvas } from './game.js';

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
    if (keystatus.arrowUp)
        player2.move_up();
    if (keystatus.arrowDown)
        player2.move_down();
}

export function getMouseCoord(e) {
    // console.log(e.clientX - rect.left, ' ', e.clientY - rect.top);
    // console.log(buttonReplay.x, ' ', buttonReplay.y);
    // if (buttonReplay.isAt(e.clientX - rect.left, e.clientY - rect.top))
    //     console.log('oui');
}