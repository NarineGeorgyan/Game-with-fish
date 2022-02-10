const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const backgroundImg = document.createElement("img");
backgroundImg.src = "https://eskipaper.com/images/underwater-world-1.jpg";

const killerImg = document.createElement("img");
killerImg.src = "https://www.nicepng.com/png/full/283-2835603_finding-nemo-marlin-bruce-pixar-clip-art-bruce.png";
const meduzaImg = document.createElement("img");
meduzaImg.src = "https://clipart-best.com/img/jellyfish/jellyfish-clip-art-2.png";
const fishNemoImg = document.createElement("img");
fishNemoImg.src = "https://static.wixstatic.com/media/2cd43b_5f5a2eeb54ba47c2ac505f845cf6618c~mv2.png/v1/fill/w_320,h_275,fp_0.50_0.50/2cd43b_5f5a2eeb54ba47c2ac505f845cf6618c~mv2.png";

let data = {
  meduza: {
    xDelta: 2,
    yDelta: 3,
    x: random(0, canvas.width/2),
    y: random(0, canvas.width/5),
    width: 60,
    height: 75
  },
  killer: {
    xDelta: 0,
    yDelta: 0,
    x: canvas.height,
    y: 0,
    width: 100,
    height: 80,
    direction: 1,
    status: false
  },
  fish: [],
  score : 0,
  live: 3

};
var score = document.getElementById("score") 

var live = document.getElementById("live")  
function intersect(rect1, rect2) {
  const x = Math.max(rect1.x, rect2.x),
    num1 = Math.min(rect1.x + rect1.width, rect2.x + rect2.width),
    y = Math.max(rect1.y, rect2.y),
    num2 = Math.min(rect1.y + rect1.height, rect2.y + rect2.height);
  return (num1 >= x && num2 >= y);
}

function draw() {

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

  context.save();
  context.scale(data.killer.direction, 1);
  context.drawImage(killerImg, data.killer.x * data.killer.direction, data.killer.y, data.killer.width * data.killer.direction, data.killer.height);
  context.restore();

  data.fish.forEach(function(fishItem) {
    context.save();
    context.scale(fishItem.direction, 1);
    context.drawImage(fishNemoImg, fishItem.x * fishItem.direction, fishItem.y, fishItem.width * fishItem.direction, fishItem.height);
    context.restore();
  });

  context.drawImage(meduzaImg, data.meduza.x, data.meduza.y, data.meduza.width, data.meduza.height);

}

function update() {
  data.fish.forEach(function(fishItem) {
    if (fishItem.x + fishItem.width > canvas.width || fishItem.x < 0) {
      fishItem.xDelta *= -1;
    }
    if (fishItem.y + fishItem.height > canvas.height || fishItem.y < 0) {
      fishItem.yDelta *= -1;
    }
    fishItem.x += fishItem.xDelta;
    fishItem.y += fishItem.yDelta;

  });

  if (data.killer.x + data.killer.width > canvas.width || data.killer.x < 0) {
    data.killer.xDelta *= -1;

  }
  if (data.killer.y + data.killer.height > canvas.height || data.killer.y < 0) {
    data.killer.yDelta *= -1;
  }
  data.killer.x += data.killer.xDelta;
  data.killer.y += data.killer.yDelta;
}

function loop() {

  requestAnimationFrame(loop);
  draw();
  update();
  if  (data.meduza.x + data.meduza.width > canvas.width || data.meduza.x < 0) {
    data.meduza.xDelta *= -1;
  }
  if (data.meduza.y + data.meduza.height > canvas.height || data.meduza.y < 0) {
    data.meduza.yDelta *= -1;
  }
  data.meduza.x += data.meduza.xDelta;
  data.meduza.y += data.meduza.yDelta;
  if (intersect(data.killer, data.meduza)) {
    data.killer.deleteMe = true;
    data.killer.status = true;
    data.killer = Object.keys(data).filter(function(val) {

      return val !== "killer"


    });

    if (!data.killer.status) {
      setTimeout(function() {
      alert("GAME OVER!!!!!" + "Your score is" + " " + data.score);
        data.killer.draw();
      }, 1000);
    
    }
    
  }
}

loop()

function random(min, max) {
  return Math.floor(Math.random() * max - min) + min;
}

function addFishToOcean() {
  if (data.fish.length < 6)
    data.fish.push({
      width: 60,
      height: 60,
      x: Math.max(canvas.width - 60, 0),
      y: Math.max(Math.random() * canvas.height - 60, 0),

      xDelta: Math.max(random(-3, 3), 1),
      yDelta: Math.max(random(-3, 3), 0),
      direction: 1

    });

}

function killFish(){

    data.fish.forEach(function(fishItem) {
        if (intersect(data.killer, fishItem)) {
          data.score++;
   
  
          fishItem.deleteMe = true;
        }
      });
      data.fish = data.fish.filter(function(fishItem) {
        return fishItem.deleteMe !== true;
      });
  return data.score ;
}
document.addEventListener("keydown", function(evt) {
  if (evt.code === "ArrowRight") {
    data.killer.xDelta = 5;
    killFish();
    score.innerHTML = data.score;
 
  } else if (evt.code === "ArrowLeft") {
    data.killer.xDelta = -5;
    killFish();
 
    score.innerHTML = data.score;

  } else if (evt.code === "ArrowUp") {
    data.killer.yDelta = -5;
    killFish();
  
    score.innerHTML = data.score;

  } else if (evt.code === "ArrowDown") {
    data.killer.yDelta = 5;
    killFish();
 
    score.innerHTML = data.score;
  } else {

   data.killer.direction*=-1;
  }
});

document.addEventListener("keyup", function(evt) {
     
  data.killer.xDelta = 0;
  data.killer.yDelta = 0;
});
document.addEventListener("tab", function(evt) {
if(evt.keyCode === 9)
data.killer.direction*=-1;
   
  });

setInterval(addFishToOcean, 1000);
