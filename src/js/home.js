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


const tabCommon = (tabSelector, paneSelector) => {
    // Khởi tạo các tab
    $(tabSelector).click(function () {
        var tabId = $(this).data('tab');

        $(tabSelector).removeClass('tabs__tab--active');
        $(paneSelector).removeClass('tabs__pane--active');

        $(this).addClass('tabs__tab--active');
        $(paneSelector + '[data-content="' + tabId + '"]').addClass('tabs__pane--active');
    });
}

const SectionHuongDan = () => {
    tabCommon('.huongdan .tabs__tab', '.huongdan .tabs__pane');
}

const SectionLivestream = () => {
    const $grid = $('#livestreamGrid');
    const dataStr = $grid.attr('data-livestream');
    if (!dataStr) {
        console.warn('No livestream data found');
        return;
    }
    
    let livestreamData;
    try {
        livestreamData = JSON.parse(dataStr);
    } catch (e) {
        console.error('Invalid JSON in livestream data:', e);
        return;
    }
    
    const siteDomain = $('#baseUrl').val() || '';

    $grid.empty(); // <-- Thêm dòng này để clear nội dung cũ

    livestreamData.forEach((item, index) => {
        const tLeft = [0, 4, 8, 12].includes(index) ? 't-left' : '';
        const tRight = [3, 7, 11, 15].includes(index) ? 't-right' : '';
        const tBottom = [12, 13, 14, 15].includes(index) ? 't-bottom' : '';

        const $tooltipImages = item.prize.images
            .map(img => `<img src="${siteDomain}${img}" alt="${item.episode}">`)
            .join('');


        const $item = $(`
        <div class="livestream__item item-${index}">
            <div class="livestream__episode">
                <p class="livestream__text">${item.episode}</p>
                <p class="livestream__date">${item.date}</p>
            </div>
            <div class="livestream__tooltip ${tLeft} ${tRight} ${tBottom}">
                <div class="livestream__tooltip-images ${item.prize.images.length == 0 ? 'hidden':''}">${$tooltipImages}</div>
                <p class="livestream__tooltip-desc">${item.prize.description}</p>
            </div>
        </div>
        `);
        $grid.append($item);
    });

    $grid.off('click', '.livestream__episode'); // Xóa sự kiện cũ nếu có
    $grid.on('click', '.livestream__episode', function (e) {
        e.stopPropagation();
        const $tooltip = $(this).siblings('.livestream__tooltip');
        $('.livestream__tooltip').not($tooltip).removeClass('active');
        $tooltip.toggleClass('active');
    });

    $(document).on('click', function () {
        $('.livestream__tooltip').removeClass('active');
    });
}

const SectionHanhTrinh = () => {
    const $sliderTop = $('.hanhtrinh__slider-top');
    const $sliderBottom = $('.hanhtrinh__slider-bottom');

    if ($sliderTop.length && $sliderBottom.length) {
        // Chỉ unslick nếu đã khởi tạo
        if ($sliderBottom.hasClass('slick-initialized')) {
            $sliderBottom.slick('unslick');
        }
        if ($sliderTop.hasClass('slick-initialized')) {
            $sliderTop.slick('unslick');
        }

        $sliderBottom.slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            adaptiveHeight: true,
            fade: true,
        });

        $sliderTop.slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            centerMode: true,
            centerPadding: '0px',
            focusOnSelect: true,
            arrows: true,
        });

        // Đồng bộ thủ công
        $sliderTop.on('afterChange', function (event, slick, currentSlide) {
            $sliderBottom.slick('slickGoTo', currentSlide);
        });
    }
};

