const enemies = [];
const enemyBullets = [];
const enemyRows = 5;
const enemiesPerRow = 8;
let enemyDirection = 1;
let enemySpeed = 1;
let enemyDropDistance = 20;
let hackerHealth = 30;
const descendingEnemySpeed = 0.1; 
const hackerSpawnInterval = 20000; 
const maxSpawnedEnemies = 3; 

function createEnemies() {
    enemies.length = 0;
    enemyBullets.length = 0;
    if (currentLevel === 6) {
        // Create a single hacker enemy
        enemies.push({
            x: canvas.width / 2 - 100,
            y: 50,
            width: 200,
            height: 200,
            type: 'hacker',
            spawnTimer: 0,
            teleportTimer: 0,
            visible: true
        });
        hackerHealth = 30;
    } else {
        // Create normal enemies for other levels
        for (let row = 0; row < enemyRows; row++) {
            for (let col = 0; col < enemiesPerRow; col++) {
                enemies.push({
                    x: col * 70 + 50,
                    y: row * 50 + 50,
                    width: 40,
                    height: 30,
                    type: getEnemyType(currentLevel),
                    blinkTimer: Math.random() * 2000,
                    glitchTimer: Math.random() * 1000,
                    binaryTimer: 0,
                    lockTimer: Math.random() * 1000,
                    shootTimer: 0
                });
            }
        }
    }
}

function getEnemyType(level) {
    switch(level) {
        case 1: return 'phishing';
        case 2: return 'virus';
        case 3: return 'spyware';
        case 4: return 'malware';
        case 5: return 'ransomware';
        case 6: return 'hacker';
        default: return 'phishing';
    }
}

function drawEnemies() {
    enemies.forEach(enemy => {
        switch(enemy.type) {
            case 'phishing':
                drawPhishingEmail(enemy.x, enemy.y, enemy.width, enemy.height);
                break;
            case 'virus':
                drawVirus(enemy.x, enemy.y, enemy.width, enemy.height);
                break;
            case 'spyware':
                drawSpyware(enemy.x, enemy.y, enemy.width, enemy.height, enemy.blinkTimer);
                break;
            case 'malware':
                drawMalware(enemy.x, enemy.y, enemy.width, enemy.height, enemy.glitchTimer);
                break;
            case 'ransomware':
                drawRansomware(enemy.x, enemy.y, enemy.width, enemy.height, enemy.lockTimer);
                break;
            case 'hacker':
                if (enemy.visible) {
                    drawHacker(enemy.x, enemy.y, enemy.width, enemy.height);
                }
                break;
        }
    });
}

function drawPhishingEmail(x, y, width, height) {
    // Envelope
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x, y + height);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Envelope flap
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + width / 2, y + height / 2);
    ctx.lineTo(x + width, y);
    ctx.stroke();

    // Fishing hook
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + width / 2, y);
    ctx.lineTo(x + width / 2, y + height / 2);
    ctx.arc(x + width / 2 + height / 8, y + height / 2, height / 8, Math.PI, 0, true);
    ctx.stroke();
}

function drawVirus(x, y, width, height) {
    ctx.fillStyle = '#00FF00';
    ctx.beginPath();
    ctx.arc(x + width / 2, y + height / 2, width / 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw spikes
    ctx.strokeStyle = '#00CC00';
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const spikeLength = width / 2;
        ctx.beginPath();
        ctx.moveTo(x + width / 2, y + height / 2);
        ctx.lineTo(
            x + width / 2 + Math.cos(angle) * spikeLength,
            y + height / 2 + Math.sin(angle) * spikeLength
        );
        ctx.stroke();
    }
}

function drawSpyware(x, y, width, height, blinkTimer) {
    // Main body (camera)
    ctx.fillStyle = '#808080'; // Grey color
    ctx.beginPath();
    ctx.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Lens
    ctx.fillStyle = '#C0C0C0'; // Light grey
    ctx.beginPath();
    ctx.arc(x + width / 2, y + height / 2, width / 4, 0, Math.PI * 2);
    ctx.fill();

    // Blinking light
    const blinkState = Math.sin(blinkTimer / 200) > 0;
    ctx.fillStyle = blinkState ? '#FF0000' : '#800000'; // Red when on, dark red when off
    ctx.beginPath();
    ctx.arc(x + width * 0.8, y + height * 0.2, width / 10, 0, Math.PI * 2);
    ctx.fill();

    // Legs
    ctx.strokeStyle = '#808080';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y + height);
    ctx.lineTo(x + width / 4, y + height * 1.2);
    ctx.moveTo(x + width, y + height);
    ctx.lineTo(x + width * 3/4, y + height * 1.2);
    ctx.stroke();

    // Scanning beam (only show occasionally)
    if (Math.random() < 0.05) {
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)'; // Semi-transparent green
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + width / 2, y + height / 2);
        ctx.lineTo(x + width / 2, y + height * 2);
        ctx.stroke();
    }
}

