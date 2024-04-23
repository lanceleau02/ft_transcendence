export function curveGraph() {
    const userDataDiv = document.getElementById('userData');
    const matchesString = userDataDiv.getAttribute('last_ten_matches');
    console.log('Matches String:', matchesString); // Log matchesString to the console
    
    // Convert the comma-separated string into an array of numbers
    const matches = matchesString.split(',').map((match, index) => {
        const number = Number(match);
        console.log(`Value at index ${index}:`, number); // Log each value to the console
        return number;
    });
    console.log('Matches Array:', matches); // Log matches array to the console
    
    const data = matches.map((match, index) => ({ x: index, y: match }));

    // Function to draw the curve chart
    function drawCurveChart(data) {
        const canvas = document.getElementById('curveGraph');
        const ctx = canvas.getContext('2d');

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate the maximum values of x and y
        const maxX = Math.max(...data.map(point => point.x));
        const maxY = 3;

        // Calculate the scaling factor
        const scaleX = canvas.width / maxX;
        const scaleY = canvas.height / maxY;

        // Begin drawing the curve
        ctx.beginPath();
        ctx.moveTo(data[0].x * scaleX + 25, canvas.height - data[0].y * scaleY);

        for (let i = 1; i < data.length; i++) {
            ctx.lineTo(data[i].x * scaleX, canvas.height - data[i].y * scaleY);
        }

        // Draw a line to close the path and fill the area under the curve
        ctx.lineTo(data[data.length - 1].x * scaleX, canvas.height);
        ctx.lineTo(data[0].x * scaleX + 25, canvas.height);
        ctx.closePath();
        ctx.fillStyle = 'rgba(242, 242, 242, 0.2)'; // Light blue fill color
        ctx.fill();

        // Style the curve
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'white';
        ctx.stroke();

        // Draw Y-axis legends
        ctx.lineWidth = 2; // Set a different line width for Y-axis legends
        ctx.strokeStyle = 'white'; // Set stroke style to black for the line
        ctx.beginPath();
        ctx.moveTo(25, 0);
        ctx.lineTo(25, canvas.height);
        ctx.stroke();

        ctx.fillStyle = 'white';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        const legendCount = 4; // Number of legend values
        for (let i = 0; i < legendCount; i++) {
            const yPos = (canvas.height - 15) - (i * (canvas.height - 30) / (legendCount - 1));
            const value = Math.round(i * maxY / (legendCount - 1));
            ctx.fillText(value.toString(), 20, yPos);
        }

        ctx.fillStyle = '#fff';
        ctx.font = '18px Comic Sans MS';
        ctx.fillText("Scored points history", 0, 0);
    }

    // Call the drawCurveChart function with the data
    drawCurveChart(data);
}
