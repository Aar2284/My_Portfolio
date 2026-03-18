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
const hudWrapper = document.querySelector(".skills-hud-wrapper");
const hudBrackets = document.querySelectorAll(".hud-brackets div");
const hudStatus = document.querySelector(".hud-status-bar");
const hudScanner = document.querySelector(".hud-scanner");

gsap.set(slides, { x: "100vw", scale: 0.8, opacity: 0, filter: "blur(10px)", visibility: "visible" });

// 1. Entrance Animation
gsap.fromTo(hudWrapper, 
    { opacity: 0, scale: 0.8, y: 100 }, 
    { 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        scrollTrigger: { trigger: "#phase2-skills", start: "top bottom", end: "top top", scrub: 1 }
    }
);

// 2. Pinned Animation
const skillsTl = gsap.timeline({
    scrollTrigger: { 
        trigger: "#phase2-skills", 
        start: "top top", 
        end: "+=800%", 
        pin: true, 
        scrub: 1 
    }
});

skillsTl.to({}, { duration: 0.8 })
        .to(hudWrapper, { 
            y: "-38vh", 
            scale: 0.55, 
            backgroundColor: "rgba(0, 255, 255, 0.08)",
            backdropFilter: "blur(15px)",
            border: "1px solid rgba(0, 255, 255, 0.3)",
            duration: 2, 
            ease: "power3.inOut" 
        })
        .to(hudBrackets, { opacity: 1, duration: 0.8, stagger: 0.1 }, "-=1.2")
        .to(hudStatus, { opacity: 0.8, duration: 0.8 }, "-=1")
        .to(hudScanner, { 
            opacity: 0.5, 
            duration: 0.8,
            onStart: () => { hudScanner.style.animation = "scan 2.5s infinite linear"; }
        }, "-=1.2");

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

// --- Cinematic About Me HUD Logic (V4) ---
const aboutBtn = document.querySelector('.hero-cta.secondary');
const aboutOverlay = document.getElementById('about-overlay');
const hudContainer = document.querySelector('.hud-container');
const closeAbout = document.getElementById('close-about');
const ufoClose = document.querySelector('.ufo-close');

// Neural Canvas Logic
const canvas = document.getElementById('about-neural-canvas');
const ctx = canvas.getContext('2d');
let dots = [];

function initNeuralCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    dots = [];
    for(let i=0; i<80; i++) {
        dots.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3
        });
    }
}

function drawNeuralNetwork() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(0, 255, 255, 0.1)";
    ctx.fillStyle = "rgba(0, 255, 255, 0.3)";
    
    dots.forEach((d, i) => {
        d.x += d.vx; d.y += d.vy;
        if(d.x < 0 || d.x > canvas.width) d.vx *= -1;
        if(d.y < 0 || d.y > canvas.height) d.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1.5, 0, Math.PI*2);
        ctx.fill();
        
        for(let j=i+1; j<dots.length; j++) {
            let d2 = dots[j];
            let dist = Math.hypot(d.x - d2.x, d.y - d2.y);
            if(dist < 150) {
                ctx.lineWidth = 1 - dist/150;
                ctx.beginPath();
                ctx.moveTo(d.x, d.y);
                ctx.lineTo(d2.x, d2.y);
                ctx.stroke();
            }
        }
    });
    requestAnimationFrame(drawNeuralNetwork);
}

window.addEventListener('resize', initNeuralCanvas);
initNeuralCanvas();
drawNeuralNetwork();

// Decoding Effect Function
function decodeText(element, finalString, duration = 1000) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
    const iterations = 15;
    let currentIteration = 0;
    
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            element.innerText = finalString
                .split("")
                .map((char, index) => {
                    if (index < (currentIteration / iterations) * finalString.length) {
                        return finalString[index];
                    }
                    if (char === " ") return " ";
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join("");
            
            if (currentIteration >= iterations) {
                clearInterval(interval);
                element.innerText = finalString;
                resolve();
            }
            currentIteration++;
        }, duration / iterations);
    });
}

if (aboutBtn && aboutOverlay) {
    aboutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Reset and show overlay
        gsap.set(aboutOverlay, { visibility: "visible", opacity: 0 });
        gsap.set(hudContainer, { opacity: 0, scale: 1.1, translateZ: 200 });
        gsap.set(".academic-stats", { x: "40vw", y: "0vh", opacity: 0 }); 
        gsap.set([".hud-center", ".hud-right", ".vertical-title", ".hud-bottom"], { opacity: 0 });
        
        // UFO Initial State (off-screen)
        gsap.set(ufoClose, { x: 400, y: -400, opacity: 0, rotation: 45, scale: 1 });
        ufoClose.classList.remove('ufo-active');

        const tl = gsap.timeline();
        
        tl.to(aboutOverlay, { opacity: 1, duration: 0.4 })
          .to(hudContainer, { 
              opacity: 1, 
              scale: 1, 
              translateZ: 0, 
              duration: 1, 
              ease: "expo.out" 
          }, "-=0.2")
          
          // UFO Fly In
          .to(ufoClose, { 
              x: 0, y: 0, opacity: 1, rotation: 0, 
              duration: 1.2, ease: "back.out(1.2)",
              onComplete: () => ufoClose.classList.add('ufo-active')
          }, "-=0.5")

          .to(".academic-stats", { 
              opacity: 1, 
              duration: 0.5,
              onComplete: () => {
                  const stats = document.querySelectorAll('.stat-value');
                  const originalValues = Array.from(stats).map(s => s.innerText);
                  stats.forEach((stat, i) => decodeText(stat, originalValues[i], 1200));
              }
          })
          
          .to(".academic-stats", { 
              x: 0, y: 0, duration: 1.2, ease: "power4.inOut", delay: 1.5 
          })
          
          .to(".vertical-title", { opacity: 0.3, scaleY: 1, duration: 0.8, ease: "expo.out" }, "-=0.4")
          .to(".hud-center", { opacity: 1, x: 0, duration: 1 }, "-=0.4")
          .from(".narrative-block", { y: 30, opacity: 0, stagger: 0.2, duration: 0.8 }, "-=0.8")
          .to(".hud-right", { opacity: 1, x: 0, duration: 1 }, "-=1")
          .to(".hud-bottom", { opacity: 1, duration: 0.5 }, "-=0.5");
    });
}

if (closeAbout) {
    closeAbout.addEventListener('click', () => {
        const closeTl = gsap.timeline({
            onComplete: () => gsap.set(aboutOverlay, { visibility: "hidden" })
        });

        // UFO Fly Away S-shaped path to bottom-left
        ufoClose.classList.remove('ufo-active');
        
        closeTl.to(ufoClose, {
            duration: 1.2,
            ease: "power2.inOut",
            keyframes: [
                { x: -150, y: 100, rotation: -20, scale: 0.8 },
                { x: -50, y: 400, rotation: 15, scale: 0.6 },
                { x: -window.innerWidth - 200, y: window.innerHeight + 200, rotation: -45, scale: 0.3 }
            ]
        })
        .to(hudContainer, { 
            scale: 1.1, translateZ: 200, opacity: 0, 
            duration: 0.8, ease: "expo.in" 
        }, "-=0.8")
        .to(aboutOverlay, { opacity: 0, duration: 0.4 }, "-=0.4");
    });
}
