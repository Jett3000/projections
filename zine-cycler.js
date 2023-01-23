// authored by jett pavlica 1/22/23
// major shoutout to Marian Veteanu for the scenemanager library!

// manager
var mgr;
var sceneLength = 300; // frames per scene

// prism pictures
var beasleyPic;
var eakesPic;
var powellPic;
var banPic;
var moranPic;
var knegoPic;
var leePic;
var headPic;

// precalculated points of a pentagon
var pentaPoints = [];

// support classes
class PackedPentagon {
    constructor() {
        this.regen();
    }

    // give the pentagon a random position on the screen,
    // reset radius and growing state, and record frameCount
    regen() {
        this.pos = createVector(random(width), random(height));
        this.rad = 1;
        this.angle = random(TWO_PI);
        this.growing = true;
        this.startFrame = frameCount;
    }

    // if the pentagon is still growing, increase radius
    // and check for collisions
    step(pentagons) {
        if (this.growing) {
            this.rad++;
            for (let other of pentagons) {
                if (other != this &&
                    (other.rad + this.rad) > this.pos.dist(other.pos) * 2) {
                    this.growing = false;
                    other.growing = false
                    return;
                }
            }
        }
    }

    // translate to the pentagon position, scale by radius
    // draw shape w/ precomputed pentagon points
    show() {
        if (this.rad < 16 && !this.growing) {
            return;
        }

        push();
        translate(this.pos.x, this.pos.y);
        scale(this.rad);
        rotate(this.angle);
        beginShape()
        for (var point of pentaPoints) {
            vertex(point.x, point.y);
        }
        endShape(CLOSE);
        pop();
    }
}

class GlassPentagon {
    constructor() {
        this.pos = createVector(random(width), random(height));
        this.vel = p5.Vector.random2D()
            .mult(random(1, 3));
        this.col = random(["#0000977C", "#0048007C", "#DA00007C"]);
        this.noiseOffset = random(999);
    }

    step() {
        // add velocity to position to simmulate movement
        this.pos.add(this.vel);

        // bounce off walls if out of bounds
        if (this.pos.x < 0 || this.pos.x > width) {
            this.vel.x *= -1;
        }
        if (this.pos.y < 0 || this.pos.y > height) {
            this.vel.y *= -1;
        }
    }

    show() {
        push();
        translate(this.pos.x, this.pos.y);
        scale(120);
        rotate(2 * TWO_PI * noise(this.noiseOffset + (frameCount / 300)));
        fill(this.col);
        beginShape();
        for (var point of pentaPoints) {
            vertex(point.x, point.y);
        }
        endShape();
        pop();
    }
}

function preload() {
    let currImage;

    beasleyPic = loadImage('img/derrick-beasley-prism.png');

    eakesPic = loadImage('img/cwe-prism.png');

    powellPic = loadImage('img/jermaine-powell-prism.png');

    banPic = loadImage('img/ban-artwork-prism.png');

    moranPic = loadImage('img/mailande-moran-prism.png');

    knegoPic = loadImage('img/samir-knego-prism.png');

    leePic = loadImage('img/jim-lee-prism.png');

    headPic = loadImage('img/jim-lee-head.png');
}

function setup() {
    // enviroment
    let c = createCanvas(window.innerWidth, window.innerHeight);
    c.parent(document.getElementById('sketch-container'));

    fill("#DA48975A");
    noStroke();
    frameRate(30);
    blendMode(BLEND);
    imageMode(CENTER);

    // populate pentaPoints
    for (let i = 0; i < 5; i++) {
        let direction = p5.Vector.fromAngle((i * TWO_PI) / 5 - HALF_PI);
        pentaPoints.push(direction.copy());
    }

    // resize images
    ratio = (height * 0.7) / beasleyPic.height;
    beasleyPic.resize(beasleyPic.height * ratio, 0);

    ratio = (height * 0.7) / eakesPic.height;
    eakesPic.resize(eakesPic.height * ratio, 0);

    ratio = (height * 0.7) / powellPic.height;
    powellPic.resize(powellPic.height * ratio, 0);

    ratio = (height * 0.7) / banPic.height;
    banPic.resize(banPic.height * ratio, 0);

    ratio = (height * 0.7) / moranPic.height;
    moranPic.resize(moranPic.height * ratio, 0);

    ratio = (height * 0.7) / knegoPic.height;
    knegoPic.resize(knegoPic.height * ratio, 0);

    ratio = (height * 0.7) / leePic.height;
    leePic.resize(leePic.height * ratio, 0);
    headPic.resize(headPic.height * ratio * 0.8, 0);

    // setup manager and scenes
    mgr = new SceneManager();
    mgr.addScene(BeasleySketch);
    mgr.addScene(EakesSketch);
    mgr.addScene(PowellSketch);
    mgr.addScene(BANSketch);
    mgr.addScene(MoranSketch);
    mgr.addScene(KnegoSketch);
    mgr.addScene(LeeSketch);
    mgr.showNextScene();
}

