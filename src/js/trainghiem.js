const animateThuyen = () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error('GSAP not available for thuyen animation');
        return;
    }
    // Random cycle function
    const randomCycle = () => {
        const randomY = gsap.utils.random(-15, 10);
        const randomX = gsap.utils.random(-8, 8);
        const randomRotation = gsap.utils.random(-3, 3);
        const randomDuration = gsap.utils.random(1.7, 2.3); // Giảm xuống quanh 2s
        const randomDelay = gsap.utils.random(0.2, 0.5);    // Delay ngắn hơn

        gsap.to(".trainghiem .conthuyen", {
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
    randomCycle();
};

const animateDieu = () => {
    if (typeof gsap === 'undefined') {
        console.error('GSAP not available for dieu animation');
        return;
    }

    const duration = 3.5;
    gsap.to('.trainghiem .condieu', {
        rotation: 10,
        x: 20,
        duration: duration,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1
    });
    gsap.to('.trainghiem .condieu', {
        rotation: -10,
        x: -20,
        duration: duration,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 2
    });
}

const animateNiemTuHaoSlider = () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error('GSAP or ScrollTrigger not available for niemtuhao slider animation');
        return;
    }
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.tn-niemtuhao__slider',
            start: 'top 20%',
            toggleActions: 'play none none none',
            once: true,
            // markers: true
        }
    });

    // Rơi xuống và nảy
    tl.fromTo('.tn-niemtuhao__slider',
        { y: -200, opacity: 0, rotation: 0 },
        { y: 0, opacity: 1, duration: 1.1, ease: 'bounce.out', rotation: 0 }
    )
    // Lắc xoay trái phải như khung tranh
    .to('.tn-niemtuhao__slider', {
        rotation: -8,
        duration: 0.13,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 1
    })
    .to('.tn-niemtuhao__slider', {
        rotation: 6,
        duration: 0.11,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 1
    })
    .to('.tn-niemtuhao__slider', {
        rotation: -4,
        duration: 0.09,
        ease: 'sine.inOut'
    });
};

const animateKhoiDauHanhTrinhSlider = () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error('GSAP or ScrollTrigger not available for khoidauhanhtrinh slider animation');
        return;
    }

    const elems = document.querySelectorAll('.tn-khoidauhanhtrinh__slider');

    gsap.set(elems, { y: '100%', opacity: 0 });

    gsap.to(elems, {
        y: '0%',
        opacity: 1,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.tn-khoidauhanhtrinh__khunggo', // Đổi trigger thành khunggo
            start: 'top 95%', // Khi top khunggo chạm 70% viewport (tức là cách 30% từ trên)
            toggleActions: 'play none none none',
            once: true,
            // markers: true
        }
    });

     if (window.innerWidth < 767) {
        gsap.to(elems, {
            y: '0%',
            opacity: 1,
            duration: 2,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.tn-khoidauhanhtrinh__khunggo', // Đổi trigger thành khunggo
                start: 'top', // Khi bottom khunggo chạm 5% viewport (tức là cách 5% từ dưới)
                toggleActions: 'play none none none',
                once: true,
                // markers: true
            }
        });

    }
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
    const waitForLibraries = () => {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            console.log('✅ All libraries loaded, initializing...');

            if (initGSAP()) {
                console.log('✅ GSAP initialized successfully');

                setTimeout(() => {
                    animateThuyen();
                    animateDieu();
                    animateNiemTuHaoSlider(); // Chỉ gọi cho slider NIEMTUHAO
                    // KHÔNG gọi animateKhoiDauHanhTrinhSlider() ở đây nữa!
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

function initSliders() {
    $('#slider-niemtuhao').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: false,
        arrows: true,
        infinite: false,
    });

    $('#slider-khoidauhanhtrinh').on('init', function() {
        animateKhoiDauHanhTrinhSlider(); // CHỈ gọi ở đây
        ScrollTrigger.refresh();
    }).slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: false,
        arrows: true,
        infinite: false,
    });
}

$(document).ready(() => {
    initSliders();
    // animateNiemTuHaoSlider(); // Nếu cần, gọi ở đây hoặc sau khi slider đã init
});


$(window).on('resize', function(){
});


//