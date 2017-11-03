var nextAction;

function doSomethingRandom(state){
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
    var rnd = Math.floor(Math.random() * 5);

    return commands[rnd];
}

function info(){
    return {
        name: "Pingusaur",
        team: "PinguTeam"
    }
}

function action(state) {
    return {
        command: doSomethingRandom(state)
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
};function getBody(req){
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