//thư viện of SectionTinTucThuVien
const TabTinTuc = function () {
    const renderTinTucDynamic = (data) => {
        // Lưu data vào biến toàn cục (hoặc closure)
        window._tintucData = data; // hoặc const tintucData = data; nếu không muốn global

        const $container = $('.tintuc-thuvien .tabs__pane[data-content="1"]');
        const $list = $('<div class="tintuc-thuvien__list"></div>');
        const $pagination = $('<div class="tintuc-thuvien__pagination"></div>');
        const perPage = 4;
        const totalPages = Math.ceil(data.length / perPage);
        const siteDomain = 'https://muavangthanglon.pvcfc.com.vn';

        function renderPage(page) {
            $list.empty();
            $pagination.empty();

            const start = (page - 1) * perPage;
            const end = start + perPage;
            const currentItems = data.slice(start, end);

            currentItems.forEach((item, index) => {
                // indexInData là vị trí thực trong mảng data gốc
                const indexInData = start + index;
                $list.append(`
                <div class="tintuc-thuvien__item">
                    <a href="#" 
                        class="tintuc-thuvien__image" 
                        data-index="${indexInData}"
                        data-title="${item.title}" 
                        data-image="${siteDomain + item.image}" 
                        data-short_des="${item.short_des || ''}"
                    >
                        <img src="${siteDomain + item.image}" alt="${item.title}" />
                    </a>
                    <h4><a href="#">${item.title || ''}</a></h4>
                    <p>${item.short_des || ''}</p>
                </div>
            `);
            });

            for (let i = 1; i <= totalPages; i++) {
                $pagination.append(`
                <button class="page ${i === page ? 'active' : ''}">
                    ${i}
                </button>
            `);
            }

            // Rebind click handlers after DOM update
            $('.tintuc-thuvien .tintuc-thuvien__image').off('click').on('click', function (e) {
                e.preventDefault();

                const index = $(this).data('index');
                const title = $(this).data('title');
                const image = $(this).data('image');
                // Lấy HTML từ mảng data gốc
                const desc = window._tintucData[index].full_des;

                $('#modal-tintuc .modal-image img').attr('src', image).attr('alt', title);
                $('#modal-tintuc .modal-text').html(desc);
                $('#modal-tintuc').removeClass('inactive');
            });
        }

        // Clear & render
        $container.empty().append($list).append($pagination);
        renderPage(1);

        // Pagination handler
        $container.on('click', '.page', function () {
            const page = parseInt($(this).text());
            renderPage(page);
        });

        // Close modal
        $('#modal-tintuc .modal-button').on('click', () => {
            $('#modal-tintuc').addClass('inactive');
        });
    };

    // Đóng modal khi click ra ngoài modal-content
    $(document).on('mousedown', '.modal', function (e) {
        // Nếu click vào chính modal (overlay) mà KHÔNG phải modal-content hoặc con của nó
        if ($(e.target).is('.modal')) {
            $(this).addClass('inactive');
        }
    });

    const dataOriginTintuc = $('#tintuc').val();
    if (!dataOriginTintuc || dataOriginTintuc === 'undefined') {
        console.warn('No tintuc data found');
        return;
    }
    
    let jsonDataTintuc;
    try {
        jsonDataTintuc = JSON.parse(dataOriginTintuc);
    } catch (e) {
        console.error('Invalid JSON in tintuc data:', e);
        return;
    }
    renderTinTucDynamic(jsonDataTintuc);
}

//thư viện of SectionTinTucThuVien
const TabThuVien = function () {

    const renderThuVienDynamic = (data) => {
        const $container = $('.tintuc-thuvien .tabs__pane[data-content="2"]');
        const $list = $('<div class="tintuc-thuvien__list"></div>');
        const $pagination = $('<div class="tintuc-thuvien__pagination"></div>');
        const perPage = 4;
        const totalPages = Math.ceil(data.length / perPage);

        function renderPage(page) {
            $list.empty();
            $pagination.empty();

            const start = (page - 1) * perPage;
            const end = start + perPage;
            const currentItems = data.slice(start, end);

            currentItems.forEach(item => {
                if (item.thumb !== null && item.thumb !== '') {
                    $list.append(`
                    <div class="tintuc-thuvien__item video">
                        <figure
                            class="tintuc-thuvien__image"
                            data-fancybox="gallery-thuvien"
                            data-width="1280"
                            data-height="720"
                            href="${item.media}"
                        >
                            <img src="${item.thumb}" alt="${item.des}" />
                        </figure>
                    </div>
                `);
                } else {
                    $list.append(`
                    <div class="tintuc-thuvien__item">
                        <figure
                            class="tintuc-thuvien__image"
                            data-fancybox="gallery-thuvien"
                            data-width="1280"
                            data-height="720"
                            href="${item.media}"
                        >
                            <img src="${item.media}" alt="${item.des}" />
                        </figure>
                    </div>
                `);
                }
            });

            for (let i = 1; i <= totalPages; i++) {
                $pagination.append(`
                <button class="page ${i === page ? 'active' : ''}" ${i === page ? 'disabled' : ''}>
                    ${i}
                </button>
            `);
            }
        }

        // Clear previous & append container
        $container.empty().append($list).append($pagination);
        renderPage(1);

        // Bind pagination events
        $container.on('click', '.page', function () {
            const page = parseInt($(this).text());
            renderPage(page);
        });
    };
    const dataOriginThuvien = $('#thuvien').val();
    if (!dataOriginThuvien || dataOriginThuvien === 'undefined') {
        console.warn('No thuvien data found');
        return;
    }
    
    let jsonDataThuvien;
    try {
        jsonDataThuvien = JSON.parse(dataOriginThuvien);
    } catch (e) {
        console.error('Invalid JSON in thuvien data:', e);
        return;
    }
    renderThuVienDynamic(jsonDataThuvien);

}

