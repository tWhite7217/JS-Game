/*
gameUI.js
Author: Tommy White
Contains the UI code for the JavaScript game, including all
    canvas references.
*/

const outlineWidth = 4;

export var canvasWidth;
export var canvasHeight;
export var gameWidth;
export var targetRadius;
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
var soundXposition;
export var soundYposition;

export var playerXPosition;

var prevY = 2;
var prevHealth = 3;
var prevScore = 0;
var prevAudio;
var prevVolume;

const heartImage = document.getElementById("heart");
const musicImage = document.getElementById("music note");
const speakerImage = document.getElementById("speaker symbol");
const noImage = document.getElementById("no symbol");

var canvasIds = [
  "back",
  "health",
  "audio",
  "score",
  "circles",
  "player",
  "border",
];
var canvases = {};
var ctxs = {};

canvasIds.forEach((id) => {
  canvases[id] = document.getElementById(id);
  canvases[id].width = window.innerWidth;
  canvases[id].height = window.innerHeight;
  ctxs[id] = canvases[id].getContext("2d");
});

/*
Draws the screen that shows when the game is initially loaded.
*/
export function drawPregame() {
  // Lines that show the different touchscreen areas
  ctxs["back"].beginPath();
  ctxs["back"].strokeStyle = "rgb(255, 255, 255)";
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
  ctxs["back"].font = `${canvasWidth / 34}px courier`;
  ctxs["back"].fillStyle = "rgb(255, 255, 255)";

  // Explains controls to move reticle up
  ctxs["back"].fillText(
    "Tap this section or",
    canvasWidth / 20,
    canvasHeight / 4 - canvasWidth / 20
  );
  ctxs["back"].fillText(
    "press the Up arrow",
    canvasWidth / 20,
    canvasHeight / 4
  );
  ctxs["back"].fillText(
    "to move the reticle up.",
    canvasWidth / 20,
    canvasHeight / 4 + canvasWidth / 20
  );

  // Explains controls to move reticle down
  ctxs["back"].fillText(
    "Tap this section or",
    canvasWidth / 20,
    (canvasHeight * 3) / 4 - canvasWidth / 20
  );
  ctxs["back"].fillText(
    "press the Down arrow",
    canvasWidth / 20,
    (canvasHeight * 3) / 4
  );
  ctxs["back"].fillText(
    "to move the reticle down.",
    canvasWidth / 20,
    (canvasHeight * 3) / 4 + canvasWidth / 20
  );

  // Explains controls to fire
  ctxs["back"].fillText(
    "Tap this section or",
    (canvasWidth * 11) / 20,
    canvasHeight / 2 - canvasWidth / 20
  );
  ctxs["back"].fillText(
    "press the Spacebar",
    (canvasWidth * 11) / 20,
    canvasHeight / 2
  );
  ctxs["back"].fillText(
    "to fire and to start.",
    (canvasWidth * 11) / 20,
    canvasHeight / 2 + canvasWidth / 20
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
      console.log(i);
      ctxs["back"].rect(
        Math.round(gameXoffset),
        Math.round(gameYoffset + laneHeight * i - 1),
        Math.round(gameWidth),
        2
      );
    });
    ctxs["back"].fillStyle = "rgb(221, 160, 221)";
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
        Math.round(targetRadius * 2),
        Math.round(targetRadius * 2)
      );
    }
    prevHealth = health;
  }
}

