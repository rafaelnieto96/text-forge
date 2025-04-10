let neurons = [];
let NUM_NEURONS = 40;
let ACTIVATION_DISTANCE = 150;
let MAX_CONNECTIONS = 5;

function calculateDensity() {
    const screenArea = window.innerWidth * window.innerHeight;
    const baseDensity = 0.00004;
    NUM_NEURONS = Math.max(10, Math.floor(screenArea * baseDensity));
    ACTIVATION_DISTANCE = Math.min(150, Math.max(80, window.innerWidth / 10));
    MAX_CONNECTIONS = window.innerWidth < 768 ? 3 : 5;
}

function setup() {
    const canvas = createCanvas(window.innerWidth, window.innerHeight);
    canvas.parent('background-container');
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('left', '0');
    canvas.style('width', '100%');
    canvas.style('height', '100%');
    canvas.style('z-index', '0');
    canvas.style('pointer-events', 'none');
    colorMode(RGB, 255, 255, 255, 1);
    noFill();
    angleMode(DEGREES);

    calculateDensity();

    for (let i = 0; i < NUM_NEURONS; i++) {
        neurons.push(new Neuron());
    }
}

function draw() {
    background(0, 0, 0);

    neurons.forEach(neuron => {
        neuron.update();
        neuron.show();
    });

    drawNeuralConnections();

    if (window.innerWidth > 768) {
        globalPulseEffect();
    }
}

class Neuron {
    constructor() {
        this.pos = createVector(random(width), random(height));
        this.connections = [];
        this.pulse = 0;
        const baseSize = window.innerWidth < 768 ? 6 : 8;
        this.targetSize = random(baseSize, baseSize * 1.8);
        this.color = color(255, random(180, 220), random(180, 220), 200);
    }

    update() {
        const moveSpeed = window.innerWidth < 768 ? 0.2 : 0.3;
        this.pos.add(createVector(random(-moveSpeed, moveSpeed), random(-moveSpeed, moveSpeed)));
        this.pos.x = constrain(this.pos.x, 0, width);
        this.pos.y = constrain(this.pos.y, 0, height);

        let mouseDist = dist(mouseX, mouseY, this.pos.x, this.pos.y);
        if (mouseDist < ACTIVATION_DISTANCE) {
            this.activate();
        }

        this.pulse = lerp(this.pulse, 0, 0.1);
    }

    activate() {
        this.pulse = 1;
    }

    show() {
        let glowSize = this.targetSize * (1 + this.pulse * 2);
        let baseAlpha = alpha(this.color);
        let currentAlpha = baseAlpha + (255 - baseAlpha) * sin(frameCount * 0.1 + this.pos.x * 0.1);

        let glowColor = color(hue(this.color), saturation(this.color), brightness(this.color), currentAlpha * 0.5 * (0.5 + this.pulse * 0.5));
        fill(glowColor);
        noStroke();
        ellipse(this.pos.x, this.pos.y, glowSize);

        let bodyColor = color(hue(this.color), saturation(this.color) * 0.8, brightness(this.color) * 0.9, currentAlpha);
        stroke(bodyColor);
        strokeWeight(window.innerWidth < 768 ? 1.5 : 2);
        fill(30, 50, 80, 230);
        ellipse(this.pos.x, this.pos.y, this.targetSize);
    }
}

function drawNeuralConnections() {
    neurons.forEach((a, i) => {
        let others = neurons.slice(i + 1)
            .map(b => ({ neuron: b, dist: dist(a.pos.x, a.pos.y, b.pos.x, b.pos.y) }))
            .sort((x, y) => x.dist - y.dist)
            .slice(0, MAX_CONNECTIONS);

        others.forEach(({ neuron: b, dist }) => {
            if (dist < ACTIVATION_DISTANCE * 1.8) {
                let alphaValue = map(dist, 0, ACTIVATION_DISTANCE * 1.8, 200, 0);
                let lineWidth = map(dist, 0, ACTIVATION_DISTANCE * 1.8,
                    window.innerWidth < 768 ? 2 : 3,
                    window.innerWidth < 768 ? 0.3 : 0.5);

                let pulseSpeed = window.innerWidth < 768 ? 0.03 : 0.05;
                let pulse = (sin(frameCount * pulseSpeed + dist * 0.01) + 1) * 0.5;
                alphaValue *= pulse;
                
                let connColor = color(hue(a.color), saturation(a.color), brightness(a.color), alphaValue);
                stroke(connColor);
                strokeWeight(lineWidth);
                line(a.pos.x, a.pos.y, b.pos.x, b.pos.y);
            }
        });
    });
}

function globalPulseEffect() {
    noFill();
    stroke(255, 0, 0, window.innerWidth < 768 ? 40 : 70);
    strokeWeight(window.innerWidth < 768 ? 1 : 1.5);
    let pulseSize = (frameCount % 120) * (window.innerWidth < 768 ? 3 : 4);
    ellipse(mouseX, mouseY, pulseSize, pulseSize);
}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
    calculateDensity();
    neurons = [];
    for (let i = 0; i < NUM_NEURONS; i++) {
        neurons.push(new Neuron());
    }
} 