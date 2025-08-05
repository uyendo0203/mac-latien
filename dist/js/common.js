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
        let hasRequiredFields = false;
        
        // Validate tất cả input, nhưng chỉ bắt buộc điền những input có required
        $form.find(".form-item input, .form-item select, .form-item textarea").each(function () {
            const $field = $(this);
            const value = $field.val().trim();
            const fieldType = $field.attr("type");
            const isRequired = $field.attr("required") !== undefined;
            let errorMessage = "";

            // Đánh dấu có required fields
            if (isRequired) {
                hasRequiredFields = true;
            }

            // Kiểm tra trống chỉ áp dụng cho required fields
            if (isRequired && (value === "" || value === "1")) {
                errorMessage = "Trường này không được để trống!";
                isValid = false;
            } 
            // Nếu không required nhưng có giá trị thì vẫn validate format
            else if (!isRequired && value !== "" && value !== "1") {
                if (fieldType === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
                    errorMessage = "Email không hợp lệ!";
                    isValid = false;
                } else if (fieldType === "number" && !/^\d{10,}$/.test(value)) {
                    errorMessage = "Số điện thoại phải có ít nhất 10 chữ số!";
                    isValid = false;
                }
            }
            // Nếu required và có giá trị thì validate format
            else if (isRequired && value !== "" && value !== "1") {
                if (fieldType === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
                    errorMessage = "Email không hợp lệ!";
                    isValid = false;
                } else if (fieldType === "number" && !/^\d{10,}$/.test(value)) {
                    errorMessage = "Số điện thoại phải có ít nhất 10 chữ số!";
                    isValid = false;
                }
            }

            $field.siblings(".error").remove();
            if (errorMessage) {
                $field.after(`<span class="error">${errorMessage}</span>`);
            }
        });

        // Logic validation:
        // - Luôn kiểm tra format errors (isValid)  
        // - Submit button chỉ disabled khi có lỗi validation
        $form.find(".submit").prop("disabled", !isValid);
        return isValid;
    };

    // Gán validate cho tất cả các form có .form-item
    $("form:has(.form-item)").each(function () {
        const $form = $(this);

        // Gắn sự kiện input/change cho tất cả input trong form
        $form.find(".form-item input, .form-item select, .form-item textarea").on("input change", function () {
            validateForm($form);
        });

        // Gắn sự kiện submit riêng cho từng form
        $form.on("submit", function (e) {
            e.preventDefault();
            
            // Luôn validate form trước khi submit
            const isFormValid = validateForm($form);
            
            if (isFormValid) {
                // $("#noti").addClass("active");
                // this.submit(); // Nếu bạn muốn gửi
            }
            // Nếu form không hợp lệ, validateForm đã hiển thị error messages
        });

        // Kiểm tra dữ liệu mặc định lúc load (chỉ required fields mới ảnh hưởng đến submit button)
        const checkDefaultData = () => {
            let isFilled = true;
            $form.find(".form-item input[required], .form-item select[required], .form-item textarea[required]").each(function () {
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
    $(".consultation").val("01234567893");
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

    $(".hamburger").click(function () {
        $(this).toggleClass("open");
        $('.menu').toggleClass("open");
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

    $('.popup').addClass('active');
    $('.popup-close').click(function () {
        $('.popup').removeClass('active');
    });

    $('.popup').click(function (event) {
        if (!$(event.target).closest('.popup-content').length) {
            $('.popup').removeClass('active');
        }
    });


});

// Simple video fallback
document.addEventListener('DOMContentLoaded', () => {
    // const videos = document.querySelectorAll('video');

    // videos.forEach(video => {
    //     video.addEventListener('error', () => {
    //         const src = video.querySelector('source')?.src || video.src;
    //         if (!src) return;

    //         // Tạo đường dẫn image
    //         const imagePath = src.replace(/\.(mp4|webm|ogg)$/i, '.png');

    //         // Tạo img element
    //         const img = document.createElement('img');
    //         img.src = imagePath;
    //         img.className = video.className;
    //         img.alt = 'Video fallback';

    //         // Thay thế video bằng image
    //         video.parentNode.replaceChild(img, video);

    //         console.log(`Replaced video with image: ${imagePath}`);
    //     });

    //     // Timeout fallback (nếu video không load trong 3s)
    //     setTimeout(() => {
    //         if (video.readyState === 0) {
    //             video.dispatchEvent(new Event('error'));
    //         }
    //     }, 3000);
    // });


    
});


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

    if ($(window).width() > 767 && $(this).scrollTop() > 50) {
        $('header').addClass('active');
    } else {
        $('header').removeClass('active');
    }
});

// Adjust input height with error message
const adjustInputHeightWithError = (inputElement, hasError = false) => {
    const formItem = inputElement.closest('.form-item');

    if (!formItem) return;

    if (hasError) {
        formItem.style.marginBottom = 'calc(0.8rem + var(--original-margin, 0.8rem))';
    } else {
        formItem.style.marginBottom = '';
    }
};

// Sử dụng MutationObserver để detect error elements ngay lập tức
const observeErrorChanges = () => {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                const target = mutation.target;

                // Check nếu là form-item hoặc bên trong form-item
                const formItem = target.closest('.form-item') ||
                    (target.classList?.contains('form-item') ? target : null);

                if (formItem) {
                    const input = formItem.querySelector('input, textarea, select');
                    const hasError = formItem.querySelector('.error-message, .error, [class*="error"]') ||
                        formItem.classList.contains('error') ||
                        formItem.classList.contains('has-error');

                    if (input) {
                        adjustInputHeightWithError(input, !!hasError);
                    }
                }
            }
        });
    });

    // Observe tất cả form-item
    document.querySelectorAll('.form-item').forEach(formItem => {
        observer.observe(formItem, {
            childList: true,
            attributes: true,
            attributeFilter: ['class'],
            subtree: true
        });
    });
};

// Event listeners cho input changes
document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo observer
    observeErrorChanges();

    // Backup với input events
    const formInputs = document.querySelectorAll('.form-item input, .form-item textarea, .form-item select');

    formInputs.forEach(input => {
        ['input', 'change', 'blur', 'focus'].forEach(eventType => {
            input.addEventListener(eventType, () => {
                // Delay nhỏ để đợi error message được thêm vào
                setTimeout(() => {
                    const formItem = input.closest('.form-item');
                    const hasError = formItem && (
                        formItem.querySelector('.error-message, .error, [class*="error"]') ||
                        formItem.classList.contains('error') ||
                        formItem.classList.contains('has-error') ||
                        input.classList.contains('error')
                    );

                    adjustInputHeightWithError(input, !!hasError);
                }, 10); // 10ms delay
            });
        });
    });
});