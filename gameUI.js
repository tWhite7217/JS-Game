/*
gameUI.js
Author: Tommy White
Contains the UI code for the JavaScript game, including all
    canvas references.
*/

const outlineWidth = 4;
const playerLineWidth = 2;
const sqrt2 = Math.SQRT2;

const targetColor = "rgb(34, 139, 34)";
const white = "rgb(255, 255, 255)";
const black = "rgb(0, 0, 0)";
const obstacleColor = "rgb(220, 20, 60)";
const borderColor = "rgb(221, 160, 221)";
const missedColor = "rgb(255, 222, 74)";

export var canvasWidth;
export var canvasHeight;
export var gameWidth;
export var uiElementsRadius;
var baseTargetRadius;
var maxTargetRadius;
var targetRadiusStep;
export var obstacleRadius;
var gameHeight;
var gameXoffset;
var gameYoffset;
var laneHeight;
var playerRadius;
var scoreXposition;
var scoreYposition;
var healthXposition;
var healthXdistance;
var healthYposition;
export var githubTextYposition;
var pregameFont;
var pregameLeftTextX;
var pregameLineSpacing;

export var playerXPosition;

var prevY = 2;
var prevHealth = 3;
var prevScore = 0;
var prevShowFired = false;

const innerRadiusMultiplier = 1.3;
const outerRadiusMultiplier = 1.8;

const heartImage = document.getElementById("heart");

var canvasIds = ["back", "health", "score", "circles", "player", "border"];
var canvases = {};
var ctxs = {};

canvasIds.forEach((id) => {
  canvases[id] = document.getElementById(id);
  canvases[id].width = window.innerWidth;
  canvases[id].height = window.innerHeight;
  ctxs[id] = canvases[id].getContext("2d");
});

export function getTargetRadius(size) {
  return baseTargetRadius + size * targetRadiusStep;
}

/*
Draws the screen that shows when the game is initially loaded.
*/
export function drawPregame() {
  // Lines that show the different touchscreen areas
  ctxs["back"].clearRect(0, 0, canvasWidth, canvasHeight);
  ctxs["back"].beginPath();
  ctxs["back"].strokeStyle = white;
  ctxs["back"].moveTo(Math.round(canvasWidth / 2), 0);
  ctxs["back"].lineTo(Math.round(canvasWidth / 2), canvasHeight);
  ctxs["back"].moveTo(0, Math.round(canvasHeight / 2));
  ctxs["back"].lineTo(
    Math.round(canvasWidth / 2),
    Math.round(canvasHeight / 2)
  );
  ctxs["back"].stroke();
  ctxs["back"].closePath();

  // Setting up text settings
  ctxs["back"].font = `${pregameFont}px courier`;
  ctxs["back"].fillStyle = white;

  // Explains controls to move reticle up
  ctxs["back"].fillText(
    "Tap this section or",
    pregameLeftTextX,
    canvasHeight / 4 - pregameLineSpacing
  );
  ctxs["back"].fillText(
    "press the Up arrow",
    pregameLeftTextX,
    canvasHeight / 4
  );
  ctxs["back"].fillText(
    "to move the reticle up.",
    pregameLeftTextX,
    canvasHeight / 4 + pregameLineSpacing
  );

  // Explains controls to move reticle down
  ctxs["back"].fillText(
    "Tap this section or",
    pregameLeftTextX,
    (canvasHeight * 3) / 4 - pregameLineSpacing
  );
  ctxs["back"].fillText(
    "press the Down arrow",
    pregameLeftTextX,
    (canvasHeight * 3) / 4
  );
  ctxs["back"].fillText(
    "to move the reticle down.",
    pregameLeftTextX,
    (canvasHeight * 3) / 4 + pregameLineSpacing
  );

  // Explains controls to fire
  ctxs["back"].fillText(
    "Tap this section or",
    (canvasWidth * 11) / 20,
    canvasHeight / 2 - pregameLineSpacing
  );
  ctxs["back"].fillText(
    "press the Spacebar",
    (canvasWidth * 11) / 20,
    canvasHeight / 2
  );
  ctxs["back"].fillText(
    "to fire and to start.",
    (canvasWidth * 11) / 20,
    canvasHeight / 2 + pregameLineSpacing
  );

  // Explains game objectives
  ctxs["back"].fillText(
    "Avoid red squares.",
    (canvasWidth * 11) / 20,
    canvasHeight / 6 - pregameLineSpacing
  );
  ctxs["back"].fillText(
    "Fire at green circles",
    (canvasWidth * 11) / 20,
    canvasHeight / 6
  );
  ctxs["back"].fillText(
    "to increase score.",
    (canvasWidth * 11) / 20,
    canvasHeight / 6 + pregameLineSpacing
  );
  ctxs["back"].fillText(
    "Fire at hearts to heal.",
    (canvasWidth * 11) / 20,
    canvasHeight / 6 + pregameLineSpacing * 2
  );
  ctxs["back"].beginPath();
  ctxs["back"].arc(
    (canvasWidth * 11) / 20 - pregameLineSpacing + pregameFont / 2,
    canvasHeight / 6 + pregameFont / 2,
    pregameFont / 2,
    0,
    2 * Math.PI
  );
  ctxs["back"].fillStyle = targetColor;
  ctxs["back"].fill();
  ctxs["back"].closePath();

  ctxs["back"].beginPath();
  ctxs["back"].rect(
    (canvasWidth * 11) / 20 - pregameLineSpacing,
    canvasHeight / 6 - gameWidth / 22 - pregameFont,
    pregameFont,
    pregameFont
  );
  ctxs["back"].fillStyle = obstacleColor;
  ctxs["back"].fill();
  ctxs["back"].closePath();

  ctxs["health"].drawImage(
    heartImage,
    (canvasWidth * 11) / 20 - pregameLineSpacing,
    canvasHeight / 6 + gameWidth / 9 - pregameFont,
    pregameFont,
    pregameFont
  );
}

