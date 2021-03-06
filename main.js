/*
main.js
Author: Tommy White
Contains the main logic for the JavaScript game.
*/

import {
  updateUIVariables,
  updateUI,
  drawAudio,
  drawBackground,
  drawBorder,
  drawHealth,
  drawPlayer,
  drawPregame,
  drawScore,
  drawGameOver,
  clearCanvases,
  playerXPosition,
  obstacleRadius,
  gameWidth,
  getTargetRadius,
} from "./gameUI.js";

import {
  upPressed,
  downPressed,
  spacePressed,
  mPressed,
  sPressed,
  setUpPressed,
  setDownPressed,
  setSpacePressed,
  setMPressed,
  setSPressed,
} from "./controls.js";

import { spawn } from "./spawn.js";

//Variables and function for managing music and sound effects

var audio = 0;
var oldVolume;
var song = new Audio("silence.mp3");
var laserSound = new Audio("laser-shot-quiet.mp3");
var damageTakenSound = new Audio("damage.mp3");

// function manageMusic() {
//   if (mPressed) {
//     song.volume = !song.volume;
//     setMPressed(false);
//   }
//   if (sPressed) {
//     audio = !audio;
//     setSPressed(false);
//   }
//   if (song.paused) {
//     oldVolume = song.volume;
//     switch (Math.floor(Math.random() * 4)) {
//       case 0:
//         song = new Audio("bensound-scifi.mp3");
//         break;
//       case 1:
//         song = new Audio("bensound-newdawn.mp3");
//         break;
//       case 2:
//         song = new Audio("bensound-evolution.mp3");
//         break;
//       case 3:
//         song = new Audio("bensound-deepblue.mp3");
//         break;
//     }
//     song.play();
//     song.volume = oldVolume;
//   }
// }

//Other variables used for logic and data storage

var score = 0;
var health = 3;
var playerYposition = 2;

const iterationsPerSpawn = 25;
const maxMsPerIteration = 30;
const minMsPerIteration = 12;
const movementPerIteration = 60;
const scoreForMaxDifficulty = 100; // Higher = easier

function scaledMsPerIteration() {
  return Math.max(
    maxMsPerIteration -
      (maxMsPerIteration - minMsPerIteration) * (score / scoreForMaxDifficulty),
    minMsPerIteration
  );
}

var count = 0;

var animation;

var targets = [];
var obstacles = [];

/*
Determines if a target has been hit by the player.
  If any were hit, they are removed from the targets
  array and the score is increased (or health if the
  target was a heart). Also plays a laser sound if
  the player fired.
*/
function targetHit() {
  if (spacePressed) {
    if (audio) {
      laserSound.play();
    }
    setSpacePressed(false);
    for (var i = 0; i < targets.length; i++) {
      if (
        targets[i].yPosition === playerYposition &&
        Math.abs(targets[i].xPosition - playerXPosition) <=
          getTargetRadius(targets[i].size)
      ) {
        if (targets[i].givesHealth) {
          health += 1;
        }
        score += targets[i].pointValue;
        targets.splice(i, 1);
        i--;
      }
    }
  }
}

/*
Determines if a player contacted any obstacles.
  If so, health is decreased, the obstacle can
  no longer harm the player, and a damage sound
  effect will be played.
*/
function obstacleHit() {
  for (var i = 0; i < obstacles.length; i++) {
    if (
      obstacles[i].yPosition === playerYposition &&
      !obstacles[i].hasDetected &&
      Math.abs(obstacles[i].xPosition - playerXPosition) <= obstacleRadius
    ) {
      health--;
      obstacles[i].hasDetected = true;
      if (audio) {
        damageTakenSound.play();
      }
    }
  }
}

/*
Checks if the player input a movement and changes
  the player's y position if so.
*/
function move() {
  if (downPressed) {
    if (playerYposition != 3) {
      playerYposition += 1;
    }
    setDownPressed(false);
  }
  if (upPressed) {
    if (playerYposition != 1) {
      playerYposition -= 1;
    }
    setUpPressed(false);
  }
}

/*
Updates the positions of all targets and obstacles.
  Removes any from the arrays that are no longer in
  the play space.
*/
function moveTargetsAndObstacles(timeChange) {
  let movement =
    ((gameWidth / movementPerIteration) * timeChange) / scaledMsPerIteration();
  for (var i = 0; i < targets.length; i++) {
    targets[i].xPosition -= movement;
    if (targets[i].xPosition < 0 - getTargetRadius(targets[i].size)) {
      targets.splice(i, 1);
      i--;
    }
  }
  for (var i = 0; i < obstacles.length; i++) {
    obstacles[i].xPosition -= movement;
    if (obstacles[i].xPosition < 0 - obstacleRadius) {
      obstacles.splice(i, 1);
      i--;
    }
  }
}

/*
The game logic that occurs every animation frame.
*/
function tick(lastTime) {
  let now = Date.now();
  let timeChange = now - lastTime;
  let msThreshold = iterationsPerSpawn * scaledMsPerIteration();
  if (count >= msThreshold) {
    spawn(Math.floor(Math.random() * 11), obstacles, targets);
    count = count % msThreshold;
  } else {
    count += timeChange;
  }
  // console.log(targets);
  targetHit();
  obstacleHit();
  move();
  moveTargetsAndObstacles(timeChange);
  updateUI(
    obstacles,
    targets,
    health,
    audio,
    song.volume,
    score,
    playerYposition
  );
  animation = requestAnimationFrame(() => tick(now));
  checkForGameOver();
  // manageMusic();
}

/*
The code that runs ever 50ms when the page is first loaded.
  Shows controls and enters the main game if the player fires.
*/
function pregame() {
  updateUIVariables();

  drawPregame();

  animation = requestAnimationFrame(pregame);

  if (spacePressed) {
    drawBackground(true);
    drawHealth(true, health);
    drawAudio(true, audio, song.volume);
    drawScore(true, score);
    drawPlayer(true, playerYposition);
    drawBorder(true);
    song.play();
    cancelAnimationFrame(animation);
    animation = requestAnimationFrame(() => tick(Date.now()));
    setSpacePressed(false);
  }
}

/*
Checks if the player set a new high score. If so,
  localStorage is used to save the score.
returns: True if new high score set. False otherwise.
*/
function checkHighScore() {
  var highScore = localStorage.getItem("high-score");
  if (!highScore || score > highScore) {
    localStorage.setItem("high-score", score);
    return true;
  }
  return false;
}

/*
Checks if the player has lost all their health.
  If so, the game over state begins.
*/
function checkForGameOver() {
  if (health <= 0) {
    clearCanvases();
    drawAudio(true, audio, song.volume);
    var newHighScore = checkHighScore();
    cancelAnimationFrame(animation);
    animation = requestAnimationFrame(() => gameOver(newHighScore));
  }
}

/*
The code that runs after a player has lost all health.
  Shows the player's score and enter a new game if
  the player fires.
newHighScore: True if new high score set. False otherwise.
*/
function gameOver(newHighScore) {
  // manageMusic();
  var updated = updateUIVariables();

  drawGameOver(score, newHighScore);
  drawAudio(updated, audio, song.volume);

  animation = requestAnimationFrame(() => gameOver(newHighScore));

  if (spacePressed) {
    targets = [];
    obstacles = [];
    score = 0;
    health = 3;
    drawBackground(true);
    drawHealth(true);
    drawScore(true);
    drawPlayer(true, playerYposition);
    drawBorder(true);
    cancelAnimationFrame(animation);
    animation = requestAnimationFrame(() => tick(Date.now()));
    setSpacePressed(false);
  }
}

animation = requestAnimationFrame(pregame);
