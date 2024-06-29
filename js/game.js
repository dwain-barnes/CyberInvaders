// game.js
let canvas, ctx, scoreElement, gameMessageElement, messageTextElement, finalScoreElement, startScreen, startButton;
let score = 0;
let gameIsOver = false;
let currentLevel = 1;
const bullets = [];
let preLevelScreen, continueButton, endButton, questionElement, answerButtons;
let currentQuestion, correctAnswer;
let gamePaused = false;


function initializeGame() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    scoreElement = document.getElementById('scoreValue');
    gameMessageElement = document.getElementById('gameMessage');
    messageTextElement = document.getElementById('messageText');
    finalScoreElement = document.getElementById('finalScore');
    startScreen = document.getElementById('startScreen');
    startButton = document.getElementById('startButton');
    gameInfo = document.getElementById('gameInfo');

    canvas.width = 800;
    canvas.height = 600;

    initializePlayer();
    createEnemies();
    
    startButton.addEventListener('click', startGame);

    document.addEventListener('keydown', (e) => {
        if (!gameIsOver) {
            if (e.key === 'ArrowLeft') {
                movePlayer('left');
            } else if (e.key === 'ArrowRight') {
                movePlayer('right');
            } else if (e.key === ' ') {
                shoot();
            } else if (e.key === 'p' || e.key === 'P') {
                togglePause(); // Allow pausing/unpausing with 'P' key
            }
        } else if (e.key === ' ') {
            resetGame();
            gameLoop();
        }
        
        // Add this for exiting the pre-level screen
        if (e.key === 'Escape' && preLevelScreen && preLevelScreen.parentNode) {
            returnToMainMenu();
        }
    });



    // Initialize pre-level screen elements
    preLevelScreen = document.createElement('div');
    preLevelScreen.id = 'preLevelScreen';
    continueButton = document.createElement('button');
    endButton = document.createElement('button');
    questionElement = document.createElement('p');
    answerButtons = document.createElement('div');

    // Set up the how to play button
    const howToPlayButton = document.getElementById('howToPlayButton');
    const howToPlaySection = document.getElementById('howToPlay');

    howToPlayButton.addEventListener('click', () => {
        if (howToPlaySection.style.display === 'none' || howToPlaySection.style.display === '') {
            howToPlaySection.style.display = 'block';
            howToPlayButton.textContent = 'Hide Instructions';
        } else {
            howToPlaySection.style.display = 'none';
            howToPlayButton.textContent = 'How to Play';
        }
    });

    // Spawn power-ups periodically
    setInterval(spawnPowerUp, 10000); // Spawn a power-up every 10 seconds

    // Initialize the first level
    currentLevel = 1;
    loadLevel(currentLevel);

    // Show the start screen initially
    showStartScreen();
}

function gameLoop() {
    if (!gameIsOver  && !gamePaused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        updatePlayer();
        updateBullets();
        updateEnemies();
        updateEnemyBullets();
        updatePowerUps();
        checkCollisions();
        
        drawPlayer();
        drawBullets();
        drawEnemies();
        drawEnemyBullets();
        drawPowerUps();
        
        requestAnimationFrame(gameLoop);
    }
}


function showPreLevelScreen() {
    gamePaused = true; // Ensure the game is paused
    
    // Get the dimensions and position of the canvas
    const canvasRect = canvas.getBoundingClientRect();
    
    preLevelScreen.style.position = 'absolute';
    preLevelScreen.style.top = `${canvasRect.top}px`;
    preLevelScreen.style.left = `${canvasRect.left}px`;
    preLevelScreen.style.width = `${canvasRect.width}px`;
    preLevelScreen.style.height = `${canvasRect.height}px`;
    preLevelScreen.style.backgroundColor = 'rgba(0, 0, 51, 0.9)';
    preLevelScreen.style.color = '#00FFFF';
    preLevelScreen.style.padding = '20px';
    preLevelScreen.style.boxSizing = 'border-box';
    preLevelScreen.style.overflow = 'auto';
    preLevelScreen.style.display = 'flex';
    preLevelScreen.style.flexDirection = 'column';
    preLevelScreen.style.justifyContent = 'space-between';

    const levelInfo = getLevelInfo(currentLevel);

    preLevelScreen.innerHTML = `
        <div>
            <h2>Level ${currentLevel}: ${levelInfo.title}</h2>
            <p>${levelInfo.description}</p>
            <h3>Enemies in this level:</h3>
            <ul>
                ${levelInfo.enemies.map(enemy => `<li>${enemy.name}: ${enemy.description}</li>`).join('')}
            </ul>
        </div>
        <div id="questionSection">
            <h3>Bonus Question:</h3>
            <p id="question">${levelInfo.question}</p>
            <div id="answerButtons"></div>
        </div>
        <div id="navigationButtons"></div>
    `;

    const answerButtonsContainer = preLevelScreen.querySelector('#answerButtons');
    levelInfo.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.textContent = answer;
        button.addEventListener('click', () => checkAnswer(index));
        answerButtonsContainer.appendChild(button);
    });

    const navigationButtons = preLevelScreen.querySelector('#navigationButtons');
    
    continueButton.textContent = 'Continue';
    continueButton.style.marginRight = '10px';
    continueButton.addEventListener('click', startLevel);

    endButton.textContent = 'End';
    endButton.addEventListener('click', returnToMainMenu);

    navigationButtons.appendChild(continueButton);
    navigationButtons.appendChild(endButton);

    document.body.appendChild(preLevelScreen);

    // Adjust font sizes based on canvas size
    adjustFontSizes();
}

