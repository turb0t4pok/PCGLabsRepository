const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let gridSize = 20;
let drawnPixels = [];
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

function drawGrid() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvasWidth; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasHeight);
        ctx.stroke();
    }
    for (let y = 0; y < canvasHeight; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasWidth, y);
        ctx.stroke();
    }
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvasWidth / 2, 0);
    ctx.lineTo(canvasWidth / 2, canvasHeight);
    ctx.moveTo(0, canvasHeight / 2);
    ctx.lineTo(canvasWidth, canvasHeight / 2);
    ctx.stroke();
    drawUnitMarkers();
}
function drawUnitMarkers() {
    const centerX = Math.floor(canvasWidth / 2);
    const centerY = Math.floor(canvasHeight / 2);

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    for (let x = centerX % gridSize; x < canvasWidth; x += gridSize) {
        if (x === centerX) continue;
        ctx.beginPath();
        ctx.moveTo(x, centerY - 5);
        ctx.lineTo(x, centerY + 5);
        ctx.stroke();
    }
    for (let y = centerY % gridSize; y < canvasHeight; y += gridSize) {
        if (y === centerY) continue;
        ctx.beginPath();
        ctx.moveTo(centerX - 5, y);
        ctx.lineTo(centerX + 5, y);
        ctx.stroke();
    }
}

function toGrid(x, y) {
    const offsetX = Math.floor(canvasWidth / 2);
    const offsetY = Math.floor(canvasHeight / 2);
    return [offsetX + x * gridSize, offsetY - y * gridSize];
}

function drawPixel(x, y, color = 'black') {
    const exists = drawnPixels.some(pixel => pixel.x === x && pixel.y === y && pixel.color === color);
    if (!exists) {
        drawnPixels.push({ x, y, color });
    }
    const [gridX, gridY] = toGrid(x, y);
    ctx.fillStyle = color;
    const pixelSize = Math.max(gridSize, 2);
    ctx.fillRect(gridX - pixelSize / 2, gridY - pixelSize / 2, pixelSize, pixelSize);
}

function redrawPixels() {
    for (const pixel of drawnPixels) {
        const [gridX, gridY] = toGrid(pixel.x, pixel.y);
        if (
            gridX >= 0 &&
            gridX < canvasWidth &&
            gridY >= 0 &&
            gridY < canvasHeight
        ) {
            drawPixel(pixel.x, pixel.y, pixel.color);
        }
    }
}

document.getElementById('scale-slider').addEventListener('input', (event) => {
    gridSize = parseInt(event.target.value);
    document.getElementById('scale-value').innerText = gridSize;
    drawGrid();
    redrawPixels();
});

function stepByStep(x1, y1, x2, y2) {
    let output = "Пошаговый алгоритм:\n";
    const dx = x2 - x1;
    const dy = y2 - y1;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));
    const xInc = dx / steps;
    const yInc = dy / steps;

    let x = x1, y = y1;
    for (let i = 0; i <= steps; i++) {
        drawPixel(Math.round(x), Math.round(y), 'red');
        output += `Шаг ${i}: (${Math.round(x)}, ${Math.round(y)})\n`;
        x += xInc;
        y += yInc;
    }
    return output;
}

function dda(x1, y1, x2, y2) {
    let output = "Алгоритм ЦДА:\n";
    const dx = Math.round(x2) - Math.round(x1);
    const dy = Math.round(y2) - Math.round(y1);
    const steps = Math.max(Math.abs(dx), Math.abs(dy));
    const xInc = dx / steps;
    const yInc = dy / steps;
    let x = Math.round(x1), y = Math.round(y1);
    for (let i = 0; i <= steps; i++) {
        drawPixel(Math.round(x), Math.round(y), 'blue');
        output += `Шаг ${i}: (${Math.round(x)}, ${Math.round(y)})\n`;
        x += xInc;
        y += yInc;
    }
    return output;
}

function bresenhamLine(x1, y1, x2, y2) {
    let output = "Алгоритм Брезенхема (линия):\n";
    let deltax = Math.abs(x2 - x1);
    let deltay = Math.abs(y2 - y1);
    let error = 0;
    if(deltax >= deltay){
        let deltaerr = (deltay + 1);
        let y = y1;
        let diry = y2 - y1;
        if (diry > 0) diry = 1;
        if (diry < 0) diry = -1;
        for(let x = x1; x <= x2; x++){
            drawPixel(x, y, 'green');
            output += `Точка: (${x}, ${y})\n`;
            error = error + deltaerr;
            if (error >= (deltax + 1)){
                y = y + diry;
                error = error - (deltax + 1.0);
            }
        }
    }
    else {
        let deltaerr = (deltax + 1);
        let x = x1;
        let dirx = x2 - x1;
        if (dirx > 0) dirx = 1;
        if (dirx < 0) dirx = -1;
        for(let y = y1; y <= y2; y++){
            drawPixel(x, y, 'green');
            output += `Точка: (${x}, ${y})\n`;
            error = error + deltaerr;
            if (error >= (deltay + 1)){
                x = x + dirx;
                error = error - (deltay + 1.0);
            }
        }
    }
    return output;
}

function bresenhamCircle(xc, yc, r) {
    let output = "Алгоритм Брезенхема (окружность):\n";
    let x = 0;
    let y = r;
    let d = 3 - 2 * r;

    function drawCirclePoints(xc, yc, x, y) {
        drawPixel(xc + x, yc + y, 'purple');
        drawPixel(xc - x, yc + y, 'purple');
        drawPixel(xc + x, yc - y, 'purple');
        drawPixel(xc - x, yc - y, 'purple');
        drawPixel(xc + y, yc + x, 'purple');
        drawPixel(xc - y, yc + x, 'purple');
        drawPixel(xc + y, yc - x, 'purple');
        drawPixel(xc - y, yc - x, 'purple');
    }
    while (y >= x) {
        drawCirclePoints(xc, yc, x, y);
        output += `Точки: (${xc + x}, ${yc + y}), (${xc - x}, ${yc + y}), ...\n`;
        x++;
        if (d > 0) {
            y--;
            d += 4 * (x - y) + 10;
        } else {
            d += 4 * x + 6;
        }
    }
    return output;
}

document.getElementById('draw-btn').addEventListener('click', () => {
    drawnPixels = [];
    const x1 = parseFloat(document.getElementById('x1').value);
    const y1 = parseFloat(document.getElementById('y1').value);
    const x2 = parseFloat(document.getElementById('x2').value);
    const y2 = parseFloat(document.getElementById('y2').value);
    const radius = parseInt(document.getElementById('radius').value);
    const algorithm = document.getElementById('algorithm').value;

    drawGrid();
    let output = "";

    switch (algorithm) {
        case 'step-by-step':
            output = stepByStep(x1, y1, x2, y2);
            break;
        case 'dda':
            output = dda(x1, y1, x2, y2);
            break;
        case 'bresenham-line':
            output = bresenhamLine(x1, y1, x2, y2);
            break;
        case 'bresenham-circle':
            output = bresenhamCircle(x1, y1, radius);
            break;
    }

    document.getElementById('output').innerText = output;
});
drawGrid();