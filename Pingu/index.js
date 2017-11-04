var nextAction;

// Util
function numberRange (start, end) {
    return new Array(end - start).fill().map((d, i) => i + start);
}

// Agressive
function distanceToEnemy(currentPosition, enemyPosition) {
    var distanceX = Math.abs(currentPosition.x - enemyPosition.x);
    var distanceY = Math.abs(currentPosition.y - enemyPosition.y);
    var distance = Math.sqrt(distanceX*distanceX + distanceY*distanceY);
    return distance;
}

function getPlayerVicinityGrid(state) {
    var pinguX = state.you.x;
    var pinguY = state.you.y;
    var boardEndX = state.mapWidth;
    var boardEndY = state.mapHeight; 

    var gridX = numberRange((pinguX - state.visibility), (pinguX + state.visibility) + 1);
    var gridY = numberRange((pinguY - state.visibility), (pinguY + state.visibility) + 1);

    var grid = [];
    gridX.forEach(function(x, indexX) {
        gridY.forEach(function(y, indexY) {
            grid.push({ x: gridX[indexX], y: gridY[indexY] });
        });
    });

    return grid;
}

function shouldShoot(state) {
    currentPosition = state.you;
    enemyPositions = state.enemies;

    var shoot = false;
    enemyPositions.forEach(function(enemy) {
        if (distanceToEnemy(currentPosition, enemy) < state.visibility) {
            switch (currentPosition.direction) {
                case "top":
                shoot = enemy.x == currentPosition.x && enemy.y > currentPosition.y;
                break;
                case "bottom":
                shoot = enemy.x == currentPosition.x && enemy.y < currentPosition.y;
                break;
                case "left":
                shoot = enemy.y == currentPosition.y && enemy.x < currentPosition.x;
                break;
                case "right":
                shoot = enemy.y == currentPosition.y && enemy.x > currentPosition.x;
                break;
            }
        }
    }, this);
    
    return shoot;
}

function powerUpInVicinity(state) {
    var grid = getPlayerVicinityGrid(state);

    var bonusTileInVicinity = null;
    var bonusTiles = state.bonusTiles;
    grid.forEach(function(point) {
        bonusTiles.forEach(function(bonusPoint) {
            if (point.x === bonusPoint.x && point.y === bonusPoint.y) {
                bonusTileInVicinity = bonusPoint;
                break;
            }
        });

        if (bonusTileInVicinity !== null)
            break;
    });

    return bonusTileInVicinity;
}

function isShootingPathObstructed(pingu, enemy, axis, walls) {
    var isObstructed = false;
    walls.forEach(function(wall) {
        if (axis === "x" && wall.y === pingu.y) {
            if (pingu.direction === "right") {
                var xPointsInBetween = numberRange(pingu.x + 1, enemy.x);
                if (xPointsInBetween.indexOf(wall.x) !== -1) {
                    isObstructed = true;
                }
            } else if (pingu.direction === "left") {
                var xPointsInBetween = numberRange(enemy.x + 1, pingu.x);
                if (xPointsInBetween.indexOf(wall.x) !== -1) {
                    isObstructed = true;
                }
            }
        } else if (axis === "y" && wall.x === pingu.x) {
            if (pingu.direction === "top") {
                var yPointsInBetween = numberRange(enemy.y + 1, pingu.y);
                if (pointyPointsInBetweensInBetween.indexOf(wall.y) !== -1) {
                    isObstructed = true;
                }
            } else if (pingu.direction === "bottom") {
                var yPointsInBetween = numberRange(pingu.y + 1, enemy.y);
                if (yPointsInBetween.indexOf(wall.x) !== -1) {
                    isObstructed = true;
                }
            }
        }
    });

    return isObstructed;
}

// Survival


