class Cell {
    constructor(x, y, parentRuleset) {
        //Required, because searcing for self is expensive
        this.x = x;
        this.y = y;
        if(colorMap[JSON.stringify(parentRuleset)] === undefined) colorMap[JSON.stringify(parentRuleset)] = randomRgb(); //Create new color for ruleset, if it doesn't exists
        this.color = colorMap[JSON.stringify(parentRuleset)];
        this.ruleset = parentRuleset;
        this.isSelected = false;
    }
    updateColor() {
        if(colorMap[JSON.stringify(this.ruleset)] === undefined) colorMap[JSON.stringify(this.ruleset)] = randomRgb();
        this.color = colorMap[JSON.stringify(this.ruleset)];
    }
    remove() {
        if(this == selectedCell) {
            selectedCell = null;
            selectedRuleset = defaultRuleset;
        }
        delete cellsObj[this.y][this.x];
    }
    render() {
        if((this.x + 1) * UNIT < camera.x || (this.y + 1) * UNIT < camera.y || this.x * UNIT > camera.x + canvas.clientWidth || this.y * UNIT > camera.y + canvas.clientHeight) return; // Check if the cell is visible
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x * UNIT - camera.x, this.y * UNIT - camera.y, UNIT, UNIT); //Todo optimalize, don't draw if out of view
        if(this.isSelected) {
            ctx.strokeStyle = "red";
            ctx.lineWidth = 5;
            ctx.strokeRect(this.x * UNIT - camera.x, this.y * UNIT - camera.y, UNIT, UNIT);
        }
    }
    update() {
        let count = 0;
        //Count living neighbors
        for(let i = 0; i < this.ruleset.checkedLocations.length; i++) {
            for(let i2 = 0; i2 < this.ruleset.checkedLocations[i].length; i2++) {
                if(i == 2 && i2 == 2) continue;
                if(this.ruleset.checkedLocations[i][i2]) {
                    if(cellsObj[this.y + i - 2]?.[this.x + i2 - 2]) {
                        count++
                    }
                }
            }
        }
        //Delete if condition is false
        if(!this.ruleset.conditionList[count]) {
            willBeRemoved.push(this);
        }
        //Detect and cache the dead cells
        for(let i = 0; i < defaultDead.checkedLocations.length; i++) {
            for(let i2 = 0; i2 < defaultDead.checkedLocations[i].length; i2++) {
                if(i == 2 && i2 == 2) continue;
               if(defaultDead.checkedLocations[i][i2]) {
                    if(!reqDeadCells[this.y - i  + 2]?.[this.x - i2 + 2]) {
                        let target = cellsObj[this.y - i  + 2]?.[this.x - i2 + 2];
                        if(!target) {
                            if(!reqDeadCells[this.y - i  + 2]) reqDeadCells[this.y - i  + 2] = {};
                            reqDeadCells[this.y - i  + 2][this.x - i2 + 2] = true;
                        }
                    }
               }
            }
        }
    }
}