const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ---------------- Constants ----------------
const groundY = 300;
const gravity = 0.6;
const speed = 3;
const pyramidWidth = 48;
const pyramidHeight = 48;

// ---------------- Player ----------------
let pyramidX = 50;
let pyramidY = groundY - pyramidHeight;
let velocityY = 0;
let onGround = true;
let facingRight = true;
let gameOver = false; 

// Load two images
const pyramidLeft = new Image();
pyramidLeft.src = "PyramidLeft.png";
const pyramidRight = new Image();
pyramidRight.src = "PyramidRight.png";

// ---------------- Obstacles ----------------
const obstacle = {
  x: 300,
  y: groundY - 48,
  width: 48,
  height: 48
};
const obstacleImage = new Image();
obstacleImage.src = "Obstacle.png";

let lastMoveTime = Date.now(); // last time the player moved
const idleLimit = 5000; // 5000ms = 5 seconds


// ---------------- Input ----------------
const keys = {};
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

window.addEventListener("keydown", e => {
  if (e.code === "Space" && onGround) {
    velocityY = -10;
    onGround = false;
  }
});

// ---------------- Update ----------------
function update() {

  if (gameOver) return;

  // check idle time

  if (Date.now() - lastMoveTime >= idleLimit) {
    gameOver = true; 
    alert("Game Over! You were idling for 5 seconds!"); 
    return; 
  }
  // Horizontal movement
  let nextX = pyramidX;
  if (keys["ArrowRight"]) {
    nextX += speed;
    facingRight = true;
    lastMoveTime = Date.now();
  }
  if (keys["ArrowLeft"]) {
    nextX -= speed;
    facingRight = false;
    lastMoveTime = Date.now(); 
  }

  if (keys["Space"]) {
    lastMoveTime = Date.now();
  }

  // ---------------- Prevent leaving canvas horizontally ----------------
  if (pyramidX < 0) pyramidX = 0;  // left edge
  if (pyramidX + pyramidWidth > canvas.width) pyramidX = canvas.width - pyramidWidth; 

  if (pyramidY < 0) {
    pyramidY = 0;      // top edge
    velocityY = 0;     // stop upward movement
  }
  

  // Horizontal collision with obstacle
  if (
    nextX + pyramidWidth > obstacle.x &&
    nextX < obstacle.x + obstacle.width &&
    pyramidY + pyramidHeight > obstacle.y &&
    pyramidY < obstacle.y + obstacle.height
  ) {
    if (keys["ArrowRight"]) nextX = obstacle.x - pyramidWidth;
    if (keys["ArrowLeft"]) nextX = obstacle.x + obstacle.width;
  }

  if (nextX < 0) nextX = 0;
  if (nextX + pyramidWidth > canvas.width) nextX = canvas.width - pyramidWidth;

  // Vertical movement
  velocityY += gravity;
  let nextY = pyramidY + velocityY;
  onGround = false;

  // Land on top of obstacle
  if (
    velocityY > 0 &&
    pyramidX + pyramidWidth > obstacle.x &&
    pyramidX < obstacle.x + obstacle.width &&
    pyramidY + pyramidHeight <= obstacle.y &&
    nextY + pyramidHeight >= obstacle.y
  ) {
    nextY = obstacle.y - pyramidHeight;
    velocityY = 0;
    onGround = true;
  }

  // Land on ground
  if (nextY + pyramidHeight > groundY) {
    nextY = groundY - pyramidHeight;
    velocityY = 0;
    onGround = true;
  }

  pyramidY = nextY;

  pyramidX = nextX; 
}

// ---------------- Draw ----------------
function draw() {
  // Clear canvas
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw ground
  ctx.fillStyle = "brown";
  ctx.fillRect(0, groundY, canvas.width, 4);

  // Draw obstacle
  if (obstacleImage.complete) {
    ctx.drawImage(obstacleImage, obstacle.x, obstacle.y);

  }

  // Draw pyramid
  if (facingRight && pyramidRight.complete) {
    ctx.drawImage(pyramidRight, pyramidX, pyramidY, pyramidWidth, pyramidHeight);
  } else if (!facingRight && pyramidLeft.complete) {
    ctx.drawImage(pyramidLeft, pyramidX, pyramidY, pyramidWidth, pyramidHeight);
  }
}

// ---------------- Game Loop ----------------
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
