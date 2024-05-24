import { buttonReplay } from "./game.js";

export function drawEndScreen(ctx, text) {
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