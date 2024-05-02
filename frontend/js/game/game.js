import { wait2get } from "./game_utils.js";

async function menu(canvas, ctx) {
	canvas.style.display = 'none';

    const modeButtons = document.querySelectorAll('.mode');
    const versionButtons = document.querySelectorAll('.version');
    const classicButton = document.getElementById('classic');
    const customButton = document.getElementById('custom');
    const playButton = document.getElementById('play');

	playButton.style.display = 'none';

    function isModeSelected() {
        return [...modeButtons].some(button => button.classList.contains('active'));
    }

    modeButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            modeButtons.forEach(function (btn) {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            if (isModeSelected() && classicButton.classList.contains('active')) {
                runGame();
            } else if (isModeSelected() && customButton.classList.contains('active')) {
                displayAdditionalOptions();
            }
        });
    });

    versionButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            versionButtons.forEach(function (btn) {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            if (isModeSelected() && classicButton.classList.contains('active')) {
                runGame();
            } else if (isModeSelected() && customButton.classList.contains('active')) {
                displayAdditionalOptions();
            }
        });
    });

    function runGame() {
	    playButton.style.display = '';
        console.log('Running the game...');
    }

    function displayAdditionalOptions() {
	    playButton.style.display = 'none';
        console.log('Displaying additional options...');
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