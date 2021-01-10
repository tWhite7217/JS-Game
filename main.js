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
  targetRadius,
  gameWidth,
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

function manageMusic() {
  if (mPressed) {
    song.volume = !song.volume;
    setMPressed(false);
  }
  if (sPressed) {
    audio = !audio;
    setSPressed(false);
  }
  if (song.paused) {
    oldVolume = song.volume;
    switch (Math.floor(Math.random() * 4)) {
      case 0:
        song = new Audio("bensound-scifi.mp3");
        break;
      case 1:
        song = new Audio("bensound-newdawn.mp3");
        break;
      case 2:
        song = new Audio("bensound-evolution.mp3");
        break;
      case 3:
        song = new Audio("bensound-deepblue.mp3");
        break;
    }
    song.play();
    song.volume = oldVolume;
  }
}

//Other variables used for logic and data storage

var score = 0;
var health = 3;
var playerYposition = 2;

const minCount = 10;
const countRange = 15;
var count = 0;

var interval;

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
          targetRadius + targetRadius * targets[i].size
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
function moveTargetsAndObstacles() {
  for (var i = 0; i < targets.length; i++) {
    targets[i].xPosition -= gameWidth / 60;
    if (
      targets[i].xPosition <
      0 - (targetRadius + targets[i].size * targetRadius)
    ) {
      targets.splice(i, 1);
      i--;
    }
  }
  for (var i = 0; i < obstacles.length; i++) {
    obstacles[i].xPosition -= gameWidth / 60;
    if (obstacles[i].xPosition < 0 - obstacleRadius) {
      obstacles.splice(i, 1);
      i--;
    }
  }
}

/*
The game logic that occurs every 30ms.
*/
function tick() {
  if (count >= minCount + Math.floor(countRange / (1 + score / 20))) {
    spawn(Math.floor(Math.random() * 11), obstacles, targets);
    count = 0;
  } else {
    count++;
  }
  targetHit();
  obstacleHit();
  move();
  moveTargetsAndObstacles();
  updateUI(
    obstacles,
    targets,
    health,
    audio,
    song.volume,
    score,
    playerYposition
  );
  checkForGameOver();
  manageMusic();
}

/*
The code that runs ever 50ms when the page is first loaded.
  Shows controls and enters the main game if the player fires.
*/
function pregame() {
  updateUIVariables();

  drawPregame();

  if (spacePressed) {
    drawBackground(true);
    drawHealth(true, health);
    drawAudio(true, audio, song.volume);
    drawScore(true, score);
    drawPlayer(true, playerYposition);
    drawBorder(true);
    song.play();
    clearInterval(interval);
    interval = setInterval(tick, 30);
    setSpacePressed(false);
  }
}

/*
Checks if the player has lost all their health.
  If so, the game over state begins.
*/
function checkForGameOver() {
  if (health <= 0) {
    clearInterval(interval);
    clearCanvases();
    drawAudio(true);
    interval = setInterval(gameOver, 50);
  }
}

/*
The code that runs after a player has lost all health.
  Shows the player's score and enter a new game if
  the player fires.
*/
function gameOver() {
  manageMusic();
  var updated = updateUIVariables();

  drawGameOver(score);
  drawAudio(updated);

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
    clearInterval(interval);
    interval = setInterval(tick, 30);
    setSpacePressed(false);
  }
}

interval = setInterval(pregame, 50);
