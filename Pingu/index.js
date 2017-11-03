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
    var enemy = findClosestEnemy(pingu, opts.enemies, opts.visibility);
    
    if (!enemy) {
        return doSomethingRandom();
    }

    // Enemy in range! SHOOT TO KILL!
    var pinguX = pingu.x, pinguY = pingu.y;
    var enemyX = enemy.x, enemyY = enemy.y;
    
    var shouldShoot = false;
    if (pinguY === enemyY) {
        // Both on same Y-axis
        shouldShoot = ((pinguX < enemyX) && pingu.direction === 'right') 
            || ((pinguX > enemyX) && pingu.direction === 'left');
    } else if (pinguX === enemyX) {
        // Both on same X-axis
        shouldShoot = ((pinguY < enemyY) && pingu.direction === 'bottom')
            || ((pinguY > enemyY) && pingu.direction === 'top');
    }

    if (shouldShoot) {
        return commands.shoot;
    } else {
        return doSomethingRandom();
    }
}

// Utilities
function findClosestEnemy(you, enemies, fieldOfViewRadius) {
    var closestEnemy = null;
    enemies.array.forEach(function(enemy) {
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
        body = JSON.parse(body);
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
        }
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