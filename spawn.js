/*
spawn.js
Author: Tommy White
Contains code for spawning obstacles and targets the JavaScript game.
*/

import { gameWidth, obstacleRadius } from "./gameUI.js";

class Obstacle {
  constructor(yPos) {
    this.xPosition = gameWidth + obstacleRadius * 2 - 1;
    this.yPosition = yPos;
    this.hasDetected = false;
  }
}

class Target {
  constructor(size, yPos, givesHealth) {
    this.size = size;
    this.givesHealth = givesHealth;

    if (givesHealth) {
      this.pointValue = 0;
    } else {
      this.pointValue = 3 - size;
    }
    this.xPosition = gameWidth + obstacleRadius * 2 - 1;

    this.yPosition = yPos;
  }
}

/*
Spawns obstacles and/or targets.
type: a random integer that defines which type
  of spawn should occur
obstacles: the array of obstacles to be updated
targets: the array of targets to be updated
*/
export function spawn(type, obstacles, targets) {
  var healthSpawn = Math.floor(Math.random() * 100);
  if (healthSpawn === 0) {
    targets.push(new Target(0, Math.floor(type / 4) + 1, true));
  } else {
    if (type < 3) {
      spawnObstacleOrTarget(
        Math.floor(Math.random() * 2),
        type + 1,
        obstacles,
        targets
      );
    } else if (type < 6) {
      spawnObstacleAndTarget(
        Math.floor(Math.random() * 3) + 1,
        obstacles,
        targets
      );
    } else {
      spawnTwoObstacles(obstacles);
    }
  }
}

/*
A helper function of spawn. Spawns either one obstacle
  or one target. Will be called if spawn's type
  argument is 0, 1, or 2.
obstacleOrTarget: If 0, an obstacle is spawned.
  Else, a target is spawned.
yPos: Can be 1, 2, or 3. Determines the y position of
  the spawned object.
obstacles: the array of obstacles to be updated
targets: the array of targets to be updated
*/
function spawnObstacleOrTarget(obstacleOrTarget, yPos, obstacles, targets) {
  if (obstacleOrTarget) {
    targets.push(new Target(Math.floor(Math.random() * 3), yPos, false));
  } else {
    obstacles.push(new Obstacle(yPos));
  }
}

/*
A helper function of spawn. Spawns both one obstacle
  and one target. Will be called if spawn's type
  argument is 3, 4, or 5.
obstacleYPos: Can be 1, 2, or 3. Determines the y position
  of the spawned obstacle.
obstacles: the array of obstacles to be updated
targets: the array of targets to be updated
*/
function spawnObstacleAndTarget(obstacleYPos, obstacles, targets) {
  obstacles.push(new Obstacle(obstacleYPos));
  if (Math.floor(Math.random() * 2)) {
    targets.push(
      new Target(
        Math.floor(Math.random() * 3),
        2 - Math.floor(obstacleYPos / 2)
      )
    );
  } else {
    targets.push(
      new Target(
        Math.floor(Math.random() * 3),
        3 - Math.floor(obstacleYPos / 3)
      )
    );
  }
}

/*
A helper function of spawn. Spawns two obstacles.
  Will be called if spawn's type argument is 6 or greater.
obstacles: the array of obstacles to be updated
*/
function spawnTwoObstacles(obstacles) {
  var obstacleLines = Math.floor(Math.random() * 3);
  obstacles.push(new Obstacle(1 + Math.floor(obstacleLines / 2)));
  obstacles.push(new Obstacle(2 + Math.ceil(obstacleLines / 2)));
}
