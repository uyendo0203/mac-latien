const LoadingAnimation = () => {
    const tl = gsap.timeline({
        delay: 2 // Thêm độ trễ 5 giây trước khi bắt đầu animation
    });

    gsap.to(['.la-bay'], {
        opacity: 0,
        ease: 'power3.inOut',
    }, 6);

    const configForTreeBird = {
        opacity: 1,
        x: 0,
        y: 0
    }

    // STEP 0: Set trạng thái ban đầu cho tất cả
    tl.set(['.tree-1', '.tree-2', '.tree-3', '.tree-4'], {
        ...configForTreeBird,
        scale: 1
    });
    tl.set(['.bird'], {
        ...configForTreeBird
    });

    tl.set('.text-lost', {
        opacity: 0,
        scale: 1
    });

    if (window.innerWidth < 1024) {
        tl.set('.center', {
            y: '-35%'
        });
    } else {
        tl.set('.center', {
            y: '-31%'
        });
    }


    // STEP 1: Tree & bird di chuyển từ giây 2 → 5
    const startFromTimeBird = 3; // Bắt đầu từ giây 3
    const configDurationTreeBird = {
        duration: 3,
    };
    const configEaseTreeBird = {
        ease: 'power3.inOut',
    };
    const configScaleTreeInOut = {
        scale: 2.5
    }
    tl.to('.tree-1', {
        x: '-100%',
        ...configScaleTreeInOut,
        ...configDurationTreeBird,
        ...configEaseTreeBird
    }, startFromTimeBird);

    tl.to('.tree-2', {
        x: '100%',
        ...configScaleTreeInOut,
        ...configDurationTreeBird,
        ...configEaseTreeBird
    }, startFromTimeBird);

    tl.to(['.tree-3', '.tree-4'], {
        y: '100%',
        ...configScaleTreeInOut,
        ...configDurationTreeBird,
        ...configEaseTreeBird
    }, startFromTimeBird);

    tl.to('.bird', {
        x: '-100%',
        ...configDurationTreeBird,
        ...configEaseTreeBird
    }, startFromTimeBird);

    // STEP 2: text-lost fade in từ 3s → 5s
    const startFromTimeLost = 1; // Bắt đầu từ 
    tl.to('.text-lost', {
        opacity: 1,
        duration: 1,
        ease: 'power2.out'
    }, startFromTimeLost);
    tl.to('.text-lost', {
        scale: 5,
        opacity: 0,
        duration: 1,
        ease: 'power1.in',
        transformOrigin: 'center center'
    }, 3);



    // STEP 4: Tree & bird fade out tại 7s
    const configForTreeBirdOut = {
        opacity: 0,
        duration: 0.5,
        ease: 'power1.inOut'
    }
    // Reset lại để GSAP hiểu rõ trạng thái trước khi bắt đầu zoom
    tl.to(['.tree-1', '.tree-2', '.tree-3', '.tree-4'], {
        transformOrigin: 'center center',
        ease: 'power4.in',
        ...configForTreeBirdOut
    }, 7);
    tl.to(['.bird'], {
        ...configForTreeBirdOut
    }, 7);


    // Cloud-1 không bị ảnh hưởng bởi delay
    gsap.set('.cloud-1', {
        y: 0,
        x: '8%',
    });

    gsap.to('.cloud-1', {
        x: '-20%',
        duration: 11,
        ease: 'power3.inOut',
    });

    /*  STEP 5: center bật lên tại 5.3s */

    let yVal = 0;

    if (window.innerWidth < 800) {
        yVal = '-16%';
    } else if (window.innerWidth < 1024) {
        yVal = '-33%';
    } else {
        yVal = 0;
    }

    tl.to('.center', {
        y: yVal,
        yPercent: 0,
        duration: 1.5,
        ease: 'power2.out'
    }, 5);

    /* STEP 6: logo-lasting xuất hiện tại 6.5s */
    tl.to('.text-lasting', {
        opacity: 1,
        duration: 1.2,
        ease: 'power3.inOut'
    }, 6.5);
};

const LoadingAnimationTime = () => {
    const tl = gsap.timeline();

    // ... (các bước animation như bạn đã có)

    // BẮT ĐẦU ĐOẠN BỘ ĐẾM
    let start = null;
    const timerElement = document.querySelector('.timer');

    const updateTime = (timestamp) => {
        if (!start) start = timestamp;
        const elapsed = (timestamp - start) / 1000; // giây
        timerElement.textContent = `${elapsed.toFixed(1)}s`;

        // chạy đến 10 giây là dừng (hoặc sửa tùy bạn)
        if (elapsed < 10) {
            requestAnimationFrame(updateTime);
        } else {
            timerElement.textContent = `10.0s`;
        }
    };

    requestAnimationFrame(updateTime);
};


const audioPlay = () => {
    const $audio = $('.audio-media')[0];

    // Ban đầu muted để tránh browser chặn autoplay
    $audio.muted = true;
    let isMuted = true;

    // Trạng thái ban đầu: nhạc tắt → hiện icon pause
    $('.audio-play').hide();
    $('.audio-pause').show();

    // ✅ Bất kỳ click nào trên trang → nếu đang mute thì bật nhạc
    $(document).on('click', function () {
        if (isMuted) {
            $audio.muted = false;
            $audio.play();
            isMuted = false;

            // Nhạc đang phát → hiện icon play
            $('.audio-play').show();
            $('.audio-pause').hide();
        }
    });

    // ✅ Click icon để bật/tắt nhạc
    $('.audio-btn').on('click', function (e) {
        e.stopPropagation(); // Ngăn sự kiện lan ra ngoài

        isMuted = !isMuted;
        $audio.muted = isMuted;

        if (isMuted) {
            // Nhạc tắt → hiện icon pause
            $('.audio-play').hide();
            $('.audio-pause').show();
        } else {
            // Nhạc phát → hiện icon play
            $('.audio-play').show();
            $('.audio-pause').hide();
            $audio.play();
        }
    });
};




$(document).ready(() => {
    audioPlay()
    LoadingAnimation()
});