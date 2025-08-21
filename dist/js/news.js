function initNewsSliders() {
    // Đơn vị phân phối: chỉ 1 item, dots, không arrow
    $('.news__slider.donviphanphoi').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        arrows: false,
        infinite: true
    });
    $('.agency .news__slider').slick({
        // slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        arrows: false,
        infinite: true,
        rows: 3,
        slidesPerRow: 3
    });

    // Bình thường: 3 item, scroll 1, dots, không arrow
    $('.news__slider.normal').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        dots: true,
        arrows: false,
        infinite: true,
        responsive: [{
            breakpoint: 600,
            settings: {
                slidesToShow: 1
            }
        }]
    });
}


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
                    bottom: "-1%",
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

function animationClouds() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error('GSAP or ScrollTrigger not available');
        return;
    }

    const cloud1 = document.querySelector('.news-hero__cloud-1');
    const cloud2 = document.querySelector('.news-hero__cloud-2');
    const heroSection = document.querySelector('.news-hero');

    if (!cloud1 || !cloud2 || !heroSection) {
        console.error('Cloud elements or hero section not found!');
        return;
    }

    // Set initial position
    gsap.set(cloud1, {
        x: "-20%",
        opacity: 0
    });
    gsap.set(cloud2, {
        x: "20%",
        opacity: 0
    });

    const timeRun = 1.5;
    ScrollTrigger.create({
        trigger: heroSection,
        start: "top 80%",
        end: "top 50%",
        onEnter: () => {
            gsap.to(cloud1, {
                x: "-60%",
                opacity: 1,
                duration: timeRun,
                ease: "power1.out"
            });
            gsap.to(cloud2, {
                x: "90%",
                opacity: 1,
                duration: timeRun,
                ease: "power1.out"
            });
        },
        onLeaveBack: () => {
            gsap.to(cloud1, {
                x: "-5%",
                opacity: 0,
                duration: timeRun,
                ease: "power1.out"
            });
            gsap.to(cloud2, {
                x: "5%",
                opacity: 0,
                duration: timeRun,
                ease: "power1.out"
            });
        }
    });
}

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
                    animationClouds();
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
            const before = heading.querySelector('.before-effect');
            if (!before) return;
            if (rect.top <= winH * 0.2 && rect.bottom > winH * 0.1) {
                before.style.transition = "bottom 0.5s cubic-bezier(0.4,0,0.2,1)";
                before.style.bottom = "0";
            } else {
                before.style.bottom = "3rem"; // hoặc giá trị mặc định
            }
        });
    }

    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onScroll);
    onScroll();
}   

function fadeUpOnScroll() {
    const fadeUpItems = document.querySelectorAll('[data-ani="fade-up"]');

    function checkFadeUp() {
        const windowHeight = window.innerHeight;
        const triggerPoint = windowHeight / 2; // Giữa màn hình

        fadeUpItems.forEach(item => {
            // Nếu đã hiện rồi thì bỏ qua
            if (item.classList.contains('fadeup-active')) return;

            const rect = item.getBoundingClientRect();
            if (rect.top < triggerPoint && rect.bottom > triggerPoint) {
                item.classList.add('fadeup-active');
            }
        });
    }

    window.addEventListener('scroll', checkFadeUp);
    window.addEventListener('resize', checkFadeUp);
    checkFadeUp();
}

function gsapNewsSectionAnimation() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    document.querySelectorAll('[data-ani="news"]').forEach(section => {
        const heading = section.querySelector('.news__heading');
        const headingImg = section.querySelector('.news__heading .heading-image');
        const slider = section.querySelector('.news__slider');

        if (!heading || !headingImg || !slider) return;

        // Xác định start theo kích thước màn hình
        const isMobile = window.innerWidth < 767;
        const startValue = isMobile ? "top 80%" : "top 50%";

        // GSAP timeline cho từng section
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: startValue,
                toggleActions: "play reverse play reverse",
                // markers: true
            }
        });
        // 1. Fade up heading và slider cùng lúc (hiệu ứng rõ hơn)
        tl.fromTo([heading, slider], 
            { opacity: 0, y: 100 }, 
            { opacity: 1, y: 0, duration: 1, ease: "power2.out", stagger: 0 }, // chạy đồng thời
        );

        // 2. Show headingImg (fade up) sau 0.2s
        tl.fromTo(headingImg, 
            { opacity: 0, y: 60 }, 
            { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 
            "+=0.05"
        );
    });
}

// Gọi hàm này sau khi DOM ready và GSAP đã sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
    gsapNewsSectionAnimation();
});

// Gọi hàm fadeUpOnScroll sau khi DOM ready
$(document).ready(() => {
    initNewsSliders();
    activateNewsHeadingOnScroll();
    fadeUpOnScroll();
});

