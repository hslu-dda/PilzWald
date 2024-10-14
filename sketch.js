var socket;

let data = [];
let systems = [];

let yScalePlant = d3.scalePoint();
let yScaleFungi = d3.scalePoint();
let vScaleConnection = d3.scaleSqrt();
let cScale = d3.scaleOrdinal();
let colScale = d3.scaleSequential();
let strokeScale = d3.scaleSqrt();

let v1;
let v2;

let yPlant;
let xFungi;
let yFungi;
let imageArray;
let currentImage = 0;

let limitParticles = true;
let limit = 50;
let debugView = false;
let mask;
let offScreen;

let particleImage;
let images = [];

let corners = [
  {
    x: 0,
    y: 0,
  },
  {
    x: 2556,
    y: 11,
  },
  {
    x: 2509,
    y: 1371,
  },
  {
    x: 56,
    y: 1388,
  },
];

function setup() {
  pixelDensity(1);
  createCanvas(windowWidth, windowHeight);
  updateMask();
  select("canvas").style("border", "none");

  "#E8C9FF", // Button 1
    "#8DD8FF", // Button 2
    "#7FFF99", // Button 3 (more green)
    "#FFEE80", // Button 4 (more yellow)
    "#FFB073", // Button 5
    "#FF7373", // Button 6
    "#D86AFF", // Button 7
    "#73B2FF", // Button 8
    (particleImage = loadImage("E8C9FF.png"));
  images.push(particleImage);

  particleImage = loadImage("8DD8FF.png");
  images.push(particleImage);

  particleImage = loadImage("7FFF99.png");
  images.push(particleImage);

  particleImage = loadImage("FFEE80.png");
  images.push(particleImage);

  particleImage = loadImage("FFB073.png");
  images.push(particleImage);

  particleImage = loadImage("FF7373.png");
  images.push(particleImage);

  particleImage = loadImage("D86AFF.png");
  images.push(particleImage);

  particleImage = loadImage("73B2FF.png");
  images.push(particleImage);

  offScreen = createGraphics(windowWidth / 2, windowHeight / 2);

  //socket = socket.io.connect('http://localhost:3000');
  socket = io.connect("https://dda-miflck.herokuapp.com/");

  // Callback function
  socket.on("message", (data) => {
    console.log("callback from server", data);
    switch (data) {
      case 0:
        background(4, 47, 16);
        currentImage = 0;
        for (let i = 0; i < systems.length; i++) {
          if (systems[i].module == currentImage) {
            systems[i].deleteParticles();
          }
        }
        break;
    }
    switch (data) {
      case 1:
        background(4, 47, 16);
        currentImage = 1;
        for (let i = 0; i < systems.length; i++) {
          if (systems[i].module == currentImage) {
            systems[i].deleteParticles();
          }
        }

        break;
    }
    switch (data) {
      case 2:
        background(4, 47, 16);
        currentImage = 2;
        for (let i = 0; i < systems.length; i++) {
          if (systems[i].module == currentImage) {
            systems[i].deleteParticles();
          }
        }
        break;
    }
    switch (data) {
      case 3:
        background(4, 47, 16);
        currentImage = 3;
        for (let i = 0; i < systems.length; i++) {
          if (systems[i].module == currentImage) {
            systems[i].deleteParticles();
          }
        }
        break;
    }
    switch (data) {
      case 4:
        background(4, 47, 16);
        currentImage = 4;
        for (let i = 0; i < systems.length; i++) {
          if (systems[i].module == currentImage) {
            systems[i].deleteParticles();
          }
        }
        break;
    }
    switch (data) {
      case 5:
        background(4, 47, 16);
        currentImage = 5;
        for (let i = 0; i < systems.length; i++) {
          if (systems[i].module == currentImage) {
            systems[i].deleteParticles();
          }
        }
        break;
    }
    switch (data) {
      case 6:
        background(4, 47, 16);
        currentImage = 6;
        for (let i = 0; i < systems.length; i++) {
          if (systems[i].module == currentImage) {
            systems[i].deleteParticles();
          }
        }
        break;
    }
    switch (data) {
      case 7:
        background(4, 47, 16);
        currentImage = 7;
        for (let i = 0; i < systems.length; i++) {
          if (systems[i].module == currentImage) {
            systems[i].deleteParticles();
          }
        }
        break;
    }
    switch (data) {
      case 8:
        background(4, 47, 16);
        currentImage = 8;
        for (let i = 0; i < systems.length; i++) {
          if (systems[i].module == currentImage) {
            systems[i].deleteParticles();
          }
        }
        break;
    }
  });

  // gets called when new client arrives
  socket.on("client connected", (data) => {
    console.log("client added", data);
  });
  generateSystems();
  noStroke();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  offScreen = createGraphics(windowWidth / 2, windowHeight / 2);
  console.log("resize!", windowWidth, windowHeight);

  generateSystems();
  updateMask();
}

