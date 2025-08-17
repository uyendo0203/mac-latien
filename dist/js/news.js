function initNewsSliders() {
    // Đơn vị phân phối: chỉ 1 item, dots, không arrow
    $('.news__slider.donviphanphoi').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        arrows: false,
        infinite: true
    });

    // Bình thường: 3 item, scroll 1, dots, không arrow
    $('.news__slider.normal').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        dots: true,
        arrows: false,
        infinite: true,
        responsive: [
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });
}


const animateThuyen = () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error('GSAP not available for thuyen animation');
        return;
    }

    if (window.innerWidth < 767) {
        gsap.set(".thuyen", {
            top: "18%",
            right: "4%",
            scaleX: 1,
            position: "absolute"
        });
    } else {
        gsap.set(".thuyen", {
            top: "30%",
            right: "-16%",
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
                    top: "33%",
                    right: "-16%",
                    duration: timeRun,
                    ease: "power1.out"
                });
            } else {
                tl.to(".thuyen", {
                    top: "34%",
                    right: "-2%",
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
                    top: "18%",
                    right: "-6%",
                    scaleX: 1,
                    rotation: 0,
                    y: 0,
                    x: 0,
                    duration: timeRun - 1,
                    ease: "power1.out"
                });
            } else {
                gsap.to(".thuyen", {
                     top: "34%",
                    right: "-2%",
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

function activateNewsHeadingOnScroll() {
    const headings = document.querySelectorAll('.news__heading');

    function onScroll() {
        const winH = window.innerHeight;
        headings.forEach(heading => {
            const section = heading.closest('section');
            if (!section) return;
            const rect = section.getBoundingClientRect();
            // Nếu section top <= 20% viewport và bottom > 10% viewport thì active
            if (rect.top <= winH * 0.2 && rect.bottom > winH * 0.1) {
                heading.classList.add('active');
            } else {
                heading.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onScroll);
    onScroll();
}

$(document).ready(() => {
    console.log(11);
    initNewsSliders();
    activateNewsHeadingOnScroll();
});