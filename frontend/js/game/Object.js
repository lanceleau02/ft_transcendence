export class	Object {
	constructor(x, y, w, h, img) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.img = new Image();
		this.img.src = img;
		this.speed = 0;
	}
    intersects(obj) {
        if (this.x + this.w >= obj.x && this.x <= obj.x + obj.w &&
            this.y + this.h >= obj.y && this.y <= obj.y +obj.h)
            return true;
        return false;
    }
    intersectY(obj) {
        return ((obj.y + obj.h / 2) - (this.y + this.h / 2));
    }
	isAt(x, y) {
		if (this.x + this.w >= x && this.x <= x &&
			this.y + this.h >= y && this.y <= y)
			return true;
		return false;
	}
}