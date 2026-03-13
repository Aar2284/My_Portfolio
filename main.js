// Lenis Smooth Scroll Initialization
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
})

// Bind Lenis's requestAnimationFrame to rely on GSAP's ticker
function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Update ScrollTrigger internally whenever Lenis scrolls
lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time)=>{
  lenis.raf(time * 1000)
})
gsap.ticker.lagSmoothing(0)

// ------------------------------------------------------------------------------------------------ //
// Phase 2: Custom Comet Cursor Logic
const cometCursor = document.querySelector('.cursor-comet');
const cometTrail = document.querySelector('.cursor-trail');

document.addEventListener('mousemove', (e) => {
    // We update cursor positions on mouse move
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Quick responsive update for main comet dot
    gsap.to(cometCursor, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        ease: "power2.out"
    });
    
    // A slightly delayed tracker for the tail effect
    gsap.to(cometTrail, {
        x: mouseX,
        y: mouseY,
        duration: 0.3,
        ease: "power2.out"
    });
});

// Cursor Hover Effects for Links/Buttons
const interactiveElements = document.querySelectorAll('a, .btn-primary, .star-node, .glass-card, .contact-link');

interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
        gsap.to(cometCursor, {
            scale: 2,
            backgroundColor: "transparent",
            border: "1px solid var(--color-neon-cyan)",
            duration: 0.3
        });
    });
    
    el.addEventListener('mouseleave', () => {
        gsap.to(cometCursor, {
            scale: 1,
            backgroundColor: "var(--color-neon-cyan)",
            border: "none",
            duration: 0.3
        });
    });
});

// ------------------------------------------------------------------------------------------------ //
// Phase 3 & 4: Space Journey (Liftoff & Orbital Shatter)
const tlSpaceJourney = gsap.timeline({
    scrollTrigger: {
        trigger: "#space-journey",
        start: "top top",
        end: "+=800%", // Increased scroll distance heavily so parts fall one by one very slowly
        scrub: 1, // Smooth scrubbing
        pin: true, // Pin the whole space journey container
    }
});

// Fire flicker (independent of scroll)
gsap.to(".rocket-fire", {
    scaleY: 1.5, y: 10, duration: 0.1, yoyo: true, repeat: -1, ease: "power1.inOut"
});

tlSpaceJourney
    // --- LIFTOFF (0 to 6) ---
    // 1. Ignite the smoke initially
    .to(".smoke-layer", { opacity: 1, scale: 2, duration: 1, ease: "power1.out" }, 0)
    .to(".rocket-fire", { opacity: 1, duration: 0.5 }, 0)
    
    // 2. Parallax: Earth moves down violently, Sky fades to black
    .to(".launchpad-container", { y: "150vh", duration: 6, ease: "power2.inOut" }, 0.5)
    .to(".sky-black-overlay", { opacity: 1, duration: 4 }, 2)
    
    // Cloud parallax moving down faster than the rocket
    .to(".cloud-1", { y: "150vh", duration: 5, ease: "power1.in" }, 0.5)
    .to(".cloud-2", { y: "180vh", duration: 5, ease: "power1.in" }, 0.5)
    .to(".cloud-3", { y: "120vh", duration: 5, ease: "power1.in" }, 0.5)
    .to(".cloud-4", { y: "200vh", duration: 5, ease: "power1.in" }, 0.5)
    
    // Rocket curvy trajectory (Starts straight at 20%, moves up, tilts, curves to center, un-tilts)
    // Decreased the upward y shift (now -15vh instead of -35vh) so it sits lower on the screen
    .to(".rocket-assembly", { y: "-15vh", duration: 6, ease: "power2.inOut" }, 0.5)
    .to(".rocket-assembly", { left: "50%", duration: 6, ease: "power1.inOut" }, 0.5)
    // Add the tilt mid-flight to simulate the curve, then zero it out
    .to(".rocket-assembly", { rotation: 25, duration: 2, ease: "power1.inOut" }, 1.5)
    .to(".rocket-assembly", { rotation: 0, duration: 2, ease: "power1.inOut" }, 4.5)
    
    // Animate the introductory text upwards and out of frame alongside the earth
    .to(".intro-content", { y: "-100vh", opacity: 0, duration: 5, ease: "power2.in" }, 0.5)

    // --- ORBITAL SHATTER (Sequential & Slow Free Fall) ---
    // Start slowing down the engine as we reach the center orbit
    .to(".rocket-fire", { opacity: 0.3, scaleY: 0.5, duration: 1 }, 5.5)
    
    // PART 1: The Boosters Shatter (Left & Right)
    // Reduce horizontal spread to -10vw / 10vw so the long text labels stay safely inside the viewport
    .to(".layer-2", { x: "-10vw", y: "-5vh", duration: 2, ease: "power2.out" }, 6.5) // Move wrapper (text stays straight)
    .to(".layer-2 .rocket-layer", { rotation: -30, duration: 2, ease: "power2.out" }, 6.5) // Rotate ONLY the image
    .to(".node-2", { opacity: 1, duration: 1 }, 6.5) // Tech stack reads straight

    .to(".layer-4", { x: "10vw", y: "-5vh", duration: 2, ease: "power2.out" }, 6.5)
    .to(".layer-4 .rocket-layer", { rotation: 30, duration: 2, ease: "power2.out" }, 6.5)
    .to(".node-4", { opacity: 1, duration: 1 }, 6.5)

    // Boosters slowly free fall all the way out of frame (y: 150vh), staying horizontally visible
    .to(".layer-2", { y: "150vh", duration: 5, ease: "power1.in" }, 8.5)
    .to(".layer-4", { y: "150vh", duration: 5, ease: "power1.in" }, 8.5)

    // PART 2: The Thrusters/Engine Block (Bottom) - Only happens after Boosters are falling
    .to(".layer-5", { y: "15vh", duration: 2, ease: "power2.out" }, 11.5) 
    .to(".layer-5 .rocket-layer", { rotation: 20, duration: 2, ease: "power2.out" }, 11.5) 
    .to(".rocket-fire", { opacity: 0, scaleY: 0, duration: 0.5 }, 11.5) 
    .to(".node-5", { opacity: 1, duration: 1 }, 11.5)
    
    // Engine block free fall out of frame
    .to(".layer-5", { y: "150vh", duration: 4, ease: "power1.in" }, 13.5)

    // PART 3: The Nose Cone (Top) - Only happens after engine drops
    .to(".layer-1", { x: "-5vw", y: "-5vh", duration: 2, ease: "power2.out" }, 16.5) 
    .to(".layer-1 .rocket-layer", { rotation: -30, duration: 2, ease: "power2.out" }, 16.5) 
    .to(".node-1", { opacity: 1, duration: 1 }, 16.5)
    
    // Nose cone free fall out of frame
    .to(".layer-1", { y: "150vh", duration: 4, ease: "power1.in" }, 18.5)

    // PART 4: The Main Core Escapes (Center) - After everything else is gone
    .to(".node-3", { opacity: 1, duration: 1 }, 21.5) 
    .to(".layer-3", { scale: 1.1, duration: 2, ease: "power1.inOut" }, 21.5) 
    
    // 1. Scene 3 fades in behind the rocket with a heavy blur
    .set("#scene-3", { filter: "blur(20px)" }, 22)
    .to("#scene-3", { opacity: 1, duration: 3, ease: "power1.inOut" }, 22)

    // 2. Rocket cinematically flies passing the camera
    .to(".layer-3", { y: "-150vh", scale: 2, duration: 4, ease: "power3.in" }, 24)
    .to(".node-3", { opacity: 0, duration: 1 }, 24)

    // 3. Blur is removed to reveal the stars clearly now that the rocket has passed
    .to("#scene-3", { filter: "blur(0px)", duration: 2, ease: "power2.out" }, 27)

    // 4. Then the constellation starts forming (merged into this pinned timeline)
    .to(".constellation-path", { strokeDashoffset: 0, duration: 2.5, ease: "power1.inOut" }, 29)
    .to(".star-label", { opacity: 1, stagger: 0.2, duration: 1.5 }, 29.5)
    
    // Finalize pinned sequence by unlocking pointers for Scene 3 projects
    .set("#scene-3", { pointerEvents: "auto" });

