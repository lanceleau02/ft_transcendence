export function pieChart() {
	const userDataDiv = document.getElementById('userData')
	if (userDataDiv === null)
		return;
	const victories = userDataDiv.getAttribute('wins')
	const defeats = userDataDiv.getAttribute('losses')
	const total_games = userDataDiv.getAttribute('played_games')

	const win_ratio = (victories / total_games) * 100
	const lose_ratio = (defeats / total_games) * 100

	const canvas = document.getElementById('pieChart');
	const ctx = canvas.getContext('2d');
	const centerX = (canvas.width) / 2;
	const centerY = (canvas.height) / 2;
	const radius = Math.min(canvas.width - 50, canvas.height - 50) / 2;
	
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
		const total = win_ratio + lose_ratio;
		let startAngle = 0;
		let endAngle = 0;
	
		endAngle = (win_ratio / total) * (Math.PI * 2);
		drawPieSlice(ctx, centerX, centerY, radius, startAngle, endAngle, '#2ecc71');
		startAngle = endAngle;
	
		endAngle = (lose_ratio / total) * (Math.PI * 2);
		drawPieSlice(ctx, centerX, centerY, radius, startAngle, startAngle + endAngle, '#e74c3c');
	}
	
	drawPieChart();
}
