function turnRandom(){
    var commands = ["rotate-right", "rotate-left"];
    var rnd = Math.floor(Math.random() * 2);
    return commands[rnd];
}

function info(){
    return {
        name: "Pingusaur",
        team: "Pingumon"
    }
}

function action (req){
    var map = req.body,
    result,
    wallAt = function (point) {
        return map.walls.find(function (wall) {
            return wall.x === point.x && wall.y === point.y;
        });
    },
    movements = {
        top: { x: 0, y: -1 },
        left: { x: -1, y: 0 },
        bottom: {x: 0, y: 1},
        right: {x: 1, y: 0}
    },
    outsideMap = function (point) {
        return point.x < 0 || point.x >= map.mapWidth || point.y < 0 || point.y >= map.mapHeight;
    },
    penguin = map.you,
    opponent = (map.enemies && map.enemies[0]) || {},
    movement = movements[penguin.direction],
    opMovement = opponent.direction && movements[opponent.direction],
    nextField = { x: penguin.x + movement.x, y: penguin.y + movement.y },
    nextFieldOpponent = opMovement && { x: opponent.x + opMovement.x, y: opponent.y + opMovement.y },
    nextFieldOpponent2 = opMovement && { x: opponent.x + 2 * opMovement.x, y: opponent.y + 2 * opMovement.y },
    nextFieldOpponent3 = opMovement && { x: opponent.x + 3 * opMovement.x, y: opponent.y + 3 * opMovement.y },
    nextFieldOpponent4 = opMovement && { x: opponent.x + 4 * opMovement.x, y: opponent.y + 4 * opMovement.y },
    hasTarget = function (firingpenguin, targetPoint, maxDistance) {
        var distance, pointAtDistance,
            firingpenguinMovement = movements[firingpenguin.direction];
        if (!targetPoint || !targetPoint.x || !firingpenguin.y) {
            return false;
        }
        for (distance = 0; distance < (maxDistance || map.weaponRange); distance++) {
            pointAtDistance = { x: firingpenguin.x + (distance + 1) * firingpenguinMovement.x, y: firingpenguin.y + (distance + 1) * firingpenguinMovement.y };
            if (targetPoint.x == pointAtDistance.x && targetPoint.y == pointAtDistance.y) {
                return true;
            }
        }
        return false;
    },
    getChasingAxis = function () {
        var vertical, horizontal, vd, hd;
        if (!opponent.x) {
            return false;
        }
        vertical = (penguin.y < opponent.y) ? 'top' : 'bottom';
        horizontal = (penguin.x < opponent.x) ? 'left' : 'right';
        vd = Math.abs(penguin.y - opponent.y);
        hd = Math.abs(penguin.x - opponent.x);
        if (hd < vd) {
            return horizontal;
        } else {
            return vertical;
        }
    },
    closeToBorder = function () {
        return outsideMap({x: penguin.x +  2 * movement.x, y: penguin.y +  2 * movement.y});
    },
    chasingAxis = getChasingAxis();

    if (hasTarget(penguin, opponent) || hasTarget(penguin, nextFieldOpponent) || hasTarget(penguin, nextFieldOpponent2) || hasTarget(penguin, nextFieldOpponent3)  || hasTarget(penguin, nextFieldOpponent4)) {
        result = 'shoot';
    } else if (chasingAxis === penguin.direction) {
        if (wallAt(nextField)) {
            return 'shoot';
        } else if (outsideMap(nextField)) {
            result = turnRandom();
        } else if (hasTarget(opponent, nextField, 1)) {
            result = 'pass';
        } else {
            result = 'advance';
        }
    } else if (chasingAxis || closeToBorder() || wallAt(nextField) || outsideMap(nextField)) {
        result = turnRandom();
    } else {
        result = 'advance';
    }
    return {
        command: result
    };
}


function getBody(req){
    switch(req.method){
        case 'GET':
            return info();
        case 'POST':
            return action(req);
    }
}

module.exports = function (context, req) {

    context.log('JavaScript HTTP trigger function processed a request.', req.body);
    context.res = {
        headers: {
            "Access-Control-Allow-Origin": "*"  
        },
        body: getBody(req)
    };
    context.done();
};