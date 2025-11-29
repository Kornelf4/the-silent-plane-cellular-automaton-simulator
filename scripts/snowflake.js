var snowFlakeIntervalId = setInterval(function() {
    if(getRandomIntegerInclusive(0, 5) == 0) {
        snowflakes.push(new Snowflake());
    }
}, 1000 / 60);

class Snowflake {
    constructor() {
        this.x = floatRand(camera.x / UNIT, (camera.x + canvas.clientWidth) / UNIT);
        this.y = floatRand(camera.y / UNIT, (camera.y + canvas.clientHeight) / UNIT);
        this.size = Math.random() / UNIT * 100;
        this.appMap = generateNew();
        this.pixUnit = this.size / this.appMap.length;
        this.maxLifeTime = getRandomIntegerInclusive(60, 300);
        this.ageCounter = 0;
        this.render = () => {
            this.pixUnit = this.size * UNIT / this.appMap.length;
            for(let i = 0; i < this.appMap.length; i++) {
                for(let i2 = 0; i2 <this.appMap.length; i2++) {
                    let actP = this.appMap[i][i2];
                    if(actP) {
                        ctx2.globalAlpha = 1 - this.ageCounter / this.maxLifeTime;
                        ctx2.fillStyle = actP;
                        ctx2.fillRect(this.x * UNIT + i2 * this.pixUnit - camera.x, this.y * UNIT + i * this.pixUnit - camera.y, this.pixUnit, this.pixUnit);
                    }
                }
            }
            this.ageCounter++;
            if(this.ageCounter >= this.maxLifeTime) snowflakes.splice(snowflakes.indexOf(this), 1);
        }
    }
}