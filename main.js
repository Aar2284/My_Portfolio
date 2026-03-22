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

// === Phase 1: Hero Parallax ===
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

// === Phase 2: Education Dossier ===
// Phase 1: Entrance scrub (heading fades/scales in as section scrolls into view)
const eduHeading = document.querySelector(".edu-heading-wrapper");
if (eduHeading) {
    gsap.fromTo(eduHeading,
        { opacity: 0, scale: 0.8, yPercent: 50 },
        {
            opacity: 1, scale: 1, yPercent: 0,
            scrollTrigger: {
                trigger: "#phase2-education",
                start: "top bottom",
                end: "top top",
                scrub: 1
            }
        }
    );
}

// Elements for decorative sub-animations
const eduCrosshairs = document.querySelectorAll(".edu-crosshairs div");
const eduStatusBar = document.querySelector(".edu-status-bar");
const eduScanner = document.querySelector(".edu-scanner");

const dossierCards = gsap.utils.toArray(".dossier-card");
if (dossierCards.length) {
    // Initial state: 3D perspective setup for cards (ALL hidden initially!)
    gsap.set(dossierCards, { opacity: 0, scale: 0.85, rotationX: -15, y: 50, filter: "blur(15px)" });

    const eduTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#phase2-education",
            start: "top top",
            end: `+=${dossierCards.length * 100 + 400}%`,
            pin: true,
            scrub: 1
        }
    });

    // Phase 2: Hold at center (heading sits big for a beat)
    eduTl.to({}, { duration: 4 });

    // Phase 3: Shrink & dock heading to top
    // Since top starts at 35%, -31vh puts it cleanly at precisely 4vh off the ceiling edge!
    eduTl.to(eduHeading, {
        y: "-31vh",
        scale: 0.45,
        backgroundColor: "rgba(255, 0, 255, 0.08)",
        backdropFilter: "blur(15px)",
        border: "1px solid rgba(255, 0, 255, 0.3)",
        duration: 3,
        ease: "power2.inOut"
    });

    // Phase 3b: Concurrent decorative sub-animations
    eduTl.to(eduCrosshairs, { opacity: 1, duration: 1, stagger: 0.2 }, "-=2");
    eduTl.to(eduStatusBar, { opacity: 0.8, duration: 1 }, "-=1.5");
    eduTl.to(eduScanner, {
        opacity: 0.5,
        duration: 1,
        onStart: () => { eduScanner.style.animation = "eduScan 2.5s infinite linear"; }
    }, "-=2");

    // Small pause before cards begin
    eduTl.to({}, { duration: 1 });

    // Card stack transitions
    dossierCards.forEach((card, i) => {
        const ringFill = card.querySelector('.ring-fill');
        const percent = ringFill ? (parseInt(ringFill.getAttribute('data-percent'), 10) || 0) : 0;
        const fullCircumference = 314;
        const targetOffset = fullCircumference - (fullCircumference * (percent / 100));

        if (i === 0) {
            // Fade in FIRST card natively (no longer starts visible!)
            eduTl.to(card, { opacity: 1, scale: 1, rotationX: 0, y: 0, filter: "blur(0px)", duration: 1 });
            
            // First card ring animates in synchronously with card spawn
            if (ringFill) {
                eduTl.fromTo(ringFill,
                    { strokeDashoffset: fullCircumference },
                    { strokeDashoffset: targetOffset, duration: 1, ease: "power2.out" },
                    "-=0.5"
                );
            }
            eduTl.to({}, { duration: 1.5 }); // Hold for reading
        } else {
            // Fade out previous card, fade in current
            eduTl.to(dossierCards[i-1], { opacity: 0, scale: 1.1, rotationX: 15, y: -50, filter: "blur(15px)", duration: 1 })
                 .to(card, { opacity: 1, scale: 1, rotationX: 0, y: 0, filter: "blur(0px)", duration: 1 }, "-=0.5");

            if (ringFill) {
                eduTl.fromTo(ringFill,
                    { strokeDashoffset: fullCircumference },
                    { strokeDashoffset: targetOffset, duration: 1, ease: "power2.out" },
                    "-=0.5"
                );
            }
            eduTl.to({}, { duration: 1.5 }); // Hold for reading
        }
    });
}

