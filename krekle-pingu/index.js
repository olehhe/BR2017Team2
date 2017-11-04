var nextAction;

// Stats
function isStrongest(state) {
    strongest = true
    currentStrength = state.you.strength + state.you.weaponRange + state.you.weaponDamage;
    state.enemies.forEach(function(enemy) {
        if (currentStrength < enemy.strength + enemy.weaponRange + enemy.weaponDamage) {
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
function turnTo(state) {
    
    // Enemy
    if (isStrongest(state)) {
        enemyPosition = {x: state.enemies[0].x, y: state.enemies[0].y};
        enemyTurn = turnAgainsStuffLeftOrRight(state, enemyPosition); 
        if (enemyTurn) {
            return enemyTurn;
        } 
    }
    
    // Bonus
    var closest = { distance: null, bonus: null, turn: null};
    var bonuses = state.bonusTiles.forEach((bonus) => {
        var bonusPos = { x: bonus.x, y: bonus.y };
        var distance = distanceToEnemy({ x: state.you.x, y: state.you.y }, bonusPos);
        
        if(distance < 4 && (closest.distance == null || distance < closest.distance))
            closest = { distance, bonus, turn: turnAgainsStuffLeftOrRight(state, bonusPos)};
    });
    
    return closest.turn == null && closest.bonus != null ? 
        shootOrAdvance(state) : null;
}

function shootOrAdvance(state) {
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
    }

    if(nextPosition.x >= 0 && nextPosition.x <= state.mapWidth 
        && nextPosition.y >= 0 && nextPosition.y <= state.mapHeight) {
            return 'shoot';
        }
}


function turnAgainsStuffLeftOrRight(state, stuff) {
    orientation = state.you.direction;
    currentPosition = {x: state.you.x, y: state.you.y};

    switch(orientation) {
        case "top":
            if (currentPosition.y == stuff.y) {
                if (currentPosition.x > stuff.x) {
                    return 'rotate-left';
                } else if (currentPosition.x < stuff.x) {
                    return 'rotate-right';
                }
            }
            break;
        case "bottom":
            if (currentPosition.y == stuff.y) {
                if (currentPosition.x < stuff.x) {
                    return 'rotate-left';
                } else if (currentPosition.x > stuff.x)  {
                    return 'rotate-right';
                }
            }
            break;
        case "left":
            if (currentPosition.x == stuff.x) {
                if (currentPosition.y > stuff.y) {
                    return 'rotate-right';
                } else if (currentPosition.y < stuff.y) {
                    return 'rotate-left';
                }
            }
            break;
        case "right":
            if (currentPosition.x == stuff.x) {
                if (currentPosition.y < stuff.y) {
                    return 'rotate-right';
                } else if (currentPosition.y > stuff.y) {
                    return 'rotate-left';
                }
            }
            break;
        default:
            return null;
    }
}

function noCombatTurn(direction, state) {
    positionX = state.you.x;
    positionY = state.you.y;

    height = state.mapHeight;
    width = state.mapWidth;

    switch (direction) {
        case 'top':
            if (positionX > width / 2) {
                return 'rotate-left';
            }
            return 'rotate-right';
        case 'bottom':
            if (positionX > width / 2) {
                return 'rotate-right';
            }
            return 'rotate-left';
        case 'right':
            if (positionY > height / 2) {
                return 'rotate-left';
            }
            return 'rotate-right';
        case 'left':
            if (positionY > height / 2) {
                return 'rotate-right';
            }
            return 'rotate-left';
    }
}

function baseMovement(state) {
    // Turn - for enemy or bonus
    turnToward = turnTo(state);
    if (turnToward) {
        return turnToward;
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
        //return noCombatTurn(direction, state);
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