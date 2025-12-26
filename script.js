// --- COUNTDOWN LOGIC ---
const bgMusic = document.getElementById('bg-music');
const fworkAudio = document.getElementById("firework-bg");

const countDate = new Date(`Jan 1, ${new Date().getFullYear() + 1} 00:00:00`).getTime();
const timerContainer = document.getElementById('timer-container');
const celebration = document.getElementById('celebration');

// Function to update time
function updateCountdown() {
    const now = new Date().getTime();
    const gap = countDate - now;

    // Math for time units
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Calculate display values
    const d = Math.floor(gap / day);
    const h = Math.floor((gap % day) / hour);
    const m = Math.floor((gap % hour) / minute);
    const s = Math.floor((gap % minute) / second);

    // Update HTML
    document.getElementById('days').innerText = d;
    document.getElementById('hours').innerText = h < 10 ? '0' + h : h;
    document.getElementById('minutes').innerText = m < 10 ? '0' + m : m;
    document.getElementById('seconds').innerText = s < 10 ? '0' + s : s;

    // Check if countdown is finished
    if (gap <= 0) {
        clearInterval(interval); // Stop the timer
        timerContainer.style.display = "none"; // Hide countdown
        celebration.style.display = "block"; // Show Message

        bgMusic.pause();
        bgMusic.currentTime = 0;

        fworkAudio.play();

        startFireworks(); // Trigger Fireworks
    }
}

const interval = setInterval(updateCountdown, 1000);
updateCountdown(); // Run immediately on load


// --- FIREWORKS LOGIC ---

let canvas, ctx, w, h, particles = [];
let fireworksActive = false;

function startFireworks() {
    fireworksActive = true;
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    resize();
    window.addEventListener('resize', resize);
    loop();
}

function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}

// Particle Class
class Particle {
    constructor() {
        this.x = w / 2; // Start from center (can change to random)
        this.y = h / 2;
        // Random velocity
        this.vx = random(-5, 5);
        this.vy = random(-5, 5);
        // Random properties
        this.alpha = 1;
        this.color = `hsl(${random(0, 360)}, 100%, 50%)`;
        this.size = random(2, 5);
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.01; // Fade out
        this.size -= 0.05; // Shrink
    }

    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function loop() {
    if (!fireworksActive) return;

    requestAnimationFrame(loop);

    // Create trail effect
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, w, h);

    // Spawn new particles randomly to simulate explosions
    if (Math.random() < 0.1) { // Control frequency of explosions
        let explosionX = random(0, w);
        let explosionY = random(0, h);
        for (let i = 0; i < 50; i++) { // Particles per explosion
            let p = new Particle();
            p.x = explosionX;
            p.y = explosionY;
            particles.push(p);
        }
    }

    // Update and draw existing particles
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Remove dead particles
        if (particles[i].alpha <= 0 || particles[i].size <= 0) {
            particles.splice(i, 1);
            i--;
        }
    }
}