// === Phase 3: Skills Sequence ===
const slides = gsap.utils.toArray(".skill-slide");
const hudWrapper = document.querySelector(".skills-hud-wrapper");
const hudBrackets = document.querySelectorAll(".hud-brackets div");
const hudStatus = document.querySelector(".hud-status-bar");
const hudScanner = document.querySelector(".hud-scanner");

gsap.set(slides, { x: "100vw", scale: 0.8, opacity: 0, filter: "blur(10px)", visibility: "visible" });

// 1. Entrance Animation
gsap.fromTo(hudWrapper, 
    { opacity: 0, scale: 0.8, yPercent: 50 }, 
    { 
        opacity: 1, 
        scale: 1, 
        yPercent: 0, 
        scrollTrigger: { 
            trigger: "#phase3-skills", 
            start: "top bottom", 
            end: "top top", 
            scrub: 1 
        }
    }
);

// 2. Pinned Animation
const skillsTl = gsap.timeline({
    scrollTrigger: { 
        trigger: "#phase3-skills", 
        start: "top top", 
        end: "+=1200%", 
        pin: true, 
        scrub: 1 
    }
});

const nebulaLayer = document.querySelector(".nebula-layer");
const rift = document.querySelector(".dimensional-rift");
const nebulaColors = [
    { c1: "rgba(75, 0, 130, 0.15)", c2: "rgba(0, 255, 255, 0.15)" }, // Indigo + Electric Cyan
    { c1: "rgba(0, 128, 128, 0.15)", c2: "rgba(255, 191, 0, 0.15)" },  // Teal + Gold Amber
    { c1: "rgba(255, 0, 255, 0.15)", c2: "rgba(255, 105, 180, 0.15)" },// Magenta + Warm Pink
    { c1: "rgba(80, 200, 120, 0.15)", c2: "rgba(57, 255, 20, 0.15)" }  // Emerald + Neon Green
];

// Hold at center
skillsTl.to({}, { duration: 6 }) 
        .to(hudWrapper, { 
            y: "-52vh", 
            scale: 0.5, 
            backgroundColor: "rgba(0, 255, 255, 0.08)",
            backdropFilter: "blur(15px)",
            border: "1px solid rgba(0, 255, 255, 0.3)",
            duration: 3, 
            ease: "power2.inOut" 
        })
        .to(hudBrackets, { opacity: 1, duration: 1, stagger: 0.2 }, "-=2")
        .to(hudStatus, { opacity: 0.8, duration: 1 }, "-=1.5")
        .to(hudScanner, { 
            opacity: 0.5, 
            duration: 1,
            onStart: () => { hudScanner.style.animation = "scan 2.5s infinite linear"; }
        }, "-=2");