// Movement
function baseMovement(state) {
    direction = state.you.direction;
    nextPosition = {x: state.you.x, y: state.you.y};
    switch (direction) {
        case 'top':
            nextPosition.y = nextPosition.y - 1;
            break;
        case 'bottom':
            nextPosition.y = nextPosition.y + 1;
            break;
        case 'right':
            nextPosition.x = nextPosition.x + 1;
            break;
        case 'left':
            nextPosition.x = nextPosition.x - 1;
            break;
    }

    if (isTileSafe(nextPosition, state)) {
        // Move ahead if free tile
        return 'advance';
    } else {
        // Random rotation
        var rotation = ['rotate-left', 'rotate-right'];
        var rnd = Math.floor(Math.random() * 2);
        return rotation[rnd];
    }
}

function isTileSafe(point, state) {
    if(point.x == 0 || point.x == state.mapWidth) {
        return false;
    }

    if(point.y == 0 || point.y == state.mapHeight) {
        return false;
    }
    
    walls = state.walls;
    fires = state.fire;
    return isTileOpen(point, walls) && isTileOpen(point, fires);
}

function isTileOpen(point, items) {
    var isOpen = true;
    items.forEach(function(item) {
        if (item.x == point.x && item.y == point.y) {
            isOpen = false;
        }
    }, this);
    return isOpen;
}

function inWhichDirectionIsPoint(pingu, point) {
    var result = [];
    if (pingu.x < point.x) {
        result.push('right');
    }
    if (pingu.x > point.x) {
        result.push('left');
    }
    if (pingu.y < point.y) {
        result.push('bottom');
    }
    if (pingu.y > point.y) {
        result.push('top');
    }
    return result;
}

function amIWellOriented(pingu, point) {
    var directionOfPoint = inWhichDirectionIsPoint(pingu, point);
    if (directionOfPoint.indexOf('right') != -1 && pingu.direction == 'right') {
        return true;
    }
    if (directionOfPoint.indexOf('left') != -1 && pingu.direction == 'left') {
        return true;
    }
    if (directionOfPoint.indexOf('bottom') != -1 && pingu.direction == 'bottom') {
        return true;
    }
    if (directionOfPoint.indexOf('top') != -1 && pingu.direction == 'top') {
        return true;
    }
    return false;
}

function orientTo(pingu, point) {
    if (amIWellOriented(pingu, point)) {
        return null;
    }
    var directionOfPoint = inWhichDirectionIsPoint(pingu, point);
    if ((pingu.direction == 'top' && directionOfPoint.indexOf('right') != -1) ||
        (pingu.direction == 'right' && directionOfPoint.indexOf('bottom') != -1) ||
        (pingu.direction == 'bottom' && directionOfPoint.indexOf('left') != -1) ||
        (pingu.direction == 'left' && directionOfPoint.indexOf('top') != -1)) {
        return 'turn-right';
    }
    return 'turn-left';
}

function moveTo(pingu, point) {
    if (pingu.x == point.x && pingu.y == point.y) {
        return 'shoot';
    }
    if (!amIWellOriented(pingu, point)) {
        var orientResult = orientTo(point);
        if (orientResult) return orientResult;
    }
    return 'advance';
}

function calculateMove(state){
    // Controls
    var direction = state.you.direction;
    if(nextAction) {
        if(nextAction != direction) {
            return "rotate-right";
        }

        return "advance";
    }
    
    var commands = [
        "rotate-right",
        "rotate-left",
        "advance",
        "retreat",
        "shoot"
    ];

    if (shouldShoot(state)) {
        return commands[4];
    } else {
        //var powerUpPoint = powerUpInVicinity(state);
        var powerUpPoint = null;
        if (powerUpPoint) {
            //moveTo(powerUpPoint);
        } else {
            return baseMovement(state)
        }
    }

    // Fallback
    //var rnd = Math.floor(Math.random() * 5);
    //return commands[rnd];
}

function info(){
    return {
        name: "Joda",
        team: ":)"
    }
}

function action(state) {
    return {
        command: calculateMove(state)
    };
}

function getBody(req){
    switch(req.method){
        case 'GET':
            return info();
        case 'POST':
            return action(req.body);
        case 'PATCH':
            const previousAction = nextAction;
            nextAction = req.body.nextAction;
            return { nextAction, previousAction };
    }
}

module.exports = function (context, req) {

    context.log('JavaScript HTTP trigger function processed a request.', req.body);
    context.res = {
        body: getBody(req)
    };
    context.done();
};