import { Object } from "./Object.js";
import { height } from './game.js';

export class	Batarang extends Object {
	constructor(x, y, w, h, lr, img, name) {
		super(x, y, w, h, img);
		this.lr = lr;
		this.speed = 10;
		this.score = 0;
		this.name = name;
	}
	move_up() {
		if (this.y - this.speed > 15)
			this.y -= this.speed;
	}
	move_down() {
		if (this.y + this.h + this.speed < height - 15)
			this.y += this.speed;
	}
}