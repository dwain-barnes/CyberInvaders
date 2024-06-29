// powerups.js
const powerUps = [];

function spawnPowerUp() {
    const powerUp = {
        x: Math.random() * (canvas.width - 30) + 15,
        y: 0,
        width: 30,
        height: 20,
        speed: 2
    };
    powerUps.push(powerUp);
}

function updatePowerUps() {
    for (let i = powerUps.length - 1; i >= 0; i--) {
        powerUps[i].y += powerUps[i].speed;

        if (checkCollision(player, powerUps[i])) {
            activatePowerUp();
            powerUps.splice(i, 1);
            continue;
        }

        if (powerUps[i].y > canvas.height) {
            powerUps.splice(i, 1);
        }
    }
}

function drawPowerUps() {
    powerUps.forEach(powerUp => {
        // Main bandaid rectangle
        ctx.fillStyle = '#FFA07A'; // Light salmon color
        ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
        
        // White stripe in the middle
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(powerUp.x + powerUp.width * 0.3, powerUp.y, powerUp.width * 0.4, powerUp.height);
        
        // Rounded ends
        ctx.fillStyle = '#FFA07A';
        ctx.beginPath();
        ctx.arc(powerUp.x, powerUp.y + powerUp.height / 2, powerUp.height / 2, 0.5 * Math.PI, 1.5 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(powerUp.x + powerUp.width, powerUp.y + powerUp.height / 2, powerUp.height / 2, 1.5 * Math.PI, 0.5 * Math.PI);
        ctx.fill();
    });
}

function activatePowerUp() {
    isPoweredUp = true;
    powerUpTime = Date.now();
    playPowerUpSound(); 
}

function resetPowerUps() {
    powerUps.length = 0;
}

function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}