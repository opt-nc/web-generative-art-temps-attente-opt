let url = "http://localhost:8081/temps-attente/agences/noumea";
let data;

let fps = 0;

let gravity;
let length;
let showNames;

let planets = [];

function preload(){
  loadJSON(url, gotData);
}

function gotData(json){
  data = json;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  for(let i = 0; i < Object.keys(data).length; i++) {
    let x = random(width);
    let y = random(height);
    let m = map(data[i].realMaxWaitingTimeMs, 0, 150000, 30, 200, true);
    planets[i] = new Planet(i, Object.keys(data).length, x, y, m, data[i].designation);
  }
  
  setInterval(refreshFPS, 1000);

  gravity = createSlider(0, 2, 0.3, 0.01);
  gravity.position(50, height - 50);
  gravity.style("width", "150px");

  length = createSlider(0, 200, 30, 1);
  length.position(50, height - 75);
  length.style("width", "150px");

  showNames = createCheckbox("Afficher les noms", false);
  showNames.position(45, height - 100);
  showNames.style("font-family","Arial");
  showNames.style("color","white");
}

function draw() {
  clear();
  for(let planet of planets){
    planet.update(length.value());
    planet.show(showNames.checked());
    planet.attract(planets, gravity.value());
  }

  showDate();
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}

function showDate(){
  push();

  translate(width/2, height/2);

  fill(255);
  stroke(255);
  moment.locale("fr");

  let date = moment().format("dddd").charAt(0).toUpperCase() + moment().format("dddd").slice(1);
  date += " " + moment().format("Do") + " " + moment().format("MMMM");
  textSize(32);
  text(date, -width/2.25+5, -height/3-80);

  textSize(64);
  let time = moment().format("HH:mm:ss");
  text(time, -width/2.25, -height/3);
  textSize(24);
  text("FPS: " + fps, -width/2.25+5, -height/3+50);

  pop();
}

function refreshFPS(){
  fps = parseInt(frameRate()); 
}