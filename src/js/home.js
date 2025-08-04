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
	const h_left = '.hand-left';
	const h_right = '.hand-right';
	const h_wrap = '.hand-wrap';
	const handWrap = document.querySelector(h_wrap);
	const handLeft = document.querySelector(h_left);
	const handRight = document.querySelector(h_right);

	if (!handWrap || !handLeft || !handRight) {
		console.error('Hand elements not found!');
		return;
	}

	// Set initial position để đảm bảo hands ở vị trí ban đầu
	gsap.set(h_left, {
		x: "0%"
	});
	gsap.set(h_right, {
		x: "0%"
	});
	const timeRun = 1.5;
	ScrollTrigger.create({
		trigger: h_wrap,
		start: "top 50%", // Thay đổi từ 80% xuống 60%
		end: "top 30%", // Thay đổi end position
		markers: false, // Để debug
		onEnter: () => {
			console.log("Hands animation: onEnter triggered");
			gsap.to(h_left, {
				x: "-40%",
				duration: timeRun,
				ease: "power1.out"
			});
			gsap.to(h_right, {
				x: "47%",
				duration: timeRun,
				ease: "power1.out"
			});
		},
		onLeaveBack: () => {
			console.log("Hands animation: onLeaveBack triggered");
			gsap.to(h_left, {
				x: "0%",
				duration: timeRun,
				ease: "power1.out"
			});
			gsap.to(h_right, {
				x: "0%",
				duration: timeRun,
				ease: "power1.out"
			});
		}
	});
};

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

const animateThuyen = () => {
	if (window.innerWidth < 767) {
		gsap.set(".thuyen", {
			top: "18%",
			right: "-6%",
			scaleX: 1,
			position: "absolute"
		});
	} else {
		gsap.set(".thuyen", {
			top: "12%",
			right: "-6%",
			scaleX: 1,
			position: "absolute"
		});
	}


	const timeRun = 4;
	let animationActive = false;

	ScrollTrigger.create({
		trigger: ".thuyen",
		start: "top 50%",
		onEnter: () => {
			if (animationActive) return;

			const tl = gsap.timeline({
				onComplete: () => {
					// Bắt đầu random cycle
					animationActive = true;
					randomCycle();
				}
			});

			// Animation chính
			if (window.innerWidth < 767) {
				tl.to(".thuyen", {
					top: "24%",
					right: "18%",
					duration: timeRun,
					ease: "power1.out"
				});
			} else {
				tl.to(".thuyen", {
					top: "18%",
					right: "21%",
					duration: timeRun,
					ease: "power1.out"
				});
			}



		},

		onLeaveBack: () => {
			animationActive = false;
			gsap.killTweensOf(".thuyen");

			if (window.innerWidth < 767) {
				gsap.to(".thuyen", {
					top: "18%",
					right: "-6%",
					scaleX: 1,
					rotation: 0,
					y: 0,
					x: 0,
					duration: timeRun - 1,
					ease: "power1.out"
				});
			} else {
				gsap.to(".thuyen", {
					top: "12%",
					right: "-6%",
					scaleX: 1,
					rotation: 0,
					y: 0,
					x: 0,
					duration: timeRun - 1,
					ease: "power1.out"
				});
			}


		}
	});

	// Random cycle function
	const randomCycle = () => {
		if (!animationActive) return;

		const randomY = gsap.utils.random(-15, 10);
		const randomX = gsap.utils.random(-8, 8);
		const randomRotation = gsap.utils.random(-3, 3);
		const randomDuration = gsap.utils.random(2, 4);
		const randomDelay = gsap.utils.random(0.5, 2);

		gsap.to(".thuyen", {
			y: randomY,
			x: randomX,
			rotation: randomRotation,
			duration: randomDuration,
			ease: "power2.inOut",
			delay: randomDelay,
			onComplete: () => {
				// Restart với giá trị random mới
				randomCycle();
			}
		});
	};
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
		animateConChim();
		animateThuyen();
		ScrollTrigger.refresh();
	}, 100);
});


// ==============================
// Document ready: khởi tạo toàn bộ các module
// ==============================
$(document).ready(() => {

	

});

$(window).on('scroll', function () {

});

$(window).resize(() => {});
