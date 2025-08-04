// Smooth scroll: khi click vào trigger, cuộn đến block đích
const goToBlock = (triggerSelector, targetSelector) => {
    $(triggerSelector).on("click", e => {
        e.preventDefault();
        $("html, body").animate({
                scrollTop: $(targetSelector).offset().top
            },
            1000
        );
    });
};

// Khởi tạo GSAP an toàn
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

const animationHands = () => {
    // Kiểm tra GSAP trước khi sử dụng
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error('GSAP or ScrollTrigger not available');
        return;
    }
    
    // Sử dụng class cụ thể để tránh xung đột
    const h_left = '.hand-wrap .video-hand-left';
    const h_right = '.hand-wrap .video-hand-right';
    const h_wrap = '.hand-wrap';
    
    const handWrap = document.querySelector(h_wrap);
    const handLeft = document.querySelector(h_left);
    const handRight = document.querySelector(h_right);

    if (!handWrap || !handLeft || !handRight) {
        console.error('Hand elements not found!');
        console.log('handWrap:', handWrap);
        console.log('handLeft:', handLeft);
        console.log('handRight:', handRight);
        return;
    }

    console.log('✅ Hand elements found, creating animation...');

    // Set initial position
    gsap.set(h_left, {
        x: "0%"
    });
    gsap.set(h_right, {
        x: "0%"
    });
    
    const timeRun = 1.5;
    ScrollTrigger.create({
        trigger: h_wrap,
        start: "top 80%",
        end: "top 50%",
        markers: false, // Đặt true để debug
        onEnter: () => {
            console.log("✅ Hands animation: onEnter triggered");
            gsap.to(h_left, {
                x: "-40%",
                duration: timeRun,
                ease: "power1.out"
            });
            gsap.to(h_right, {
                x: "47%",
                duration: timeRun,
                ease: "power1.out"
            });
        },
        onLeaveBack: () => {
            console.log("✅ Hands animation: onLeaveBack triggered");
            gsap.to(h_left, {
                x: "0%",
                duration: timeRun,
                ease: "power1.out"
            });
            gsap.to(h_right, {
                x: "0%",
                duration: timeRun,
                ease: "power1.out"
            });
        }
    });
};

const animateConChim = () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error('GSAP not available for conchim animation');
        return;
    }

    gsap.set(".conchim", {
        bottom: "30%",
        left: "0%",
        scaleX: 1,
        position: "absolute"
    });

    const timeRun = 4;

    ScrollTrigger.create({
        trigger: ".section-heading.vanhoanghethuat",
        start: "top 50%",
        onEnter: () => {
            const tl = gsap.timeline();

            // 1. Bay tới trước
            tl.to(".conchim", {
                bottom: "6%",
                left: "68%",
                duration: timeRun,
                ease: "power1.out"
            });

            // 2. Sau khi bay xong -> flip mặt
            tl.to(".conchim", {
                scaleX: -1,
                duration: 0.3,
                ease: "power1.inOut"
            }, "+=0.1");
        },

        onLeaveBack: () => {
            gsap.to(".conchim", {
                bottom: "30%",
                left: "0%",
                scaleX: 1,
                duration: timeRun - 1,
                ease: "power1.out"
            });
        },
    });
};

const animateThuyen = () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error('GSAP not available for thuyen animation');
        return;
    }

    if (window.innerWidth < 767) {
        gsap.set(".thuyen", {
            top: "18%",
            right: "-6%",
            scaleX: 1,
            position: "absolute"
        });
    } else {
        gsap.set(".thuyen", {
            top: "12%",
            right: "-6%",
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
                    top: "24%",
                    right: "18%",
                    duration: timeRun,
                    ease: "power1.out"
                });
            } else {
                tl.to(".thuyen", {
                    top: "18%",
                    right: "21%",
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
                    top: "12%",
                    right: "-6%",
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

// ===== MAIN INITIALIZATION =====
document.addEventListener("DOMContentLoaded", () => {
    console.log('🚀 DOM loaded, checking libraries...');
    console.log('GSAP available:', typeof gsap !== 'undefined');
    console.log('ScrollTrigger available:', typeof ScrollTrigger !== 'undefined');
    console.log('jQuery available:', typeof $ !== 'undefined');
    
    // Chờ libraries load xong
    const waitForLibraries = () => {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            console.log('✅ All libraries loaded, initializing...');
            
            if (initGSAP()) {
                console.log('✅ GSAP initialized successfully');
                
                setTimeout(() => {
                    animationHands();
                    animateConChim();
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

// Separate jQuery initialization để tránh conflict
$(document).ready(() => {
    // Smooth scroll functions
    goToBlock('.scroll-trigger', '.target-section');
});
