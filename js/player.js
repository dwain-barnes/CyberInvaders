// player.js
let player;
let isPoweredUp = false;
let powerUpTime = 0;
const POWER_UP_DURATION = 5000;

let shieldPulse = 0;
let antennaGlow = 0;

function initializePlayer() {
    player = {
        x: canvas.width / 2,
        y: canvas.height - 50,
        width: 50,
        height: 50,
        speed: 10,
        lives: 3  // Initial lives
    };
}

function drawPlayer() {
    const centerX = player.x;
    const centerY = player.y;
    const width = player.width;
    const height = player.height;

    // Body
    ctx.fillStyle = '#00FFFF';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - height / 2);
    ctx.lineTo(centerX - width / 2, centerY + height / 2);
    ctx.lineTo(centerX + width / 2, centerY + height / 2);
    ctx.closePath();
    ctx.fill();

    // Visor
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX - width / 4, centerY - height / 6);
    ctx.quadraticCurveTo(centerX, centerY - height / 3, centerX + width / 4, centerY - height / 6);
    ctx.stroke();

    // Utility Belt
    ctx.fillStyle = '#FFCC00';
    ctx.fillRect(centerX - width / 3, centerY + height / 4, width * 2/3, height / 10);

    // Glowing Lines
    ctx.strokeStyle = '#00FFFF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX - width / 3, centerY);
    ctx.lineTo(centerX + width / 3, centerY);
    ctx.moveTo(centerX - width / 4, centerY + height / 8);
    ctx.lineTo(centerX + width / 4, centerY + height / 8);
    ctx.stroke();

    // Animated shield
    ctx.fillStyle = `rgba(0, 255, 255, ${0.2 + Math.sin(shieldPulse) * 0.1})`;
    ctx.beginPath();
    ctx.arc(centerX, centerY, width / 2, 0, Math.PI * 2);
    ctx.fill();

    // Animated antenna
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - height / 2);
    ctx.lineTo(centerX, centerY - height * 3/4);
    ctx.stroke();
    
    ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + Math.sin(antennaGlow) * 0.5})`;
    ctx.beginPath();
    ctx.arc(centerX, centerY - height * 3/4, width / 16, 0, Math.PI * 2);
    ctx.fill();

    if (isPoweredUp) {
        // Power-up aura
        ctx.fillStyle = `rgba(255, 255, 0, ${0.3 + Math.sin(shieldPulse) * 0.2})`;
        ctx.beginPath();
        ctx.arc(centerX, centerY, width * 0.75, 0, Math.PI * 2);
        ctx.fill();
    }


}

function movePlayer(direction) {
    if (direction === 'left' && player.x > player.width / 2) {
        player.x -= player.speed;
    } else if (direction === 'right' && player.x < canvas.width - player.width / 2) {
        player.x += player.speed;
    }
}

function shoot() {
    const bulletSpeed = 7;
    const bulletColor = isPoweredUp ? '#FFFF00' : '#FFFFFF';
    const bulletSize = isPoweredUp ? 5 : 3;
    
    if (isPoweredUp) {
        bullets.push(
            { x: player.x - 10, y: player.y, speed: bulletSpeed * 1.5, color: bulletColor, size: bulletSize },
            { x: player.x, y: player.y, speed: bulletSpeed * 1.5, color: bulletColor, size: bulletSize },
            { x: player.x + 10, y: player.y, speed: bulletSpeed * 1.5, color: bulletColor, size: bulletSize }
        );
    } else {
        bullets.push({ x: player.x, y: player.y, speed: bulletSpeed, color: bulletColor, size: bulletSize });
    }
}

function resetPlayer() {
    initializePlayer();
    isPoweredUp = false;
}

function updatePlayer() {
    shieldPulse += 0.05;
    antennaGlow += 0.1;

    if (isPoweredUp && Date.now() - powerUpTime > POWER_UP_DURATION) {
        isPoweredUp = false;
    }
}


function updateLivesDisplay() {
    const livesElement = document.getElementById('livesValue');
    livesElement.textContent = player.lives;
    livesElement.classList.add('animate');
    setTimeout(() => livesElement.classList.remove('animate'), 500);
}

function playerHit() {
    player.lives--;
    updateLivesDisplay();
    if (player.lives <= 0) {
        endGame('Game Over - Out of lives!');
    } else {
        // Optional: Add invincibility period or reset player position
        player.x = canvas.width / 2;
        player.y = canvas.height - 50;
    }
}

// Make functions and variables accessible globally
window.player = player;
window.initializePlayer = initializePlayer;
window.drawPlayer = drawPlayer;
window.movePlayer = movePlayer;
window.shoot = shoot;
window.resetPlayer = resetPlayer;
window.updatePlayer = updatePlayer;
window.playerHit = playerHit;
window.updateLivesDisplay = updateLivesDisplay;
