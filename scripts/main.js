var cellsObj = {}; // Object matrix go brr
var pressedKeys = {};
var canvas = document.getElementById("canvas");
var canvas2 = document.getElementById("canvas2");
var ctx = canvas.getContext("2d");
var ctx2 = canvas2.getContext("2d");
var UNIT = 50;
var camera = { x: 0, y: 0 };
var cameraSpeed = 5;
var cameraMoveFPS = 60;
var updateSpeedFPS = 10;
var reqDeadCells = {};
var willBeRemoved = [];
var willBeAdded = [];
var isPaused = true;
var intervalID = null;
var mutationRate = 0;
var colorMap = {};
var grid = false;
var selectedCell = false;
var selectedRuleset = defaultRuleset;
var fpsDiv = document.getElementById("fpsText");
var spaceWasReleased = true;
let snowflakes = [];
var lastCalledTime;
var fps;
colorMap[JSON.stringify(defaultRuleset)] = "rgba(2, 91, 8, 1)";
document.onclick = function() {
    document.getElementsByTagName("body")[0].requestFullscreen();
    document.onclick = function() {}
}
canvas.setAttribute("width", document.getElementsByTagName("body")[0].clientWidth);
canvas.setAttribute("height", document.getElementsByTagName("body")[0].clientHeight);
canvas2.setAttribute("width", document.getElementsByTagName("body")[0].clientWidth);
canvas2.setAttribute("height", document.getElementsByTagName("body")[0].clientHeight);
function addCell(x, y, cell) {
    if (!cellsObj[y]) {
        cellsObj[y] = {};
    }
    cellsObj[y][x] = cell;
}
function calcFPS() {
    if (!lastCalledTime) {
        lastCalledTime = Date.now();
        fps = 0;
        return;
    }
    delta = (Date.now() - lastCalledTime) / 1000;
    lastCalledTime = Date.now();
    fps = 1 / delta;
}
function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        document.getElementById("pauseButton").value = "Start";
    } else {
        document.getElementById("pauseButton").value = "Pause";
    }
}
function start() {
    initLocBoxes();
    updateDisplay();
    let boxElems = document.getElementsByClassName("locBox");
    for (let i = 0; i < boxElems.length; i++) {
        boxElems[i].addEventListener("click", function () {
            let splicedId = this.id.slice(1).split("_");
            let thisX = splicedId[0];
            let thisY = splicedId[1];
            if (selectedRuleset.checkedLocations[thisY][thisX]) {
                selectedRuleset.conditionList.pop();
            } else {
                selectedRuleset.conditionList.push(false);
            }
            selectedRuleset.checkedLocations[thisY][thisX] = !selectedRuleset.checkedLocations[thisY][thisX];
            updateDisplay();
            if (selectedCell) selectedCell.updateColor();
        })
    }
}
function initLocBoxes() {
    let target = document.getElementById("locationContainer");
    for (let i = 0; i < 5; i++) {
        for (let i2 = 0; i2 < 5; i2++) {
            let actual = document.createElement("div");
            actual.classList.add("locBox");
            actual.id = `l${i2}_${i}`;
            target.appendChild(actual);
        }
    }
}
addEventListener("resize", (event) => {
    canvas.setAttribute("width", document.getElementsByTagName("body")[0].clientWidth);
    canvas.setAttribute("height", document.getElementsByTagName("body")[0].clientHeight);
    canvas2.setAttribute("width", document.getElementsByTagName("body")[0].clientWidth);
    canvas2.setAttribute("height", document.getElementsByTagName("body")[0].clientHeight);
})
function renderCells() {
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    for (let i in cellsObj) {
        for (let i2 in cellsObj[i]) { //Why the shit performance??
            cellsObj[i][i2].render(i2, i);
        }
    }
}
function updateCells() {
    for (let i in cellsObj) {
        for (let i2 in cellsObj[i]) {
            cellsObj[i][i2].update(i2, i);
        }
    }
}
function toggleCellAt(x, y, ruleSet) {
    let target = cellsObj[y]?.[x];
    if (target) {
        delete cellsObj[y][x];
    } else {
        addCell(x, y, new Cell(x, y, ruleSet));
    }
}
function selectCellAt(x, y) {
    if (cellsObj[y]?.[x]) { //This cannot be automated ):
        if (selectedCell == cellsObj[y][x]) {
            selectedCell.isSelected = false;
            selectedCell = null;
            selectedRuleset = defaultRuleset;
            document.getElementById("modSelect").innerText = "default";
        } else {
            if (selectedCell) selectedCell.isSelected = false;
            selectedCell = cellsObj[y][x];
            selectedCell.isSelected = true;
            selectedRuleset = selectedCell.ruleset;
            document.getElementById("modSelect").innerText = "selected";
        }
    } else {
        if (selectedCell) selectedCell.isSelected = false;
        selectedCell = null;
        selectedRuleset = defaultDead;
        document.getElementById("modSelect").innerText = "dead";
    }
    updateDisplay();
}
function mostFrequent(arr) {
    let m = new Map();
    let maxCount = 0;
    let res = null;

    for (let num of arr) {
        let count = (m.get(num) || 0) + 1;
        m.set(num, count);

        if (count > maxCount) {
            maxCount = count;
            res = num;
        }
    }

    return res;
}
function updateDeadCells() {
    for (let y in reqDeadCells) {
        for (let x in reqDeadCells[y]) {
            let parsedX = parseInt(x);
            let parsedY = parseInt(y); // Ye this was hard to debug
            let counter = 0;
            //let possibleParentRulesets = []; // Why the long name
            let parentCache = {};
            let bestOc = null;
            let bestNum = 0;
            for (let i = 0; i < defaultDead.checkedLocations.length; i++) {
                for (let i2 = 0; i2 < defaultDead.checkedLocations[i].length; i2++) {
                    if (i == 2 && i2 == 2) continue;
                    if (defaultDead.checkedLocations[i][i2]) {
                        let target = cellsObj[parsedY + i - 2]?.[parsedX + i2 - 2];
                        if (target) {
                            counter++;
                            let actRs = target.rsString();
                            //possibleParentRulesets.push(target.ruleset);
                            if(parentCache[actRs]) {
                                parentCache[actRs]++;
                            } else {
                                parentCache[actRs] = 1;
                            }
                            if(parentCache[actRs] >bestNum) {
                                bestNum = parentCache[actRs];
                                bestOc = target.ruleset;
                            }
                        }
                    }
                }
            }
            /*console.log("a")
            console.log(parentCache);
            console.log(bestOc);*/
            //let randRuleset = possibleParentRulesets[getRndInteger(0, possibleParentRulesets.length - 1)];
            /*let randRuleset = mostFrequent(possibleParentRulesets);
            console.log("Array:");
            console.log(possibleParentRulesets);
            console.log("Choosen:")
            console.log(randRuleset)*/
            if (defaultDead.conditionList[counter]) {
                willBeAdded.push(new Cell(parsedX, parsedY, mutRuleset(bestOc)))
            }
        }
    }
}
function updateState() {
    reqDeadCells = {};
    willBeRemoved = [];
    willBeAdded = [];
    updateCells(); // This shouldn't be the most efficent sequence of operations but I'm too dumb
    updateDeadCells();
    for (let i = 0; i < willBeAdded.length; i++) {
        addCell(willBeAdded[i].x, willBeAdded[i].y, new Cell(willBeAdded[i].x, willBeAdded[i].y, willBeAdded[i].ruleset))
    }
    for (let i = 0; i < willBeRemoved.length; i++) {
        willBeRemoved[i].remove();
    }
    //renderCells();
    calcFPS();
    fpsDiv.innerText = "FPS: " + Math.floor(fps);
}
function newInterval() { //Readable
    intervalID = window.setInterval(() => {
        if (!isPaused) {
            updateState();
        } else {
            //renderCells();
        }
    }, 1000 / updateSpeedFPS);
}
function updateGameSpeed(to) {
    updateSpeedFPS = to;
    clearInterval(intervalID);
    newInterval()
}
window.setInterval(() => {
    moveCamera();
    ctx2.clearRect(0, 0, canvas2.clientWidth, canvas2.clientHeight);
    for (let i = 0; i < snowflakes.length; i++) {
        snowflakes[i].render();
    }
    renderCells();
}, 1000 / cameraMoveFPS);
newInterval();