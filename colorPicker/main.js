// Ползунки и числовые поля для RGB
const rInput = document.getElementById('r');
const gInput = document.getElementById('g');
const bInput = document.getElementById('b');
const rValInput = document.getElementById('r_val');
const gValInput = document.getElementById('g_val');
const bValInput = document.getElementById('b_val');

// Ползунки и числовые поля для XYZ
const xInput = document.getElementById('x');
const yInput = document.getElementById('y');
const zInput = document.getElementById('z');
const xValInput = document.getElementById('x_val');
const yValInput = document.getElementById('y_val');
const zValInput = document.getElementById('z_val');

// Ползунки и числовые поля для HSV
const hInput = document.getElementById('h');
const sInput = document.getElementById('s');
const vInput = document.getElementById('v');
const hValInput = document.getElementById('h_val');
const sValInput = document.getElementById('s_val');
const vValInput = document.getElementById('v_val');

function initColorPicker() {
    var canvas = document.getElementById('colorCanvas');
    var canvasContext = canvas.getContext('2d');
  
    let gradient = canvas.getContext('2d').createLinearGradient(0, 0, canvas.width, 0)
    gradient.addColorStop(0, '#ff0000')
    gradient.addColorStop(1 / 6, '#ffff00')
    gradient.addColorStop((1 / 6) * 2, '#00ff00')
    gradient.addColorStop((1 / 6) * 3, '#00ffff')
    gradient.addColorStop((1 / 6) * 4, '#0000ff')
    gradient.addColorStop((1 / 6) * 5, '#ff00ff')
    gradient.addColorStop(1, '#ff0000')
    canvas.getContext('2d').fillStyle = gradient
    canvas.getContext('2d').fillRect(0, 0, canvas.width, canvas.height)
  
    gradient = canvas.getContext('2d').createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    canvas.getContext('2d').fillStyle = gradient
    canvas.getContext('2d').fillRect(0, 0, canvas.width, canvas.height)
  
    gradient = canvas.getContext('2d').createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
    gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0)')
    gradient.addColorStop(1, 'rgba(0, 0, 0, 1)')
    canvas.getContext('2d').fillStyle = gradient
    canvas.getContext('2d').fillRect(0, 0, canvas.width, canvas.height)
  
  
    canvas.onclick = function(e) {
        console.log()
      var imgData = canvasContext.getImageData((e.offsetX / canvas.clientWidth) * canvas.width, (e.offsetY / canvas.clientHeight) * canvas.height, 1, 1);
        var rgba = imgData.data;
        const r = rgba[0];
        const g = rgba[1];
        const b = rgba[2];

        // Обновляем RGB
        rInput.value = r;
        gInput.value = g;
        bInput.value = b;
        rValInput.value = r;
        gValInput.value = g;
        bValInput.value = b;
        
        // Превью цвета
        colorPreview.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        const xyz = rgbToXyz(r, g, b);
        updateXyzInputs(xyz);

        const hsv = rgbToHsv(r, g, b);
        updateHsvInputs(hsv);
    }
  }
initColorPicker()
function updateRgb() {
    const r = parseInt(rInput.value);
    const g = parseInt(gInput.value);
    const b = parseInt(bInput.value);


    const xyz = rgbToXyz(r, g, b);
    updateXyzInputs(xyz);

    const hsv = rgbToHsv(r, g, b);
    updateHsvInputs(hsv);

    colorPreview.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
}

// Обновление XYZ
function updateXyz() {
    const x = parseFloat(xInput.value);
    const y = parseFloat(yInput.value);
    const z = parseFloat(zInput.value);

    const rgb = xyzToRgb(x, y, z);
    updateRgbInputs(rgb);
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
    updateHsvInputs(hsv);
    colorPreview.style.backgroundColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    //updateRgb();
}

// Обновление HSV
function updateHsv() {
    const h = parseInt(hInput.value);
    const s = parseInt(sInput.value);
    const v = parseInt(vInput.value);

    const rgb = hsvToRgb(h, s, v);
    updateRgbInputs(rgb);
    const xyz = rgbToXyz(rgb.r, rgb.g, rgb.b);
    updateXyzInputs(xyz);
    colorPreview.style.backgroundColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    //updateRgb();
}

// Обновление значений RGB
function updateRgbInputs(rgb) {
    if(rgb.r < 0){
        rInput.value = 0;
        rValInput.value = 0;
    }
    else if(rgb.r > 255){
        rInput.value = 255;
        rValInput.value = 255;
    }
    else {
        rInput.value = rgb.r;
        rValInput.value = rgb.r
    }
    ////////
    if(rgb.g < 0){
        gInput.value = 0;
        gValInput.value = 0;
    }
    else if(rgb.g > 255){
        gInput.value = 255;
        gValInput.value = 255;
    }
    else {
        gInput.value = rgb.g;
        gValInput.value = rgb.g;
    }
    ////////
    if(rgb.b < 0){
        bInput.value = 0;
        bValInput.value = 0;
    }
    else if(rgb.b > 255){
        bInput.value = 255;
        bValInput.value = 255;
    }
    else {
        bInput.value = rgb.b;
        bValInput.value = rgb.b;
    }
    }

