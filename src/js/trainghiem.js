const animateThuyen = () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error('GSAP not available for thuyen animation');
        return;
    }
    // Random cycle function
    const randomCycle = () => {
        console.log(111);
        
        const randomY = gsap.utils.random(-15, 10);
        const randomX = gsap.utils.random(-8, 8);
        const randomRotation = gsap.utils.random(-3, 3);
        const randomDuration = gsap.utils.random(2, 4);
        const randomDelay = gsap.utils.random(0.5, 2);

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
    randomCycle()

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
                    animateDieu(); // Thêm dòng này để khởi động animation con diều
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
}


$(document).ready(() => {
    initSliders()
});


$(window).on('resize', function(){
});


//