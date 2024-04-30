import { wait2get } from "./game_utils.js";

async function menu(canvas, ctx) {
	canvas.style.display = 'none';

	const modeButtons = document.querySelectorAll('.mode');
	const versionButtons = document.querySelectorAll('.version');

	modeButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            modeButtons.forEach(function (btn) {
                btn.classList.remove('active');
            });
            button.classList.add('active');
        });
    });

    versionButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            versionButtons.forEach(function (btn) {
                btn.classList.remove('active');
            });
            button.classList.add('active');
        });
    });

	function isGameModeActive() {
		let isActive = false;
        modeButtons.forEach(function (button) {
            if (button.classList.contains('active')) {
                isActive = true;
            }
        });
        return isActive;
	}
}

async function drawBoard(ctx) {
    // Draw background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

	// Draw border
	ctx.lineWidth = 20;
	ctx.strokeStyle = 'white';
	ctx.strokeRect(0, 10, canvas.width, canvas.height - 20);

	// Draw dividing line
    ctx.beginPath();
	ctx.lineWidth = 40;
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
}

export async function game() {
	const canvas = await wait2get('boardpong');
    const ctx = canvas.getContext('2d');

	menu(canvas, ctx);
	drawBoard(ctx);
}