/*
	Template Name: SaasRiver - SaaS & StartUp HTML Template
	Author: https://themexriver.com/
	Version: 1.0
*/

(function ($) {
"use strict";

/*
	no-scroll-restore — a reload half-way down the page would otherwise put the
	browser back at that offset after the scroll-driven triggers were measured,
	leaving every start/end point off by the restored amount
*/
if ("scrollRestoration" in history) {
	history.scrollRestoration = "manual";
}

/*
	windows-load-function
*/

// section-title-1 — the split has to happen before the preloader lifts, or the
// lines are on screen for the length of the fade and then jump back out
var waTitleLines = [];

function waTitleSplit() {
	if (getComputedStyle(document.body).direction === "rtl") return;
	if (!$(".wa_title_ani_1").length) return;

	gsap.registerPlugin(SplitText);

	$(".wa_title_ani_1").each(function (index, el) {

		// double split: the second pass wraps each line in a mask
		var wa_title_line = new SplitText(el, {
			type: "lines",
			linesClass: "wa-split-line"
		});
		new SplitText(el, {
			type: "lines",
			linesClass: "wa-split-mask"
		});

		gsap.set(wa_title_line.lines, {
			yPercent: 110,
			opacity: 0
		});

		waTitleLines.push({
			el: el,
			lines: wa_title_line.lines,
			delay: parseFloat($(el).attr('data-split-delay')) || 0
		});
	});
}


window.addEventListener("load", function(){

	// drop any scroll position gsap/the browser remembered, then measure the
	// triggers from a clean top-of-page state
	ScrollTrigger.clearScrollMemory("manual");
	window.scrollTo(0, 0);
	ScrollTrigger.refresh();

	// park the headline lines while the curtain is still up
	waTitleSplit();

	if (document.querySelectorAll(".ot-preloader-1").length) {
		const loader = document.querySelector(".ot-preloader-1");
		
		setTimeout(() => {
			loader.classList.add("loaded");
		});

		// hold the intro back until the curtain has finished lifting
		// (matches the .55s fade in scss/components/_preloader.scss)
		setTimeout(function () {
			afterPreloader();
		}, 550);
		setTimeout(function () {
			loader.remove();
		}, 1500);

	} else {
		afterPreloader();
	}

	afterPageLoad();

})

/* 
	after-preloader-start
*/
function afterPreloader() {

	// the hero opens only now, so its reveal is not spent behind the curtain
	ot_hero1_intro();
	ot_hero2_intro();
	ot_hero3_intro();

	/*
		only-LTR-direction
	*/
	if (getComputedStyle(document.body).direction !== "rtl") {

		// section-title-1 — the lines were already split and parked by
		// waTitleSplit(), all that is left is to let them slide up
		waTitleLines.forEach(function (wa_title_item) {
			gsap.to(wa_title_item.lines, {
				scrollTrigger: {
					trigger: wa_title_item.el,
					start: "top 86%",
				},
				yPercent: 0,
				opacity: 1,
				duration: .9,
				ease: "power3.out",
				stagger: .1,
				delay: wa_title_item.delay
			});
		});

	}

/*
	after-preloader-end
*/
}

/* 
	after-page-load-start
*/
function afterPageLoad() {

	/* 
		add-active-class
	*/
	const waAddClass = gsap.utils.toArray('.wa_add_class');
	waAddClass.forEach(waAddClassItem => {
		gsap.to(waAddClassItem, {
			scrollTrigger: {
				trigger: waAddClassItem,
				start: "top 90%",
				end: "bottom bottom",
				toggleActions: "play none none reverse",
				toggleClass: "active",
				once: true,
				markers: false,
			}
		});
	});

	/* 
		wow-activation
	*/
	if($('.wow').length){
		var wow = new WOW({
			boxClass:     'wow',
			animateClass: 'animated',
			offset:       100,
			mobile:       true,
			live:         true
		});
		wow.init();
	};

		

/* 
	after-page-load-start
*/
}

// clip animation
const waClipAnimation = {

	// wrappers marked data-clip-manual are played by their own script
	// (sliders, tabs, popups …) through waClipAnimation.play(wrapper)
	init: function () {
		const self = this;

		$(".wa_clip_animation").not("[data-clip-manual]").each(function () {
			if (self.createMasks(this)) {
				self.reveal(this, true);
			}
		});
	},

	initialClipPaths: [
		"polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)",
		"polygon(33.33% 0%, 33.33% 0%, 33.33% 0%, 33.33% 0%)",
		"polygon(65.66% 0%, 66.66% 0%, 66.66% 0%, 66.66% 0%)",
		"polygon(0% 33.33%, 0% 33.33%, 0% 33.33%, 0% 33.33%)",
		"polygon(33.33% 33.33%, 33.33% 33.33%, 33.33% 33.33%, 33.33% 33.33%)",
		"polygon(65.66% 33.33%, 66.66% 33.33%, 66.66% 33.33%, 66.66% 33.33%)",
		"polygon(0% 66.66%, 0% 66.66%, 0% 66.66%, 0% 66.66%)",
		"polygon(33.33% 66.66%, 33.33% 66.66%, 33.33% 66.66%, 33.33% 66.66%)",
		"polygon(65.66% 66.66%, 66.66% 66.66%, 66.66% 66.66%, 66.66% 66.66%)"
	],

	finalClipPaths: [
		"polygon(0% 0%, 34.33% 0%, 34.33% 34.33%, 0% 34.33%)",
		"polygon(32.33% 0%, 66.66% 0%, 66.66% 33.33%, 33.33% 34.33%)",
		"polygon(65.66% 0%, 100% 0%, 100% 33.33%, 65.66% 34.33%)",
		"polygon(0% 33.33%, 33.33% 33.33%, 33.33% 66.66%, 0% 66.66%)",
		"polygon(30.33% 33.33%, 66.66% 33.33%, 66.66% 66.66%, 33.33% 66.66%)",
		"polygon(65.66% 33.33%, 100% 32.33%, 100% 66.66%, 65.66% 66.66%)",
		"polygon(0% 65.66%, 33.33% 66.66%, 33.33% 100%, 0% 100%)",
		"polygon(30.33% 66.66%, 66.66% 65.66%, 66.66% 100%, 33.33% 100%)",
		"polygon(65.66% 66.66%, 100% 65.66%, 100% 100%, 65.66% 100%)"
	],

	// the nine tiles that make up the reveal — rebuilt on every play
	createMasks: function (wrapper) {
		const $wrapper = $(wrapper);
		const $img = $wrapper.find(".wa_clip_animation_img[data-animate='true']");

		if (!$img.length) return false;

		const url = $img.attr("src");

		$wrapper.find(".wa_mask").remove();

		for (let i = 0; i < 9; i++) {
			$("<div>", {
				class: `wa_mask wa_mask_${i + 1}`,
				css: {
					backgroundImage: `url(${url})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
					position: "absolute",
					inset: 0
				}
			}).appendTo($wrapper);
		}

		return true;
	},

	// diagonal open — scroll triggered by default, instant when scroll is false
	reveal: function (wrapper, scroll) {
		const self = this;
		const $masks = $(wrapper).find(".wa_mask");

		if (!$masks.length) return;

		gsap.set($masks.toArray(), {
			clipPath: function (i) {
				return self.initialClipPaths[i];
			}
		});

		const order = [
			[".wa_mask_1"],
			[".wa_mask_2", ".wa_mask_4"],
			[".wa_mask_3", ".wa_mask_5", ".wa_mask_7"],
			[".wa_mask_6", ".wa_mask_8"],
			[".wa_mask_9"]
		];

		const tl = gsap.timeline(scroll ? {
			scrollTrigger: {
				trigger: wrapper,
				start: "top 75%"
			}
		} : {});

		order.forEach((targets, i) => {
			const elements = targets
				.map(sel => wrapper.querySelector(sel))
				.filter(Boolean);

			if (!elements.length) return;

			tl.to(elements, {
				clipPath: (j, el) =>
					self.finalClipPaths[$masks.toArray().indexOf(el)],
				duration: 1,
				ease: "power4.out",
				stagger: 0.1
			}, i * 0.125);
		});
	},

	// rebuild + replay right away, for anything that swaps images in place
	play: function (wrapper) {
		if (wrapper && this.createMasks(wrapper)) {
			this.reveal(wrapper, false);
		}
	}
};

waClipAnimation.init();

// hero-1-slider
var ot_hero1_imgs = [];

$('.ot_hero1_slider .swiper-slide .bg-img img').each(function () {
	ot_hero1_imgs.push($(this).attr('src'));
});

// the two buttons preview the slide they will bring in
function ot_hero1_preview(swiper) {
	var total = ot_hero1_imgs.length;
	if (!total) return;

	$('.ot_hero1_prev_img img').attr('src', ot_hero1_imgs[(swiper.realIndex - 1 + total) % total]);
	$('.ot_hero1_next_img img').attr('src', ot_hero1_imgs[(swiper.realIndex + 1) % total]);
}

// plays the first slide in, called after the preloader lifts
function ot_hero1_intro() {
	if (typeof ot_hero1_slider === "undefined") return;

	ot_hero1_clip(ot_hero1_slider);
	ot_hero1_content(ot_hero1_slider, true);
}

// the incoming slide replays the clip reveal on its background image
function ot_hero1_clip(swiper) {
	var slide = swiper.slides[swiper.activeIndex];
	if (!slide) return;

	waClipAnimation.play(slide.querySelector(".wa_clip_animation"));
}

// the active slide's copy — parked out of sight on init, played once the
// preloader has lifted and again on every slide change
function ot_hero1_content(swiper, play) {
	var slide = swiper.slides[swiper.activeIndex];
	if (!slide) return;

	var content = slide.querySelector('.ot-hero-1-slider-item-content');
	if (!content) return;

	var ot_hero1_author = content.querySelector('.ot-hero-1-slider-item-author');
	var ot_hero1_title = content.querySelector('.ot-hero-1-slider-item-title');
	var ot_hero1_disc = content.querySelector('.ot-hero-1-slider-item-disc');
	var ot_hero1_btns = Array.prototype.slice.call(content.querySelectorAll('.ot-hero-1-slider-item-content .btn-elm'));

	// a quick slide change can leave the previous run half way through
	var ot_hero1_targets = [ot_hero1_author, ot_hero1_title, ot_hero1_disc].concat(ot_hero1_btns).filter(Boolean);

	gsap.killTweensOf(ot_hero1_targets);
	gsap.set(ot_hero1_targets, { y: 40, opacity: 0 });

	if (!play) return;

	gsap.timeline({ defaults: { duration: 1.2, ease: "power3.out" } })
		.to(ot_hero1_author, {
			y: 0,
			opacity: 1,
		})
		.to(ot_hero1_title, {
			y: 0,
			opacity: 1,
		}, "-=1")
		.to(ot_hero1_disc, {
			y: 0,
			opacity: 1,
		}, "-=1")
		.to(ot_hero1_btns, {
			y: 0,
			opacity: 1,
			stagger: .14,
		}, "-=1");
}
var ot_hero1_slider = new Swiper(".ot_hero1_slider", {
	loop: true,
	speed: 1000,
	slidesPerView: 1,
    autoplay: {
		delay: 4000,
	},
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
	
	navigation: {
		nextEl: '.ot_hero1_slider_next',
		prevEl: '.ot_hero1_slider_prev',
	},

	on: {
		afterInit: function () {
			ot_hero1_preview(this);

			// park the copy out of sight straight away, so nothing flashes
			// while the preloader fades; ot_hero1_intro() plays it after
			ot_hero1_content(this, false);
		},
		slideChange: function () {
			ot_hero1_preview(this);
		},
		slideChangeTransitionStart: function () {
			ot_hero1_clip(this);
			ot_hero1_content(this, true);
		},
	},
});

// hero-2 — the opening plays once the preloader has lifted, so every piece is
// parked out of sight the moment this script runs, behind the curtain
var ot_hero2_shapes = gsap.utils.toArray(".ot-hero-2-bg-shape img");
var ot_hero2_img = document.querySelector(".ot-hero-2-img img");
var ot_hero2_line = document.querySelector(".ot-hero-2-popup-line path");
var ot_hero2_dots = gsap.utils.toArray(".ot-hero-2-popup-line circle");
var ot_hero2_text = document.querySelector(".ot-hero-2-popup-text");
var ot_hero2_clip = document.querySelector(".ot-hero-2-bg-text .wa_clip_animation");
var ot_hero2_copy = gsap.utils.toArray(".ot-hero-2-title-1, .ot-hero-2-title-2, .ot-hero-2-title-3, .ot-hero-2-disc, .ot-hero-2-content .btn-elm > a");
var ot_hero2_length = 0;
var ot_hero2_alphas = [];

function ot_hero2_park() {
	if (!$(".ot-hero-2-area").length) return;

	if (ot_hero2_shapes.length) {
		gsap.set(ot_hero2_shapes, { xPercent: 70, opacity: 0 });
	}

	if (ot_hero2_copy.length) {
		gsap.set(ot_hero2_copy, { y: 40, opacity: 0 });
	}

	if (ot_hero2_img) {
		gsap.set(ot_hero2_img, { yPercent: 14, opacity: 0 });
	}

	if (ot_hero2_line) {
		ot_hero2_length = ot_hero2_line.getTotalLength();

		gsap.set(ot_hero2_line, {
			strokeDasharray: ot_hero2_length,
			strokeDashoffset: -ot_hero2_length,
		});
	}

	// each dot is put back to the opacity the markup gave it, not to 1
	ot_hero2_dots.forEach(function (ot_hero2_dot) {
		var ot_hero2_alpha = parseFloat(ot_hero2_dot.getAttribute("opacity"));

		ot_hero2_alphas.push(isNaN(ot_hero2_alpha) ? 1 : ot_hero2_alpha);
		gsap.set(ot_hero2_dot, { attr: { opacity: 0 } });
	});

	if (ot_hero2_text) {
		gsap.set(ot_hero2_text, { y: 20, opacity: 0 });
	}
}

ot_hero2_park();

function ot_hero2_intro() {
	if (!$(".ot-hero-2-area").length) return;

	var ot_hero2_tl = gsap.timeline({ defaults: { ease: "power3.out" } });

	// the rings come in off the right edge, one behind the other
	if (ot_hero2_shapes.length) {
		ot_hero2_tl.to(ot_hero2_shapes, {
			xPercent: 0,
			opacity: 1,
			duration: 1.3,
			stagger: .18,
		}, 0);
	}

	// the headline, the copy under it and the two buttons come up in order
	if (ot_hero2_copy.length) {
		ot_hero2_tl.to(ot_hero2_copy, {
			y: 0,
			opacity: 1,
			duration: 1.1,
			stagger: .12,
		}, .15);
	}

	// the wordmark opens in the theme's nine-tile image reveal
	if (ot_hero2_clip) {
		ot_hero2_tl.call(function () {
			waClipAnimation.play(ot_hero2_clip);
		}, null, .3);
	}

	// the cut-out slides up into the column
	if (ot_hero2_img) {
		ot_hero2_tl.to(ot_hero2_img, {
			yPercent: 0,
			opacity: 1,
			duration: 1.4,
		}, .25);
	}

	// the leader line draws itself up towards the badge, the dots land on its
	// two ends, and only then does the label fade in
	if (ot_hero2_line) {
		ot_hero2_tl.to(ot_hero2_line, {
			strokeDashoffset: 0,
			duration: 1.1,
			ease: "power2.inOut",
		}, .6);

		ot_hero2_dots.forEach(function (ot_hero2_dot, index) {
			ot_hero2_tl.to(ot_hero2_dot, {
				attr: { opacity: ot_hero2_alphas[index] },
				duration: .4,
			}, 1.35 + index * .08);
		});
	}

	if (ot_hero2_text) {
		ot_hero2_tl.to(ot_hero2_text, {
			y: 0,
			opacity: 1,
			duration: .8,
		}, 1.6);
	}
}

// hero-3 — same deal as hero-2: the opening is parked while the script runs so
// nothing plays out behind the preloader curtain
var ot_hero3_world = document.querySelector(".ot-hero-3-top .bg-world");
var ot_hero3_authors = gsap.utils.toArray(".ot-hero-3-top .rating-elm .author-img-single");
var ot_hero3_rating = document.querySelector(".ot-hero-3-top .rating-elm .text-elm");
var ot_hero3_disc = document.querySelector(".ot-hero-3-top .right-elm .disc");
var ot_hero3_btn = document.querySelector(".ot-hero-3-top .right-elm .btn-elm");
var ot_hero3_company = document.querySelector(".ot-hero-3-top .company-elm");

function ot_hero3_park() {
	if (!$(".ot-hero-3-top").length) return;

	// the globe keeps its own css spin, so only the wrapper is touched
	if (ot_hero3_world) {
		gsap.set(ot_hero3_world, { scale: .85, opacity: 0 });
	}

	if (ot_hero3_authors.length) {
		gsap.set(ot_hero3_authors, { scale: 0, opacity: 0 });
	}

	gsap.set([ot_hero3_rating, ot_hero3_disc, ot_hero3_btn, ot_hero3_company].filter(Boolean), {
		y: 30,
		opacity: 0,
	});
}

ot_hero3_park();

function ot_hero3_intro() {
	if (!$(".ot-hero-3-top").length) return;

	var ot_hero3_tl = gsap.timeline({ defaults: { ease: "power3.out" } });

	if (ot_hero3_world) {
		ot_hero3_tl.to(ot_hero3_world, {
			scale: 1,
			opacity: 1,
			duration: 1.6,
			ease: "power2.out",
		}, 0);
	}

	// the four faces pop in before the rating they belong to
	if (ot_hero3_authors.length) {
		ot_hero3_tl.to(ot_hero3_authors, {
			scale: 1,
			opacity: 1,
			duration: .7,
			stagger: .08,
			ease: "back.out(1.8)",
		}, .1);
	}

	if (ot_hero3_rating) {
		ot_hero3_tl.to(ot_hero3_rating, {
			y: 0,
			opacity: 1,
			duration: .9,
		}, .35);
	}

	// the headline lines are handled by wa_title_ani_1, so the copy on the
	// right picks up from where they land
	if (ot_hero3_disc) {
		ot_hero3_tl.to(ot_hero3_disc, {
			y: 0,
			opacity: 1,
			duration: .9,
		}, .5);
	}

	if (ot_hero3_btn) {
		ot_hero3_tl.to(ot_hero3_btn, {
			y: 0,
			opacity: 1,
			duration: .9,
		}, .62);
	}

	if (ot_hero3_company) {
		ot_hero3_tl.to(ot_hero3_company, {
			y: 0,
			opacity: 1,
			duration: .9,
		}, .74);
	}
}

// services-1-slider
var ot_services1_slider = new Swiper(".ot_services1_slider", {
	loop: true,
	speed: 800,
	spaceBetween: 28,
	slidesPerView: "auto",
	autoplay: {
		delay: 4000,
	},
});

// price-1-toggle — swaps every card between the monthly and the annual rate
$("#ot-price-1-toggle").on("change", function () {
	var ot_price1_yearly = $(this).is(":checked");

	$(".ot-price-1-card .price").each(function () {
		var $amount = $(this).find(".amount");

		$amount.text($amount.data(ot_price1_yearly ? "yearly" : "monthly"));
		$(this).find(".duration").text(ot_price1_yearly ? "/per yearly" : "/per monthly");
	});
});

// step-1-bg-dot — every dot drops in from the top edge and fades out on the way down
$(".sb-step-1-bg-dot circle").each(function () {
	var sb_step1_cy = parseFloat(this.getAttribute("cy"));
	var sb_step1_dur = gsap.utils.random(4, 8);
	var sb_step1_dot_tl = gsap.timeline({ repeat: -1 });

	sb_step1_dot_tl
		.set(this, { y: -sb_step1_cy, opacity: 0 })
		.to(this, { y: 163 - sb_step1_cy, duration: sb_step1_dur, ease: "none" }, 0)
		.to(this, { opacity: 1, duration: sb_step1_dur * 0.2 }, 0)
		.to(this, { opacity: 0, duration: sb_step1_dur * 0.8, ease: "none" }, sb_step1_dur * 0.2);

	// start each dot mid-fall so the field is already populated on load
	sb_step1_dot_tl.progress(Math.random());
});

// step-1-line — the two glowing dashes travel along the two connector paths
$(".sb-step-1-line svg").each(function () {
	var $paths = $(this).find("path:not(.sb-step-1-line-dot)");
	var $dots = $(this).find(".sb-step-1-line-dot");

	$dots.each(function (index) {
		var sb_step1_tl = gsap.timeline({ repeat: -1, delay: index * 0.6 });

		sb_step1_tl
			.fromTo(this, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0)
			.to(
				this,
				{
					motionPath: {
						path: $paths[index],
						align: $paths[index],
						alignOrigin: [0.5, 0.5],
						autoRotate: true,
						start: 1,
						end: 0,
					},
					duration: 3.2,
					ease: "none",
				},
				0
			)
			.to(this, { opacity: 0, duration: 0.4 }, 2.8);
	});
});

// sb-price-1-toggle — swaps every card between the monthly and the annual rate
$("#sb-price-1-toggle").on("change", function () {
	var sb_price1_yearly = $(this).is(":checked");

	$(".sb-price-1-toggle").toggleClass("is-yearly", sb_price1_yearly);
	$(".sb-price-1-toggle-label.monthly").toggleClass("active", !sb_price1_yearly);
	$(".sb-price-1-toggle-label.yearly").toggleClass("active", sb_price1_yearly);

	$(".sb-price-1-card .price").each(function () {
		var $amount = $(this).find(".amount");

		$amount.text($amount.data(sb_price1_yearly ? "yearly" : "monthly"));
		$(this).find(".duration").text(sb_price1_yearly ? "/per yearly" : "/per monthly");
	});
});

// the labels flip the switch as well
$(".sb-price-1-toggle-label").on("click", function () {
	$("#sb-price-1-toggle").prop("checked", $(this).hasClass("yearly")).trigger("change");
});

// project-1-slider — the slide in focus grows, so re-measure once it settles
var ot_project1_slider = new Swiper(".ot_project1_slider", {
	loop: true,
	speed: 800,
	spaceBetween: 20,
	slidesPerView: "auto",

	navigation: {
		nextEl: ".ot_project1_next",
		prevEl: ".ot_project1_prev",
	},

	pagination: {
		el: ".ot_project1_pagination",
		type: "fraction",
		formatFractionCurrent: function (number) {
			return number < 10 ? "0" + number : number;
		},
		renderFraction: function (currentClass, totalClass) {
			return "<span class=\"" + currentClass + "\"></span>" +
				"<span class=\"divider\">/<span class=\"" + totalClass + "\"></span></span>";
		},
	},

	on: {
		slideChangeTransitionEnd: function () {
			this.update();
		},
	},
});


// testimonial-2-slider — the quote cross-fades, and the three photos around it
// are re-dealt to whoever is now active, next and previous
var ot_testimonial2_imgs = [];

$(".ot_testimonial2_slider .swiper-slide").each(function () {
	ot_testimonial2_imgs.push($(this).attr("data-img"));
});

// each frame lets go of its face before it takes the new one
// (the fade itself lives in scss/layout/_testimonial.scss)
function ot_testimonial2_swap($frame, src) {
	if (!$frame.length || !src) return;

	var $img = $frame.find("img");

	if ($img.attr("src") === src) return;

	$frame.addClass("is-changing");

	setTimeout(function () {
		$img.attr("src", src);
		$frame.removeClass("is-changing");
	}, 350);
}

function ot_testimonial2_photos(swiper) {
	var total = ot_testimonial2_imgs.length;
	if (!total) return;

	ot_testimonial2_swap($(".ot-testimonial-2-box .active-img"), ot_testimonial2_imgs[swiper.realIndex]);
	ot_testimonial2_swap($(".ot-testimonial-2-box .next-img"), ot_testimonial2_imgs[(swiper.realIndex + 1) % total]);
	ot_testimonial2_swap($(".ot-testimonial-2-box .prev-img"), ot_testimonial2_imgs[(swiper.realIndex - 1 + total) % total]);
}

var ot_testimonial2_slider = new Swiper(".ot_testimonial2_slider", {
	/* three quotes are too few to clone for a loop, so the ends rewind */
	rewind: true,
	speed: 800,
	slidesPerView: 1,
    autoplay: {
		delay: 4000,
	},
	/* the stack keeps the tallest quote's height, so the arrows hold still */
	effect: "fade",
	fadeEffect: {
		crossFade: true,
	},

	navigation: {
		nextEl: ".ot_testimonial2_next",
		prevEl: ".ot_testimonial2_prev",
	},

	on: {
		slideChange: function () {
			ot_testimonial2_photos(this);
		},
	},
});


// process-1-cards — the steps rise into the middle of the row one by one,
// then the finished stack fans back out to its own columns, all on scroll
if ($(".ot-process-1-wrap-height").length) {
	gsap.matchMedia().add("(min-width: 1400px)", function () {
		var ot_process1_cards = gsap.utils.toArray(".ot-process-1-card");
		var ot_process1_wrap = document.querySelector(".ot-process-1-wrap");

		// how far a card has to travel to sit in the middle of the row
		function ot_process1_center(card) {
			return (ot_process1_wrap.offsetWidth / 2) - (card.offsetLeft + card.offsetWidth / 2);
		}

		gsap.set(ot_process1_cards, {
			x: function (index, card) {
				return ot_process1_center(card);
			},
			yPercent: 200,
			zIndex: function (index) {
				return index + 1;
			},
		});

		var ot_process1_tl = gsap.timeline({
			scrollTrigger: {
				trigger: ".ot-process-1-wrap-height",
				start: "top 30%",
				end: "bottom bottom",
				scrub: 1,
				invalidateOnRefresh: true,
			}
		});

		// one card after another into the middle
		ot_process1_cards.forEach(function (card, index) {
			ot_process1_tl.to(card, {
				yPercent: 0,
				opacity: 1,
				duration: 1,
				ease: "none",
			}, index);
		});

		// once all four are stacked, they spread to left and right
		ot_process1_tl.to(ot_process1_cards, {
			x: 0,
			duration: 1.5,
			ease: "power2.inOut",
			stagger: 0.1,
		}, ot_process1_cards.length + 0.2);

		return function () {
			gsap.set(ot_process1_cards, { clearProps: "all" });
		};
	});
}

// dot-shape — the dotted bands wipe in as they scroll into view: the ones
// pinned to a section top open downwards, the bottom one opens upwards
if ($(".ot-dot-shape, .bg-dot-shape-1, .bg-dot-shape-2").length) {
	gsap.utils.toArray(".ot-dot-shape, .bg-dot-shape-1, .bg-dot-shape-2").forEach(function (ot_dot_shape) {
		var ot_dot_up = ot_dot_shape.classList.contains("bg-dot-shape-2");

		gsap.fromTo(ot_dot_shape, {
			clipPath: ot_dot_up ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
			opacity: 0,
		}, {
			clipPath: "inset(0% 0% 0% 0%)",
			opacity: 1,
			duration: 1.4,
			ease: "power3.out",
			scrollTrigger: {
				trigger: ot_dot_shape,
				start: "top 90%",
				once: true,
			}
		});
	});
}
// about-1-images — the two photos rise in, then the badges land on top
if ($(".ot-about-1-img").length) {
	gsap.utils.toArray(".ot-about-1-img").forEach(function (ot_about1_img) {
		var ot_about1_tl = gsap.timeline({
			scrollTrigger: {
				trigger: ot_about1_img,
				start: "top 80%",
				once: true,
			}
		});

		ot_about1_tl
			.from(ot_about1_img.querySelectorAll(".img-single"), {
				y: 70,
				opacity: 0,
				duration: 1.2,
				stagger: .18,
				ease: "power3.out",
			})
			.from(ot_about1_img.querySelectorAll(".ot-about-1-exp"), {
				scale: .8,
				opacity: 0,
				duration: .9,
				ease: "back.out(1.6)",
				transformOrigin: "left top",
			}, "-=.7")
			.from(ot_about1_img.querySelectorAll(".ot-about-1-ceo"), {
				x: 40,
				opacity: 0,
				duration: .9,
				ease: "power3.out",
			}, "-=.6");
	});
}

// industry-1-tabs — the panel image wipes down and settles out of a slow
// zoom every time another tab is picked
if ($(".ot-industry-1-tabs").length) {
	$('.ot-industry-1-tabs [data-bs-toggle="tab"]').on("shown.bs.tab", function (event) {
		var ot_industry1_pane = document.querySelector(event.target.getAttribute("data-bs-target"));
		if (!ot_industry1_pane) return;

		var ot_industry1_img = ot_industry1_pane.querySelector(".img-elm");
		if (!ot_industry1_img) return;

		gsap.fromTo(ot_industry1_img, {
			clipPath: "inset(0% 0% 100% 0%)",
		}, {
			clipPath: "inset(0% 0% 0% 0%)",
			duration: .9,
			ease: "power3.out",
		});

		gsap.fromTo(ot_industry1_img.querySelector("img"), {
			scale: 1.12,
		}, {
			scale: 1,
			duration: 1.4,
			ease: "power3.out",
		});
	});
}


// team-2-x-member — the oversized headline lifts in as the section arrives,
// then the card row slides across it while the sticky box holds
if ($(".ot-team-2-area").length) {
	// only where the four-up row has room — under 1400 the scss drops the
	// 200vh runway and the sticky pin with it
	gsap.matchMedia().add("(min-width: 1400px)", function () {

		// measured off the headline itself — the section top clears 80% of the
		// viewport while the centred headline is still a screen away
		gsap.from(".ot-team-2-title-big-elm", {
			scrollTrigger: {
				trigger: ".ot-team-2-title-big-elm",
				start: "top 85%",
				once: true,
			},
			y: 80,
			opacity: 0,
			duration: 1.2,
			ease: "power3.out",
		});

		// the row travels its own width, scrubbed across the whole 200vh runway
		gsap.fromTo(".ot-team-2-list", {
			xPercent: 100,
		}, {
			xPercent: 0,
			ease: "none",
			scrollTrigger: {
				trigger: ".ot-team-2-area",
				start: "top top",
				end: "bottom bottom",
				scrub: 1,
				invalidateOnRefresh: true,
			},
		});

		return function () {
			gsap.set(".ot-team-2-list, .ot-team-2-title-big-elm", { clearProps: "all" });
		};
	});
}

// choose-2-skills — each bar runs out to the width the markup carries, the
// reading and its end tick travelling with the fill
if ($(".ot-choose-2-skill-list").length) {
	gsap.utils.toArray(".ot-choose-2-skill-list").forEach(function (ot_choose2_list) {
		gsap.from(ot_choose2_list.querySelectorAll(".bar-fill"), {
			scrollTrigger: {
				trigger: ot_choose2_list,
				start: "top 85%",
				once: true,
			},
			width: 0,
			duration: 1.4,
			stagger: .15,
			ease: "power3.out",
		});
	});
}

// project-2-cards — each card swings in from the right, one after the other,
// while the section stays pinned, the newest one landing on top of the stack
if ($(".ot-project-2-area").length) {
	var ot_project2_area = document.querySelector(".ot-project-2-area");
	var ot_project2_items = gsap.utils.toArray(".ot-project-2-item-posi");

	// the runway grows with the markup — one viewport of scroll per card
	ot_project2_area.style.setProperty("--ot-project-2-count", ot_project2_items.length);

	gsap.matchMedia().add("(min-width: 1400px)", function () {
		gsap.set(ot_project2_items, {
			xPercent: 100,
			yPercent: 100,
			rotate: -90,
			zIndex: function (index) {
				return index + 1;
			},
		});

		var ot_project2_tl = gsap.timeline({
			scrollTrigger: {
				trigger: ot_project2_area,
				start: "top 50%",
				end: "bottom bottom",
				scrub: 1,
				invalidateOnRefresh: true,
			}
		});

		// one card per scroll step, the previous one left sitting underneath
		ot_project2_items.forEach(function (ot_project2_item, index) {
			ot_project2_tl.to(ot_project2_item, {
				xPercent: 0,
				yPercent: 0,
				rotate: 0,
				duration: 1,
				ease: "none",
			}, index);
		});

		// under 1400 the cards just stack as an ordinary list
		return function () {
			gsap.set(ot_project2_items, { clearProps: "all" });
		};
	});
}

// core-features-2 — the photo opens from the left, the play button pops onto
// it, the open circle draws out and the two cards follow
if ($(".ot-core-features-2-area").length) {
	var ot_features2_thumb = document.querySelector(".ot-core-features-2-media .thumb");
	var ot_features2_playbtn = document.querySelector(".ot-core-features-2-media .playbtn");
	var ot_features2_circle = document.querySelector(".ot-core-features-2-media .circle-shape");
	var ot_features2_cards = gsap.utils.toArray(".ot-core-features-2-card");

	var ot_features2_tl = gsap.timeline({
		scrollTrigger: {
			trigger: ".ot-core-features-2-area",
			start: "top 80%",
			once: true,
		},
		defaults: { ease: "power3.out" },
	});

	if (ot_features2_thumb) {
		gsap.set(ot_features2_thumb, { clipPath: "inset(0% 100% 0% 0%)" });
		gsap.set(ot_features2_thumb.querySelector("img"), { scale: 1.15 });

		ot_features2_tl
			.to(ot_features2_thumb, {
				clipPath: "inset(0% 0% 0% 0%)",
				duration: 1.2,
				ease: "power4.out",
			}, 0)
			.to(ot_features2_thumb.querySelector("img"), {
				scale: 1,
				duration: 1.4,
			}, 0);
	}

	if (ot_features2_playbtn) {
		gsap.set(ot_features2_playbtn, { scale: 0, opacity: 0 });

		ot_features2_tl.to(ot_features2_playbtn, {
			scale: 1,
			opacity: 1,
			duration: .8,
			ease: "back.out(1.7)",
		}, .5);
	}

	if (ot_features2_circle) {
		gsap.set(ot_features2_circle, { clipPath: "inset(0% 100% 0% 0%)" });

		ot_features2_tl.to(ot_features2_circle, {
			clipPath: "inset(0% 0% 0% 0%)",
			duration: 1,
			ease: "power4.out",
		}, .45);
	}

	if (ot_features2_cards.length) {
		gsap.set(ot_features2_cards, { y: 50, opacity: 0 });

		ot_features2_tl.to(ot_features2_cards, {
			y: 0,
			opacity: 1,
			duration: 1,
			stagger: .15,
		}, .3);
	}
}

// apps-1-ring — spread the logos around the ring in %, so it scales with the ring (the ring turns via css)
$(".sb-apps-1-logo").each(function () {
	var $sb_apps1_items = $(this).find(".single-logo");
	var sb_apps1_total = $sb_apps1_items.length;

	$sb_apps1_items.each(function (index) {
		// half a step of offset keeps two logos straddling the top of the ring
		var angle = ((index + 0.5) / sb_apps1_total) * Math.PI * 2 - Math.PI / 2;

		// 45.17% of the ring width = the 542px mid-line of the band on the 1200px ring
		this.style.left = 50 + 45.17 * Math.cos(angle) + "%";
		this.style.top = 50 + 45.17 * Math.sin(angle) + "%";
	});
});

})(jQuery);