const SectionTinTucThuVien = () => {
    tabCommon('.tintuc-thuvien .tabs__tab', '.tintuc-thuvien .tabs__pane');

    TabTinTuc();
    TabThuVien();
}

const SectionThuVienTraoGiai = () => {
    const $tabHeading = $('.thuvien-traogiai__month');
    const $tabContainer = $('.thuvien-traogiai__list');
    const $scrollContainer = $tabHeading;
    const scrollAmount = 100;
    const ItemPerPage = 6; // Số item hiển thị mỗi trang


    // Arrow click
    $('.arrow-left').on('click', function () {
        $scrollContainer.animate({
            scrollLeft: $scrollContainer.scrollLeft() - scrollAmount
        }, 300);
    });

    $('.arrow-right').on('click', function () {
        $scrollContainer.animate({
            scrollLeft: $scrollContainer.scrollLeft() + scrollAmount
        }, 300);
    });

    // Parse JSON
    const DataThuVienTraoGiai = $('#thuvien_traogiai').val();
    if (!DataThuVienTraoGiai || DataThuVienTraoGiai === 'undefined') {
        console.warn('No thuvien traogiai data found');
        return;
    }

    let dataOrigin;
    try {
        dataOrigin = JSON.parse(DataThuVienTraoGiai);
    } catch (e) {
        console.error('Invalid JSON in thuvien traogiai data:', e);
        return;
    }
    $tabHeading.empty();
    $tabContainer.empty();

    if (dataOrigin.length < 6) {
        $('.thuvien-traogiai__month-wrap .arrow').hide();
    }

    dataOrigin.forEach((element, index) => {
        const activeClass = index === 0 ? 'active' : '';

        // Append label tháng
        $tabHeading.append(`
            <label data-tab="${element.month}" class="thuvien-traogiai__month-item ${activeClass}">Tháng ${element.month}</label>
        `);

        // Gallery HTML
        let galleryHTML = '';
        element.gallery.forEach((img, indexImg) => {
            galleryHTML += `
                <figure class="thuvien-traogiai__gallery-item">
                    <img src="${img}" alt="Thư viện trao giải" />
                </figure>
            `;
        });
        // <span class="absolute left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%]">${element.month}-${indexImg}</span>


        // Pagination (max 8 page button)

        let paginationHTML = `<button class="page active">1</button>`;

        const totalPage = Math.ceil(element.gallery.length / ItemPerPage);
        for (let i = 2; i <= Math.min(totalPage, 8); i++) {
            paginationHTML += `<button class="page">${i}</button>`;
        }

        // Tab content
        $tabContainer.append(`
            <div class="thuvien-traogiai__tab tab-${element.month} ${activeClass}">
                <div class="thuvien-traogiai__gallery">
                    ${galleryHTML}
                </div>
                <div class="thuvien-traogiai__pagination">
                    ${paginationHTML}
                </div>
            </div>
        `);
    });

    // Tab switching
    $(document).on('click', '.thuvien-traogiai__month-item', function () {
        const tabId = $(this).data('tab');
        $('.thuvien-traogiai__month-item').removeClass('active');
        $(this).addClass('active');

        $('.thuvien-traogiai__tab').removeClass('active');
        $('.tab-' + tabId).addClass('active');

        paginate('.tab-' + tabId);
    });

    // Pagination click
    $(document).on('click', '.page', function () {
        const $tab = $(this).closest('.thuvien-traogiai__tab');
        $tab.find('.page').removeClass('active');
        $(this).addClass('active');

        paginate($tab);
    });

    // Paginate function
    function paginate(container) {
        const $tab = $(container);
        const activePage = parseInt($tab.find('.page.active').text());
        const perPage = ItemPerPage;

        $tab.find('.thuvien-traogiai__gallery-item').each(function (index) {
            const start = (activePage - 1) * perPage;
            const end = activePage * perPage;
            $(this).toggle(index >= start && index < end);
        });
    }

    // Initial paginate
    paginate('.tab-' + dataOrigin[0].month);
};

