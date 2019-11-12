// Basic Graphing Calculator

// Intro

// Informing user of no key press
alert('Editing from keyboard is not allowed. Use button interface instead.');

// Will display popup if user presses a key
document.addEventListener('keypress', popup);

function popup() {
    if (menuOpen) {
        let popupBox = document.getElementById('key-warning');
        popupBox.style.opacity = 1;
        popupBox.style.zIndex = 4;
        setTimeout(function(){popupBox.style.opacity = 0;
        popupBox.style.zIndex = -1 }, 2000);
        }
}


// Open side navigation
let menuOpen = true;

// Event Listeners
document.getElementById('openclose').addEventListener('click', toggleOpen);

// Open Function
function toggleOpen() {
    let sideBar = document.getElementById('mySideNav');
    let openClose = document.getElementById('openclose');
    let dimensions = document.getElementById('set-dimensions');
    let buttonMenu = document.getElementById('nav-buttons');
    if (menuOpen) {
        sideBar.style.width = '0px';
        openClose.style.left = '0px';
        openClose.innerHTML = '>>';
        dimensions.style.visibility = 'hidden';
        buttonMenu.style.visibility = 'hidden';
    } else {
        sideBar.style.width = '400px';
        openClose.style.left = '400px';
        openClose.innerHTML = '<<';
        dimensions.style.visibility = 'visible';
        buttonMenu.style.visibility = 'visible';
    }
    menuOpen = !(menuOpen);
}


// Update Input Boxes with button menu
document.getElementById('set-dimensions').addEventListener('click', boxSelector);
document.getElementById('nav-input').addEventListener('click', boxSelector);
document.getElementById('nav-buttons').addEventListener('click', buttonInput);

// Global Variables
let src = document.getElementById('equ1');
// These will be where the equation will be parsed, to be interpreted in the next step.
let currentArray, currentFunction;
let function1 = [];
let function2 = [];
let viewer1 = [];
let viewer2 = [];

let tracer1 = [];
let tracer2 = [];
let traceViewer1 = [];
let traceViewer2 = [];

let xMaxArr = [1, 5];
let xMinArr = ['-', 1, 5];
let yMaxArr = [1, 0];
let yMinArr = ['-', 1, 0];
let xMaxView = [1, 5];
let xMinView = ['-', 1, 5];
let yMaxView = [1, 0];
let yMinView = ['-', 1, 0];


// Functions

// This will store the currently selected box into the src variable
function boxSelector(event) {
    if (event.target.classList.contains('selectable')) {
        src.style.borderWidth = '1px';
        src = event.target; 
        src.style.borderWidth = '4px';
    }
}

// This will update both the display and the inner, parsed arrays
function buttonInput() {
    let button = event.target; // This stores the button that was clicked
    if (button.nodeName == 'BUTTON') {
        let displayer = button.innerHTML;
        let grapher = button.id;

        
        // Equation
        if (src.classList.contains('equ')) {
            if (src.id == 'equ1') {
                currentArray = viewer1;
                currentFunction = function1;
            } else if (src.id == 'equ2') {
                currentArray = viewer2;
                currentFunction = function2;
            }
            if (grapher == 'back' && currentArray.length != 0) {
                currentArray.pop();
                currentFunction.pop();
            } else if (grapher != 'back') {
                currentArray.push(displayer);
                currentFunction.push(grapher);
            }

        // Trace
        } else if (src.classList.contains('tracer') && grapher != 'x') {
            if (src.id == 'tracex1') {
                currentArray = traceViewer1;
                currentFunction = tracer1;
            } else if (src.id == 'tracex2') {
                currentArray = traceViewer2;
                currentFunction = tracer2;
            }

            if (grapher == 'back' && currentArray.length != 0) {
                currentArray.pop();
                currentFunction.pop();
            } else if (grapher != 'back') {
                currentArray.push(displayer);
                currentFunction.push(grapher);
            }
        
        // Dimension
        } else if (src.classList.contains('dimension')) {
            if (src.id == 'xMin-input') {
                currentArray = xMinView;
                currentFunction = xMinArr;
            } else if (src.id == 'xMax-input') {
                currentArray = xMaxView;
                currentFunction = xMaxArr;
            } else if (src.id == 'yMin-input') {
                currentArray = yMinView;
                currentFunction = yMinArr;
            } else if (src.id == 'yMax-input') {
                currentArray = yMaxView;
                currentFunction = yMaxArr;
            }
            if ((button.classList.contains('pure') || grapher == ' - ')) {
                if (grapher == 'back' && currentArray.length != 0) {
                    currentArray.pop();
                    currentFunction.pop();
                } else if (grapher == ' - ') {
                    if (currentArray.length == 0) {
                        currentArray.push('-');
                        currentFunction.push('0 - ');
                    }
                } else if (grapher != 'back') {
                    currentArray.push(displayer);
                    currentFunction.push(grapher);
                }
            }
        }

        let it = String(currentArray[currentArray.length - 2]);
        if ((grapher == 'Math.PI' || grapher == 'x') && (!(isNaN(it)) || it == 'π')) {
            currentFunction.splice(-1, 1, '* ' + grapher);
        }
        // Display on screen
        src.innerHTML = '';
        let fLen = currentArray.length;
        for (i = 0; i < fLen; i++) {
            src.innerHTML += currentArray[i];
        }   
    }
}