function drawMalware(x, y, width, height, glitchTimer) {
    // Main body
    ctx.fillStyle = '#330000'; // Dark red
    ctx.fillRect(x, y, width, height);

    // Glitch effect
    const glitchState = Math.sin(glitchTimer / 50) > 0;
    if (glitchState) {
        ctx.fillStyle = '#FF3300'; // Bright orange
        const glitchX = x + Math.random() * width * 0.8;
        const glitchY = y + Math.random() * height * 0.8;
        ctx.fillRect(glitchX, glitchY, width * 0.2, height * 0.2);
    }

    // Binary code effect
    ctx.fillStyle = '#FF0000'; // Red
    ctx.font = '10px Courier';
    for (let i = 0; i < 4; i++) {
        const digit = Math.random() > 0.5 ? '1' : '0';
        ctx.fillText(digit, x + i * 10, y + height / 2);
    }
}

function drawRansomware(x, y, width, height, lockTimer) {
    // Main body (padlock)
    ctx.fillStyle = '#A9A9A9'; // Dark gray
    ctx.fillRect(x, y, width, height * 0.7);
    
    // Shackle
    ctx.beginPath();
    ctx.arc(x + width / 2, y, width / 2, Math.PI, 0);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#A9A9A9';
    ctx.stroke();

    // Lock mechanism
    ctx.fillStyle = '#FFD700'; // Gold color
    ctx.fillRect(x + width * 0.3, y + height * 0.3, width * 0.4, height * 0.4);

    // Keyhole
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(x + width / 2, y + height * 0.5, width * 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Flashing ransom message
    if (Math.sin(lockTimer / 200) > 0) {
        ctx.fillStyle = '#FF0000';
        ctx.font = '10px Arial';
        ctx.fillText('LOCKED', x, y + height + 10);
    }

    // Chains
    ctx.strokeStyle = '#C0C0C0';
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(x - 5, y + i * 10);
        ctx.lineTo(x + width + 5, y + i * 10);
        ctx.stroke();
    }
}

function drawHacker(x, y, width, height) {
    // Silhouette
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.moveTo(x + width / 2, y); // Hood point
    ctx.lineTo(x, y + height); // Bottom left
    ctx.lineTo(x + width, y + height); // Bottom right
    ctx.closePath();
    ctx.fill();

    // Hoodie
    ctx.fillStyle = '#0d0d0d';
    ctx.beginPath();
    ctx.moveTo(x + width / 2, y);
    ctx.lineTo(x + width / 4, y + height / 3);
    ctx.lineTo(x + width * 3/4, y + height / 3);
    ctx.closePath();
    ctx.fill();

    // Glowing eyes
    const eyeColor = hackerHealth > 15 ? '#00ffff' : '#ff0000';
    ctx.fillStyle = eyeColor;
    ctx.beginPath();
    ctx.arc(x + width / 3, y + height / 3, 10, 0, Math.PI * 2);
    ctx.arc(x + width * 2/3, y + height / 3, 10, 0, Math.PI * 2);
    ctx.fill();

    // Hacking gesture (randomly appearing binary)
    if (Math.random() < 0.1) {
        ctx.fillStyle = '#33ff33';
        ctx.font = '20px Courier';
        for (let i = 0; i < 5; i++) {
            const digit = Math.random() > 0.5 ? '1' : '0';
            ctx.fillText(digit, x + Math.random() * width, y + Math.random() * height);
        }
    }

    // Health bar
    const healthPercentage = hackerHealth / 30;
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(x, y - 20, width, 10);
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(x, y - 20, width * healthPercentage, 10);
}

