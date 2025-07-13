// Smooth scroll: khi click vào trigger, cuộn đến block đích
const goToBlock = (triggerSelector, targetSelector) => {
    $(triggerSelector).on("click", e => {
        e.preventDefault();
        $("html, body").animate({
                scrollTop: $(targetSelector).offset().top
            },
            1000
        );
    });
};

// ==============================
// Document ready: khởi tạo toàn bộ các module
// ==============================

const MenuHandler = () => {
    // Scroll đến section khi click menu item
    $('.menu_click').on('click', function (e) {
        e.preventDefault();

        const targetName = $(this).attr('link');
        const targetSection = $(`section[section-anchor="${targetName}"]`);

        $('header').removeClass('active');
        $('header .menu').removeClass('active');

        if (targetSection.length) {
            const offset = targetSection.offset().top - 100;
            $('html, body').animate({
                scrollTop: offset > 0 ? offset : 0
            }, 600);
        }
    });

    // Toggle menu
    $('header .toggle').off('click').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation(); // Ngăn click lan ra ngoài document

        $('header').toggleClass('active');
        $('header .menu').toggleClass('active');
    });

    // Close button
    $('.btn-x-close').on('click', function (e) {
        e.preventDefault();
        $('header').removeClass('active');
        $('header .menu').removeClass('active');
    });

    // Ngăn click bên trong menu lan ra document
    $('header .menu').on('click', function (e) {
        e.stopPropagation();
    });

    // Click outside menu để đóng
    $(document).on('click', function () {
        if ($('header').hasClass('active')) {
            $('header').removeClass('active');
            $('header .menu').removeClass('active');
        }
    });
};

// Dữ liệu mẫu để điền vào form
const setDefaultData = () => {
    $(".fullname").val("xxx");
    $(".email").val("xxxx@example.com");
    $(".phone").val("0123456789");
    $("select[name='consultation']").val("3");
};
$(document).ready(() => {

    // setDefaultData(); // Thiết lập dữ liệu mẫu cho local
    MenuHandler()

});

$(window).on("scroll", function () {
    if ($(window).scrollTop() > 0) {
        $("header").addClass("scrolled");
    } else {
        $("header").removeClass("scrolled");
    }
});

$(window).resize(() => {});