var nextAction;

// Agressive
function distanceToEnemy(currentPosition, enemyPosition) {
    var distanceX = Math.abs(currentPosition.x - enemyPosition.x);
    var distanceY = Math.abs(currentPosition.y - enemyPosition.y);
    var distance = Math.sqrt(distanceX*distanceX + distanceY*distanceY);
    return distance;
}

function shouldShot(state) {
    currentPosition = state.you;
    enemyPositions = state.enemies;

    enemyPositions.forEach(function(enemy) {
        if (distanceToEnemy(currentPosition, enemy) < state.visibility) {
            var shoot = false;
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
            if (shoot) {
                return true;
            }
        }
    }, this);
    
    return false;
}

// Survival


// Movement
function baseMovement(state) {
    direction = state.you.direction;
    nextPosition = {x: state.you.x, y: state.you.y};
    switch (direction) {
        case 'top':
            nextPosition.y--;
            break;
        case 'bottom':
            nextPosition.y++;
            break;
        case 'right':
            nextPosition.x++;
            break;
        case 'left':
            nextPosition.x--;
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
    items.forEach(function(item) {
        if (item.x == point.x && item.y == point.y) {
            return false;
        }
    }, this);
    return true;
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

    if (shouldShot(state)) {
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