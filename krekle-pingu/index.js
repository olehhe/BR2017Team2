var nextAction;

// Stats
function isStrongest(state) {
    strongest = true
    currentStrength = state.you.strength;
    state.enemies.forEach(function(enemy) {
        if (currentStrength < enemy.strength) {
             strongest = false;
        }
    });
    return strongest;
}


// Agressive
function distanceToEnemy(currentPosition, enemyPosition) {
    var distanceX = Math.abs(currentPosition.x - enemyPosition.x);
    var distanceY = Math.abs(currentPosition.y - enemyPosition.y);
    var distance = Math.sqrt(distanceX*distanceX + distanceY*distanceY);
    return distance;
}

function shouldShoot(state) {
    currentPosition = state.you;
    enemyPositions = state.enemies;

    var shoot = false;
    enemyPositions.forEach(function(enemy) {
        if (distanceToEnemy(currentPosition, enemy) < state.weaponRange) {
            switch (currentPosition.direction) {
                case "top":
                    shoot = enemy.x == currentPosition.x && enemy.y < currentPosition.y;
                    break;
                case "bottom":
                    shoot = enemy.x == currentPosition.x && enemy.y > currentPosition.y;
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

// Survival


// Movement
function turnAgainsPlayerLeftOrRight(state) {
    orientation = state.you.direction;
    currentPosition = {x: state.you.x, y: state.you.y};
    enemyPosition = {x: state.enemies[0].x, y: state.enemies[0].y};

    switch(orientation) {
        case "top":
            if (currentPosition.y == enemyPosition.y) {
                if (currentPosition.x > enemyPosition.x) {
                    return 'rotate-left';
                } else {
                    return 'rotate-right';
                }
            }
            break;
        case "bottom":
            if (currentPosition.y == enemyPosition.y) {
                if (currentPosition.x < enemyPosition.x) {
                    return 'rotate-left';
                } else {
                    return 'rotate-right';
                }
            }
            break;
        case "left":
            if (currentPosition.x == enemyPosition.x) {
                if (currentPosition.y > enemyPosition.y) {
                    return 'rotate-left';
                } else {
                    return 'rotate-right';
                }
            }
            break;
        case "right":
            if (currentPosition.x == enemyPosition.x) {
                if (currentPosition.y < enemyPosition.y) {
                    return 'rotate-left';
                } else {
                    return 'rotate-right';
                }
            }
            break;
        default:
            return null;
    }
}

function baseMovement(state) {
    // if stronger -> turn
    if (isStrongest(state)) {
        turnTowardPenguin = turnAgainsPlayerLeftOrRight(state);
        if (turnTowardPenguin) {
            return turnTowardPenguin;
        }
    }

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
        var rotation = ['rotate-left', 'rotate-right', 'shoot'];
        var rnd = Math.floor(Math.random() * 3);
        return rotation[rnd];
    }
}

function isTileSafe(point, state) {
    if(point.x < 0 || point.x === state.mapWidth) {
        return false;
    }

    if(point.y < 0 || point.y === state.mapHeight) {
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
        return baseMovement(state)
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