// Add this function to adjust font sizes based on canvas size
function adjustFontSizes() {
    const canvasWidth = canvas.width;
    const scaleFactor = canvasWidth / 800; // Assuming 800 is the base width

    preLevelScreen.style.fontSize = `${14 * scaleFactor}px`;
    preLevelScreen.querySelector('h2').style.fontSize = `${24 * scaleFactor}px`;
    preLevelScreen.querySelectorAll('h3').forEach(h3 => h3.style.fontSize = `${18 * scaleFactor}px`);
    preLevelScreen.querySelectorAll('button').forEach(button => button.style.fontSize = `${16 * scaleFactor}px`);
}

// Update the CSS for the pre-level screen elements
const style = document.createElement('style');
style.textContent = `
    #preLevelScreen {
        font-family: Arial, sans-serif;
    }
    #preLevelScreen h2 {
        margin-bottom: 10px;
        color: #FFFF00;
    }
    #preLevelScreen h3 {
        margin-top: 15px;
        margin-bottom: 10px;
        color: #FFFF00;
    }
    #preLevelScreen p, #preLevelScreen li {
        margin-bottom: 5px;
    }
    #preLevelScreen ul {
        padding-left: 20px;
    }
    #questionSection {
        background-color: rgba(0, 255, 255, 0.1);
        padding: 15px;
        border-radius: 5px;
        margin-top: 15px;
    }
    #answerButtons {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 10px;
    }
    #answerButtons button, #navigationButtons button {
        background-color: #00FFFF;
        color: #000033;
        border: none;
        padding: 10px;
        cursor: pointer;
        border-radius: 5px;
        transition: all 0.3s ease;
    }
    #answerButtons button:hover, #navigationButtons button:hover {
        background-color: #000033;
        color: #00FFFF;
        box-shadow: 0 0 10px #00FFFF;
    }
    #answerButtons button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    #navigationButtons {
        display: flex;
        justify-content: center;
        margin-top: 15px;
    }
`;
document.head.appendChild(style);