const SectionFaq = () => {
    $('.faq__item').on('click', function () {
        const $item = $(this);
        // Xoá active các item khác
        $('.faq__item').removeClass('active');
        // Nếu đã active → remove
        if ($item.hasClass('active')) {
            $item.removeClass('active');
        } else {

            // Thêm active cho item được click
            $item.addClass('active');
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
    MenuHandler()

    SectionHuongDan()
    SectionLivestream()
    SectionHanhTrinh()
    SectionTinTucThuVien()
    SectionThuVienTraoGiai()
    SectionFaq()

});

$(window).on("scroll", function () {
    if ($(window).scrollTop() > 0) {
        $("header").addClass("scrolled");
    } else {
        $("header").removeClass("scrolled");
    }
});

$(window).resize(() => {});
const setDefaultDataMiniGame = () => {
    // Dữ liệu mẫu cho form mini-game
    $(".form-box .input").eq(0).val("Nguyễn Văn A"); // Họ & tên
    $(".form-box .input").eq(1).val("0123456789"); // Số điện thoại
    $(".form-box .input").eq(2).val("123 Đường ABC, Quận 1"); // Địa chỉ
};
// Validate và xử lý form mini-game
const miniGameModal = () => {
    // Chỉ cần số điện thoại có ít nhất 10 số
    const validatePhone = phone => /^\d{10,}$/.test(phone);

    const showModal = modalId => {
        $(`#${modalId}`).removeClass('inactive');
        $('.modal').not(`#${modalId}`).addClass('inactive');
    };
    const closeModal = () => {
        $('.modal').addClass('inactive inactive');
    };
    window.closeModal = closeModal;

    const checkPhoneAPI = phone => {
        return new Promise(resolve => {
            setTimeout(() => resolve(phone === '01234567890'), 500);
        });
    };

    // Hàm kiểm tra valid toàn bộ form
    function checkFormValid($form) {
        let allFilled = true;
        let phoneValid = true;
        const $inputs = $form.find('.input');
        $inputs.each(function (i) {
            if (!$(this).val().trim()) {
                allFilled = false;
            }
            // Kiểm tra số điện thoại ở input thứ 2
            if (i === 1 && !validatePhone($(this).val().trim())) {
                phoneValid = false;
            }
        });
        return allFilled && phoneValid;
    }

    // Disable submit nếu chưa nhập đủ hoặc số điện thoại không hợp lệ
    $('.form-box .input').on('input', function () {
        const $form = $(this).closest('.form-box');
        const isValid = checkFormValid($form);
        $form.find('.submit-button').prop('disabled', !isValid);
    });

    // Khi load trang, kiểm tra luôn trạng thái ban đầu
    $('.form-box').each(function () {
        const isValid = checkFormValid($(this));
        $(this).find('.submit-button').prop('disabled', !isValid);
    });

    $('.form-box').on('submit', async function (e) {
        e.preventDefault();
        const $inputs = $(this).find('.input');
        let valid = true;

        $inputs.each(function (i) {
            if (!$(this).val().trim()) {
                $(this).addClass('input-error');
                valid = false;
            } else {
                $(this).removeClass('input-error');
            }
            // Kiểm tra số điện thoại ở input thứ 2
            if (i === 1 && !validatePhone($(this).val().trim())) {
                $(this).addClass('input-error');
                valid = false;
            }
        });

        if (!valid) return;

        const phone = $inputs.eq(1).val().trim();
        const exist = await checkPhoneAPI(phone);
        if (exist) {
            showModal('modal-exist-phone');
        } else {
            showModal('modal-play-game');
        }
    });

    // Đóng modal khi click ra ngoài modal-content
    $(document).on('mousedown', '.modal', function (e) {
        // Nếu click vào chính modal (overlay) mà KHÔNG phải modal-content hoặc con của nó
        if ($(e.target).is('.modal')) {
            $(this).addClass('inactive');
        }
    });

};