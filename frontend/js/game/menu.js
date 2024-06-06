import { startGame } from './game.js';
import { Player } from './Player.js';
import { translation } from '../translation/translation.js'

let players;

export async function menu(canvas) {
    // Declare variables
    const modeButtons = document.querySelectorAll('.mode');
    // const versionButtons = document.querySelectorAll('.version');
    // const classicButton = document.getElementById('classic');
    // const customButton = document.getElementById('custom');
    const playButton = document.getElementById('play');
    const optionsMenu = document.getElementById('options-menu');
    const firstMenu = document.getElementById('first-menu');
    const mapButtons = document.querySelectorAll('.map');
    // const colorsButtons = document.querySelectorAll('.colors');
    const colorSelect1 = document.getElementById('p1color');
    const colorSelect2 = document.getElementById('p2color');
    const playCustomButton = document.getElementById('play-custom');
    
    const playerContainers = document.getElementById('playerContainers');
    const addPlayerButton = document.getElementById('add-player');
    const removePlayerButton = document.getElementById('remove-player');
    
    addPlayerButton.addEventListener('click', addPlayer);
    removePlayerButton.addEventListener('click', removePlayer);
    
    // Hide elements
    playButton.style.display = 'none';
    playCustomButton.style.display = 'none';
    optionsMenu.style.display = 'none';
    // playCustomButton.style.display = 'none';
    
    if (document.getElementById("userid").textContent == 'None') {
        document.getElementById("player1alias").value = "guest";
        document.getElementById("player2alias").value = "guest2";
    }
    
    var playerCount = 2;

    // Check selected buttons
    function isModeSelected() {
        return [...modeButtons].some(button => button.classList.contains('active'));
    }

    function isMapSelected() {
        return [...mapButtons].some(button => button.classList.contains('active'));
    }

    // function isColorsSelected() {
    //     return [...colorsButtons].some(button => button.classList.contains('active'));
    // }
    //

    // Unselect a button when an another is clicked
    function toggleActiveClass(buttons, button) {
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    }

    // Select game type
    function handleModeSelection() {
        // if (isModeSelected() && classicButton.classList.contains('active')) {
        //     runGame();
        // } else if (isModeSelected() && customButton.classList.contains('active')) {
        //     displayOptionsMenu();
        // }
        if (isModeSelected())
            displayOptionsMenu();
        if (modeButtons[2].classList.contains('active')) {
            addPlayerButton.style.display= '';
            removePlayerButton.style.display= '';
        } else {
            addPlayerButton.style.display= 'none';
            removePlayerButton.style.display= 'none';
            for (let i = 0; i < 8; i++) {
                removePlayer();
            }
        }

    }

    // Handle clicked buttons
    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (!isModeSelected()) {
                mapButtons[0].classList.add('active');
                playCustomButton.style.display = '';
            }
            toggleActiveClass(modeButtons, button);
            handleModeSelection();
        });
    });

    // versionButtons.forEach(button => {
    //     button.addEventListener('click', () => {
    //         toggleActiveClass(versionButtons, button);
    //         handleModeSelection();
    //     });
    // });
    //

    // runGame() function
    // function runGame() {
    //     playButton.style.display = '';
    //     optionsMenu.style.display = 'none';
    // }

    // displayOptionsMenu() function
    function displayOptionsMenu() {
        playButton.style.display = 'none';
        optionsMenu.style.display = '';

        mapButtons.forEach(button => {
            button.addEventListener('click', () => {
                toggleActiveClass(mapButtons, button);
                if (isMapSelected()) {
                    playCustomButton.style.display = '';
                }
            });
        });

        // colorsButtons.forEach(button => {
        //     button.addEventListener('click', () => {
        //         toggleActiveClass(colorsButtons, button);
        //         if (isMapSelected() && isColorsSelected()) {
        //             playCustomButton.style.display = '';
        //         }
        //     });
        // });
    }

    // Display game and hide menu
    // playButton.addEventListener('click', () => {
    //     firstMenu.style.display = 'none';
    //     canvas.style.display = '';
    //     startGame(modeButtons[1].classList.contains('active'), 'blue', 'red');
    // });

    // function showMenu() {

    // }

    playCustomButton.addEventListener('click', () => {
        firstMenu.style.display = 'none';
        optionsMenu.style.display = 'none';
        // canvas.style.display = '';
        addPlayerButton.removeEventListener('click', addPlayer);
        removePlayerButton.removeEventListener('click', removePlayer);
        savePlayers();
        startGame(modeButtons[1].classList.contains('active'), players, getBackgroundPath());
    });

    // if (running != -1)

    function getBackgroundPath() {
        if (mapButtons[0].classList.contains('active'))
            return "";
        else if (mapButtons[1].classList.contains('active'))
            return "/static/img/game/Bat-Cave.jpg";
        else if (mapButtons[2].classList.contains('active'))
            return "/static/img/game/Arkham.jpg";
        else
            return "/static/img/game/manor.jpg";
    }

    function addPlayer() {
        if (playerCount == 8)
            return ;
        playerCount++;
    
        const playerContainer = document.createElement('div');
        playerContainer.classList.add('player-container');
        playerContainer.id = `player${playerCount}`;
		
        playerContainer.innerHTML = `
			<label class="player">Player </label>
			<label>${playerCount} alias:</label>
            <input type="text" id="player${playerCount}alias" value="guest${playerCount}">
            <label class="ms-3 player">Player </label>
            <label>${playerCount}</label>
            <label class="color"> color:</label>
            <select id="p${playerCount}color">
                <option value="red">Red</option>
                <option value="blue">Blue</option>
                <option value="yellow">Yellow</option>
                <option value="green">Green</option>
                <option value="purple">Purple</option>
            </select>
        `;
		
        console.log(playerContainer);
        console.log(playerContainers);
        playerContainers.appendChild(playerContainer);
		translation();
    }

    function removePlayer() {
        if (playerCount == 2)
            return ;
        const playerContainer = document.getElementById(`player${playerCount}`);
        playerContainer.remove();
        playerCount--;
    }

    function savePlayers() {
        players = []; // Clear the previous players array
    
        for (let i = 1; i <= playerCount; i++) {
            const alias = document.getElementById(`player${i}alias`).value;
            const color = document.getElementById(`p${i}color`).value;
    
            const player = new Player(alias, color, false);
            players.push(player);
        }
        players[0].is_auth = document.getElementById("userid").textContent != 'None';
    }
}