function getLevelInfo(level) {
    const levelInfo = {
        1: {
            title: "Phishing Emails",
            description: "Phishing emails are fraudulent messages designed to trick recipients into revealing sensitive information or clicking on malicious links.",
            enemies: [
                { name: "Phishing Email", description: "A deceptive email mimicking a legitimate source." }
            ],
            question: "What's the best way to verify a suspicious email?",
            answers: [
                "Click on all links to check them",
                "Contact the sender directly using a known, verified method",
                "Reply to the email asking if it's legitimate",
                "Ignore it and hope for the best"
            ],
            correctAnswer: 1
        },
        2: {
            title: "Computer Viruses",
            description: "Computer viruses are malicious programs that can replicate and spread to other computers, potentially causing damage or stealing information.",
            enemies: [
                { name: "Virus", description: "A self-replicating malicious program." }
            ],
            question: "What's an effective way to protect against computer viruses?",
            answers: [
                "Never use the internet",
                "Install and regularly update antivirus software",
                "Only use your computer on weekends",
                "Delete all your files regularly"
            ],
            correctAnswer: 1
        },
        3: {
            title: "Spyware",
            description: "Spyware is software that secretly monitors and collects personal information from your computer without your consent.",
            enemies: [
                { name: "Spyware", description: "Malicious software that covertly gathers user information." }
            ],
            question: "Which of these is a common sign of spyware infection?",
            answers: [
                "Your computer runs faster than usual",
                "You start receiving fewer emails",
                "Unexpected pop-ups appear frequently",
                "Your internet connection improves"
            ],
            correctAnswer: 2
        },
        4: {
            title: "Malware",
            description: "Malware, short for malicious software, is any program or file that is intentionally designed to cause damage to a computer, server, or network.",
            enemies: [
                { name: "Malware", description: "Software designed to disrupt, damage, or gain unauthorized access to a computer system." }
            ],
            question: "Which practice helps prevent malware infections?",
            answers: [
                "Opening all email attachments to check them",
                "Disabling your firewall",
                "Never updating your operating system",
                "Only downloading software from trusted sources"
            ],
            correctAnswer: 3
        },
        5: {
            title: "Ransomware",
            description: "Ransomware is a type of malicious software designed to block access to a computer system until a sum of money is paid.",
            enemies: [
                { name: "Ransomware", description: "Malware that encrypts files and demands payment for decryption." }
            ],
            question: "What's a crucial step in protecting against ransomware?",
            answers: [
                "Keeping all your files on one device",
                "Regularly backing up your data",
                "Paying the ransom immediately if infected",
                "Sharing your encryption keys online"
            ],
            correctAnswer: 1
        },
        6: {
            title: "Master Hacker",
            description: "The Master Hacker represents the culmination of all cyber threats, combining various attack methods and requiring all your cybersecurity knowledge to defeat.",
            enemies: [
                { name: "Master Hacker", description: "A formidable opponent using advanced hacking techniques." }
            ],
            question: "Which of these is NOT a good cybersecurity practice?",
            answers: [
                "Using strong, unique passwords",
                "Keeping software updated",
                "Sharing passwords with others",
                "Using two-factor authentication"
            ],
            correctAnswer: 2
        }
    };

    return levelInfo[level];
}

function displayQuestion() {
    const levelInfo = getLevelInfo(currentLevel);
    currentQuestion = levelInfo.question;
    correctAnswer = levelInfo.correctAnswer;

    questionElement.textContent = currentQuestion;
    answerButtons.innerHTML = '';

    levelInfo.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.textContent = answer;
        button.addEventListener('click', () => checkAnswer(index));
        answerButtons.appendChild(button);
    });
}


function checkAnswer(selectedIndex) {
    const levelInfo = getLevelInfo(currentLevel);
    if (selectedIndex === levelInfo.correctAnswer) {
        score += 50;
        updateScore(50);
        alert('Correct! You earned bonus points.');
    } else {
        alert('Incorrect. The correct answer will help you stay safe online!');
    }

    // Disable answer buttons after selection
    const answerButtons = document.querySelectorAll('#answerButtons button');
    answerButtons.forEach(button => button.disabled = true);
}

function startLevel() {
    document.body.removeChild(preLevelScreen);
    gamePaused = false; // Unpause the game
    gameLoop(); // Restart the game loop
}

function returnToMainMenu() {
    document.body.removeChild(preLevelScreen);
    gamePaused = false;
    showStartScreen();
}



function updateScore(points) {
    score += points;
    const scoreElement = document.getElementById('scoreValue');
    scoreElement.textContent = score;
    scoreElement.classList.add('animate');
    setTimeout(() => scoreElement.classList.remove('animate'), 500);
}

function startGame() {
    startScreen.style.display = 'none';
    canvas.style.display = 'block';
    gameInfo.style.display = 'block';
    resetGame();
    showPreLevelScreen(); // Show the pre-level screen immediately
}

function togglePause() {
    gamePaused = !gamePaused;
    if (!gamePaused) {
        gameLoop(); // Restart the game loop if unpausing
    }
}


function resetGame() {
    gameIsOver = false;
    gameMessageElement.style.display = 'none';
    score = 0;
    scoreElement.textContent = score;
    currentLevel = 1;
    loadLevel(currentLevel);
  
    resetPlayer();
    updateLivesDisplay();
    resetEnemies();
    resetPowerUps();
    bullets.length = 0;
    enemyBullets.length = 0;
}

