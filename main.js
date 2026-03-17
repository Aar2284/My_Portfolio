// Initialize Lenis Smooth Scroll
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

// --- 1. Canvas Particle System (Background) ---
const canvas = document.getElementById('bg-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

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

    for (let i = 0; i < 150; i++) particles.push(new Particle());

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
}

// --- 2. GSAP Idle Animations (Planets & Rocket) ---

// Gentle Hover for Planets
gsap.to(".planet-1", { y: 25, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut" });
gsap.to(".planet-2", { y: -20, duration: 3.2, repeat: -1, yoyo: true, ease: "sine.inOut" });
gsap.to(".planet-3", { y: 15, duration: 5, repeat: -1, yoyo: true, ease: "sine.inOut" });
gsap.to(".planet-4", { y: -30, duration: 4.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
gsap.to(".planet-5", { y: 18, duration: 3.8, repeat: -1, yoyo: true, ease: "sine.inOut" });

// Rocket: Action A - Mechanical Vibration (Thrust)
gsap.to(".rocket", {
    x: "+=1.5",
    y: "+=1.5",
    rotation: "+=1",
    duration: 0.05,
    repeat: -1,
    yoyo: true,
    ease: "none"
});

// Rocket: Action B - Forward Drift (Momentum)
gsap.to(".rocket", {
    x: "-=20",
    y: "-=20",
    duration: 2.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
});

// --- 3. Scroll Transitions ---

// Hero Parallax (Depth Effect)
const heroParallax = gsap.timeline({
    scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: 1
    }
});

heroParallax.to(".rocket", { yPercent: -300, xPercent: 100, ease: "none" }, 0)
            .to(".planet-1", { yPercent: -50, ease: "none" }, 0)
            .to(".planet-2", { yPercent: -100, ease: "none" }, 0)
            .to(".planet-3", { yPercent: -20, ease: "none" }, 0)
            .to(".planet-4", { yPercent: -150, ease: "none" }, 0)
            .to(".planet-5", { yPercent: -80, ease: "none" }, 0)
            .to(".hero-text-content", { opacity: 0, y: -100, ease: "none" }, 0);

// Skills Planet Sequence (Existing Logic)
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

// Split-Screen Project Showcase (Diagonal Mask Wipe)
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
    projectsTl.fromTo(card, 
        { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)", visibility: "visible" },
        { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)", duration: 1, ease: "power2.inOut" }
    );
    projectsTl.to(card, { duration: 2 });
    if (i < projectCards.length - 1) {
        projectsTl.to(card, { y: "-100%", duration: 1, ease: "power2.in" });
    }
});

// Back to Top
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
    backToTop.addEventListener('click', () => {
        lenis.scrollTo(0, { duration: 2 });
    });
}