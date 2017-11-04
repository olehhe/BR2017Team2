var nextCommand;

function doSomethingRandom(state){
    const direction = state.you.direction;

    if(nextCommand) {
        var splat = nextCommand.split('_');
        var action = splat[1];

        if(splat[0] == 'move') {
            if(action != direction) {
                if(direction == 'top' && action == 'left' 
                || direction == 'bottom' && action == 'right'
                || direction == 'left' && action == 'down'
                || direction == 'right' && action == 'top'){
                    return "rotate-left";
                }

                return "rotate-right";
            }

            return "advance";
        }

        return action;
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
        name: "Neida",
        team: ":("
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
            const previousAction = nextCommand;
            nextCommand = req.body.nextCommand;
            return { nextCommand, previousAction };
    }
}

module.exports = function (context, req) {

    context.log('JavaScript HTTP trigger function processed a request.', req.body);
    context.res = {
        body: getBody(req)
    };
    context.done();
};