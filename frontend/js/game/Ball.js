import { Object } from "./Object.js";
import { height, width } from './game.js';

export class	Ball extends Object {
	constructor(x, y, w, h, img) {
		super(x, y, w, h, img);
		this.angle = 45 - Math.floor(Math.random() * 91);
		this.speed = 10;
        this.baseSpeed = this.speed;
        this.speedX = this.speed * Math.cos(this.angle * (Math.PI / 180));
        this.speedY = this.speed * -Math.sin(this.angle * (Math.PI / 180));
        this.speedCap = this.speed * 3;
        this.lastTouched = 0;
	}

	setAngle(angle) {
        angle = angle % 360;
        if (angle > 180)
            this.angle = (-angle + (angle - 179) * 2);
        else if (angle < -180)
            this.angle = (-angle - -(angle + 179) * 2); 
        else
            this.angle = angle;
        this.speedX = this.speed * Math.cos(this.angle * (Math.PI / 180));
        this.speedY = this.speed * -Math.sin(this.angle * (Math.PI / 180));
	}

    checkCollisionPlayer(player, n) {
        if (!this.intersects(player))
            return;
        var intersectY = (this.intersectY(player))
        if (intersectY > (player.h / 2))
            intersectY = (player.h / 2);
        else if (intersectY < -(player.h / 2))
            intersectY = -(player.h / 2);
        if (n == 1)
            this.setAngle(intersectY / (player.h / 2) * 40);
        else
            this.setAngle(180 - intersectY / (player.h / 2) * 40);
        this.lastTouched = n;
        this.speed *= 1.2;
        if (this.speed > this.speedCap)
            this.speed = this.speedCap;
    }

	checkCollision(batarang1, batarang2) {
		if (this.y < 0 || this.y + this.h > height) {
            this.setAngle(-this.angle);
            this.y += this.speedY;
        }
		if (this.x < 0)
            return 2;
        else if (this.x + this.w > width)
            return 1;
        if (this.lastTouched != 1)
            this.checkCollisionPlayer(batarang1, 1);
        if (this.lastTouched != 2)
            this.checkCollisionPlayer(batarang2, 2);
        return 0;
	}

    move(batarang1, batarang2) {
        var res = this.checkCollision(batarang1, batarang2);
        this.x += this.speedX;
        this.y += this.speedY;
        return res;
    }
}