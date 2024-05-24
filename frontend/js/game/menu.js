import { game_init } from './game.js'

export async function menu(canvas) {
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
        game_init();
    });

    playCustomButton.addEventListener('click', () => {
        firstMenu.style.display = 'none';
        optionsMenu.style.display = 'none';
        canvas.style.display = '';
    });
}