// Обновление значений XYZ
function updateXyzInputs(xyz) {
    if(xyz.x < 0){
        xInput.value = 0;
        xValInput.value = 0;
    }
    else if(xyz.x > 100){
        xInput.value = 100;
        xValInput.value = 100;
    }
    else {
        xInput.value = xyz.x.toFixed(2);
        xValInput.value = xyz.x.toFixed(2);
    }
    ////////
    if(xyz.y < 0){
        yInput.value = 0;
        yValInput.value = 0;
    }
    else if(xyz.y > 100){
        yInput.value = 100;
        yValInput.value = 100;
    }
    else {
        yInput.value = xyz.y.toFixed(2);
        yValInput.value = xyz.y.toFixed(2);
    }
    ////////
    if(xyz.z < 0){
        zInput.value = 0;
        zValInput.value = 0;
    }
    else if(xyz.z > 100){
        zInput.value = 100;
        zValInput.value = 100;
    }
    else {
        zInput.value = xyz.z.toFixed(2);
        zValInput.value = xyz.z.toFixed(2);
    }
}

// Обновление значений HSV
function updateHsvInputs(hsv) {
    if(hsv.h > 360){
        hInput.value = 360;
        hValInput.value = 360;
    }
    else if(hsv.h < 0){
        hInput.value = 0;
        hValInput.value = 0;
    }
    else {
        hInput.value = hsv.h;
        hValInput.value = hsv.h;
    }
    /////////
    if(hsv.s > 100){
        sInput.value = 100;
        sValInput.value = 100;
    }
    else if(hsv.s < 0){
        sInput.value = 0;
        sValInput.value = 0;
    }
    else {
        sInput.value = hsv.s.toFixed(2);
        sValInput.value = hsv.s.toFixed(2);
    }
    ///////////
    if(hsv.v > 100){
        vInput.value = 100;
        vValInput.value = 100;
    }
    else if(hsv.v < 0){
        vInput.value = 0;
        vValInput.value = 0;
    }
    else {
        vInput.value = hsv.v.toFixed(2);
        vValInput.value = hsv.v.toFixed(2);
    }
}

function bindInputs(slider, numInput, updateFunc) {
    slider.addEventListener('input', () => {
        numInput.value = slider.value;
        updateFunc();
    });

    numInput.addEventListener('input', () => {
        slider.value = numInput.value;
        updateFunc();
    });
}

// Привязываем все поля к соответствующим функциям
bindInputs(rInput, rValInput, updateRgb);
bindInputs(gInput, gValInput, updateRgb);
bindInputs(bInput, bValInput, updateRgb);

bindInputs(xInput, xValInput, updateXyz);
bindInputs(yInput, yValInput, updateXyz);
bindInputs(zInput, zValInput, updateXyz);

bindInputs(hInput, hValInput, updateHsv);
bindInputs(sInput, sValInput, updateHsv);
bindInputs(vInput, vValInput, updateHsv);

 // События для обновления цвета
 rInput.addEventListener('input', updateRgb);
 gInput.addEventListener('input', updateRgb);
 bInput.addEventListener('input', updateRgb);

 xInput.addEventListener('input', updateXyz);
 yInput.addEventListener('input', updateXyz);
 zInput.addEventListener('input', updateXyz);

 hInput.addEventListener('input', updateHsv);
 sInput.addEventListener('input', updateHsv);
 vInput.addEventListener('input', updateHsv);

 updateRgb(); // Инициализация  

 function rgbToXyz(r, g, b) {
    r = r / 255; g = g / 255; b = b / 255;
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

    let x = r * 0.4124 + g * 0.3576 + b * 0.1805;
    let y = r * 0.2126 + g * 0.7152 + b * 0.0722;
    let z = r * 0.0193 + g * 0.1192 + b * 0.9505;

    return { x: x * 100, y: y * 100, z: z * 100 };
}

// Конвертация XYZ → RGB
function xyzToRgb(x, y, z) {
    x = x / 100; y = y / 100; z = z / 100;
    let r = x * 3.2406 + y * -1.5372 + z * -0.4986;
    let g = x * -0.9689 + y * 1.8758 + z * 0.0415;
    let b = x * 0.0557 + y * -0.2040 + z * 1.0570;

    r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : r * 12.92;
    g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : g * 12.92;
    b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : b * 12.92;

    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

// Конвертация RGB → HSV
function rgbToHsv(r, g, b) {
    r = r / 255; g = g / 255; b = b / 255;
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let delta = max - min;
    let s = 0;
    let v = max;
    if(max != 0){
        s = delta / max;
    }
    if(delta === 0){
        h = 0;
    }
    else {
        switch (max) {
            case r: h = (g - b) / delta + (g < b ? 6 : 0); break;
            case g: h = (b - r) / delta + 2; break;
            case b: h = (r - g) / delta + 4; break;
        }
    }
    return { h: Math.round(h * 60), s: Math.round(s * 100), v: Math.round(v * 100) };
}

// Конвертация HSV → RGB
function hsvToRgb(h, s, v) {
    h /= 60;
    s /= 100;
    v /= 100;
    let c = s * v;
    let x = c * (1 - Math.abs(h % 2 - 1));
    let r, g, b;
    if(h >= 0 && h < 1 || h === 6){
        r = c;
        g = x;
        b = 0;
    }
    else if(h >= 1 && h < 2){
        r = x;
        g = c;
        b = 0;
    }
    else if(h >= 2 && h < 3){
        r = 0;
        g = c;
        b = x;
    }
    else if(h >= 3 && h < 4){
        r = 0;
        g = x;
        b = c;
    }
    else if(h >= 4 && h < 5){
        r = x;
        g = 0;
        b = c;
    }
    else if(h >= 5 && h < 6){
        r = c;
        g = 0;
        b = x;
    }
    let m = v - c;
    r += m;
    g += m;
    b += m;
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}