/*
Draws the canvas that contains the game's background.
updated: True if the canvas size has changed. False otherwise.
*/
export function drawBackground(updated) {
  if (updated) {
    ctxs["back"].clearRect(0, 0, canvasWidth, canvasHeight);

    //Draws the three "lanes" that make up the game's background
    ctxs["back"].beginPath();
    [1, 2, 3].forEach((i) => {
      ctxs["back"].rect(
        Math.round(gameXoffset),
        Math.round(gameYoffset + laneHeight * i - 1),
        Math.round(gameWidth),
        2
      );
    });
    ctxs["back"].fillStyle = borderColor;
    ctxs["back"].fill();
    ctxs["back"].closePath();
  }
}

/*
Draws the canvas that shows the player's health. Only draws
  if the canvas size or player's health has changed.
updated: True if the canvas size has changed. False otherwise.
health: The player's current health.
*/
export function drawHealth(updated, health) {
  if (health !== prevHealth || updated) {
    ctxs["health"].clearRect(0, 0, canvasWidth, canvasHeight);
    for (var i = 0; i < health; i++) {
      ctxs["health"].drawImage(
        heartImage,
        Math.round(gameXoffset + healthXposition + healthXdistance * i),
        Math.round(gameYoffset + healthYposition),
        Math.round(uiElementsRadius * 2),
        Math.round(uiElementsRadius * 2)
      );
    }
    prevHealth = health;
  }
}

/*
Draws the canvas that shows the player's score. Only draws
  if the canvas size or score have changed.
updated: True if the canvas size has changed. False otherwise.
score: The player's current score.
*/
export function drawScore(updated, score) {
  if (updated || score !== prevScore) {
    ctxs["score"].clearRect(0, 0, canvasWidth, canvasHeight);
    ctxs["score"].fillStyle = white;
    ctxs["score"].font = `${gameWidth / 24}px courier`;
    ctxs["score"].fillText(
      `Score: ${score}`,
      Math.round(gameXoffset + scoreXposition),
      Math.round(gameYoffset + scoreYposition)
    );
    prevScore = score;
  }
}

