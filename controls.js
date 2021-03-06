/*
controls.js
Author: Tommy White
Contains the controls logic for the JavaScript game.
*/

import { canvasWidth, canvasHeight } from "./gameUI.js";

export var upPressed = false;
export var downPressed = false;
export var spacePressed = false;
var upLock = false;
var downLock = false;
var spaceLock = false;

export function setUpPressed(value) {
  upPressed = value;
}

export function setDownPressed(value) {
  downPressed = value;
}

export function setSpacePressed(value) {
  spacePressed = value;
}

export function setMPressed(value) {
  mPressed = value;
}

export function setSPressed(value) {
  sPressed = value;
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("touchstart", touchHandler);

/*
Defines what should happen when a key is pressed down.
e: the event generated when the key was pressed down
*/
function keyDownHandler(e) {
  if ((e.key === "Up" || e.key === "ArrowUp") && !upLock) {
    upPressed = true;
    upLock = true;
  } else if (e.key === "Down" || (e.key === "ArrowDown" && !downLock)) {
    downPressed = true;
    downLock = true;
  } else if ((e.key === " " || e.key === "Spacebar") && !spaceLock) {
    spacePressed = true;
    spaceLock = true;
  }
}

/*
Defines what should happen when a key is released.
e: the event generated when the key was pressed down
*/
function keyUpHandler(e) {
  if (e.key === "Up" || e.key === "ArrowUp") {
    upLock = false;
  } else if (e.key === "Down" || e.key === "ArrowDown") {
    downLock = false;
  } else if (e.key === " " || e.key === "Spacebar") {
    spaceLock = false;
  }
}

/*
Defines what should happen when a touch event starts.
e: the event generated when the screen was touched
*/
function touchHandler(e) {
  for (let i = 0; i < e.touches.length; i++) {
    if (e.touches[i].clientX <= canvasWidth / 2) {
      // Left half pressed
      if (e.touches[i].clientY <= canvasHeight / 2) {
        // Top left pressed
        upPressed = true;
      } else {
        // Bottom left pressed
        downPressed = true;
      }
    } else {
      // Right half pressed
      spacePressed = true;
    }
  }
}