// First, accurately measure each path length for perfect draw animation BEFORE scroll
const paths = document.querySelectorAll('.constellation-path');
paths.forEach(path => {
    const pLength = path.getTotalLength();
    path.style.strokeDasharray = pLength;
    path.style.strokeDashoffset = pLength; // initially hidden
});

// ------------------------------------------------------------------------------------------------ //
// Phase 6: Scene 4 - The Glasshouse (Horizontal Scroll)
const tlGlasshouse = gsap.timeline({
    scrollTrigger: {
        trigger: "#scene-4",
        start: "top top",
        end: "+=3000", // Scroll for 3000px vertically to slide the 4 cards
        scrub: 1,
        pin: true,
    }
});

tlGlasshouse.to(".horizontal-scroll-container", {
    // Scroll horizontally the exact width of the container minus one viewport width
    x: () => -(document.querySelector('.horizontal-scroll-container').scrollWidth - window.innerWidth),
    ease: "none",
    duration: 4
})
// "after the all the cards are done then make them blur"
.to(".glass-card", { filter: "blur(20px)", opacity: 0.2, duration: 1 }, ">");

// ------------------------------------------------------------------------------------------------ //
// Phase 7: Scene 5 - Hyperdrive Jump & Info Screen

// Generate Hyperdrive Streaks dynamically
const hyperZone = document.querySelector('.hyperdrive-zone');
if (hyperZone) {
    for (let i = 0; i < 60; i++) {
        const streak = document.createElement('div');
        streak.classList.add('hyper-streak');
        // Random starting parameters
        const angle = Math.random() * 360;
        const distance = Math.random() * 100; // start near center
        streak.style.transform = `rotate(${angle}deg) translateY(${distance}px)`;
        // Store base angle for animation
        streak.dataset.angle = angle;
        hyperZone.appendChild(streak);
    }
}

const tlHyperdrive = gsap.timeline({
    scrollTrigger: {
        trigger: "#scene-5",
        start: "top top",
        end: "+=2000",
        scrub: 1,
        pin: true,
    }
});

tlHyperdrive
    // 1. Stars dramatically stretch and accelerate outward into lines (Hyperdrive start)
    .to(".hyper-streak", { 
        height: () => 500 + Math.random() * 500 + "px", // stretch massively
        y: () => 500 + Math.random() * 500, // explode outwards from center
        opacity: 1, 
        duration: 2, 
        ease: "power4.in" 
    }, 0)
    // 2. The whole zone scales slightly to enhance the incoming speed
    .to(".hyperdrive-zone", { scale: 1.5, duration: 2, ease: "power2.in" }, 0)
    // 3. Screen flashes to pure white to mask the transition
    .to("#white-screen", { opacity: 1, duration: 0.5 }, ">-0.4")
    // Keep it interactive
    .set("#white-screen", { pointerEvents: "auto" })
    // 4. Fade in text links on the white screen
    .to(".transmission-tail", { opacity: 1, y: 0, duration: 1, ease: "power2.out" });