slides.forEach((slide, i) => {
    // Nebula Background
    if (nebulaLayer) {
        skillsTl.to(nebulaLayer, { 
            backgroundImage: `radial-gradient(circle at 30% 50%, ${nebulaColors[i].c1} 0%, transparent 60%), radial-gradient(circle at 70% 30%, ${nebulaColors[i].c2} 0%, transparent 60%)`,
            duration: 2,
            ease: "sine.inOut"
        }, i === 0 ? "-=0" : "-=2");
    }

    if(i > 0 && rift) {
        skillsTl.to(rift, {
            opacity: 1, duration: 0.1, yoyo: true, repeat: 1, ease: "power1.inOut"
        }, "-=1.5");
    }

    skillsTl.to(slide, { x: "0vw", opacity: 1, scale: 1, filter: "blur(0px)", duration: 2, ease: "expo.out" });
    
    // Animate Tech-ID ticker if it's there
    const ticker = slide.querySelector('.ticker');
    if(ticker) {
        skillsTl.to(ticker, {
            innerHTML: ticker.getAttribute('data-target'),
            duration: 1.5,
            snap: { innerHTML: 1 },
            ease: "power2.out"
        }, "-=1");
    }
    const tickerText = slide.querySelector('.ticker-text');
    if(tickerText) {
        skillsTl.to({}, {
            onStart: () => { tickerText.innerHTML = tickerText.getAttribute('data-target'); },
            duration: 0.5,
        }, "-=1");
    }

    skillsTl.to({}, { duration: 3 });
    if (i !== slides.length - 1) {
        skillsTl.to(slide, { x: "-100vw", scale: 1.2, opacity: 0, filter: "blur(10px)", duration: 1.5, ease: "expo.in" });
    }
});

// === Phase 4: Projects Showcase ===
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
          .to(diagonalBg, { clipPath: "polygon(0% 0%, 75% 0%, 55% 100%, 0% 100%)", duration: 1.5, ease: "expo.inOut" }, "-=0.8")
          .to(constGraphic, { left: "70%", top: "50%", scale: 0.8, rotation: 12, duration: 2, ease: "power4.inOut" }, "-=1.5")
          .to(leftInfo, { opacity: 1, x: 0, duration: 1.5, ease: "expo.out" }, "-=1")
          .to(holoCard, { opacity: 1, x: 0, duration: 1.5, ease: "expo.out" }, "-=1.2")
          .to({}, { duration: 2 });
});

window.addEventListener('load', () => {
    ScrollTrigger.refresh();
});

// === Phase 5: Outro ===
const outroTl = gsap.timeline({ scrollTrigger: { trigger: "#phase5-outro", start: "top bottom", end: "bottom bottom", scrub: true } });
outroTl.from(".aurora-bg", { opacity: 0, scale: 1.5, filter: "blur(100px)", duration: 2 })
       .from(".mountains", { y: 200, ease: "power2.out" }, 0.5)
       .from(".outro-content h2", { scale: 0.5, filter: "blur(20px)", opacity: 0, duration: 1.5, ease: "expo.out" }, 1)
       .from(".outro-links a", { y: 50, opacity: 0, stagger: 0.2, duration: 1, ease: "back.out(1.7)" }, 1.5);

gsap.to(".final-fade", { scrollTrigger: { trigger: "#phase5-outro", start: "90% top", end: "bottom top", scrub: true }, opacity: 1, ease: "none" });

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
// --- Neural Cosmos Redesign Logic ---

