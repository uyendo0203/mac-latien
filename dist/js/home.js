


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


// Home events: xử lý tab events và slide sự kiện
const eventsAction = () => {
	$(".tabs-nav .label").on("click", function () {
		$(".tabs-nav .label").removeClass("active");
		$(this).addClass("active");

		const tabIndex = $(this).data("rel");
		$(`.tabs-${tabIndex}`).fadeIn("slow").siblings(".tabs-slider").hide();
		initializeTab(tabIndex);
	});

	const initializeTab = tabIndex => {
		const $tab = $(`.tabs-${tabIndex}`).find(".events");
		if ($tab.length) {
			const events = JSON.parse($tab.attr("data-events"));
			const itemsPerSlide = 4;
			const totalSlides = Math.ceil(events.length / itemsPerSlide);
			const activeEvents = {};
			let currentSlide = 0;

			const renderSlides = () => {
				let paginationHTML = "";
				if (totalSlides > 1) {
					for (let i = 0; i < totalSlides; i++) {
						paginationHTML += `<span class="dot ${i === 0 ? "active" : ""}" data-slide="${i}"></span>`;
					}
					$tab.find(".paginationDots").html(paginationHTML);
				}
				updateSlide(0);
			};

			const updateSlide = slideIndex => {
				currentSlide = slideIndex;
				const slideEvents = events.slice(
					slideIndex * itemsPerSlide,
					(slideIndex + 1) * itemsPerSlide
				);
				const activeEventIndex = slideIndex * itemsPerSlide;
				activeEvents[slideIndex] = activeEventIndex;
				const activeEvent = slideEvents[0];

				$tab.find(".eventImage").attr({
					src: activeEvent.image,
					alt: activeEvent.image
				});
				$tab.find(".events__title img").attr({
					src: activeEvent.big_title,
					alt: activeEvent.sub_title
				});
				$tab.find(".events__item-month").text(`${activeEvent.sub_title}:`);
				$tab.find(".events__item-date").text(activeEvent.date);
				$tab.find(".events__description").text(activeEvent.description);

				let listHTML = "";
				slideEvents.forEach((event, index) => {
					const eventIndex = slideIndex * itemsPerSlide + index;
					if (eventIndex !== activeEventIndex) {
						listHTML += `
			  <li class="events__item" data-index="${eventIndex}" data-slide="${slideIndex}">
				<h1 class="events__item-title">${event.title}</h1>
				<div class="events__item-time">
				  <p class="events__item-month">${event.sub_title}</p>
				  <p class="events__item-date">${event.date}</p>
				</div>
			  </li>`;
					}
				});
				$tab.find(".eventList").html(listHTML);
			};

			$tab.off("click", ".events__item").on("click", ".events__item", function () {
				const eventIndex = $(this).data("index");
				const slideIndex = $(this).data("slide");
				const newActiveEvent = events[eventIndex];
				const oldActiveEventIndex = activeEvents[slideIndex];
				activeEvents[slideIndex] = eventIndex;

				$tab.find(".eventImage").attr({
					src: newActiveEvent.image,
					alt: newActiveEvent.image
				});
				$tab.find(".events__title img").attr({
					src: newActiveEvent.big_title,
					alt: newActiveEvent.sub_title
				});
				$tab.find(".events__item-month").text(`${newActiveEvent.sub_title}:`);
				$tab.find(".events__item-date").text(newActiveEvent.date);
				$tab.find(".events__description").text(newActiveEvent.description);

				const oldEvent = events[oldActiveEventIndex];
				const oldItemHTML = `
		  <li class="events__item" data-index="${oldActiveEventIndex}" data-slide="${slideIndex}">
			<h1 class="events__item-title">${oldEvent.title}</h1>
			<div class="events__item-time">
			  <p class="events__item-month">${oldEvent.sub_title}</p>
			  <p class="events__item-date">${oldEvent.date}</p>
			</div>
		  </li>`;
				$(this).replaceWith(oldItemHTML);
			});

			$tab.off("click", ".dot").on("click", ".dot", function () {
				const slideIndex = $(this).data("slide");
				$tab.find(".dot").removeClass("active");
				$(this).addClass("active");
				updateSlide(slideIndex);
			});

			renderSlides();

		}
	};

	// Khởi tạo tab đầu tiên khi trang load
	initializeTab(1);
};

// Beach highlight: render danh sách card và xử lý sự kiện click
const highlightSection = () => {

	// Hàm tính lại kích thước hình ảnh
	function recalcImages() {
		$(".highlight-card .heading img, .highlight-card .heading-active img").each(function () {
			const $img = $(this);
			// Sử dụng one để đảm bảo sự kiện chỉ được gắn 1 lần cho mỗi lần trigger
			$img.one("load", function () {
				if ($img.height() > 120) {
					$img.css({
						// height: "8rem",
						// width: "auto"
					});
				}
			});
			// Nếu ảnh đã load (có thể từ cache) thì trigger sự kiện load ngay
			if (this.complete) {
				$img.trigger("load");
			}
		});
		if($(window).width() < 768) {
			$(".highlights__grid").addClass("mobile");
		}else{
			$(".highlights__grid").removeClass("mobile");
		}
	}
	recalcImages()

	$(document).on("click", ".highlight-card", function () {
		if (!$(this).hasClass("active")) {
			const $activeCard = $(".highlight-card.active");
			$activeCard.removeClass("active");
			$(this).addClass("active");

			if($(window).width() < 768) {
				$(this).prependTo(".highlights__grid");
			}

			recalcImages()
		}
	});

};

// Reason slider: xử lý chuyển slide
const reasonSlider = () => {
	// Lấy slider hiện đang hiển thị (desktop hoặc mobile)
	const $slider = $(".reason__slider:visible");
	if (!$slider.length) return; // nếu không có slider nào hiển thị thì dừng

	const $items = $slider.find(".reason__item");
	const total = $items.length;
	let currentIndex = 0;
	let animating = false; // biến khóa khi animation đang chạy

	// Ẩn tất cả, chỉ hiển thị item đầu tiên
	$items.hide();
	$items.eq(currentIndex).show();

	const showSlide = (newIndex) => {
		if (animating || newIndex === currentIndex) return;
		animating = true;
		$items.eq(currentIndex).fadeOut(400, "swing", () => {
			$items.eq(newIndex).fadeIn(400, "swing", () => {
				currentIndex = newIndex;
				animating = false;
			});
		});
	};

	$(".reason__arrow--next").on("click", () => {
		const nextIndex = (currentIndex + 1) % total;
		showSlide(nextIndex);
	});

	$(".reason__arrow--prev").on("click", () => {
		const prevIndex = (currentIndex - 1 + total) % total;
		showSlide(prevIndex);
	});
};



// ==============================
// Document ready: khởi tạo toàn bộ các module
// ==============================
$(document).ready(() => {

	eventsAction();
	highlightSection();
	reasonSlider();


	$(".hambergur").click(function () {
		$(this).toggleClass("open");
		$('.menu').toggleClass("open");
	});
});

$(window).resize(() => {
	highlightSection();
});