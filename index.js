let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

let birdWidth = 40;
let birdHeight = 40;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight,
    velocityY: 0,
    gravity: 0.5,
    jumpStrength: -10
};

let obstacles = [];
let obstacleWidth = 60;

let minObstacleGap = 200;
let maxObstacleGap = 200;

let birdImg;
let topPipeImg;
let bottomPipeImg;
let backgroundImg;

// הוספת משתנה ניקוד
let score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    birdImg = new Image();
    birdImg.src = "superman (2).png";

    topPipeImg = new Image();
    topPipeImg.src = "toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "bottompipe.png";

    backgroundImg = new Image();
    backgroundImg.src = "flappybirdbg.png";

    let imagesLoaded = 0;
    let totalImages = 4;

    function imageLoaded() {
        imagesLoaded++;
        if (imagesLoaded === totalImages) {
            update();
        }
    }

    birdImg.onload = imageLoaded;
    topPipeImg.onload = imageLoaded;
    bottomPipeImg.onload = imageLoaded;
    backgroundImg.onload = imageLoaded;

    function update() {
        context.clearRect(0, 0, board.width, board.height);
        context.drawImage(backgroundImg, 0, 0, boardWidth, boardHeight);

        // עדכון וציור הניקוד
        context.fillStyle = "white";
        context.font = "20px Arial";
        context.fillText("Score: " + score, 10, 30);

        for (let i = 0; i < obstacles.length; i++) {
            let obs = obstacles[i];
            obs.x -= 2;

            if (obs.x + obstacleWidth < 0) {
                obstacles.splice(i, 1);
                i--;
                score++; // עדכון הניקוד כאשר עברת מכשול
                continue;
            }

            context.drawImage(topPipeImg, obs.x, 0, obstacleWidth, obs.topHeight);
            context.drawImage(bottomPipeImg, obs.x, obs.bottomY, obstacleWidth, boardHeight - obs.bottomY);

            // חישוב גבולות הציפור
            let birdRight = bird.x + bird.width - 5; // הוספת מרווח קטן
            let birdLeft = bird.x + 5; // הוספת מרווח קטן
            let birdBottom = bird.y + bird.height - 5; // הוספת מרווח קטן
            let birdTop = bird.y + 5; // הוספת מרווח קטן

            // חישוב גבולות המכשול
            let pipeLeft = obs.x;
            let pipeRight = obs.x + obstacleWidth;
            let topPipeBottom = obs.topHeight;
            let bottomPipeTop = obs.bottomY;

            // בדיקת התנגשות עם המכשולים
            if (birdRight > pipeLeft && birdLeft < pipeRight &&
                (birdTop < topPipeBottom || birdBottom > bottomPipeTop)) {
                console.log("התנגשות עם מכשול", bird, obs);
                alert("הפסדת!");
                resetGame(); // הפעל את הפונקציה לאתחול מחדש
                return; // עצור את המשחק
            }
        }

        bird.velocityY += bird.gravity;
        bird.y += bird.velocityY;

        if (bird.y + bird.height > boardHeight) {
            bird.y = boardHeight - bird.height;
            bird.velocityY = 0;
            console.log("התנגשות עם הרצפה", bird);
            alert("הפסדת!");
            resetGame(); // הפעל את הפונקציה לאתחול מחדש
            return; // עצור את המשחק
        }

        if (bird.y < 0) {
            bird.y = 0;
            bird.velocityY = 0;
            console.log("התנגשות עם התקרה", bird);
        }

        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

        requestAnimationFrame(update);
    }

    function generateObstacle() {
        let gap = Math.floor(Math.random() * (maxObstacleGap - minObstacleGap + 1)) + minObstacleGap;
        let topHeight = Math.floor(Math.random() * (boardHeight - gap - obstacleWidth));
        let bottomY = topHeight + gap;

        obstacles.push({
            x: boardWidth,
            topHeight: topHeight,
            bottomY: bottomY
        });
    }

    let obstacleInterval = setInterval(generateObstacle, 2000);

    document.addEventListener('mousedown', handleJump);
    document.addEventListener('touchstart', handleJump);

    function handleJump() {
        bird.velocityY = bird.jumpStrength;
    }

    function resetGame() {
        // איפוס מיקום הציפור
        bird.x = birdX;
        bird.y = birdY;
        bird.velocityY = 0;

        // ניקוי המכשולים
        obstacles = [];

        // אפס את הניקוד
        score = 0;

        // התחלת הגנרטור של מכשולים מחדש
        clearInterval(obstacleInterval);
        obstacleInterval = setInterval(generateObstacle, 2000);
    }
};
