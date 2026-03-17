// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// --- Phase 1: Hero Parallax ---
const heroTl = gsap.timeline({
    scrollTrigger: {
        trigger: "#phase1-hero",
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});

heroTl.to(".hero-planet-main", { yPercent: -50, scale: 2, filter: "blur(20px)", opacity: 0, ease: "power2.in" }, 0)
      .to(".hero-moon", { yPercent: -80, scale: 0.2, filter: "blur(10px)", opacity: 0, ease: "power2.in" }, 0)
      .to(".hero-rocket", { yPercent: -200, xPercent: -150, scale: 0.3, opacity: 0, ease: "power2.in" }, 0)
      .to(".hero-content", { yPercent: 100, scale: 0.8, filter: "blur(10px)", opacity: 0, ease: "power2.in" }, 0);

// --- Hero Idle Animations ---
gsap.to(".rocket-wrapper", { x: "-85vw", y: "-85vh", duration: 20, repeat: -1, yoyo: true, ease: "sine.inOut" });
gsap.to(".rocket-wrapper svg", { x: "random(-1, 1)", y: "random(-1, 1)", duration: 0.05, repeat: -1, yoyo: true, ease: "none" });
gsap.to(".debris", { y: "random(-100, 100)", x: "random(-50, 50)", rotation: "random(-180, 180)", duration: "random(10, 20)", repeat: -1, yoyo: true, ease: "sine.inOut" });

// --- Phase 2: Skills Sequence ---
const slides = gsap.utils.toArray(".skill-slide");
gsap.set(slides, { x: "100vw", scale: 0.8, opacity: 0, filter: "blur(10px)", visibility: "visible" });

const skillsTl = gsap.timeline({
    scrollTrigger: { trigger: "#phase2-skills", start: "top top", end: "+=800%", pin: true, scrub: 1 }
});

slides.forEach((slide, i) => {
    skillsTl.to(slide, { x: "0vw", opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.5, ease: "expo.out" }).to({}, { duration: 2 });
    if (i !== slides.length - 1) {
        skillsTl.to(slide, { x: "-100vw", scale: 1.2, opacity: 0, filter: "blur(10px)", duration: 1.2, ease: "expo.in" });
    }
});

// --- Phase 3: Projects Showcase ---
const projects = gsap.utils.toArray(".project-wrapper");
projects.forEach((proj, i) => {
    const constGraphic = proj.querySelector(".constellation-graphic");
    const initialTitle = proj.querySelector(".proj-initial-title");
    const leftInfo = proj.querySelector(".proj-left");
    const holoCard = proj.querySelector(".holo-card");
    const diagonalBg = proj.querySelector(".diagonal-bg");
    const stars = constGraphic.querySelectorAll(".c-star");

    gsap.set(constGraphic, { left: "0%", top: "50%", xPercent: -50, yPercent: -50, scale: 1.8, filter: "blur(15px)", opacity: 0 });
    gsap.set(initialTitle, { y: 100, opacity: 0, filter: "blur(10px)" });
    gsap.set(stars, { scale: 0, opacity: 0 });

    const projTl = gsap.timeline({ scrollTrigger: { trigger: proj, start: "top top", end: "+=250%", pin: true, scrub: 1 } });
    projTl.to(constGraphic, { opacity: 1, filter: "blur(0px)", scale: 1.5, duration: 1.5, ease: "power4.out" })
          .to(stars, { scale: 1, opacity: 1, stagger: 0.1, duration: 1, ease: "back.out(2)" }, "-=1")
          .to(initialTitle, { y: 0, opacity: 1, filter: "blur(0px)", duration: 1 }, "-=0.5")
          .to(initialTitle, { opacity: 0, y: -100, scale: 1.2, filter: "blur(15px)", duration: 1, ease: "power2.in" })
          .to(diagonalBg, { clipPath: "polygon(0% 0%, 60% 0%, 40% 100%, 0% 100%)", duration: 1.5, ease: "expo.inOut" }, "-=0.8")
          .to(constGraphic, { left: "50%", top: "50%", scale: 0.8, rotation: 12, duration: 2, ease: "power4.inOut" }, "-=1.5")
          .to(leftInfo, { opacity: 1, x: 0, duration: 1.5, ease: "expo.out" }, "-=1")
          .to(holoCard, { opacity: 1, x: 0, duration: 1.5, ease: "expo.out" }, "-=1.2")
          .to({}, { duration: 2 });
});

// --- Phase 4: Outro ---
const outroTl = gsap.timeline({ scrollTrigger: { trigger: "#phase4-outro", start: "top bottom", end: "bottom bottom", scrub: true } });
outroTl.from(".aurora-bg", { opacity: 0, scale: 1.5, filter: "blur(100px)", duration: 2 })
       .from(".mountains", { y: 200, ease: "power2.out" }, 0.5)
       .from(".outro-content h2", { scale: 0.5, filter: "blur(20px)", opacity: 0, duration: 1.5, ease: "expo.out" }, 1)
       .from(".outro-links a", { y: 50, opacity: 0, stagger: 0.2, duration: 1, ease: "back.out(1.7)" }, 1.5);

gsap.to(".final-fade", { scrollTrigger: { trigger: "#phase4-outro", start: "90% top", end: "bottom top", scrub: true }, opacity: 1, ease: "none" });

// --- Cinematic About Me Modal Logic (V3) ---
const aboutBtn = document.querySelector('.hero-cta.secondary');
const aboutOverlay = document.getElementById('about-overlay');
const glassPortal = document.querySelector('.glass-portal');
const closeAbout = document.getElementById('close-about');

// Particle Background for Modal
const canvas = document.getElementById('about-bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function initAboutCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    for(let i=0; i<100; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5
        });
    }
}

function drawAboutParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 255, 255, 0.5)";
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        p.x += p.speedX; p.y += p.speedY;
        if(p.x < 0) p.x = canvas.width; if(p.x > canvas.width) p.x = 0;
        if(p.y < 0) p.y = canvas.height; if(p.y > canvas.height) p.y = 0;
    });
    requestAnimationFrame(drawAboutParticles);
}

window.addEventListener('resize', initAboutCanvas);
initAboutCanvas();
drawAboutParticles();

if (aboutBtn && aboutOverlay) {
    aboutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        gsap.set(aboutOverlay, { visibility: "visible" });
        
        const tl = gsap.timeline();
        tl.to(aboutOverlay, { backgroundColor: "rgba(0,0,0,0.9)", duration: 0.5 })
          .to(glassPortal, { 
              opacity: 1, 
              scale: 1, 
              rotateX: 0, 
              duration: 1.2, 
              ease: "expo.out" 
          }, "-=0.3")
          .from(".portal-left, .portal-right", { x: (i) => i === 0 ? -50 : 50, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.8")
          .from(".orb-ring", { scale: 0, opacity: 0, stagger: 0.1, duration: 1, ease: "back.out(1.7)" }, "-=1")
          .from(".p-mod", { y: 20, opacity: 0, stagger: 0.1, duration: 0.8 }, "-=0.5");
    });
}

if (closeAbout) {
    closeAbout.addEventListener('click', () => {
        gsap.timeline({
            onComplete: () => gsap.set(aboutOverlay, { visibility: "hidden" })
        })
        .to(glassPortal, { 
            scale: 0.8, 
            rotateX: -15, 
            opacity: 0, 
            duration: 0.8, 
            ease: "expo.in" 
        })
        .to(aboutOverlay, { backgroundColor: "rgba(0,0,0,0)", duration: 0.4 }, "-=0.4");
    });
}
