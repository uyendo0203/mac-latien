const animateThuyen = () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error('GSAP not available for thuyen animation');
        return;
    }

    if (window.innerWidth < 767) {
        gsap.set(".thuyen", {
            right: "-11%",
            bottom: "6%",
            scaleX: 1,
            position: "absolute"
        });
    } else {
        gsap.set(".thuyen", {
            right: "-5%",
            bottom: "18%",
            scaleX: 1,
            position: "absolute"
        });
    }

    const timeRun = 4;
    let animationActive = false;

    ScrollTrigger.create({
        trigger: ".thuyen",
        start: "top 50%",
        onEnter: () => {
            if (animationActive) return;

            const tl = gsap.timeline({
                onComplete: () => {
                    animationActive = true;
                    randomCycle();
                }
            });

            if (window.innerWidth < 767) {
                tl.to(".thuyen", {
                    right: "0%",
                    bottom: "-4%",
                    duration: timeRun,
                    ease: "power1.out"
                });
            } else {
                tl.to(".thuyen", {
                    bottom: "11%",
                    right: "6%",
                    duration: timeRun,
                    ease: "power1.out"
                });
            }
        },

        onLeaveBack: () => {
            animationActive = false;
            gsap.killTweensOf(".thuyen");

            if (window.innerWidth < 767) {
                gsap.to(".thuyen", {
                    right: "-11%",
                    bottom: "6%",
                    scaleX: 1,
                    rotation: 0,
                    y: 0,
                    x: 0,
                    duration: timeRun - 1,
                    ease: "power1.out"
                });
            } else {
                gsap.to(".thuyen", {
                    right: "-5%",
                    bottom: "18%",
                    scaleX: 1,
                    rotation: 0,
                    y: 0,
                    x: 0,
                    duration: timeRun - 1,
                    ease: "power1.out"
                });
            }
        }
    });

    // Random cycle function
    const randomCycle = () => {
        if (!animationActive) return;

        const randomY = gsap.utils.random(-15, 10);
        const randomX = gsap.utils.random(-8, 8);
        const randomRotation = gsap.utils.random(-3, 3);
        const randomDuration = gsap.utils.random(2, 4);
        const randomDelay = gsap.utils.random(0.5, 2);

        gsap.to(".thuyen", {
            y: randomY,
            x: randomX,
            rotation: randomRotation,
            duration: randomDuration,
            ease: "power2.inOut",
            delay: randomDelay,
            onComplete: () => {
                randomCycle();
            }
        });
    };
};

const initGSAP = () => {
    if (typeof gsap === 'undefined') {
        console.error('GSAP not loaded!');
        return false;
    }

    try {
        gsap.registerPlugin(ScrollTrigger);
        gsap.registerPlugin(Observer);
        ScrollTrigger.config({
            autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load,resize',
            syncInterval: 1
        });
        return true;
    } catch (error) {
        console.error('GSAP initialization failed:', error);
        return false;
    }
};

// ===== MAIN INITIALIZATION =====
document.addEventListener("DOMContentLoaded", () => {

    // Chờ libraries load xong
    const waitForLibraries = () => {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            console.log('✅ All libraries loaded, initializing...');

            if (initGSAP()) {
                console.log('✅ GSAP initialized successfully');

                setTimeout(() => {
                    animateThuyen();
                    ScrollTrigger.refresh();
                    console.log('✅ All animations initialized');
                }, 500);
            } else {
                console.error('❌ Failed to initialize GSAP');
            }
        } else {
            console.log('⏳ Waiting for libraries...');
            setTimeout(waitForLibraries, 100);
        }
    };

    waitForLibraries();

});

$(document).ready(() => {
});


$(window).on('resize', function(){
});