function draw() {
    mgr.draw();
    if (frameCount % sceneLength == 0) mgr.showNextScene();
}

// =============================================================
// =                         BEGIN SCENES                      = 
// =============================================================

function BeasleySketch() {
    var currPoint = 2;
    var cycleFrames = sceneLength;

    this.draw = function () {
        // reset background
        background("#000817");
        blendMode(ADD);

        translate(width / 2, height / 2);
        for (let i = 0; i < 5; i++) {
            push();
            scale(width / 2.3);
            let rotation = map(i, 0, 4, 0, 4 * TWO_PI / 5);
            let progress = map(frameCount % cycleFrames, 0, cycleFrames, 0, 2);
            rotation = progress > 1 ? -rotation : rotation;
            progress = progress > 1 ? 2 - progress : progress;
            rotate(rotation * progress);
            beginShape();
            // vertex(0, 0);
            vertex(0, 0);
            curveVertex(pentaPoints[currPoint].x, pentaPoints[currPoint].y);
            curveVertex(pentaPoints[(currPoint + 1) % 5].x, pentaPoints[(currPoint + 1) % 5].y);
            vertex(0, 0);
            vertex(0, 0);
            endShape();
            pop();
        }

        if (frameCount % cycleFrames == floor(cycleFrames / 2)) {
            currPoint = (currPoint + 1) % 5;
        }

        blendMode(BLEND);
        image(beasleyPic, 0, 0);
    }
}

function EakesSketch() {
    var pentagons = [];
    var pentagonPool = [];

    this.setup = function () {
        // initialize pentagonPool and pentagons array
        for (var i = 0; i < 60; i++) {
            let p = new PackedPentagon;
            p.startFrame = 100 - i;
            pentagonPool.push(p);
        }
        pentagons.push(new PackedPentagon);
    }

    this.draw = function () {
        // reset background
        background("#000817");
        blendMode(ADD);

        // step through pentagons to show and simulate them,
        // also tracks the oldest, finished pentagon for pruning
        let maxGon = pentagons[0];
        for (let gon of pentagons) {
            gon.show();
            gon.step(pentagons);
            if (gon.startFrame < maxGon.startFrame && !gon.growing) {
                maxGon = gon;
            }
        }

        // move pentagons from the pool to the active array,
        // or prune existing pentagons if the pool is emtpy
        if (pentagonPool.length > 0) {
            pentagons.push(pentagonPool.pop());
        } else if (!maxGon.growing) {
            maxGon.regen();
        }

        blendMode(BLEND);
        image(eakesPic, width / 2, height / 2);
    }
}

function PowellSketch() {

    // this.setup = function () {
    // }

    this.draw = function () {
        // reset background
        background("#000817");
        blendMode(ADD);

        translate(width / 2, height / 2);
        for (var i = 0; i < 5; i++) {
            let p1 = pentaPoints[i];
            let p2 = pentaPoints[(i + 1) % 5];

            for (let j = 0; j < 1; j += 0.05) {
                // first lerp along the line between the points
                let ePoint = p5.Vector.lerp(p1, p2, j);
                // modulate by sin
                ePoint.mult(1 + sin(frameCount * 0.04 + map(j, 0, 1, 0, TWO_PI)) / 6);

                let distScale = powellPic.width / 1.5;
                //draw an ellipse
                ellipse(ePoint.x * distScale, ePoint.y * distScale, 15, 15);
                ellipse(ePoint.x * distScale * 1.1, ePoint.y * distScale * 1.1, 17, 17);
                ellipse(ePoint.x * distScale * 1.2, ePoint.y * distScale * 1.2, 20, 20);

            }
        }

        blendMode(BLEND);
        image(powellPic, 0, 0);
    }
}