/*
Draws the canvas that shows the player's reticle. Only draws
  if the canvas size has changed or the player moved.
updated: True if the canvas size has changed. False otherwise.
playerYposition: The player's current y position.
*/
export function drawPlayer(updated, playerYposition, showFired, hitTarget) {
  if (updated || playerYposition !== prevY || showFired !== prevShowFired) {
    ctxs["player"].clearRect(0, 0, canvasWidth, canvasHeight);
    ctxs["player"].beginPath();

    // Draws a circle to outline the reticle
    ctxs["player"].arc(
      Math.round(gameXoffset + playerXPosition),
      Math.round(gameYoffset + playerYposition * laneHeight),
      Math.round(playerRadius),
      0,
      2 * Math.PI
    );

    ctxs["player"].lineTo(
      Math.round(gameXoffset + playerXPosition - playerRadius),
      Math.round(gameYoffset + playerYposition * laneHeight)
    );
    ctxs["player"].moveTo(
      Math.round(gameXoffset + playerXPosition),
      Math.round(gameYoffset + playerYposition * laneHeight - playerRadius)
    );
    ctxs["player"].lineTo(
      Math.round(gameXoffset + playerXPosition),
      Math.round(gameYoffset + playerYposition * laneHeight + playerRadius)
    );

    ctxs["player"].strokeStyle = white;
    ctxs["player"].lineWidth = playerLineWidth;
    ctxs["player"].stroke();
    ctxs["player"].closePath();

    ctxs["player"].beginPath();

    if (showFired) {
      // Draws the lines showing that a shot was fired
      for (let [xMultiplier, yMultiplier] of [
        [1, 1],
        [-1, 1],
        [-1, -1],
        [1, -1],
      ]) {
        ctxs["player"].moveTo(
          Math.round(
            gameXoffset +
              playerXPosition +
              ((playerRadius * innerRadiusMultiplier) / sqrt2) * xMultiplier
          ),
          Math.round(
            gameYoffset +
              playerYposition * laneHeight +
              ((playerRadius * innerRadiusMultiplier) / sqrt2) * yMultiplier
          )
        );
        ctxs["player"].lineTo(
          Math.round(
            gameXoffset +
              playerXPosition +
              ((playerRadius * outerRadiusMultiplier) / sqrt2) * xMultiplier
          ),
          Math.round(
            gameYoffset +
              playerYposition * laneHeight +
              ((playerRadius * outerRadiusMultiplier) / sqrt2) * yMultiplier
          )
        );
      }

      if (hitTarget) {
        ctxs["player"].strokeStyle = targetColor;
      } else {
        ctxs["player"].strokeStyle = missedColor;
      }
      ctxs["player"].stroke();
      ctxs["player"].closePath();
    }

    prevShowFired = showFired;
    prevY = playerYposition;
  }
}

/*
Draws the canvas that shows the border around the game area
  and the black bars to the left and right of the game area.
  Only draws if the canvas size has changed.
updated: True if the canvas size has changed. False otherwise.
*/
export function drawBorder(updated) {
  if (updated) {
    // Draws black bars to the left and right of the game area to
    // ensure obstacles and targets are not visible in these areas
    ctxs["border"].beginPath();
    ctxs["border"].rect(
      0,
      Math.round(gameYoffset),
      Math.round(gameXoffset - outlineWidth / 2),
      Math.round(gameHeight)
    );
    ctxs["border"].rect(
      Math.round(gameXoffset + gameWidth + outlineWidth / 2),
      Math.round(gameYoffset),
      Math.round(gameXoffset),
      Math.round(gameHeight)
    );
    ctxs["border"].fillStyle = black;
    ctxs["border"].fill();
    ctxs["border"].closePath();

    // Draws the border around the game area
    ctxs["border"].beginPath();
    ctxs["border"].rect(
      Math.round(gameXoffset),
      Math.round(gameYoffset),
      Math.round(gameWidth),
      Math.round(gameHeight)
    );
    ctxs["border"].strokeStyle = borderColor;
    ctxs["border"].lineWidth = outlineWidth;
    ctxs["border"].stroke();
    ctxs["border"].closePath();

    // Draws text pointing to the GitHub
    ctxs["border"].fillStyle = white;
    ctxs["border"].font = `${gameWidth / 24}px courier`;
    // ctxs["border"].fillText("v0.2", 30, githubTextYposition * 1.5);
    ctxs["border"].fillText(
      "github.com/tWhite7217/JS-Game",
      gameXoffset + gameWidth / 8,
      githubTextYposition
    );
  }
}

/*
Draws the canvas that shows the game over screen.
score: The player's final score.
newHighScore: True if new high score set. False otherwise.
*/
export function drawGameOver(score, newHighScore) {
  ctxs["back"].clearRect(0, 0, canvasWidth, canvasHeight);
  ctxs["back"].font = `${gameWidth / 20}px courier`;
  ctxs["back"].fillStyle = white;
  ctxs["back"].fillText(
    "Fire to Play Again",
    gameXoffset + gameWidth / 5,
    gameYoffset + (gameHeight * 5) / 18
  );
  ctxs["back"].fillText(
    `Score: ${score}`,
    gameXoffset + gameWidth / 3,
    gameYoffset + (gameHeight * 5) / 9
  );
  ctxs["back"].fillText(
    `High score: ${localStorage.getItem("high-score")}`,
    gameXoffset + gameWidth / 4,
    gameYoffset + (gameHeight * 2) / 3
  );
  if (newHighScore) {
    ctxs["back"].fillText(
      "New high score!",
      gameXoffset + gameWidth / 4,
      gameYoffset + (gameHeight * 4) / 9
    );
  }
}