function updateEnemies() {
    if (currentLevel === 6 && enemies.length > 0) {
        const hacker = enemies[0];
        
        // Move horizontally
        hacker.x += enemySpeed * enemyDirection;
        if (hacker.x <= 0 || hacker.x + hacker.width >= canvas.width) {
            enemyDirection *= -1;
        }

        // Spawn random enemies
        hacker.spawnTimer += 16;
        if (hacker.spawnTimer > hackerSpawnInterval && enemies.length < maxSpawnedEnemies + 1) {
            spawnRandomEnemy();
            hacker.spawnTimer = 0;
        }

        // Teleport
        hacker.teleportTimer += 16;
        if (hacker.teleportTimer > 5000) { // Teleport every 5 seconds
            hacker.visible = false;
            setTimeout(() => {
                hacker.x = Math.random() * (canvas.width - hacker.width);
                hacker.visible = true;
            }, 500);
            hacker.teleportTimer = 0;
        }
        // Move spawned enemies down
        for (let i = 1; i < enemies.length; i++) {
            enemies[i].y += descendingEnemySpeed;
            if (enemies[i].y > canvas.height) {
                enemies.splice(i, 1);
                i--;
            }
        }

    } else {
        let shouldChangeDirection = false;
        let frontRowMalware = enemies.filter(e => e.type === 'malware' && e.y === enemies[0].y);
        let activeMalwareCount = 0;
        const maxActiveMalware = 2; // Maximum number of malware enemies that can fire at once
        
        enemies.forEach((enemy, index) => {
            enemy.x += enemySpeed * enemyDirection;
            
            if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
                shouldChangeDirection = true;
            }

            // Update timers
            if (enemy.type === 'spyware') {
                enemy.blinkTimer += 16;
                if (enemy.blinkTimer > 2000) enemy.blinkTimer = 0;
            } else if (enemy.type === 'malware' && frontRowMalware.includes(enemy)) {
                enemy.glitchTimer += 16;
                if (enemy.glitchTimer > 1000) enemy.glitchTimer = 0;

             
                if (activeMalwareCount < maxActiveMalware) {
                    enemy.binaryTimer += 16;
                    if (enemy.binaryTimer > 8000) { 
                        if (Math.random() < 0.2) { 
                            shootBinary(enemy);
                            activeMalwareCount++;
                        }
                        enemy.binaryTimer = 0;
                    }
                }
            } else if (enemy.type === 'ransomware') {
                enemy.lockTimer += 16;
                if (enemy.lockTimer > 1000) enemy.lockTimer = 0;

 
                if (enemy.y === enemies[0].y) {
                    enemy.shootTimer += 16;
                    if (
enemy.shootTimer > 5000) { 
    if (Math.random() < 0.2) { 
        shootPadlock(enemy);
    }
    enemy.shootTimer = 0;
}
}
}
});

if (shouldChangeDirection) {
enemyDirection *= -1;
enemies.forEach(enemy => {
enemy.y += enemyDropDistance;
});
}
}
}

function shootBinary(enemy) {
    const binaryBullet = {
        x: enemy.x + enemy.width / 2,
        y: enemy.y + enemy.height,
        width: 10,
        height: 10,
        speed: 1.5,
        type: 'binary',
        value: Math.random() > 0.5 ? '1' : '0'
    };
    enemyBullets.push(binaryBullet);
}


function shootPadlock(enemy) {
    const padlockBullet = {
        x: enemy.x + enemy.width / 2,
        y: enemy.y + enemy.height,
        width: 15,
        height: 20,
        speed: 2,
        type: 'padlock'  // Add this line to identify padlock bullets
    };
    enemyBullets.push(padlockBullet);
}

function spawnRandomEnemy() {
const types = ['phishing', 'virus', 'spyware', 'malware', 'ransomware'];
const randomType = types[Math.floor(Math.random() * types.length)];
enemies.push({
x: Math.random() * (canvas.width - 40),
y: 50,
width: 40,
height: 30,
type: randomType,
blinkTimer: Math.random() * 2000,
glitchTimer: Math.random() * 1000,
binaryTimer: 0,
lockTimer: Math.random() * 1000,
shootTimer: 0
});
}

function resetEnemies() {
createEnemies();
enemyDirection = 1;
enemySpeed = levelConfig[currentLevel].enemySpeed;
enemyDropDistance = levelConfig[currentLevel].enemyDropDistance;
enemyBullets.length = 0; // Clear enemy bullets when resetting
}

function drawEnemyBullets() {
    enemyBullets.forEach(bullet => {
        if (bullet.type === 'padlock') {
            // Draw padlock bullets
            ctx.fillStyle = '#A9A9A9'; // Dark gray for padlocks
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height * 0.7);
            ctx.beginPath();
            ctx.arc(bullet.x + bullet.width / 2, bullet.y, bullet.width / 2, Math.PI, 0);
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#A9A9A9';
            ctx.stroke();
        } else {
            // Draw binary bullets
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '12px Courier';
            ctx.fillText(bullet.value, bullet.x, bullet.y);
        }
    });
}

// Make functions and variables globally accessible
window.enemies = enemies;
window.enemyBullets = enemyBullets;
window.createEnemies = createEnemies;
window.drawEnemies = drawEnemies;
window.updateEnemies = updateEnemies;
window.resetEnemies = resetEnemies;
window.drawEnemyBullets = drawEnemyBullets;
window.hackerHealth = hackerHealth;
window.spawnRandomEnemy = spawnRandomEnemy;
