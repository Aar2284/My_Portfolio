// Initialize Lenis
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// --- 1. Canvas Particle System (Snow/Stars) ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.init();
    }
    init() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedY = Math.random() * 0.5 + 0.2;
        this.drift = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
    }
    update() {
        this.y += this.speedY;
        this.x += this.drift;
        if (this.y > canvas.height) {
            this.y = -10;
            this.x = Math.random() * canvas.width;
        }
    }
    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

for (let i = 0; i < 150; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();

// --- 2. Hero Section Animations ---

// Idle floating (yoyo)
gsap.to(".layer-planet-left", {
    y: 20,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
});
gsap.to(".layer-planet-right", {
    y: -30,
    duration: 4,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
});
gsap.to(".spaceship", {
    y: -15,
    duration: 2.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
});

// Scroll Parallax
const heroTl = gsap.timeline({
    scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});

heroTl.to(".spaceship", { y: -1000, x: -500, scale: 0.5, ease: "power2.in" }, 0)
      .to(".layer-planet-left", { y: -300, ease: "none" }, 0)
      .to(".layer-planet-right", { y: -150, ease: "none" }, 0)
      .to(".hero-text-content", { opacity: 0, y: -100, ease: "none" }, 0);

// --- 3. Skills Planet Sequence ---
const skillsTl = gsap.timeline({
    scrollTrigger: {
        trigger: "#skills",
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: 1
    }
});

const skillSlides = gsap.utils.toArray(".skill-slide");
skillSlides.forEach((slide, i) => {
    skillsTl.fromTo(slide, 
        { x: "100%", visibility: "visible" }, 
        { x: "0%", duration: 1, ease: "power2.out" }
    );
    skillsTl.to(slide, { duration: 1.5 });
    if (i < skillSlides.length - 1) {
        skillsTl.to(slide, { x: "-100%", duration: 0.8, ease: "power2.in" });
    } else {
        skillsTl.to(slide, { x: "-100%", duration: 0.8, ease: "power2.in" });
    }
});

// --- 4. Split-Screen Project Showcase (Diagonal Mask Wipe) ---
const projectsTl = gsap.timeline({
    scrollTrigger: {
        trigger: "#projects",
        start: "top top",
        end: "+=400%",
        pin: true,
        scrub: 1
    }
});

const projectCards = gsap.utils.toArray(".project-split-card");
projectCards.forEach((card, i) => {
    // Entrance with diagonal wipe
    projectsTl.fromTo(card, 
        { 
            clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)",
            visibility: "visible"
        },
        { 
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
            duration: 1, 
            ease: "power2.inOut" 
        }
    );
    
    projectsTl.to(card, { duration: 2 }); // Hold
    
    if (i < projectCards.length - 1) {
        projectsTl.to(card, { y: "-100%", duration: 1, ease: "power2.in" });
    }
});

// --- 5. Landscape & Cabin Transitions ---
gsap.from(".landscape-text", {
    opacity: 0, y: 50,
    scrollTrigger: {
        trigger: "#landscape",
        start: "top 60%",
        end: "top 30%",
        scrub: true
    }
});

gsap.from(".winter-text", {
    opacity: 0, y: 50,
    scrollTrigger: {
        trigger: "#winter",
        start: "top 60%",
        end: "top 30%",
        scrub: true
    }
});

// Back to Top
document.getElementById('back-to-top').addEventListener('click', () => {
    lenis.scrollTo(0, { duration: 2 });
});
