// Lazy load images với IntersectionObserver
const lazyLoadImages = () => {
    const preloadImage = img => (img.src = img.dataset.src);
    const configOpts = {
        rootMargin: "0px 0px 250px 0px"
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                preloadImage(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, configOpts);

    document.querySelectorAll('.lazy-load').forEach(img => observer.observe(img));
};

// Contact form: Validate và submit form
const contactForm = () => {
    const validateForm = () => {
        let isValid = true;
        $(".form-item input, .form-item select").each(function () {
            const $field = $(this);
            const value = $field.val().trim();
            const fieldType = $field.attr("type");
            let errorMessage = "";

            if (value === "" || value === "1") {
                errorMessage = "Trường này không được để trống!";
                isValid = false;
            } else if (
                fieldType === "email" &&
                !/^\S+@\S+\.\S+$/.test(value)
            ) {
                errorMessage = "Email không hợp lệ!";
                isValid = false;
            } else if (
                fieldType === "number" &&
                !/^\d{10,}$/.test(value)
            ) {
                errorMessage = "Số điện thoại phải có ít nhất 10 chữ số!";
                isValid = false;
            }

            $field.siblings(".error").remove();
            if (errorMessage) {
                $field.after(`<span class="error">${errorMessage}</span>`);
            }
        });
        $(".submit").prop("disabled", !isValid);
        return isValid;
    };

    $(".form-item input, .form-item select").on("input change", validateForm);

    $("form").on("submit", function (e) {
        e.preventDefault();
        if (validateForm()) {
            $("#noti").addClass("active");
            // $(".toast").addClass("active");

            // this.submit();
        }
    });

    // Kiểm tra nếu có dữ liệu mặc định, tự động enable nút submit
    const checkDefaultData = () => {
        let isFilled = true;
        $(".form-item input, .form-item select").each(function () {
            const $field = $(this);
            const value = $field.val().trim();
            if (value === "" || value === "1") {
                isFilled = false;
            }
        });
        $(".submit").prop("disabled", !isFilled); // Enable submit nếu có dữ liệu
    };
    checkDefaultData();
};

$(document).ready(() => {

    // contactForm();
    lazyLoadImages();
    initYouTubePlayer();


    // Nếu bạn sử dụng AOS, khởi tạo nó:
    let aosInitialized = false;

    if (typeof AOS !== "undefined" && !aosInitialized) {
        AOS.init({once: true});
        aosInitialized = true;
    }

    $('.loading').removeClass('show')

    // Khi nhấn vào hamburger, toggle class "open" cho menu
    $('.menu-text-span').on('click', function (e) {
        if ($(window).width() < 767) {
            e.preventDefault();
            $('header').toggleClass('active');
        }
    });

    // $("#noti").addClass("active");
    $(".close-noti").on("click", function () {
        $("#noti").removeClass("active");
    });

    $(".toast .close ").on("click", function () {
        $(".toast").removeClass("active");
    });

    $(".register ").on("click", function () {
        $(".popup").addClass("active");
    });
    $('.popup-close').click(function () {
        $('.popup').removeClass('active');
    });

    $('.popup').click(function (event) {
        if (!$(event.target).closest('.popup-content').length) {
            $('.popup').removeClass('active');
        }
    });
});

$(window).resize(() => {});


// ==============================
// YouTube video API & play khi scroll
// ==============================

const initYouTubePlayer = () => {
    // Inject YouTube API script
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/player_api";
    document.getElementsByTagName("script")[0].parentNode.insertBefore(
        tag,
        document.getElementsByTagName("script")[0]
    );
};

let player;

function onYouTubePlayerAPIReady() {
    player = new YT.Player("video", {
        events: {
            onReady: onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    // Đảm bảo player đã được tạo và có phương thức playVideo
    if (player && typeof player.playVideo === 'function') {
        player.playVideo();
    } else {
        console.error("Player chưa sẵn sàng hoặc không phải là YT.Player");
    }
}

const VideoTvc = $("#video-tvc");
const playVideoWhenScrollTo = videoE => {
    const curPos = $(window).scrollTop();
    const space = 200;
    if (VideoTvc.length) {
        const top = VideoTvc.offset().top - space;
        const bottom = top + VideoTvc.outerHeight();
        if (curPos >= top && curPos <= bottom) {
            videoE?.playVideo();
        }
    }
};

$(window).on("scroll", () => {
    if ($("#video-tvc").length && player) {
        playVideoWhenScrollTo(player);
    }
});