import { wait2get, centerAndResizeBoard } from "./game_utils.js";

// Global variables
let mode = "";
let map = "";
let colors = "";

async function menu(canvas) {
    // Declare variables
    const modeButtons = document.querySelectorAll('.mode');
    const versionButtons = document.querySelectorAll('.version');
    const classicButton = document.getElementById('classic');
    const customButton = document.getElementById('custom');
    const playButton = document.getElementById('play');
    const optionsMenu = document.getElementById('options-menu');
    const firstMenu = document.getElementById('first-menu');
    const mapButtons = document.querySelectorAll('.map');
    const colorsButtons = document.querySelectorAll('.colors');
    const playCustomButton = document.getElementById('play-custom');

    // Hide elements
    playButton.style.display = 'none';
    optionsMenu.style.display = 'none';
    playCustomButton.style.display = 'none';

    // Check selected buttons
    function isModeSelected() {
        return [...modeButtons].some(button => button.classList.contains('active'));
    }

    function isMapSelected() {
        return [...mapButtons].some(button => button.classList.contains('active'));
    }

    function isColorsSelected() {
        return [...colorsButtons].some(button => button.classList.contains('active'));
    }
    //

    // Unselect a button when an another is clicked
    function toggleActiveClass(buttons, button) {
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    }

    // Select game type
    function handleModeSelection() {
        if (isModeSelected() && classicButton.classList.contains('active')) {
            runGame();
        } else if (isModeSelected() && customButton.classList.contains('active')) {
            displayOptionsMenu();
        }
    }

    // Handle clicked buttons
    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            toggleActiveClass(modeButtons, button);
            handleModeSelection();
        });
    });

    versionButtons.forEach(button => {
        button.addEventListener('click', () => {
            toggleActiveClass(versionButtons, button);
            handleModeSelection();
        });
    });
    //

    // runGame() function
    function runGame() {
        playButton.style.display = '';
        optionsMenu.style.display = 'none';
    }

    // displayOptionsMenu() function
    function displayOptionsMenu() {
        playButton.style.display = 'none';
        optionsMenu.style.display = '';

        mapButtons.forEach(button => {
            button.addEventListener('click', () => {
                toggleActiveClass(mapButtons, button);
                if (isMapSelected() && isColorsSelected()) {
                    playCustomButton.style.display = '';
                }
            });
        });

        colorsButtons.forEach(button => {
            button.addEventListener('click', () => {
                toggleActiveClass(colorsButtons, button);
                if (isMapSelected() && isColorsSelected()) {
                    playCustomButton.style.display = '';
                }
            });
        });
    }

    // Display game and hide menu
    playButton.addEventListener('click', () => {
        firstMenu.style.display = 'none';
        canvas.style.display = '';
    });

    playCustomButton.addEventListener('click', () => {
        firstMenu.style.display = 'none';
        optionsMenu.style.display = 'none';
        canvas.style.display = '';
    });
    //
}

async function drawBoard(canvas, ctx) {
    console.log(canvas.width)
    console.log(canvas.height)
    
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

    canvas.style.display = 'none';

    menu(canvas);
    // centerAndResizeBoard(window.innerWidth, window.innerHeight);
    drawBoard(canvas, ctx);
}