/*
Draws the canvas that shows the game's audio settings. Only
  draws if the canvas size or audio settings have changed.
updated: True if the canvas size has changed. False otherwise.
audio: True if sound effects are enabled. False otherwise.
volume: True if music are enabled. False otherwise.
*/
export function drawAudio(updated, audio, volume) {
  if (updated || audio !== prevAudio || volume !== prevVolume) {
    ctxs["audio"].clearRect(0, 0, canvasWidth, canvasWidth);

    // Draws text crediting the music and pointing to the GitHub
    ctxs["audio"].fillStyle = "rgb(255, 255, 255)";
    ctxs["audio"].font = `${gameWidth / 24}px courier`;
    //   ctxs["audio"].fillText("v0.2", 30, soundYposition);
    ctxs["audio"].fillText("Music: bensound.com", 30, soundYposition * 1.5);
    ctxs["audio"].fillText(
      "Credits: github.com/tWhite7217/JS-Game",
      gameXoffset + gameWidth / 40,
      canvasHeight - soundYposition
    );

    // Draws letters showing how to toggle music and sound effects
    ctxs["audio"].fillText("m:", soundXposition, soundYposition);
    ctxs["audio"].fillText(
      "s:",
      Math.round(soundXposition + targetRadius * 4),
      Math.round(soundYposition)
    );

    // Draws the music and speaker symbols
    ctxs["audio"].drawImage(
      musicImage,
      Math.round(soundXposition + targetRadius),
      Math.round(soundYposition),
      Math.round(targetRadius * 2),
      Math.round(targetRadius * 2)
    );
    ctxs["audio"].drawImage(
      speakerImage,
      Math.round(soundXposition + targetRadius * 5),
      Math.round(soundYposition),
      Math.round(targetRadius * 2),
      Math.round(targetRadius * 2)
    );

    // Draws "no" symbols over the audio symbols if they have been muted
    if (!volume) {
      ctxs["audio"].drawImage(
        noImage,
        Math.round(soundXposition + targetRadius),
        Math.round(soundYposition),
        Math.round(targetRadius * 2),
        Math.round(targetRadius * 2)
      );
    }
    if (!audio) {
      ctxs["audio"].drawImage(
        noImage,
        Math.round(soundXposition + targetRadius * 5),
        Math.round(soundYposition),
        Math.round(targetRadius * 2),
        Math.round(targetRadius * 2)
      );
    }
    prevAudio = audio;
    prevVolume = volume;
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
    ctxs["score"].fillStyle = "rgb(255, 255, 255)";
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
export function drawPlayer(updated, playerYposition) {
  if (updated || playerYposition !== prevY) {
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

    // Draws the reticle's perpendicular lines
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
    ctxs["player"].strokeStyle = "rgb(255, 255, 255)";
    ctxs["player"].stroke();
    ctxs["player"].closePath();

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
    ctxs["border"].fillStyle = "rgb(0, 0, 0)";
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
    ctxs["border"].strokeStyle = "rgb(221, 160, 221)";
    ctxs["border"].lineWidth = outlineWidth;
    ctxs["border"].stroke();
    ctxs["border"].closePath();
  }
}

/*
Draws the canvas that shows the game over screen.
score: The player's final score.
*/
export function drawGameOver(score) {
  ctxs["back"].font = `${gameWidth / 20}px courier`;
  ctxs["back"].fillStyle = "rgb(255, 255, 255)";
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
}

/*
Draws the canvas that shows the obstacles and targets.
obstacles: The array containing all obstacle info.
targets: The array containing all target info.
*/
function drawCircles(obstacles, targets) {
  ctxs["circles"].clearRect(0, 0, canvasWidth, canvasHeight);

  ctxs["circles"].beginPath();
  ctxs["circles"].fillStyle = "rgb(34, 139, 34)";
  for (var i = 0; i < targets.length; i++) {
    if (targets[i].givesHealth) {
      ctxs["circles"].drawImage(
        heartImage,
        Math.round(gameXoffset + targets[i].xPosition - targetRadius),
        Math.round(
          gameYoffset + targets[i].yPosition * laneHeight - targetRadius
        ),
        Math.round(targetRadius * 2),
        Math.round(targetRadius * 2)
      );
    } else {
      ctxs["circles"].moveTo(
        Math.round(gameXoffset + targets[i].xPosition),
        Math.round(gameYoffset + targets[i].yPosition * laneHeight)
      );
      ctxs["circles"].arc(
        Math.round(gameXoffset + targets[i].xPosition),
        Math.round(gameYoffset + targets[i].yPosition * laneHeight),
        Math.round(targets[i].size * targetRadius + targetRadius),
        0,
        2 * Math.PI
      );
    }
  }
  ctxs["circles"].fill();
  ctxs["circles"].closePath();

  ctxs["circles"].beginPath();
  ctxs["circles"].fillStyle = "rgb(220, 20, 60)";
  for (var i = 0; i < obstacles.length; i++) {
    ctxs["circles"].moveTo(
      Math.round(gameXoffset + obstacles[i].xPosition),
      Math.round(gameYoffset + obstacles[i].yPosition * laneHeight)
    );
    ctxs["circles"].arc(
      Math.round(gameXoffset + obstacles[i].xPosition),
      Math.round(gameYoffset + obstacles[i].yPosition * laneHeight),
      Math.round(obstacleRadius),
      0,
      2 * Math.PI
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
audio: True if sound effects are enabled. False otherwise.
volume: True if music are enabled. False otherwise.
score: The player's current score.
playerYposition: The player's current y position.
*/
export function updateUI(
  obstacles,
  targets,
  health,
  audio,
  volume,
  score,
  playerYposition
) {
  var updated = updateUIVariables();

  drawBackground(updated);
  drawHealth(updated, health);
  drawAudio(updated, audio, volume);
  drawScore(updated, score);
  drawPlayer(updated, playerYposition);
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
    targetRadius = gameWidth / 40;
    obstacleRadius = (gameWidth * 7) / 120;
    playerRadius = gameWidth / 24;
    scoreXposition = (gameWidth * 7) / 10;
    scoreYposition = (gameHeight * 7) / 100;
    healthXposition = gameWidth / 60;
    healthXdistance = (gameWidth * 7) / 100;
    healthYposition = gameHeight / 45;
    playerXPosition = (gameWidth * 3) / 20;
    soundXposition = (canvasWidth * 4) / 5;
    soundYposition = canvasHeight / 30;

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