function endGame(message) {
    gameIsOver = true;
    gamePaused = true;

    // Get the dimensions and position of the canvas
    const canvasRect = canvas.getBoundingClientRect();

    // Create a new div for the end game message
    const endGameMessage = document.createElement('div');
    endGameMessage.id = 'endGameMessage';
    endGameMessage.style.position = 'absolute';
    endGameMessage.style.top = `${canvasRect.top}px`;
    endGameMessage.style.left = `${canvasRect.left}px`;
    endGameMessage.style.width = `${canvasRect.width}px`;
    endGameMessage.style.height = `${canvasRect.height}px`;
    endGameMessage.style.backgroundColor = 'rgba(0, 0, 51, 0.9)';
    endGameMessage.style.color = '#00FFFF';
    endGameMessage.style.padding = '20px';
    endGameMessage.style.boxSizing = 'border-box';
    endGameMessage.style.display = 'flex';
    endGameMessage.style.flexDirection = 'column';
    endGameMessage.style.justifyContent = 'center';
    endGameMessage.style.alignItems = 'center';
    endGameMessage.style.textAlign = 'center';

    endGameMessage.innerHTML = `
        <h2>${message}</h2>
        <p>Final Score: ${score}</p>
        <button id="restartButton">Play Again</button>
    `;

    document.body.appendChild(endGameMessage);

    // Add event listener to the restart button
    const restartButton = document.getElementById('restartButton');
    restartButton.addEventListener('click', () => {
        document.body.removeChild(endGameMessage);
        showStartScreen();
    });

    // Adjust font sizes based on canvas size
    adjustEndGameFontSizes();
}

// Add this function to adjust font sizes for the end game message
function adjustEndGameFontSizes() {
    const canvasWidth = canvas.width;
    const scaleFactor = canvasWidth / 800; // Assuming 800 is the base width

    const endGameMessage = document.getElementById('endGameMessage');
    endGameMessage.style.fontSize = `${16 * scaleFactor}px`;
    endGameMessage.querySelector('h2').style.fontSize = `${28 * scaleFactor}px`;
    endGameMessage.querySelector('p').style.fontSize = `${20 * scaleFactor}px`;
    endGameMessage.querySelector('button').style.fontSize = `${18 * scaleFactor}px`;
}

function nextLevel() {
    currentLevel++;
    if (currentLevel > MAX_LEVEL) {
        endGame('Congratulations! You\'ve completed all levels and saved the digital world!');
    } else {
        gamePaused = true;
        loadLevel(currentLevel);
        resetEnemies();
        resetPlayer();
        resetPowerUps();
        bullets.length = 0;
        enemyBullets.length = 0;
        showPreLevelScreen();
    }
}


// Add this function to show the start screen
function showStartScreen() {
    gameIsOver = false;
    startScreen.style.display = 'block';
    canvas.style.display = 'none';
    gameInfo.style.display = 'none';
    currentLevel = 1;
    score = 0;
    updateScore(0);
}



function showLevelMessage(message) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);
    
    setTimeout(() => {
        gameLoop();
    }, 2000);
}

function checkCollisions() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        for (let j = bullets.length - 1; j >= 0; j--) {
            if (
                bullets[j].x < enemies[i].x + enemies[i].width &&
                bullets[j].x + bullets[j].size > enemies[i].x &&
                bullets[j].y < enemies[i].y + enemies[i].height &&
                bullets[j].y + bullets[j].size > enemies[i].y
            ) {
                if (enemies[i].type === 'hacker') {
                    hackerHealth--;
                    if (hackerHealth <= 0) {
                        enemies.splice(i, 1);
                        endGame('Congratulations! You\'ve defeated the Master Hacker and saved the digital world!');
                        return; // Exit the function to prevent further processing
                    }
                } else {
                    enemies.splice(i, 1);
                }
                bullets.splice(j, 1);
                score += 10;
                scoreElement.textContent = score;
                break;
            }
        }
    }

    // Check if all enemies are defeated
    if (enemies.length === 0) {
        if (currentLevel < MAX_LEVEL) {
            nextLevel();
        } else {
            endGame('Congratulations! You\'ve completed all levels and saved the digital world!');
        }
    }
    // Check player collision with enemy bullets
    enemyBullets.forEach((bullet, index) => {
        if (
            bullet.x < player.x + player.width &&
            bullet.x + bullet.width > player.x &&
            bullet.y < player.y + player.height &&
            bullet.y + bullet.height > player.y
        ) {
            enemyBullets.splice(index, 1);
            playerHit();
        }
    });

    if (enemies.length === 0 && currentLevel < MAX_LEVEL) {
        nextLevel();
    }

    if (enemies.some(enemy => enemy.y + enemy.height >= player.y)) {
        playerHit();
    }
}

function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= bullets[i].speed;
        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
        }
    }
}

function updateEnemyBullets() {
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        enemyBullets[i].y += enemyBullets[i].speed;
        if (enemyBullets[i].y > canvas.height) {
            enemyBullets.splice(i, 1);
        }
    }
}

function drawBullets() {
    ctx.fillStyle = '#FFFFFF';
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x - bullet.size / 2, bullet.y, bullet.size, 15);
    });
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
window.addEventListener('load', initializeGame);