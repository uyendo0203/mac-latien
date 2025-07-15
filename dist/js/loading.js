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
    const configForTreeBird = {
        opacity: 1,
        x: 0,
        y: 0
    };

    gsap.set(['.tree-1', '.tree-2', '.tree-3', '.tree-4'], {
        ...configForTreeBird,
        scale: 1
    });

    gsap.set('.bird', configForTreeBird);

    gsap.set('.text-lost', {
        opacity: 0,
        scale: 1
    });

    let centerY = 0;
    if (window.innerWidth < 800) {
        centerY = '-16%';
    } else if (window.innerWidth < 1024) {
        centerY = '-35%';
    } else {
        centerY = '-31%';
    }

    gsap.set('.center', { y: centerY });

    gsap.set('.cloud-1', {
        y: 0,
        x: '8%',
        transform: 'translateZ(0)'
    });
};

const LoadingAnimation = () => {
    const tl = gsap.timeline({ delay: 2 });

    gsap.to('.la-bay', {
        opacity: 0,
        ease: 'power3.inOut',
    }, 6);

    const startFromTimeBird = 3;
    const configDurationTreeBird = { duration: 3 };
    const configEaseTreeBird = { ease: 'power3.inOut' };
    const configScaleTreeInOut = { scale: 2.5 };

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

    tl.to('.text-lost', {
        opacity: 1,
        duration: 1,
        ease: 'power2.out'
    }, 1);

    tl.to('.text-lost', {
        scale: 5,
        opacity: 0,
        duration: 1,
        ease: 'power1.in',
        transformOrigin: 'center center'
    }, 3);

    const configForTreeBirdOut = {
        opacity: 0,
        duration: 0.5,
        ease: 'power1.inOut'
    };

    tl.to(['.tree-1', '.tree-2', '.tree-3', '.tree-4'], {
        transformOrigin: 'center center',
        ease: 'power4.in',
        ...configForTreeBirdOut
    }, 7);

    tl.to('.bird', configForTreeBirdOut, 7);

    gsap.to('.cloud-1', {
        x: '-20%',
        duration: 11,
        ease: 'power3.inOut',
    });

    let centerYAfter = 0;
    if (window.innerWidth < 800) {
        centerYAfter = '-16%';
    } else if (window.innerWidth < 1024) {
        centerYAfter = '-33%';
    } else {
        centerYAfter = 0;
    }

    tl.to('.center', {
        y: centerYAfter,
        yPercent: 0,
        duration: 1.5,
        ease: 'power2.out'
    }, 5);

    tl.to('.text-lasting', {
        opacity: 1,
        duration: 1.2,
        ease: 'power3.inOut'
    }, 6.5);
};

$(document).ready(() => {
    setInitialStates();  // 💡 Set ngay để tránh flash layout
    audioPlay();         // 🎵 Gắn event cho audio
    LoadingAnimation();  // 🌀 Khởi động animation sau 2s
});
