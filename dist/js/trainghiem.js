// =================== ANIMATIONS ===================

const animateThuyen = () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error('GSAP not available for thuyen animation');
        return;
    }
    const randomCycle = () => {
        const randomY = gsap.utils.random(-15, 10);
        const randomX = gsap.utils.random(-8, 8);
        const randomRotation = gsap.utils.random(-3, 3);
        const randomDuration = gsap.utils.random(1.7, 2.3);
        const randomDelay = gsap.utils.random(0.2, 0.5);

        gsap.to(".trainghiem .conthuyen", {
            y: randomY,
            x: randomX,
            rotation: randomRotation,
            duration: randomDuration,
            ease: "power2.inOut",
            delay: randomDelay,
            onComplete: () => randomCycle()
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
};

// helper: kiểm tra element có trong viewport ko
function isElementInViewport(el) {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
}


const animateNiemTuHaoSlider = () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.error('GSAP or ScrollTrigger not available for niemtuhao slider animation');
    return;
  }

  const triggerSelector = '.tn-niemtuhao__slider';
  const triggerEl = document.querySelector(triggerSelector);
  if (!triggerEl) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: triggerSelector,
      start: 'top 80%',
      toggleActions: 'play none none none',
      once: true,
      onEnter: () => {
        if (!$('#slider-niemtuhao').hasClass('slick-initialized')) {
          initSingleSlider('#slider-niemtuhao');
        }
      }
    }
  });

  tl.fromTo(triggerSelector,
    { y: -200, rotation: 0 },
    { y: 0, duration: 1.1, ease: 'bounce.out' }
  )
  // lắc trái
  .to(triggerSelector, {
    rotation: -8,
    duration: 0.2,
    ease: 'sine.inOut'
  })
  // lắc phải
  .to(triggerSelector, {
    rotation: 6,
    duration: 0.2,
    ease: 'sine.inOut'
  })
  // lắc nhỏ hơn
  .to(triggerSelector, {
    rotation: -4,
    duration: 0.15,
    ease: 'sine.inOut'
  })
  // cuối cùng về thẳng
  .to(triggerSelector, {
    rotation: 0,
    duration: 0.1,
    ease: 'sine.inOut'
  });
};





