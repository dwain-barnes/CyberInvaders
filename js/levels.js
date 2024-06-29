// levels.js
const MAX_LEVEL = 6;

const levelConfig = {
    1: {
        enemyType: 'phishing',
        enemySpeed: 0.15,
        enemyDropDistance: 20
    },
    2: {
        enemyType: 'virus',
        enemySpeed: 0.25,
        enemyDropDistance: 21
    },
    3: {
        enemyType: 'spyware',
        enemySpeed: 0.35,
        enemyDropDistance: 22
    },
    4: {
        enemyType: 'malware',
        enemySpeed: 0.45,
        enemyDropDistance: 23
    },
    5: {
        enemyType: 'ransomware',
        enemySpeed: 0.55,
        enemyDropDistance: 24
    },
    6: {
        enemyType: 'hacker',
        enemySpeed: 1.5,
        enemyDropDistance: 0
    }
};



function loadLevel(level) {
    const config = levelConfig[level];
    enemySpeed = config.enemySpeed;
    enemyDropDistance = config.enemyDropDistance;
    // You can add more level-specific configurations here
}

// Make the levelConfig accessible globally
window.levelConfig = levelConfig;
window.loadLevel = loadLevel;
window.MAX_LEVEL = MAX_LEVEL;