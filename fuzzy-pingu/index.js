function doSomething(body) {

    var commands = ["rotate-right", "rotate-left"];
    var rnd = Math.floor(Math.random() * 2);

    var self = body.you; 
    var enemy = body.enemies[0];
    
    if(shouldFire(body, self, enemy))
        return "shoot";
    
    if(shouldFlee(body, self, enemy)){
      self.direction = prependicular(self.direction);
      return !willCollide(body, self, enemy) ? "retreat" : "advance";
    }

    if(!willCollide(body, self, enemy))
      return "advance";

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
        inRange(body, self, enemy) &&
        inSightOfFire(body, self, enemy);
}

function shouldFlee(body, self, enemy) {
    return itBurns(body, self, enemy) || 
        (isStronger(body, enemy, self) &&
        inRange(body, self, enemy));
}

function isStronger(body, self, enemy) {
    return self.strength > enemy.strength;
}

function inSightOfFire(body, self, enemy) {
  return self.x === enemy.x || self.y === enemy.y;
}

function inRange(body, self, enemy) {
  return Math.abs(self.x - enemy.x) <= self.weaponRange ||
    Math.abs(self.y - enemy.y) <= self.weaponRange;
}

function getRightDirection(body, self, enemy) {
  if(self.x === enemy.x){
    if(self.y < enemy.y)
      return 'top';
    return 'bottom';
  }
  if(self.y === enemy.y){
    if(self.x < enemy.x)
      return 'right';
    return 'left';
  }
}

function standingInFire(alreadyBurnt, fire, self){
  return alreadyBurnt || (self.x === fire.x && self.y == fire.y);
}

function itBurns(body, self, enemy) {
  return body.fire.reduce((burnt, fire) => standingInFire(burnt, fire, self), false);
}

function willCollide(body, self, enemy) {
  return body.walls.reduce((collided, wall) => collision(collided, self, wall), false);
}

function collision(collided, self, wall) {
  return collided || collisionMap[self.direction](self, wall);
}

var prependicular = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left"
}

var collisionMap = {
  top: (body, self, wall) => self.y - 1 === wall.y && self.y - 1 > -1,
  bottom: (body, self, wall) => self.y + 1 === wall.y && self.y + 1 <= body.mapHeight,
  left: (body, self, wall) => self.x - 1 === wall.y && self.x -1 > -1,
  right: (body, self, wall) => self.x + 1 === wall.y && self.x + 1 <= body.mapWidth
};

function isWithinMap()