export function pieChart() {
	const victories = 58;
	const defeats = 42;
	
	const canvas = document.getElementById('pieChart');
	const ctx = canvas.getContext('2d');
	const centerX = (canvas.width) / 2;
	const centerY = (canvas.height) / 2;
	const radius = Math.min(canvas.width - 75, canvas.height - 75) / 2;
	
	function drawPieSlice(ctx, centerX, centerY, radius, startAngle, endAngle, color) {
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.moveTo(centerX, centerY);
		ctx.arc(centerX, centerY, radius, startAngle, endAngle);
		ctx.closePath();
		ctx.fill();
	}
	
	function drawText(ctx, text, centerX, centerY) {
		ctx.fillStyle = '#fff';
		ctx.font = '18px Comic Sans MS';
		ctx.fillText(text, centerX, centerY);
	}
	
	function drawPieChart() {
		const total = victories + defeats;
		let startAngle = 0;
		let endAngle = 0;
	
		endAngle = (victories / total) * (Math.PI * 2);
		drawPieSlice(ctx, centerX, centerY, radius, startAngle, endAngle, '#2ecc71');
		drawText(ctx, 'Victories', centerX - 135, centerY + 120);
		startAngle = endAngle;
	
		endAngle = (defeats / total) * (Math.PI * 2);
		drawPieSlice(ctx, centerX, centerY, radius, startAngle, startAngle + endAngle, '#e74c3c');
		drawText(ctx, 'Defeats', centerX + 75, centerY - 100);
	}
	
	drawPieChart();
}
