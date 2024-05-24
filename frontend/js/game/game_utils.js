export async function wait2get(id) {
	// Try to get the element a first time
	var element = document.getElementById(id);

	// Loop while it's not loaded
	while (element == null) {
		await new Promise(r => setTimeout(r, 100));
		element = document.getElementById(id);
	}
	return element;
}

export async function centerAndResizeBoard(windowWidth, windowHeight) {
	// Get the dimensions of the window
/* 	windowWidth = window.innerWidth;
	windowHeight = window.innerHeight; */

	let ratio = windowWidth / 1440;
	if (windowHeight / 720 < ratio)
		ratio = windowHeight / 720;

	// Calculate the new width and height for the board
	let boardWidth = ratio * 1440;
	let boardHeight = ratio * 720;

	// Get the board using its id
	let board = wait2get("boardpong");
	
	// Set the new size for the board
	(await board).style.width = boardWidth + "px";
	(await board).style.height = boardHeight - 86 +"px";

	// Calculate the new left and top positions to center the board
	var leftPosition = (windowWidth - boardWidth) / 2;
	var topPosition = (windowHeight - boardHeight + 85) / 2;

	// Set the new position for the board
	(await board).style.left = leftPosition + "px";
	(await board).style.top = topPosition + "px";
}
