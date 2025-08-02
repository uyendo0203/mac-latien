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
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(Observer)
ScrollTrigger.config({
	autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load,resize',
	syncInterval: 1
})

const animationHands = () => {
	// Kiểm tra elements tồn tại
	const handWrap = document.querySelector('.hand-wrap');
	const handLeft = document.querySelector('.hand-left');
	const handRight = document.querySelector('.hand-right');

	if (!handWrap || !handLeft || !handRight) {
		console.error('Hand elements not found!');
		return;
	}

	// Set initial position để đảm bảo hands ở vị trí ban đầu
	gsap.set(".hand-left", {
		x: "0%"
	});
	gsap.set(".hand-right", {
		x: "0%"
	});
	const timeRun = 1.5;
	ScrollTrigger.create({
		trigger: ".hand-wrap",
		start: "top 50%", // Thay đổi từ 80% xuống 60%
		end: "top 30%", // Thay đổi end position
		markers: false, // Để debug
		onEnter: () => {
			console.log("Hands animation: onEnter triggered");
			gsap.to(".hand-left", {
				x: "-40%",
				duration: timeRun,
				ease: "power1.out"
			});
			gsap.to(".hand-right", {
				x: "47%",
				duration: timeRun,
				ease: "power1.out"
			});
		},
		onLeaveBack: () => {
			console.log("Hands animation: onLeaveBack triggered");
			gsap.to(".hand-left", {
				x: "0%",
				duration: timeRun,
				ease: "power1.out"
			});
			gsap.to(".hand-right", {
				x: "0%",
				duration: timeRun,
				ease: "power1.out"
			});
		}
	});
};;


const animateConChim = () => {
  gsap.set(".conchim", {
    bottom: "30%",
    left: "0%",
    scaleX: 1,
    position: "absolute"
  });

  const timeRun = 4;

  ScrollTrigger.create({
    trigger: ".section-heading.vanhoanghethuat",
    start: "top 50%",
    onEnter: () => {
      const tl = gsap.timeline();

      // 1. Bay tới trước
      tl.to(".conchim", {
        bottom: "6%",
        left: "68%",
        duration: timeRun,
        ease: "power1.out"
      });

      // 2. Sau khi bay xong -> flip mặt
      tl.to(".conchim", {
        scaleX: -1,
        duration: 0.3, // thời gian lật
        ease: "power1.inOut"
      }, "+=0.1"); // thêm delay 0.1s sau khi bay xong
    },

    onLeaveBack: () => {
      // Khi scroll lên -> reset mọi thứ cùng lúc
      gsap.to(".conchim", {
        bottom: "30%",
        left: "0%",
        scaleX: 1,
        duration: timeRun - 1,
        ease: "power1.out"
      });
    },

    // markers: true,
  });
};



document.addEventListener("DOMContentLoaded", () => {
	// Kiểm tra GSAP đã load
	if (typeof gsap === 'undefined') {
		console.error('GSAP is not loaded! Please include GSAP library.');
		return;
	}

	console.log('GSAP loaded successfully');

	// Đợi một chút để đảm bảo DOM đã render hoàn toàn
	setTimeout(() => {
		animationHands();
		animateConChim()
		ScrollTrigger.refresh();
	}, 100);
});


// ==============================
// Document ready: khởi tạo toàn bộ các module
// ==============================
$(document).ready(() => {

	$(".hambergur").click(function () {
		$(this).toggleClass("open");
		$('.menu').toggleClass("open");
	});


});

$(window).on('scroll', function () {

});

$(window).resize(() => {});

const animationHandsIntersection = () => {
	const handWrap = document.querySelector('.hand-wrap');
	if (!handWrap) return;

	// Set initial position
	gsap.set(".hand-left", {
		x: "0%"
	});
	gsap.set(".hand-right", {
		x: "0%"
	});

	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				console.log("Intersection: Element in view");
				gsap.to(".hand-left", {
					x: "-40%%",
					duration: 1,
					ease: "power1.out"
				});
				gsap.to(".hand-right", {
					x: "47%",
					duration: 1,
					ease: "power1.out"
				});
			} else {
				console.log("Intersection: Element out of view");
				gsap.to(".hand-left", {
					x: "0%",
					duration: 1,
					ease: "power1.out"
				});
				gsap.to(".hand-right", {
					x: "0%",
					duration: 1,
					ease: "power1.out"
				});
			}
		});
	}, {
		threshold: 0.3 // 30% của element visible
	});

	observer.observe(handWrap);
};