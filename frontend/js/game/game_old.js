/* let	board;

let	windowWidth;
let windowHeight;
let ratio;

let	boardWidth;
let	boardHeight;
let width = 1440;
let height = 720;

let ctx;

let player1 = 0;
let player2 = 0;
let ball;

var image = new Image;

class	Objects {
	constructor(x, y, w, h, img) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.s = h / height * 1.5;
		this.img = new Image();
		this.img.src = img;
		this.speed = 0;
	}
}

class	Batarang extends Objects {
	constructor(x, y, w, h, lr, img) {
		super(x, y, w, h, img);
		this.lr = lr;
		this.speed = 5;
		this.score = 0;
	}
	move_up() {
		if (this.y - this.speed - this.img.width * this.s > 0 - this.h)
			this.y -= this.speed;
	}
	move_down() {
		if (this.y + this.img.width * this.s + this.speed < height + this.h)
			this.y += this.speed;
	}
}

class	Ball extends Objects {
	constructor(x, y, w, h, speed, img) {
		super(x, y, w, h, img);
		this.speed = speed;
		this.angle = 0;
	}
	setAngle(angle) {
		this.angle = angle % Math.PI;
	}
	checkCollision() {
		if (this.y < 0 || this.y + this.h > height)
			this.setAngle(-angle);
		if (this.x < 0 || this.x + this.w > width)
			this.setAngle(angle - Math.PI);
	}
} */

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

/* function	update() {
	ctx.setTransform(1,0,0,1,0,0);
	ctx.clearRect(0, 0, width, height);
	ctx.fillText(player1.x + ", " + player1.y, 10, 10);
		
	var iwM = player1.img.width * player1.s * 2 + width;
    var ihM = player1.img.height * player1.s * 2 + height;
	var xr = ((player1.x % iwM) + iwM) % iwM - player1.w * player1.s;
    var yr = ((player1.y % ihM) + ihM) % ihM - player1.h * player1.s;
	ctx.setTransform(player1.s, 0, 0, player1.s, xr, yr); // sets scales and origin
    ctx.rotate(90*Math.PI/180);
	ctx.drawImage(player1.img, -player1.img.width / 2, -player1.img.height / 2);
	
	iwM = player2.img.width * player2.s * 2 + width;
    ihM = player2.img.height * player2.s * 2 + height;
	xr = ((player2.x % iwM) + iwM) % iwM - player2.w * player2.s;
    yr = ((player2.y % ihM) + ihM) % ihM - player2.h * player2.s;
	ctx.setTransform(player2.s, 0, 0, player2.s, xr, yr); // sets scales and origin
    ctx.rotate(-90*Math.PI/180);
	ctx.drawImage(player2.img, -player2.img.width / 2, -player2.img.height / 2);
	requestAnimationFrame(update);
}

function	movep1(e) {
	if (e.code == "KeyW")
		player1.move_up();
	if (e.code == "KeyS")
		player1.move_down();
	if (e.code == "ArrowUp")
		player2.move_up();
	if (e.code == "ArrowDown")
		player2.move_down();
} */

export async function main() {
	const canvas = await wait2get('boardpong');
	const ctx = canvas.getContext('2d');

	// Draw left part
	ctx.fillStyle = 'lightblue';
	ctx.fillRect(0, 0, canvas.width / 2, canvas.height);

	// Draw dividing line
	ctx.beginPath();
	ctx.lineWidth = 15;
	ctx.moveTo(canvas.width / 2, 0);
	ctx.lineTo(canvas.width / 2, canvas.height);
	ctx.stroke();

	// Draw right part
	ctx.fillStyle = 'lightgreen';
	ctx.fillRect(canvas.width / 2, 0, canvas.width / 2, canvas.height);

	/* board = await wait2get("boardpong");
	centerAndResizeBoard();
	ctx = (await board).getContext("2d");
	player1 = new Batarang(80, height / 2, height / 5, width / 20, -1, "/static/img/game/batarang_blue.png");
	player2 = new Batarang(width - 40, height / 2, height / 5, width / 20, 1, "/static/img/game/batarang_red.png");
	requestAnimationFrame(update);
	document.addEventListener("keydown", movep1); */
}

export async function centerAndResizeBoard() {
	// Get the dimensions of the window
	windowWidth = window.innerWidth;
	windowHeight = window.innerHeight;

	ratio = windowWidth / 1440;
	if (windowHeight / 720 < ratio)
		ratio = windowHeight / 720;

	// Calculate the new width and height for the board
	boardWidth = ratio * 1440;
	boardHeight = ratio * 720;

	// Get the board using its id
	board = wait2get("boardpong");
	
	// Set the new size for the board
	(await board).style.width = boardWidth + "px";
	(await board).style.height = boardHeight +"px";

	// Calculate the new left and top positions to center the board
	var leftPosition = (windowWidth - boardWidth) / 2;
	var topPosition = (windowHeight - boardHeight + 85) / 2;

	// Set the new position for the board
	(await board).style.left = leftPosition + "px";
	(await board).style.top = topPosition + "px";
}