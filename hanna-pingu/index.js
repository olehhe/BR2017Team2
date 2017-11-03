function moveRandom(){
    var commands = ["rotate-right", "rotate-left", "advance", "retreat"];
    var rnd = Math.floor(Math.random() * 4);
    return commands[rnd];
}

function info(){
    return {
        name: "Pingusaur",
        team: "PinguTeam"
    }
}

function action(body) {
  return {
    command: moveRandom()
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