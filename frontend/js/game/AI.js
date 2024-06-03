import { width, height } from "./game.js";

export class AI {
	constructor(isactive) {
		this.isactive = isactive;
		this.frame = 0;
		this.target = 0;
		this.intersectX = 0;
		this.intersectY = 0;
		this.move = 0;
	}

	check(batarang, ball) {
		if (this.isactive) {
			if (this.frame == 60)
				return this.think(batarang, ball);
			this.frame++;
		}
	}

	predict_trajectory(objectX, ball) {
		var tX = ball.x + ball.w;
		var tY = ball.y + ball.h;
		var speedY = ball.speedY;
		var speedX = ball.speedX;
		var ttbx;
		var ttby;

		while (1) {
			if (speedX < 0)
				return height / 2 - ball.h;
			else
				ttbx = (objectX - tX) / speedX;
			if (speedY == 0)
				return tY;
			else if (speedY < 0)
				ttby = tY / -speedY;
			else
				ttby = (height - tY) / speedY;
			if (ttbx > ttby) {
				tX += speedX * ttby;
				tY += speedY * ttby;
				speedY *= -1;
			}
			else
				break;
		}
		return (tY + speedY * ttbx);
	}

	think(batarang, ball) {
		this.target = this.predict_trajectory(batarang.x, ball);
		var	distance = this.target - (batarang.y + (batarang.h / 2));
		if (distance > 80 || distance < -80)
			this.move = parseInt(distance / batarang.speed);
		else
			this.move = 0;
		this.frame = 0;
	}
}