// 1. Starfield Background
function initStarfield() {
    const canvas = document.getElementById('skills-starfield');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let stars = [];
    const numStars = 150;
    
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            z: Math.random() * 2,
            vx: (Math.random() - 0.5) * 0.1,
            vy: (Math.random() - 0.5) * 0.1
        });
    }

    function animateStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.lineWidth = 0.5;
        for (let i = 0; i < stars.length; i++) {
            stars[i].x += stars[i].vx * stars[i].z;
            stars[i].y += stars[i].vy * stars[i].z;
            
            if (stars[i].x < 0) stars[i].x = canvas.width;
            if (stars[i].x > canvas.width) stars[i].x = 0;
            if (stars[i].y < 0) stars[i].y = canvas.height;
            if (stars[i].y > canvas.height) stars[i].y = 0;
            
            ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + stars[i].z * 0.4})`;
            ctx.beginPath();
            ctx.arc(stars[i].x, stars[i].y, stars[i].z * 1.2, 0, Math.PI * 2);
            ctx.fill();
            
            for (let j = i + 1; j < Math.min(stars.length, i + 8); j++) {
                let dx = stars[i].x - stars[j].x;
                let dy = stars[i].y - stars[j].y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 100) {
                    ctx.strokeStyle = `rgba(0, 255, 255, ${0.15 * (1 - dist / 100)})`;
                    ctx.beginPath();
                    ctx.moveTo(stars[i].x, stars[i].y);
                    ctx.lineTo(stars[j].x, stars[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateStars);
    }
    animateStars();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}
initStarfield();

// ===== 2. Holographic Code Terminal (Languages) =====
function initCodeTerminal() {
    const canvas = document.querySelector('.code-terminal-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;
    
    function resize() {
        const rect = parent.getBoundingClientRect();
        canvas.width = rect.width * 2;
        canvas.height = (rect.height - 32) * 2;
        ctx.scale(2, 2);
    }
    resize();
    
    const codeSnippets = [
        {
            lang: 'PYTHON',
            color: '#61dafb',
            lines: [
                '# Data Pipeline Module',
                'import pandas as pd',
                'import numpy as np',
                '',
                'def process_data(df):',
                '    clean = df.dropna()',
                '    scaled = normalize(clean)',
                '    return scaled.values',
                '',
                'model.fit(X_train, y_train)',
                'score = model.score(X_test)',
                'print(f"Accuracy: {score}")',
            ]
        },
        {
            lang: 'C++',
            color: '#f0db4f',
            lines: [
                '// Sorting Algorithm',
                '#include <vector>',
                '#include <algorithm>',
                '',
                'void quickSort(vector<int>& v,',
                '    int low, int high) {',
                '  if (low < high) {',
                '    int pi = partition(v,',
                '      low, high);',
                '    quickSort(v, low, pi-1);',
                '    quickSort(v, pi+1, high);',
                '  }',
            ]
        },
        {
            lang: 'JAVA',
            color: '#ff6b6b',
            lines: [
                '// REST API Service',
                'import java.util.List;',
                '',
                '@RestController',
                'public class DataController {',
                '  @GetMapping("/analyze")',
                '  public Response analyze(',
                '      @Param String query) {',
                '    Dataset ds = repo.find(',
                '      query);',
                '    return Response.ok(ds);',
                '  }',
            ]
        },
        {
            lang: 'PL/SQL',
            color: '#c678dd',
            lines: [
                '-- Analytics Procedure',
                'CREATE OR REPLACE PROCEDURE',
                '  analyze_data(p_id NUMBER)',
                'IS',
                '  v_result NUMBER;',
                'BEGIN',
                '  SELECT AVG(metric)',
                '    INTO v_result',
                '    FROM performance_data',
                '    WHERE dept_id = p_id;',
                '  DBMS_OUTPUT.PUT_LINE(',
                '    \'Result: \' || v_result);',
            ]
        }
    ];
    
    let currentSnippet = 0;
    let charIndex = 0;
    let lineIndex = 0;
    let displayLines = [];
    let isHovered = false;
    let blinkOn = true;
    
    parent.addEventListener('mouseenter', () => isHovered = true);
    parent.addEventListener('mouseleave', () => isHovered = false);
    
    setInterval(() => blinkOn = !blinkOn, 500);
    
    function typeNextChar() {
        const snippet = codeSnippets[currentSnippet];
        if (lineIndex >= snippet.lines.length) {
            // Pause, then switch to next snippet
            setTimeout(() => {
                currentSnippet = (currentSnippet + 1) % codeSnippets.length;
                lineIndex = 0;
                charIndex = 0;
                displayLines = [];
            }, isHovered ? 400 : 1500);
            return;
        }
        
        const currentLine = snippet.lines[lineIndex];
        if (charIndex <= currentLine.length) {
            if (displayLines.length <= lineIndex) {
                displayLines.push('');
            }
            displayLines[lineIndex] = currentLine.substring(0, charIndex);
            charIndex++;
        } else {
            lineIndex++;
            charIndex = 0;
        }
    }
    
    function render() {
        const w = canvas.width / 2;
        const h = canvas.height / 2;
        ctx.clearRect(0, 0, w, h);
        
        const snippet = codeSnippets[currentSnippet];
        const lineH = 16;
        const padX = 12;
        const padY = 10;
        
        // Language label at top-right
        ctx.font = 'bold 9px monospace';
        ctx.fillStyle = snippet.color;
        ctx.textAlign = 'right';
        ctx.fillText(`[ ${snippet.lang} ]`, w - padX, padY + 8);
        ctx.textAlign = 'left';
        
        // Code lines
        ctx.font = '11px monospace';
        displayLines.forEach((line, i) => {
            const y = padY + 24 + i * lineH;
            if (y > h - 10) return;
            
            // Line number
            ctx.fillStyle = 'rgba(0, 255, 255, 0.25)';
            ctx.fillText(String(i + 1).padStart(2, ' '), padX, y);
            
            // Code text
            ctx.fillStyle = snippet.color;
            ctx.globalAlpha = 0.9;
            ctx.fillText(line, padX + 24, y);
            ctx.globalAlpha = 1;
        });
        
        // Blinking cursor
        if (blinkOn && lineIndex < snippet.lines.length) {
            const cursorY = padY + 24 + lineIndex * lineH;
            const cursorX = padX + 24 + (displayLines[lineIndex] || '').length * 6.6;
            if (cursorY < h - 10) {
                ctx.fillStyle = snippet.color;
                ctx.fillRect(cursorX, cursorY - 10, 6, 12);
            }
        }
        
        requestAnimationFrame(render);
    }
    
    setInterval(() => {
        const speed = isHovered ? 3 : 1;
        for (let i = 0; i < speed; i++) typeNextChar();
    }, isHovered ? 15 : 40);
    
    render();
    window.addEventListener('resize', resize);
}
initCodeTerminal();

// ===== 3. Scatter Plot with Trend Line (Analytics) =====
function initScatterPlot() {
    const canvas = document.querySelector('.scatter-plot-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;
    
    let size = 400;
    canvas.width = size;
    canvas.height = size;
    
    const cx = size / 2, cy = size / 2, radius = size * 0.38;
    let points = [];
    let trendProgress = 0;
    let isHovered = false;
    
    parent.addEventListener('mouseenter', () => {
        isHovered = true;
        regenerateData();
    });
    parent.addEventListener('mouseleave', () => isHovered = false);
    
    function generatePoints() {
        const pts = [];
        const count = 40;
        // Generate correlated data with some noise
        const slope = (Math.random() - 0.3) * 1.5;
        const intercept = cy + (Math.random() - 0.5) * 60;
        for (let i = 0; i < count; i++) {
            const x = cx - radius * 0.8 + Math.random() * radius * 1.6;
            const y = intercept + slope * (x - cx) + (Math.random() - 0.5) * 80;
            const clampR = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
            if (clampR < radius * 0.85) {
                pts.push({ 
                    x, y, 
                    targetX: x, targetY: y,
                    currentX: cx, currentY: cy,
                    arrived: false,
                    delay: i * 2,
                    size: 2 + Math.random() * 3,
                    color: Math.random() > 0.5 ? '#00ffcc' : '#00aaff'
                });
            }
        }
        return pts;
    }
    
    function regenerateData() {
        points = generatePoints();
        trendProgress = 0;
    }
    regenerateData();
    
    function getTrendLine() {
        const arrived = points.filter(p => p.arrived);
        if (arrived.length < 5) return null;
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
        arrived.forEach(p => {
            sumX += p.targetX;
            sumY += p.targetY;
            sumXY += p.targetX * p.targetY;
            sumX2 += p.targetX * p.targetX;
        });
        const n = arrived.length;
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        const x1 = cx - radius * 0.7;
        const x2 = cx + radius * 0.7;
        return { x1, y1: slope * x1 + intercept, x2, y2: slope * x2 + intercept };
    }
    
    let frame = 0;
    function render() {
        ctx.clearRect(0, 0, size, size);
        frame++;
        
        // Grid lines (faint)
        ctx.strokeStyle = 'rgba(0, 255, 200, 0.06)';
        ctx.lineWidth = 0.5;
        for (let i = -4; i <= 4; i++) {
            const x = cx + i * (radius / 4);
            const y = cy + i * (radius / 4);
            ctx.beginPath(); ctx.moveTo(x, cy - radius); ctx.lineTo(x, cy + radius); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(cx - radius, y); ctx.lineTo(cx + radius, y); ctx.stroke();
        }
        
        // Axis labels
        ctx.font = '9px monospace';
        ctx.fillStyle = 'rgba(0, 255, 200, 0.3)';
        ctx.textAlign = 'center';
        ctx.fillText('FEATURE_X', cx, cy + radius + 18);
        ctx.save();
        ctx.translate(cx - radius - 18, cy);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('METRIC_Y', 0, 0);
        ctx.restore();
        
        // Animate points flying in
        points.forEach((p, i) => {
            if (frame < p.delay) return;
            const t = Math.min(1, (frame - p.delay) / 30);
            const ease = 1 - Math.pow(1 - t, 3);
            p.currentX = cx + (p.targetX - cx) * ease;
            p.currentY = cy + (p.targetY - cy) * ease;
            if (t >= 1) p.arrived = true;
            
            ctx.fillStyle = p.color;
            ctx.globalAlpha = 0.5 + ease * 0.5;
            ctx.beginPath();
            ctx.arc(p.currentX, p.currentY, p.size * ease, 0, Math.PI * 2);
            ctx.fill();
            // Glow
            ctx.globalAlpha = 0.15;
            ctx.beginPath();
            ctx.arc(p.currentX, p.currentY, p.size * 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        });
        
        // Trend line
        const allArrived = points.length > 0 && points.every(p => p.arrived);
        if (allArrived) trendProgress = Math.min(1, trendProgress + 0.02);
        
        const trend = getTrendLine();
        if (trend && trendProgress > 0) {
            const drawX2 = trend.x1 + (trend.x2 - trend.x1) * trendProgress;
            const drawY2 = trend.y1 + (trend.y2 - trend.y1) * trendProgress;
            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = 2;
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.moveTo(trend.x1, trend.y1);
            ctx.lineTo(drawX2, drawY2);
            ctx.stroke();
            ctx.shadowBlur = 0;
            
            // Label
            if (trendProgress > 0.8) {
                ctx.font = 'bold 9px monospace';
                ctx.fillStyle = '#ffd700';
                ctx.globalAlpha = (trendProgress - 0.8) * 5;
                ctx.textAlign = 'left';
                ctx.fillText('R² = 0.' + Math.floor(70 + Math.random() * 25), drawX2 + 5, drawY2 - 5);
                ctx.globalAlpha = 1;
            }
        }
        
        requestAnimationFrame(render);
    }
    render();
    
    // Auto-regenerate every 8 seconds
    setInterval(() => {
        if (!isHovered) regenerateData();
    }, 8000);
}
initScatterPlot();

// ===== 4. Morphing Chart Display (Visualizations) =====
function initChartMorph() {
    const canvas = document.querySelector('.chart-morph-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const label = document.querySelector('.chart-type-label');
    
    let size = 400;
    canvas.width = size;
    canvas.height = size;
    
    const cx = size / 2, cy = size / 2;
    const chartRadius = size * 0.3;
    let chartType = 0; // 0=bar, 1=line, 2=pie
    const chartNames = ['BAR_CHART', 'LINE_CHART', 'PIE_CHART'];
    const neonColors = ['#ff00ff', '#00ffff', '#ff6b9d', '#ffd700', '#00ff88', '#6366f1'];
    let morphT = 1; // 1 = fully shown
    let dataValues = [0.7, 0.5, 0.9, 0.6, 0.8, 0.4];
    let isHovered = false;
    
    canvas.parentElement.addEventListener('mouseenter', () => isHovered = true);
    canvas.parentElement.addEventListener('mouseleave', () => isHovered = false);
    
    function drawBarChart(alpha) {
        const barW = 22;
        const gap = 14;
        const totalW = dataValues.length * (barW + gap) - gap;
        const startX = cx - totalW / 2;
        const baseY = cy + chartRadius * 0.6;
        const maxH = chartRadius * 1.2;
        
        dataValues.forEach((val, i) => {
            const h = val * maxH * alpha;
            const x = startX + i * (barW + gap);
            const y = baseY - h;
            
            ctx.fillStyle = neonColors[i];
            ctx.globalAlpha = 0.7 * alpha;
            ctx.fillRect(x, y, barW, h);
            // Glow
            ctx.shadowColor = neonColors[i];
            ctx.shadowBlur = 12;
            ctx.fillRect(x, y, barW, h);
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
        });
        
        // Base line
        ctx.strokeStyle = `rgba(255, 0, 255, ${0.3 * alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx - totalW / 2 - 10, baseY);
        ctx.lineTo(cx + totalW / 2 + 10, baseY);
        ctx.stroke();
    }
    
    function drawLineChart(alpha) {
        const totalW = chartRadius * 1.6;
        const startX = cx - totalW / 2;
        const baseY = cy + chartRadius * 0.4;
        const maxH = chartRadius * 1.0;
        
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 8;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        
        dataValues.forEach((val, i) => {
            const x = startX + (i / (dataValues.length - 1)) * totalW;
            const y = baseY - val * maxH;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        // Points
        dataValues.forEach((val, i) => {
            const x = startX + (i / (dataValues.length - 1)) * totalW;
            const y = baseY - val * maxH;
            ctx.fillStyle = neonColors[i];
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;
    }
    
    function drawPieChart(alpha) {
        const total = dataValues.reduce((a, b) => a + b, 0);
        let startAngle = -Math.PI / 2;
        const r = chartRadius * 0.65;
        
        dataValues.forEach((val, i) => {
            const sliceAngle = (val / total) * Math.PI * 2 * alpha;
            ctx.fillStyle = neonColors[i];
            ctx.globalAlpha = 0.7 * alpha;
            ctx.shadowColor = neonColors[i];
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, r, startAngle, startAngle + sliceAngle);
            ctx.closePath();
            ctx.fill();
            ctx.shadowBlur = 0;
            startAngle += sliceAngle;
        });
        ctx.globalAlpha = 1;
        
        // Center hole (donut)
        ctx.fillStyle = 'rgba(10, 0, 25, 0.85)';
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.45, 0, Math.PI * 2);
        ctx.fill();
    }
    
    let frame = 0;
    function render() {
        ctx.clearRect(0, 0, size, size);
        frame++;
        
        // Draw current chart
        if (chartType === 0) drawBarChart(morphT);
        else if (chartType === 1) drawLineChart(morphT);
        else drawPieChart(morphT);
        
        requestAnimationFrame(render);
    }
    render();
    
    // Cycle charts
    function cycleChart() {
        morphT = 0;
        // Fade in
        const fadeIn = setInterval(() => {
            morphT = Math.min(1, morphT + 0.05);
            if (morphT >= 1) clearInterval(fadeIn);
        }, 20);
    }
    
    setInterval(() => {
        // Fade out
        const fadeOut = setInterval(() => {
            morphT = Math.max(0, morphT - 0.06);
            if (morphT <= 0) {
                clearInterval(fadeOut);
                chartType = (chartType + 1) % 3;
                dataValues = dataValues.map(() => 0.3 + Math.random() * 0.7);
                if (label) label.textContent = 'RENDERING: ' + chartNames[chartType];
                cycleChart();
            }
        }, 20);
    }, isHovered ? 2500 : 4000);
}
initChartMorph();