// Canvas

// Global Variables
let cnv = document.getElementById('coords');
let ctx = cnv.getContext('2d');
cnv.width = window.innerWidth;
cnv.height = window.innerHeight; 

let xMin, xMax, yMin, yMax;
xMax = 15;
xMin = -15;
yMax = 10;
yMin = -10;
let unitsPerX = (xMax - xMin) / cnv.width;
let unitsPerY = (yMax - yMin) / cnv.height;

let graphString1 = '';
let graphString2 = '';

let traceInput1 = '';
let traceInput2 = '';

// Event Listeners
document.getElementById('button-dim').addEventListener('click', changeAxis);
document.getElementById('enter1').addEventListener('click', graph1Button);
document.getElementById('enter2').addEventListener('click', graph2Button);

document.getElementById('tracer-button1').addEventListener('click', trace1);
document.getElementById('tracer-button2').addEventListener('click', trace2);

drawAxis();

// Clears Canvas and Draws axis lines function
function drawAxis() {

    // Clear
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, cnv.width, cnv.height);

    // Draw
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    if (xMax * xMin < 0) {
        let yAxisCoord = Math.abs(xMin / unitsPerX);
        ctx.beginPath();
        ctx.moveTo(yAxisCoord , 0);
        ctx.lineTo(yAxisCoord , cnv.height);
        ctx.stroke();
    }
    if (yMax * yMin < 0) {
        let xAxisCoord = Math.abs(yMax / unitsPerY);
        ctx.beginPath();
        ctx.moveTo(0 , xAxisCoord);
        ctx.lineTo(cnv.width , xAxisCoord);
        ctx.stroke();
    }

    graphLine(graphString1, 'red');
    graphLine(graphString2, 'blue');
    traceFunction(1);
    traceFunction(2);
}

// Handles 'set' button: Adjusts scale of axis, redraws axis
function changeAxis() {
    xMax = eval(xMaxArr.join(''));
    xMin = eval(xMinArr.join(''));
    yMax = eval(yMaxArr.join(''));
    yMin = eval(yMinArr.join(''));

    unitsPerX = (xMax - xMin) / cnv.width;
    unitsPerY = (yMax - yMin) / cnv.height;

    drawAxis();
}

// Takes a string graph color and graphs it
function graphLine(graphThis, color) {
    let yValues = [];
    for (let x = xMin - unitsPerX; x <= xMax; x += unitsPerX) {
        let i = eval(graphThis);
        if (i >= 10 * yMax) {
            yValues.push('Asymp');
        } else if (i <= 10 * yMin) {
            yValues.push('Asymp');
        } else {
            yValues.push(i);
        }
        
    }
    
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    
    let firstNumIndex = yValues.findIndex(checkNumber);
    function checkNumber(num) {
        return !isNaN(num);
    }
    
    ctx.beginPath();
    ctx.moveTo(firstNumIndex, (yMax - yValues[firstNumIndex]) / unitsPerY);
    for (let pix = firstNumIndex; pix <= cnv.width; pix++) {
        let i = yValues[pix];
        if (!isNaN(i)) {
            ctx.lineTo(pix, (yMax - i)/ unitsPerY);
        } else if (i == 'Asymp') {
            ctx.moveTo(pix, (yMax - yValues[pix + 1]) / unitsPerY)
        }
    }
    ctx.stroke();
}

// Handling the 'graph' buttons: update one of the graph strings, redraw axis, redraw other graph, redraw current graph
function graph1Button() {
    graphString1 = function1.join(''); // Update graphString1
    drawAxis(); // Redraw axis
}

function graph2Button() {
    graphString2 = function2.join(''); // Update graphString2
    drawAxis(); // Redraw axis
}


// Handles the 'trace' buttons: formats the array to a string, evaluates it, updates corresponding x.
function trace1() {
    traceInput1 = tracer1.join('');
    drawAxis();
}

function trace2() {
    traceInput2 = tracer2.join('');
    drawAxis();
}

// Plots a trace point based on equation number
function traceFunction(equNumber) {
    let x, yOutput;
    if (equNumber == 1 && tracer1.length != 0) {
        x = eval(traceInput1);
        yOutput = Math.round(eval(graphString1) / 0.001) * 0.001;
        ctx.fillStyle = 'red';
    } else if (tracer2.length != 0){
        x = eval(traceInput2);
        yOutput = Math.round(eval(graphString2) / 0.001) * 0.001;
        ctx.fillStyle = 'blue';
    }
    
    // Draw Circle
    ctx.beginPath();
    ctx.arc((x - xMin) / unitsPerX, (yMax - yOutput) / unitsPerY, 5, 0, 2 * Math.PI);
    ctx.fill();

    // Update innerHTML
    if (typeof yOutput != 'undefined' && !(isNaN(yOutput))) {
        document.getElementById('tracey' + equNumber).innerHTML = yOutput;
    } else {
        document.getElementById('tracey' + equNumber).innerHTML = '---';
    }
}


