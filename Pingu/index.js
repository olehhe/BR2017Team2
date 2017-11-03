function doSomethingRandom(){
    var commands = [
        "rotate-right",
        "rotate-left",
        "advance",
        "retreat",
        "shoot"
    ];
    var rnd = Math.floor(Math.random() * 5);

    return commands[rnd];
}

function info(){
    return {
        name: "Mr. Randombird",
        team: "The best team"
    }
}

function action (body){

    // Get battle-state of pingu the unbroken
    matchOpts = {
        matchId: body.matchId, // unik kamp-ID 
        mapWidth: body.mapWidth,
        mapHeight: body.mapHeight,
        suddenDeath: body.suddenDeath, // antall runder til sudden death starter
        wallDamage: body.wallDamage, // hvor mye skade som pingvinen tar av å gå inn i veggen
        penguinDamage: body.penguinDamage, // hvor mye skade pingvinen tar av å krasje med en annen pingvin -- også hvor mye skade pingvinen din gjør på veggen når den krasjer med den
        weaponDamage: body.weaponDamage, // hvor mye skade pingvinen tar av å bli skutt
        visibility: body.visibility, // avstanden i felt du kan se på radaren
        weaponRange: body.weaponRange, // avstranden i felt pingvinens laser rekker
        you: body.PENGUIN, // informasjon om din pingvin -- se pingvinstrukturen nedenfor
        enemies: body.enemies, // array. fiendlige pingviner. se struktur nedenfor
        bonusTiles: body.bonusTiles, //array. felter som inneholder bonuser. se bonusstruktur nedenfor
        walls: body.walls, // array. synlige vegger. se vegg-struktur nedenfor
        fire: body.fire, // array, synlige felt som brenner
        command: doSomethingRandom
    };

    return matchOpts;

    /*return {
            command: doSomethingRandom()
            };*/
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
        body: getBody(req)
    };
    context.done();
};