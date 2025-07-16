const audioPlay = () => {
    const $audio = $('.audio-media')[0];
    $audio.muted = true;
    let isMuted = true;

    $('.audio-play').hide();
    $('.audio-pause').show();

    $(document).on('click', function () {
        if (isMuted) {
            $audio.muted = false;
            $audio.play();
            isMuted = false;
            $('.audio-play').show();
            $('.audio-pause').hide();
        }
    });

    $('.audio-btn').on('click', function (e) {
        e.stopPropagation();
        isMuted = !isMuted;
        $audio.muted = isMuted;

        if (isMuted) {
            $('.audio-play').hide();
            $('.audio-pause').show();
        } else {
            $('.audio-play').show();
            $('.audio-pause').hide();
            $audio.play();
        }
    });
};

const setInitialStates = () => {
    const baseTransform = {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        force3D: true
    };

    gsap.set(['.tree-1', '.tree-2', '.tree-3', '.tree-4', '.bird'], baseTransform);
    gsap.set('.text-lost', {
        opacity: 0,
        scale: 1,
        force3D: true
    });

    let centerY = 0;
    if (window.innerWidth < 800) centerY = '25%';
    else if (window.innerWidth < 1367) centerY = '11%';
    else centerY = 0;

    gsap.set('.center', {
        y: centerY,
        force3D: true
    });
    gsap.set('.cloud-1', {
        y: 0,
        x: '10%',
        force3D: true
    });
    gsap.set('.text-end', {
        opacity: 0
    });

    if (window.innerWidth < 1367 && window.innerWidth > 800) {
        gsap.set('.center-img', {
            scale: 2,
            force3D: true
        });
    }
};

const LoadingAnimation = () => {
    const tl = gsap.timeline({
        delay: 2
    });

    // Lá bay mờ dần
    gsap.to('.la-bay', {
        opacity: 0,
        duration: 1.2,
        ease: 'power3.inOut',
        force3D: true
    }, 6);

    const treeBirdCommon = {
        duration: 3,
        ease: 'power3.inOut',
        scale: 2.0,
        force3D: true
    };

    tl.to('.tree-1', {
        x: '-100%',
        ...treeBirdCommon
    }, 3);
    tl.to('.tree-2', {
        x: '100%',
        ...treeBirdCommon
    }, 3);
    tl.to(['.tree-3', '.tree-4'], {
        y: '100%',
        ...treeBirdCommon
    }, 3);
    tl.to('.bird', {
        x: '-100%',
        duration: 3,
        ease: 'power3.inOut',
        force3D: true
    }, 3);

    tl.to('.text-lost', {
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
        force3D: true
    }, 1);
    tl.to('.text-lost', {
        scale: 5,
        opacity: 0,
        duration: 1,
        ease: 'power1.in',
        transformOrigin: 'center center',
        force3D: true
    }, 3);

    const fadeOutConfig = {
        opacity: 0,
        duration: 0.5,
        ease: 'power1.inOut',
        force3D: true
    };

    tl.to(['.tree-1', '.tree-2', '.tree-3', '.tree-4'], fadeOutConfig, 7);
    tl.to('.bird', fadeOutConfig, 7);

    // Mây di chuyển
    gsap.to('.cloud-1', {
        x: '-20%',
        duration: 6.5,
        ease: 'linear',
        force3D: true
    });

    // .center bật lên
    let centerYAfter = 0;
    if (window.innerWidth < 800) centerYAfter = '35%';
    else if (window.innerWidth < 1367) centerYAfter = '30%';
    else centerYAfter = '34%';

    tl.to('.center', {
        y: centerYAfter,
        yPercent: 0,
        duration: 1.5,
        ease: 'power2.out',
        force3D: true
    }, 5);

    tl.to(['.text-end', '.text-lasting'], {
        opacity: 1,
        duration: 1.2,
        ease: 'power3.inOut',
        force3D: true
    }, 6);
};


$(document).ready(() => {
    setInitialStates(); // 💡 Set ngay để tránh flash layout
    audioPlay(); // 🎵 Gắn event cho audio
    LoadingAnimation(); // 🌀 Khởi động animation sau 2s
});