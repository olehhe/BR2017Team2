function doSomething(body) {

    var commands = ["rotate-right", "rotate-left", "advance"];
    var rnd = Math.floor(Math.random() * 3);

    var self = body.you; 
    var enemy = body.enemies[0];
    
    if(shouldFire(body, self, enemy));
        return "shoot";
    
    if(shouldFlee(body, self, enemy))
        return "retreat";

    return commands[rnd]
}

function info() {
  return {
    name: "Mr. Fuzzybird",
    team: "The best team"
  };
} 

function action(body) {
  return {
    command: doSomething(body)
  };
}

function getBody(req) {
  switch (req.method) {
    case "GET":
      return info();
    case "POST":
      return action(req.body);
  }
}

module.exports = function(context, req) {
  context.log(
    "JavaScript HTTP trigger function processed a request.",
    req.body
  );
  context.res = {
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: getBody(req)
  };
  context.done();
};

function shouldFire(body, self, enemy) {
    return isStronger(body, self, enemy) && 
        (inRange(body, self, enemy) &&
        inSightOfFire(body, self, enemy));
}

function shouldFlee(body, self, enemy) {
    return itBurns(body, self, enemy) || 
        (!isStronger(body, self, enemy) &&
        inRange(body, self, enemy));
}

function isStronger(body, self, enemy) {
    return enemy.x && self.strength > self.strength;
}

function inSightOfFire(body, self, enemy) {
  return self.x === enemy.x || self.y === enemy.y;
}

function inRange(body, self, enemy) {
  return (
    Math.abs(self.x - enemy.x) <= self.weaponRange ||
    Math.abs(self.y - enemy.y) <= self.weaponRange
  );
}

function itBurns(body, self, enemy) {
  return body.fire.reduce(
    (acc, next) => (next.x === self.x && next.y === self.y) || acc
  );
}

function willCollide(body, self, enemy) {
  return body.walls.reduce(
    (acc, next) => collisionMap[self.direction](self, body.wall) || acc
  );
}

var collisionMap = {
  top: (self, wall) => self.y + 1 === wall.y,
  bottom: (self, wall) => self.y - 1 === wall.y,
  left: (self, wall) => self.x - 1 === wall.y,
  right: (self, wall) => self.x + 1 === wall.y
};