const animateKhoiDauHanhTrinhSlider = () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error('GSAP or ScrollTrigger not available for khoidauhanhtrinh slider animation');
        return;
    }

    const elems = document.querySelectorAll('.tn-khoidauhanhtrinh__slider');

    gsap.set(elems, {
        y: '100%',
        opacity: 0
    });

    gsap.to(elems, {
        y: '0%',
        opacity: 1,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.tn-khoidauhanhtrinh__khunggo',
            start: 'top 95%',
            toggleActions: 'play none none none',
            once: true,
        }
    });

    if (window.innerWidth < 767) {
        gsap.to(elems, {
            y: '0%',
            opacity: 1,
            duration: 2,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.tn-khoidauhanhtrinh__khunggo',
                start: 'top',
                toggleActions: 'play none none none',
                once: true,
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

// =================== SLICK SLIDERS ===================

/**
 * initSingleSlider:
 * - ẩn slider trước khi init (opacity:0, visibility:hidden)
 * - gắn one('init') handler trước khi gọi .slick()
 * - khi init xong: show (gsap -> jQuery animate fallback)
 * - chờ tất cả ảnh load rồi gọi setPosition()
 */
function initSingleSlider(selector) {
    const $el = $(selector);
    if (!$el.length) return;

    if (typeof $.fn.slick !== 'function') {
        console.error('❌ Slick chưa load');
        return;
    }

    // Nếu đã init rồi, đảm bảo visible và setPosition
    if ($el.hasClass('slick-initialized')) {
        // đảm bảo hiển thị
        $el.css({
            visibility: 'visible',
            opacity: 1
        });
        try {
            $el.slick('setPosition');
        } catch (e) {}
        return;
    }

    // 1) Ẩn slider trước khi init (vẫn giữ layout parent visible)
    //    visibility:hidden để nó không hiển thị; opacity cho animation fade-in.
    $el.css({
        visibility: 'hidden',
        opacity: 0
    });

    // 2) Gắn handler 'init' trước khi gọi slick
    $el.one('init', function (event, slick) {
        const $this = $(this);
        // Hiện slider: prefer GSAP nếu có
        $this.css('visibility', 'visible');
        if (typeof gsap !== 'undefined') {
            try {
                gsap.to($this, {
                    opacity: 1,
                    duration: 0.45,
                    ease: 'power1.out'
                });
            } catch (e) {
                // fallback
                $this.animate({
                    opacity: 1
                }, 300);
            }
        } else {
            $this.animate({
                opacity: 1
            }, 300);
        }

        // 3) Chờ tất cả ảnh load xong rồi setPosition lần nữa
        const $imgs = $this.find('img');
        if ($imgs.length === 0) {
            // không có ảnh -> setPosition ngay
            try {
                $this.slick('setPosition');
            } catch (e) {}
            return;
        }

        let loaded = 0,
            total = $imgs.length;
        $imgs.each(function () {
            if (this.complete && this.naturalWidth !== 0) {
                loaded++;
            } else {
                // bind once for load/error
                $(this).one('load error', function () {
                    loaded++;
                    if (loaded >= total) {
                        try {
                            $this.slick('setPosition');
                        } catch (e) {}
                    }
                });
            }
        });
        // nếu tất cả đã load rồi
        if (loaded >= total) {
            try {
                $this.slick('setPosition');
            } catch (e) {}
        }
    });

    // 4) Gọi slick (handler init đã đính kèm)
    $el.slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: false,
        arrows: true,
        infinite: false,
        adaptiveHeight: true,
        // optional: disable autoplay to avoid layout jump; uncomment nếu muốn
        // autoplay: false,
        // autoplaySpeed: 3000,
    });
}

function initSliders() {
    initSingleSlider('#slider-khoidauhanhtrinh');
    // ❌ không init #slider-niemtuhao ở đây nữa, chỉ init sau GSAP animation
}

// =================== MAIN INIT ===================

document.addEventListener("DOMContentLoaded", () => {
    const waitForLibraries = () => {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            console.log('✅ All libraries loaded, initializing...');
            if (initGSAP()) {
                console.log('✅ GSAP initialized successfully');
                setTimeout(() => {
                    animateThuyen();
                    animateDieu();
                    animateNiemTuHaoSlider(); // 🔥 gọi ở đây (sẽ init #slider-niemtuhao sau khi animation end)
                    animateKhoiDauHanhTrinhSlider();
                    ScrollTrigger.refresh();
                    console.log('✅ All animations initialized');
                }, 500);
            }
        } else {
            console.log('⏳ Waiting for libraries...');
            setTimeout(waitForLibraries, 100);
        }
    };
    waitForLibraries();
});

// jQuery init (các slider khác)
$(document).ready(() => {
    initSliders();
});

// fallback refresh khi toàn bộ ảnh đã load
$(window).on('load', function () {
    if ($('#slider-niemtuhao').hasClass('slick-initialized')) {
        $('#slider-niemtuhao').slick('setPosition');
        // đảm bảo visible nếu vì lý do nào đó chưa show
        $('#slider-niemtuhao').css({
            visibility: 'visible',
            opacity: 1
        });
    }
    if ($('#slider-khoidauhanhtrinh').hasClass('slick-initialized')) {
        $('#slider-khoidauhanhtrinh').slick('setPosition');
    }
});

// refresh on resize để tránh layout vỡ
$(window).on('resize', function () {
    if ($('#slider-niemtuhao').hasClass('slick-initialized')) {
        $('#slider-niemtuhao').slick('setPosition');
    }
    if ($('#slider-khoidauhanhtrinh').hasClass('slick-initialized')) {
        $('#slider-khoidauhanhtrinh').slick('setPosition');
    }
});