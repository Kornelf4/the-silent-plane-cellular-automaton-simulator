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
    let squareStats = prompt("Position and size of square? (x, y, height, width)")?.split(",");
    if(!squareStats) return;
    if(squareStats.length != 4) {
        alert("Could not complete operation, because one or more arguments aren't provided.")
        return;
    }
    let [sqX, sqY, sqWidth, sqHeight] = squareStats.map(elem => parseInt(elem));
    let plotChance = parseFloat(prompt("Chance for living cell on every UNIT? (From 0 to 1)"));
    if(isNaN(plotChance)) {
        alert("You have to enter a number from 0 to 1 as a chance.")
        return;
    }
    if(plotChance < 0 || plotChance > 1) {
        alert("You have to enter a number from 0 to 1 as a chance.")
        return;
    }
    for(let i = sqY; i < sqHeight + sqY; i++) {
        for(let i2 = sqX; i2 < sqWidth + sqX; i2++) {
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
document.getElementById("sc").onchange = function() {
    if(this.checked) {
        snowFlakeIntervalId = setInterval(function() {
            if(getRandomIntegerInclusive(0, 5) == 0) {
                snowflakes.push(new Snowflake());
            }
        }, 1000 / 60);
    } else {
        clearInterval(snowFlakeIntervalId);
    }
}
document.getElementById("backgroundInput").onchange = function() {
    document.getElementsByClassName("wrapper")[0].style.backgroundColor = this.value;
}