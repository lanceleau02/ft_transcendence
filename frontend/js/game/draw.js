import { buttonReplay, player1, player2, ball, width, height, canvas } from "./game.js";

export function drawEndScreen(ctx, text) {
    renderGame(canvas, ctx);
    // drawRotatedImage(ctx, buttonReplay, 0, width / 2 - buttonReplay.w / 2, height / 2 - buttonReplay.h / 2);
    ctx.drawImage(buttonReplay.img, buttonReplay.x, buttonReplay.y, buttonReplay.w, buttonReplay.h);
}

export function drawRotatedImage(ctx, object, angle, x, y) {
    ctx.save();
    ctx.translate(x + object.w / 2, y + object.h / 2);
    ctx.rotate(angle * Math.PI / 180); // Convert angle from degrees to radians
    ctx.drawImage(object.img, -object.h / 2, -object.w / 2, object.h, object.w);
    ctx.restore();
}

export function drawBoard(canvas, ctx) {
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

export function renderGame(canvas, ctx) {
    drawBoard(canvas, ctx);
    ctx.textAlign = "center";
    ctx.font = "300px digital-dream";
    ctx.fillStyle = 'yellow';
    ctx.fillText(player1.score, width / 4, height / 2 + 100, width / 2);
    ctx.fillText(player2.score, 3 * width / 4, height / 2 + 100, width / 2);
    // ctx.fillStyle = 'blue';
    // ctx.fillRect(player1.x, player1.y, player1.w, player1.h);
    // ctx.fillStyle = 'red';
    // ctx.fillRect(player2.x, player2.y, player2.w, player2.h);
    drawRotatedImage(ctx, player1, 90, player1.x, player1.y);
    drawRotatedImage(ctx, player2, -90, player2.x, player2.y);
    drawRotatedImage(ctx, ball, ball.angle, ball.x, ball.y);
}