// Globals
var commands = {
    rotateright: "rotate-right",
    rotateleft: "rotate-left",
    advance: "advance",
    retreat: "retreat",
    shoot: "shoot"
};

function doSomethingRandom(){
    var _commands = [
        "rotate-right",
        "rotate-left",
        "advance",
        "retreat",
        "shoot"
    ];
    var rnd = Math.floor(Math.random() * 5);

    return _commands[rnd];
}

function info(){
    return {
        name: "Mr. Randombird",
        team: "The best team"
    }
}

function calculateAction(opts) {
    var pingu = opts.you;

    var shouldShoot = shouldShoot(pingu, opts.enemies);
    if (shouldShoot) {
        return 'shoot';
    } else {
        return doSomethingRandom();
    }
}

function shouldShoot(currentPosition, enemyPositions) {
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

// Utilities
function findClosestEnemy(you, enemies, fieldOfViewRadius) {
    var closestEnemy = null;
    enemies.forEach(function(enemy) {
        enemyIsInRange = (enemy.x < you.x + fieldOfViewRadius) && (enemy.y < you.y + fieldOfViewRadius);

        if (enemyIsInRange) {
            // Is enemy closer than the previous?
            if ((enemy.x + enemy.y) < (closestEnemy.x + closestEnemy.y)) {
                closestEnemy.x = enemy.x;
                closestEnemy.y = enemy.y;
            }
        }
    }, this);

    return closestEnemy;
}

function action (body){

    // Get battle-state of pingu the unbroken
    if (body) {
    //    body = JSON.parse(body);
        /*var matchOpts = {
            matchId: body.matchId, // unik kamp-ID 
            mapWidth: body.mapWidth,
            mapHeight: body.mapHeight,
            suddenDeath: body.suddenDeath, // antall runder til sudden death starter
            wallDamage: body.wallDamage, // hvor mye skade som pingvinen tar av å gå inn i veggen
            penguinDamage: body.penguinDamage, // hvor mye skade pingvinen tar av å krasje med en annen pingvin -- også hvor mye skade pingvinen din gjør på veggen når den krasjer med den
            weaponDamage: body.weaponDamage, // hvor mye skade pingvinen tar av å bli skutt
            visibility: body.visibility, // avstanden i felt du kan se på radaren
            weaponRange: body.weaponRange, // avstranden i felt pingvinens laser rekker
            you: body.you, // informasjon om din pingvin -- se pingvinstrukturen nedenfor
            enemies: body.enemies, // array. fiendlige pingviner. se struktur nedenfor
            bonusTiles: body.bonusTiles, //array. felter som inneholder bonuser. se bonusstruktur nedenfor
            walls: body.walls, // array. synlige vegger. se vegg-struktur nedenfor
            fire: body.fire, // array, synlige felt som brenner
            command: doSomethingRandom()
        };*/

        var action = calculateAction(body);

        return {
            command: action
        };
    }

    return {
        command: doSomethingRandom()
    };
}

function getBody(req){
    switch(req.method){
        case 'GET':
            return info();
        case 'POST':
            return action(req.body);
    }
}

module.exports = function (context, req) {

    context.log('JavaScript HTTP trigger function processed a request.', req.body);
    context.res = {
        body: getBody(req)
    };
    context.done();
};