/*
Draws the canvas that shows the obstacles and targets.
obstacles: The array containing all obstacle info.
targets: The array containing all target info.
*/
function drawCircles(obstacles, targets) {
  ctxs["circles"].clearRect(0, 0, canvasWidth, canvasHeight);

  ctxs["circles"].beginPath();
  ctxs["circles"].fillStyle = targetColor;
  for (var i = 0; i < targets.length; i++) {
    if (targets[i].givesHealth) {
      ctxs["circles"].drawImage(
        heartImage,
        Math.round(gameXoffset + targets[i].xPosition - baseTargetRadius),
        Math.round(
          gameYoffset + targets[i].yPosition * laneHeight - baseTargetRadius
        ),
        Math.round(baseTargetRadius * 2),
        Math.round(baseTargetRadius * 2)
      );
    } else {
      ctxs["circles"].moveTo(
        Math.round(gameXoffset + targets[i].xPosition),
        Math.round(gameYoffset + targets[i].yPosition * laneHeight)
      );
      ctxs["circles"].arc(
        Math.round(gameXoffset + targets[i].xPosition),
        Math.round(gameYoffset + targets[i].yPosition * laneHeight),
        Math.round(getTargetRadius(targets[i].size)),
        0,
        2 * Math.PI
      );
    }
  }
  ctxs["circles"].fill();
  ctxs["circles"].closePath();

  ctxs["circles"].beginPath();
  ctxs["circles"].fillStyle = obstacleColor;
  for (var i = 0; i < obstacles.length; i++) {
    ctxs["circles"].moveTo(
      Math.round(gameXoffset + obstacles[i].xPosition - obstacleRadius),
      Math.round(
        gameYoffset + obstacles[i].yPosition * laneHeight - obstacleRadius
      )
    );
    ctxs["circles"].rect(
      Math.round(gameXoffset + obstacles[i].xPosition - obstacleRadius),
      Math.round(
        gameYoffset + obstacles[i].yPosition * laneHeight - obstacleRadius
      ),
      Math.round(2 * obstacleRadius),
      Math.round(2 * obstacleRadius)
    );
  }
  ctxs["circles"].fill();
  ctxs["circles"].closePath();
}

/*
The UI instruction that runs every game tick.
score: The player's final score.
obstacles: The array containing all obstacle info.
targets: The array containing all target info.
health: The player's current health.
score: The player's current score.
playerYposition: The player's current y position.
*/
export function updateUI(
  obstacles,
  targets,
  health,
  score,
  playerYposition,
  showFired,
  hitTarget
) {
  var updated = updateUIVariables();

  drawBackground(updated);
  drawHealth(updated, health);
  drawScore(updated, score);
  drawPlayer(updated, playerYposition, showFired, hitTarget);
  drawBorder(updated);
  drawCircles(obstacles, targets);
}

/*
Updates all UI variables if the canvas size has changed.

returns: True if the variables were updated. False otherwise.
*/
export function updateUIVariables() {
  if (canvasWidth != window.innerWidth || canvasHeight != window.innerHeight) {
    canvasIds.forEach((id) => {
      canvases[id].width = window.innerWidth;
      canvases[id].height = window.innerHeight;
    });
    canvasWidth = canvases["back"].clientWidth;
    canvasHeight = canvases["back"].clientHeight;
    if (canvasHeight < (canvasWidth * 3) / 4) {
      gameHeight = (canvasHeight * 4) / 5;
      gameWidth = (gameHeight * 4) / 3;
    } else {
      gameWidth = (canvasWidth * 4) / 5;
      gameHeight = (gameWidth * 3) / 4;
    }
    gameXoffset = (canvasWidth - gameWidth) / 2;
    gameYoffset = (canvasHeight - gameHeight) / 2;
    laneHeight = gameHeight / 4;
    uiElementsRadius = gameWidth / 40;
    baseTargetRadius = gameWidth / 30;
    maxTargetRadius = gameWidth / 15;
    targetRadiusStep = (maxTargetRadius - baseTargetRadius) / 2;
    obstacleRadius = (gameWidth * 7) / 120;
    playerRadius = gameWidth / 45;
    scoreXposition = (gameWidth * 7) / 10;
    scoreYposition = (gameHeight * 7) / 100;
    healthXposition = gameWidth / 60;
    healthXdistance = (gameWidth * 7) / 100;
    healthYposition = gameHeight / 45;
    playerXPosition = (gameWidth * 3) / 20;
    githubTextYposition = canvasHeight / 20;
    pregameFont = gameWidth / 28;
    pregameLeftTextX = canvasWidth / 20;
    pregameLineSpacing = gameWidth / 20;

    return true;
  }

  return false;
}

/*
Clears all UI canvases.
*/
export function clearCanvases() {
  canvasIds.forEach((id) => {
    ctxs[id].clearRect(0, 0, canvasWidth, canvasHeight);
  });
}