function generateRandomY() {
  yFungi = random(50, windowHeight - 50);
  if (yFungi > windowHeight / 2 - 50 && yFungi < height / 2 + 50) {
    yFungi = generateRandomY(); // recursively generate another random y value
  }
  return yFungi;
}

function generateSystems() {
  d3.csv("Matrix97.csv", d3.autoType).then((csv, error) => {
    systems = [];
    data = [];
    data = csv;
    console.log("data", data.length);

    let plant = data.map(function (d) {
      return d.Plant;
    });

    let fungi = data.map(function (d) {
      return d.Fungi;
    });

    let module = data.map(function (d) {
      return d.Module;
    });

    let fun = data.map(function (d) {
      return d.Function;
    });

    let connection = data.map(function (d) {
      return d.Connection;
    });

    minS = d3.min(connection);
    maxS = d3.max(connection);

    let plants = _.uniq(plant);
    let fungis = _.uniq(fungi);
    modules = _.uniq(module);
    let functions = _.uniq(fun);

    //console.log(plants);
    //console.log(fungis);
    //console.log(modules);
    //console.log(functions);

    yScalePlant = d3
      .scalePoint()
      .domain(plants)
      .range([150, windowWidth - 150]);
    yScaleFungi = d3
      .scalePoint()
      .domain(fungis)
      .range([20, windowHeight - 20]);
    cScale = d3.scaleOrdinal().domain([1, 2, 3, 4, 5, 6, 7, 8]).range([
      "#E8C9FF", // Button 1
      "#8DD8FF", // Button 2
      "#7FFF99", // Button 3 (more green)
      "#FFEE80", // Button 4 (more yellow)
      "#FFB073", // Button 5
      "#FF7373", // Button 6
      "#D86AFF", // Button 7
      "#73B2FF", // Button 8
    ]);

    strokeScale.domain([minS, maxS]).range([2, 10]);

    for (let i = 0; i < data.length; i++) {
      let plant = data[i].Plant;
      let fungi = data[i].Fungi;
      let functions = data[i].Function;
      let modules = data[i].Module;

      let xPlant = yScalePlant(plant);
      yPlant = windowHeight / 2;
      // yFungi = constrain(random(50, height-50), height/2-50, height/2+50);
      yFungi = generateRandomY();
      xFungi = random(50, windowWidth - 50);
      //let yFungi = yScaleFungi(fungi);
      //let s = data[i].Connection * 0.9;
      let s = strokeScale(data[i].Connection);
      console.log("mod", modules);
      let c = cScale(modules);

      v1 = createVector(xPlant, yPlant);
      v2 = createVector(xFungi, yFungi);

      let tImg = createImage(10, 10);
      tImg.copy(
        particleImage,
        0,
        0,
        particleImage.width,
        particleImage.height,
        0,
        0,
        particleImage.width,
        particleImage.height
      );
      //tImg.tint(255,0,0)
      let ps = new ParticleSystem(v1, v2, s, c, modules, images[modules - 1]);

      systems.push(ps);
    }
    console.log("systems!", systems.length);
  });
}

function draw() {
  background(0, 10);

  for (let i = 0; i < data.length; i++) {
    if (data[i].Module == currentImage) {
      let n = 20;
      if (data[i].Function == "AM") {
        n = 20;
      }
      if (data[i].Function == "Unknown") {
        n = 40;
      }
      if (data[i].Function == "EcM") {
        n = 10;
      }
      if (frameCount % n == 0) {
        // systems[i].addParticle();
        systems[i].addParticle();
      }
    }
  }

  for (let i = 0; i < systems.length; i++) {
    if (systems[i].module == currentImage) {
      systems[i].run();
    }
  }

  for (let i = 0; i < data.length; i++) {
    let plant = data[i].Plant;
    let fungi = data[i].Fungi;
    let modules = data[i].Module;
    let functions = data[i].Function;

    let xPlant = yScalePlant(plant);
    //let yFungi = yScaleFungi(fungi);
    let c = cScale(modules);
    let col = colScale(modules);

    stroke(255);
    noFill();
    ellipse(xPlant, yPlant, 1);

    if (modules == currentImage) {
      fill(255);
      ellipse(xPlant, yPlant, 10);
    }
  }

  // Apply the mask
  image(mask, 0, 0);

  if (debugView) {
    // Draw the corners for reference
    fill(0, 255, 0);
    for (let i = 0; i < corners.length; i++) {
      ellipse(corners[i].x, corners[i].y, 10, 10);
      text(i + 1, corners[i].x + 15, corners[i].y + 15);
    }

    fill(0);
    rect(20, 20, 100, 50);
    fill(255, 0, 0);

    text(frameRate(), 50, 50);
  }
}

