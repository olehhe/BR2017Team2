var nextAction;

// Agressive
function distanceToEnemy(currentPosition, enemyPosition) {
    distanceX = Math.abs(currentPosition.x - enemyPosition.x)
    distanceY = Math.abs(currentPosition.y - enemyPosition.y)
    distance = Math.sqrt(distanceX*distanceX + distanceY*distanceY);
    return distance;
}

function shouldShot(currentPosition, enemyPositions) {
    enemyPositions.forEach(function(enemy) {
        if (distanceToEnemy(currentPosition, enemy) < 3) {
            shoot = false
            switch (currentPosition.direction) {
                case "top":
                shoot = enemy.x == currentPosition.x && enemy.y > currentPosition.y
                break;
                case "bottom":
                shoot = enemy.x == currentPosition.x && enemy.y < currentPosition.y
                break;
                case "left":
                shoot = enemy.y == currentPosition.y && enemy.x < currentPosition.x
                break;
                case "right":
                shoot = enemy.y == currentPosition.y && enemy.x > currentPosition.x
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

function calculateMove(state){
    // Controle
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

    if (shouldShot(state.you, state.enemyPositions)) {
        return commands[4];
    }

    // Fallback
    var rnd = Math.floor(Math.random() * 5);
    return commands[rnd];
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