async function wait2get(id) {
	// Try to get the element a first time
	var element = document.getElementById(id);

	// Loop while it's not loaded
	while (element == null) {
		await new Promise(r => setTimeout(r, 100));
		element = document.getElementById(id);
	}
	return element;
}

async function drawBoard() {
	const canvas = await wait2get('boardpong');
    const ctx = canvas.getContext('2d');

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
	drawBoard();
}