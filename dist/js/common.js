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
    const validateForm = ($form) => {
        let isValid = true;
        $form.find(".form-item input, .form-item select").each(function () {
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

        $form.find(".submit").prop("disabled", !isValid);
        return isValid;
    };

    // Gán validate cho tất cả các form có .form-item
    $("form:has(.form-item)").each(function () {
        const $form = $(this);

        // Gắn sự kiện input/change cho từng form riêng
        $form.find(".form-item input, .form-item select").on("input change", function () {
            validateForm($form);
        });

        // Gắn sự kiện submit riêng cho từng form
        $form.on("submit", function (e) {
            e.preventDefault();
            if (validateForm($form)) {
                $("#noti").addClass("active");
                // this.submit(); // Nếu bạn muốn gửi
            }
        });

        // Kiểm tra dữ liệu mặc định lúc load
        const checkDefaultData = () => {
            let isFilled = true;
            $form.find(".form-item input, .form-item select").each(function () {
                const value = $(this).val().trim();
                if (value === "" || value === "1") {
                    isFilled = false;
                }
            });
            $form.find(".submit").prop("disabled", !isFilled);
        };
        checkDefaultData();
    });
};

const clickPhoneSocial = () => {
    $(".social-phone .social-item").on("click", function (e) {
        e.stopPropagation();
		$(this).closest('.social-phone').find('.number').toggleClass("active");
	});

    // Click outside to hide phone number
    $(document).on("click", function (e) {
        if (!$(e.target).closest('.social-phone').length) {
            $('.social-phone .number').removeClass("active");
        }
    });
}
    




// Dữ liệu mẫu để điền vào form
const setDefaultData = () => {
    $(".fullname").val("xxx");
    $(".email").val("xxxx@example.com");
    $(".phone").val("0123456789");
    $("select[name='consultation']").val("3");
};

$(document).ready(() => {

    // setDefaultData(); // Thiết lập dữ liệu mẫu cho local

    contactForm();
    lazyLoadImages();
    initYouTubePlayer();
    clickPhoneSocial()


    // Nếu bạn sử dụng AOS, khởi tạo nó:
    if (typeof AOS !== "undefined") {
        AOS.init();
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

    $(".register ").on("click", function (e) {
        e.preventDefault(); 
        $(".popup").addClass("active");
    });

    // $('.popup').addClass('active');
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

    if ($(this).scrollTop() > 50) {
        $('header').addClass('active');
    } else {
        $('header').removeClass('active');
    }
});