function BANSketch() {
    var pentagons = [];

    this.setup = function () {
        // populate flying pentagons
        for (var i = 0; i < 60; i++) {
            pentagons.push(new GlassPentagon());
        }
    }

    this.draw = function () {
        // reset background
        background("#000817");
        blendMode(ADD);

        for (var pentagon of pentagons) {
            pentagon.step();
            pentagon.show();
        }

        blendMode(BLEND);
        image(banPic, width / 2, height / 2);
    }
}

function MoranSketch() {
    var rows = 8;
    var cols = 8;

    // this.setup = function () {
    // }

    this.draw = function () {
        // reset background
        background("#000817");
        blendMode(ADD);

        for (let col = 1; col <= cols; col++) {
            for (let row = 1; row <= rows; row++) {
                let x = map(col, 1, cols, width * 0.1, width * 0.9);
                let y = map(row, 1, rows, height * 0.1, height * 0.9);
                let theta = map(row, 1, rows, 0, TWO_PI);
                theta += col * TWO_PI / cols;
                push();
                translate(x + sin(theta + frameCount / 20) * 40, y);
                scale(40);
                beginShape();
                for (var point of pentaPoints) {
                    vertex(point.x, point.y);
                }
                endShape();
                pop();
            }
        }

        blendMode(BLEND);
        image(moranPic, width / 2, height / 2);
    }
}

function KnegoSketch() {

    this.draw = function () {
        // reset background
        background("#000817");
        blendMode(ADD);

        translate(width / 2, height / 2);
        let layers = 8;
        for (let i = 0; i < layers; i++) {
            let rad = map(i, 0, layers, knegoPic.width, width)
            push();
            scale(rad / 1.5);
            let reverse = i % 2 == 0 ? -1 : 1;
            rotate((i * 0.1) * millis() / 1000)
            beginShape()
            for (var point of pentaPoints) {
                vertex(point.x, point.y);
            }
            endShape();
            pop();
        }

        blendMode(BLEND);
        image(knegoPic, 0, 0);

    }
}

function LeeSketch() {
    var pentagons = [];
    var countdownFrames;
    var showingHead;

    this.enter = function () {
        countdownFrames = sceneLength * 0.6;
        showingHead = false;
    }

    this.setup = function () {
        // populate pentagons
        for (let i = 0; i < 80; i++) {
            let p = p5.Vector.random3D()
                .mult(random(max(width, height)));
            pentagons.push(p);
        }
    }

    this.draw = function () {
        // reset background
        background("#000817");
        translate(width / 2, height / 2);

        for (var pentagon of pentagons) {
            push();
            translate(pentagon.x, pentagon.y);
            scale(40);
            rotate(pentagon.z * TWO_PI)
            beginShape()
            for (var point of pentaPoints) {
                vertex(point.x, point.y);
            }
            endShape();
            pop();

            if (countdownFrames < 20) {
                pentagon.x *= 1.09;
                pentagon.y *= 1.09;
            } else {
                pentagon.x *= 0.97;
                pentagon.y *= 0.97;
            }
            let dist = pentagon.x * pentagon.x + pentagon.y * pentagon.y;
            dist = Math.sqrt(dist);
            if (dist < 60 || dist > max(width, height)) {
                pentagon.normalize();
                pentagon.rotate(random(TWO_PI));
                pentagon.z = random()
                if (dist < 60) {
                    pentagon.mult(max(width, height));
                } else {
                    pentagon.mult(60);
                }
            }
        }

        push();
        countdownFrames--;
        if (countdownFrames < 20) {
            if (countdownFrames > 0) {
                let progress = countdownFrames / 20;
                progress *= progress;
                let tintVal = floor(255 * progress);
                tint(255, 255 - tintVal);
                image(headPic, 0, 0);
                tint(255, tintVal);
                image(leePic, 0, 0);
            } else {
                image(headPic, 0, 0);
            }

        } else {
            image(leePic, 0, 0);
        }
        pop();
    }
}

