import { buttonReplay, batarang1, batarang2, ball, width, height, canvas, match, tournament, dict, background } from "./game.js";

export function drawPauseMenu(ctx) {
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'yellow';
    ctx.fillRect(canvas.width - 150, 150, 20, 80);
    ctx.fillRect(canvas.width - 110, 150, 20, 80);
    ctx.textAlign = "center";
    ctx.font = "40px Comic Sans MS";
    ctx.fillStyle = 'yellow';
    ctx.fillText(dict[0], width / 2, height - 300, width / 2);
    var str = match.p1.alias + " vs " + match.p2.alias;
    ctx.fillText(str, width / 2, height - 250, width / 2);
    var nextmatch = tournament.get_next_match();
    if (!nextmatch && !tournament.qualified.length)
        return ;
    ctx.fillText(dict[1], width / 2, height - 100, width / 2);
    if (!nextmatch && tournament.qualified.length)
        str = tournament.qualified[0].alias + " vs " + dict[2];
    else
        str = nextmatch.p1.alias + " vs " + nextmatch.p2.alias;
    ctx.fillText(str, width / 2, height - 50, width / 2);
}

export function drawEndScreen(ctx, text, color) {
    renderGame(canvas, ctx);
    // drawRotatedImage(ctx, buttonReplay, 0, width / 2 - buttonReplay.w / 2, height / 2 - buttonReplay.h / 2);
    ctx.fillStyle = color;
	ctx.fillRect(width / 3, height / 2 - 120, width / 3, height / 4);
    if (tournament.simple_match || tournament.get_next_match() || tournament.qualified.length)
        ctx.drawImage(buttonReplay.img, buttonReplay.x, buttonReplay.y, buttonReplay.w, buttonReplay.h);
    ctx.textAlign = "center";
    ctx.font = "60px Comic Sans MS";
    ctx.fillStyle = 'black';
    ctx.fillText(dict[3], width / 2, height / 2, width / 2);
    ctx.fillText(text, width / 2, height / 2 + 100, width / 2);
    if (tournament.simple_match)
        ctx.fillText(dict[4], width / 2, buttonReplay.y + 85);
    else if (tournament.get_next_match() || tournament.qualified.length)
        ctx.fillText(dict[5], width / 2, buttonReplay.y + 85);
    ctx.fillStyle = 'yellow';
    var nextmatch = tournament.get_next_match();
    if (!nextmatch && tournament.qualified.length)
        ctx.fillText(tournament.qualified[0].alias + " vs " + text, width / 2, buttonReplay.y + 175);
    else if (nextmatch)
        ctx.fillText(nextmatch.p1.alias + " vs " + nextmatch.p2.alias, width / 2, buttonReplay.y + 175);
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
    if (!background) {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    else 
        ctx.drawImage(background, 0, 0, width, height);

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
    ctx.font = "40px Comic Sans MS";
    ctx.fillStyle = 'yellow';
    ctx.fillText(match.p1.alias, width / 4, height / 2 - 150, width / 2);
    ctx.fillText(match.p2.alias, 3 * width / 4, height / 2 - 150, width / 2);
    ctx.font = "300px digital-dream";
    ctx.fillStyle = 'yellow';
    ctx.fillText(batarang1.score, width / 4, height / 2 + 100, width / 2);
    ctx.fillText(batarang2.score, 3 * width / 4, height / 2 + 100, width / 2);
    // ctx.fillStyle = 'blue';
    // ctx.fillRect(batarang1.x, batarang1.y, batarang1.w, batarang1.h);
    // ctx.fillStyle = 'red';
    // ctx.fillRect(batarang2.x, batarang2.y, batarang2.w, batarang2.h);
    drawRotatedImage(ctx, batarang1, 90, batarang1.x, batarang1.y);
    drawRotatedImage(ctx, batarang2, -90, batarang2.x, batarang2.y);
    drawRotatedImage(ctx, ball, ball.angle, ball.x, ball.y);
}