window.addEventListener("keydown", (e) => {
    pressedKeys[e.key.toLowerCase()] = true;
    if(e.key.toLowerCase() == "h") {
        selectedRuleset = defaultDead;
        document.getElementById("modSelect").innerText = "dead";
    }
    if(e.key.toLowerCase() == "n") {
        selectedRuleset = defaultRuleset;
        document.getElementById("modSelect").innerText = "default";
    }
    if(e.key.toLowerCase() == "h" || e.key.toLowerCase() == "n") { // Very readable...
        if(selectedCell)selectedCell.isSelected = false;
        selectedCell = null;
        updateDisplay();
    }
    if(e.key.toLowerCase() == " " && spaceWasReleased) {
        spaceWasReleased = false;
        togglePause();
    }
});
window.addEventListener("keyup", (e) => {
    if(e.key == " ") spaceWasReleased = true;
    delete pressedKeys[e.key.toLowerCase()]
});
canvas.addEventListener('click', function(event) {
    const rect = this.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if(pressedKeys.c) {
        selectCellAt(Math.floor((x + camera.x) / UNIT), Math.floor((y + camera.y) / UNIT));
    } else {
        toggleCellAt(Math.floor((x + camera.x) / UNIT), Math.floor((y + camera.y) / UNIT), JSON.parse(JSON.stringify(defaultRuleset)));
    }
});
document.getElementById("simSpeed").addEventListener("keydown", function(e)  {
    if(e.key === "Enter") {
        updateGameSpeed(parseFloat(this.value));
        this.blur();
    }
})
document.getElementById("mutRate").addEventListener("keydown", function(e)  {
    if(e.key === "Enter") {
        mutationRate = parseInt(this.value);
        this.blur();
    }
})
document.getElementById("pauseButton").onclick = function() {
    togglePause();
    this.blur();
}
document.getElementById("stepButton").onclick = function() {
    updateState();
    this.blur();
}
function unitZoom(zoomingFactor) { //idk, from stackoverflow
    let cameraCenterX = camera.x + canvas.clientWidth / 2;
    let cameraCenterY = camera.y + canvas.clientHeight / 2;
    cameraCenterX *= zoomingFactor;
    cameraCenterY *= zoomingFactor;
    camera.x = cameraCenterX - canvas.clientWidth / 2;
    camera.y = cameraCenterY - canvas.clientHeight / 2;
}
document.getElementById("zoomInButton").onclick = () => {
    let zoomingFactor = (UNIT + 5) / UNIT;
    unitZoom(zoomingFactor);
    UNIT += 5;
}
document.getElementById("zoomOutButton").onclick = () => {
    if (UNIT - 5 <= 0) return;
    let zoomingFactor = (UNIT - 5) / UNIT;
    unitZoom(zoomingFactor);
    UNIT -= 5;
}
document.getElementById("clearButton").onclick = function() {
    cellsObj = {};
    selectedCell = null;
    selectedRuleset = defaultRuleset;
    this.blur();
}
document.getElementById("randomPlot").onclick = function() {
    if(Object.keys(cellsObj).length != 0) {
        if(confirm("The word should be empty. Do you want to clear the living cells, and then plot randomly?")) {
            cellsObj = {};
            selectedCell = null;
            selectedRuleset = defaultRuleset;
        } else {
            return;
        }
    }
    let squareSize = prompt("Size of square?");
    let plotChance = prompt("Chance for living cell on every UNIT? (From 0 to 1)");
    for(let i = 0;i < squareSize; i++) {
        for(let i2 = 0; i2 < squareSize; i2++) {
            if(Math.random() < plotChance) {
                if(!cellsObj[i]) cellsObj[i] = {};
                cellsObj[i][i2] = new Cell(i2, i, JSON.parse(JSON.stringify(defaultRuleset)))
            }
        }
    }
    this.blur();
}
canvas.onwheel = function(e) {
    e.preventDefault();
    if(e.deltaY < 0) {
        document.getElementById("zoomInButton").click();
    } else {
        document.getElementById("zoomOutButton").click();
    }
}