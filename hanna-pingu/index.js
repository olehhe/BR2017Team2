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
    your_penguin = map.you,
    opponent = (map.enemies && map.enemies[0]) || {},
    movement = movements[your_penguin.direction],
    opMovement = opponent.direction && movements[opponent.direction],
    nextField = { x: your_penguin.x + movement.x, y: your_penguin.y + movement.y },
    nextFieldOpponent = opMovement && { x: opponent.x + opMovement.x, y: opponent.y + opMovement.y },
    hasTarget = function (firingyour_penguin, targetPoint, maxDistance) {
        var distance, pointAtDistance,
            firingyour_penguinMovement = movements[firingyour_penguin.direction];
        if (!targetPoint || !targetPoint.x || !firingyour_penguin.y) {
            return false;
        }
        for (distance = 0; distance < (maxDistance || map.weaponRange); distance++) {
            pointAtDistance = { x: firingyour_penguin.x + (distance + 1) * firingyour_penguinMovement.x, y: firingyour_penguin.y + (distance + 1) * firingyour_penguinMovement.y };
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
        vertical = (your_penguin.y < opponent.y) ? 'top' : 'bottom';
        horizontal = (your_penguin.x < opponent.x) ? 'left' : 'right';
        vd = Math.abs(your_penguin.y - opponent.y);
        hd = Math.abs(your_penguin.x - opponent.x);
        if (hd < vd) {
            return horizontal;
        } else {
            return vertical;
        }
    },
    closeToBorder = function () {
        return outsideMap({x: your_penguin.x +  2 * movement.x, y: your_penguin.y +  2 * movement.y});
    },
    chasingAxis = getChasingAxis();

    if (hasTarget(your_penguin, opponent) || hasTarget(your_penguin, nextFieldOpponent)) {
        result = 'shoot';
    } else if (chasingAxis === your_penguin.direction) {
        if (wallAt(nextField)) {
            return 'shoot';
        } else if (outsideMap(nextField)) {
            result = turnRandom();
        } else if (hasTarget(opponent, nextField, 1)) {
            result = 'pass';
        } else {
            result = 'advance';
        }
    } else if (chasingAxis || closeToBorder() || wall(nextField) || outsideMap(nextField)) {
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