function updateMask() {
  mask = createGraphics(width, height);
  mask.fill(0);
  mask.rect(0, 0, width, height);
  mask.erase();
  mask.beginShape();
  for (let corner of corners) {
    mask.vertex(corner.x, corner.y);
  }
  mask.endShape(CLOSE);
  mask.noErase();
}

function keyPressed() {
  if (key >= "1" && key <= "4") {
    let index = int(key) - 1;
    corners[index] = { x: mouseX, y: mouseY };
    updateMask();
  } else if (key === "s" || key === "S") {
    saveJSON(corners, "corners.json");
    console.log("Corners saved to corners.json");
  }

  if (key == "d") {
    debugView = false;
  }
  if (key == "D") {
    debugView = true;
  }

  if (key == "l") {
    limitParticles = false;
  }
  if (key == "L") {
    limitParticles = true;
  }
}

class ParticleSystem {
  constructor(v1, v2, s, c, modules, img) {
    this.start = v2; //.mult(1/2);
    this.end = v1; //.mult(1/2);
    this.particles = [];
    this.stroke = s; //2;
    this.color = c;
    this.module = modules;
    this.img = img;
  }

  deleteParticles() {
    this.particles = [];
  }

  addParticle() {
    if (limitParticles) {
      if (this.particles.length < limit) {
        let p = new Particle(this.end, this.start, this.stroke, this.color, this.module);
        this.particles.push(p);
      }
    } else {
      let p = new Particle(this.end, this.start, this.stroke, this.color, this.module);
      this.particles.push(p);
    }
    // fill(this.color);
    // ellipse(this.start.x, this.start.y, 3);
  }
  run() {
    push();
    fill(this.color);
    ellipse(this.start.x, this.start.y, 3);
    // scale(2)

    for (let i = 0; i < this.particles.length; i++) {
      let p = this.particles[i];
      //if (i % 3 === frameCount % 3) {

      p.update();
      //         }
      //p.display();

      // Determine which half of particles to render this frame
      if (i % 2 === frameCount % 2) {
        //  scale(2)
        // p.display();
        //image(this.img, 0, 0);
        push();
        translate(p.pos.x, p.pos.y);
        scale(this.stroke / 10);
        image(this.img, 0, 0);
        pop();
      }

      /*push();
      translate(p.pos.x, p.pos.y);
      // scale(10);
      image(this.img, 0, 0);
      pop();*/
      if (p.isDead()) {
        this.particles.splice(i, 1);
      }

      if (p.hasReachedEnd()) {
        this.particles.splice(i, 1);
      }
    }
    pop();
  }
}

class Particle {
  constructor(v1, v2, s, c, modules, img) {
    this.start = v2;
    this.end = v1;
    this.maxSpeed = 1;
    this.maxForce = 0.1;
    this.vel = createVector(0, 0);
    this.acc = createVector(1, 1);
    this.v = p5.Vector.sub(this.end, this.start);
    this.v.setMag(this.maxSpeed);
    this.vel = this.v;
    this.lifespan = 60;
    this.stroke = s;
    this.pos = this.start.copy();
    this.color = c;
    this.n = 3;
    let distance = dist(this.start.x, this.start.y, this.end.x, this.end.y);
    this.weg = this.n / distance;
    this.module = modules;
    this.hasReached = false;

    //console.log(this.weg);
  }

  update() {
    this.n = this.n - this.weg;

    if (this.n < 0.5) {
      let f = p5.Vector.sub(this.end, this.pos);
      f.setMag(this.maxSpeed);
      this.vel = f;
      this.n = 0;
    }

    let noiseValue = noise(this.pos.x * 0.1, this.pos.y * 0.1);
    let theta = map(noiseValue, 0, 1, -this.n, this.n);

    this.pos.y += theta;
    this.pos.x += theta;

    this.pos.add(this.vel);
    let dist = p5.Vector.sub(this.end, this.pos);
    if (dist.mag() < 0.1) {
      this.hasReached = true;
    }

    this.lifespan = this.lifespan - 1;
  }

  display() {
    fill(this.color);

    noStroke();
    ellipse(this.pos.x, this.pos.y, this.stroke);
  }

  isDead() {
    return this.module !== currentImage;
  }

  hasReachedEnd() {
    return this.hasReached;
  }
}
