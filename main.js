document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. ORBITAL CURSOR LOGIC ---
    const core = document.querySelector('.orbital-core');
    const ring = document.querySelector('.orbital-ring');

    // Centers the elements
    gsap.set(core, { xPercent: -50, yPercent: -50 });
    gsap.set(ring, { xPercent: -50, yPercent: -50 });

    // Tracks the mouse movement
    window.addEventListener('mousemove', (e) => {
        gsap.to(core, { x: e.clientX, y: e.clientY, duration: 0 });
        gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.15, ease: "power2.out" });
    });

    // --- 2. INITIALIZE SMOOTH SCROLLING (LENIS) ---
    try {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
            smoothWheel: true
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    } catch (error) {
        console.error("Scroll engine failed to load:", error);
    }
    
});