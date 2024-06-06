import { buttonReplay, buttonBack, batarang1, batarang2, ball, width, height, canvas, match, tournament, dict, background } from "./game.js";

export function drawCountdown(ctx, countdown) {
    if (countdown < 60)
        ctx.fillText("3", width / 2, height / 2, width / 2);
    else if (countdown < 120)
        ctx.fillText("2", width / 2, height / 2, width / 2);
    else if (countdown < 180)
        ctx.fillText("1", width / 2, height / 2, width / 2);
}

export function drawPauseMenu(ctx, countdown) {
    renderGame(canvas, ctx);
    drawCountdown(ctx, countdown);
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
    ctx.drawImage(buttonBack.img, buttonBack.x, buttonBack.y, buttonBack.w, buttonBack.h);
    ctx.fillStyle = 'yellow';
    ctx.fillRect(canvas.width - 150, 150, 20, 80);
    ctx.fillRect(canvas.width - 110, 150, 20, 80);
    ctx.textAlign = "center";
    ctx.font = "60px gotham-knights";
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
    console.log(text)
    // drawRotatedImage(ctx, buttonReplay, 0, width / 2 - buttonReplay.w / 2, height / 2 - buttonReplay.h / 2);
    // ctx.fillStyle = color;
	// ctx.fillRect(width / 3, height / 2 - 120, width / 3, height / 4);
    var nextMatch = tournament.get_next_match();
    ctx.drawImage(ball.img, width / 3 - 50, height / 2 - 400, width / 3 + 100, height / 2);
    if (tournament.simple_match || nextMatch || tournament.qualified.length) {
        ctx.drawImage(buttonReplay.img, buttonReplay.x, buttonReplay.y, buttonReplay.w, buttonReplay.h);
    }
    ctx.drawImage(buttonBack.img, buttonBack.x, buttonBack.y, buttonBack.w, buttonBack.h);
    ctx.textAlign = "center";
    ctx.font = "80px gotham-knights";
    ctx.fillStyle = 'seagreen';
    ctx.fillText(dict[3], width / 2, height / 2 - 250, width / 2);
    ctx.font = "100px gotham-knights";
    ctx.fillStyle = color;
    ctx.fillText(text, width / 2, height / 2 - 100, width / 2);
    ctx.font = "80px gotham-knights";
    ctx.fillStyle = 'black';
    if (tournament.simple_match)
        ctx.fillText(dict[4], width / 2, buttonReplay.y + 85);
    else if (tournament.get_next_match() || tournament.qualified.length)
        ctx.fillText(dict[5], width / 2, buttonReplay.y + 85);
    ctx.fillStyle = 'yellow';
    var nextmatch = tournament.get_next_match();
    if (!nextmatch && tournament.qualified.length)
        ctx.fillText(tournament.qualified[0].alias + " vs " + text, width / 2, buttonReplay.y + 300);
    else if (nextmatch)
        ctx.fillText(nextmatch.p1.alias + " vs " + nextmatch.p2.alias, width / 2, buttonReplay.y + 300);
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
    ctx.font = "60px gotham-knights";
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
    drawRotatedImage(ctx, ball, 0, ball.x, ball.y);
}