function getRndInteger(min, max) { // both included
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}
function randomRgb() {
    return `rgb(${getRndInteger(0, 255)}, ${getRndInteger(0, 255)}, ${getRndInteger(0, 255)})`;
}
function getExcludedRand() { //0-1 or 3-4
    if(getRndInteger(0, 1) == 0) {
        return getRndInteger(0,1);
    } else {
        return getRndInteger(3,4);
    }
}
function getRandLoc() {//OOXOO
    return {x: getExcludedRand(), y: getExcludedRand()};
}
function mutRuleset(ruleset) {
    if(getRndInteger(0, 99) < mutationRate) {
        let result = JSON.parse(JSON.stringify(ruleset));
        switch(getRndInteger(0, 1)) {
            case 0:
                // Invert one location
                let targetLoc = getRandLoc();
                if(result.checkedLocations[targetLoc.y][targetLoc.x]) {
                    result.conditionList.pop();
                } else {
                    result.conditionList.unshift(false);
                }
                result.checkedLocations[targetLoc.y][targetLoc.x] = !result.checkedLocations[targetLoc.y][targetLoc.x];
            case 1:
                // Invert one state
                let targetIndex = getRndInteger(0, result.conditionList.length - 1);
                result.conditionList[targetIndex] = !result.conditionList[targetIndex];
            case 2:
                // Swap two states
                for(let i = 0; i < 2; i++) {
                    let target1 = getRndInteger(0, result.conditionList.length - 1);
                    let target2 = getRndInteger(0, result.conditionList.length - 1);
                    [result.conditionList[target1], result.conditionList[target2]] = [result.conditionList[target2], result.conditionList[target1]]; // Soo modern and immersive it's almost unreadable
                }
        }
        return result;
    } else {return ruleset;}
}