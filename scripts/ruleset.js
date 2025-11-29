// Rulesets of Conway's Game of Life
var defaultRuleset = {
    checkedLocations: [
        [false, false, false, false, false],
        [false, true, true, true, false],
        [false, true, false, true, false],
        [false, true, true, true, false],
        [false, false, false, false, false],
    ],
    conditionList: [false, false, true, true, false, false, false, false, false]
}
var defaultDead = {
    checkedLocations: [
        [false, false, false, false, false],
        [false, true, true, true, false],
        [false, true, false, true, false],
        [false, true, true, true, false],
        [false, false, false, false, false],
    ],
    conditionList: [false, false, false, true, false, false, false, false, false]
}