/*
	Template Name: SaasRiver - SaaS & StartUp HTML Template
	Author: https://themexriver.com/
	Version: 1.0
*/

(function ($) {
"use strict";

// a reload half-way down the page would otherwise restore the old offset after
// the scroll triggers were measured
if ("scrollRestoration" in history) {
	history.scrollRestoration = "manual";
}

const isRtl = () => getComputedStyle(document.body).direction === "rtl";
const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;


/*
	preloader-1 — the counter follows the images that are loaded, jumps to 100 on
	window load, then the panel slides up on a curved edge
*/
function sbPreloaderInit() {

	var loader = document.querySelector(".sb-preloader-1");
	if (!loader) return null;

	if (prefersReducedMotion()) {
		return {
			done: function () {
				loader.remove();
				afterPreloader();
			}
		};
	}

	var count = loader.querySelector(".count");
	var bar = loader.querySelector(".bar span");
	var words = loader.querySelectorAll(".word");
	var curve = loader.querySelector(".curve path");
	var num = { val: 0 };
	var current = 0;
	var exited = false;
	var startTime = Date.now();
	var minTime = 1200; // the counter never just flashes by on a fast load

	gsap.set(words, { yPercent: 110, opacity: 1 });
	gsap.set(words[0], { yPercent: 0 });
	gsap.from(loader.querySelectorAll(".js-in"), {
		y: 30,
		opacity: 0,
		duration: .8,
		ease: "power3.out",
		stagger: .1
	});

	function showWord(i) {
		if (i === current) return;
		gsap.to(words[current], { yPercent: -110, duration: .5, ease: "power3.inOut" });
		gsap.fromTo(words[i], { yPercent: 110 }, { yPercent: 0, duration: .5, ease: "power3.inOut" });
		current = i;
	}

	function render() {
		count.textContent = Math.round(num.val);
		gsap.set(bar, { scaleX: num.val / 100 });
		showWord(Math.min(words.length - 1, Math.floor(num.val / (100 / words.length))));
	}

	function setProgress(p) {
		gsap.to(num, {
			val: p,
			duration: .7,
			ease: "power1.out",
			overwrite: true,
			onUpdate: render,
			onComplete: p >= 100 ? finish : null
		});
	}

	function finish() {
		var wait = Math.max(0, minTime - (Date.now() - startTime)) / 1000;
		gsap.delayedCall(wait, exit);
	}

	function exit() {
		if (exited) return;
		exited = true;

		var curveH = window.innerHeight * .14;
		var tl = gsap.timeline();

		tl.to(loader.querySelectorAll(".top, .middle, .bottom"), {
			y: -40,
			opacity: 0,
			duration: .5,
			ease: "power2.in",
			stagger: .06
		});
		tl.to(loader, {
			y: -(window.innerHeight + curveH),
			duration: 1.1,
			ease: "power4.inOut"
		}, .4);
		tl.to(curve, { attr: { d: "M0 0H1440Q720 0 0 0Z" }, duration: 1.1, ease: "power2.in" }, .4);

		// the intro starts once the panel is mostly gone
		tl.call(afterPreloader, null, .9);
		tl.call(function () {
			loader.remove();
		}, null, 1.6);
	}

	// lazy images do not hold the page
	var imgs = Array.prototype.filter.call(document.images, function (img) {
		return img.loading !== "lazy" && !loader.contains(img);
	});
	var loaded = 0;

	function imgDone() {
		loaded++;
		setProgress(Math.min(90, (loaded / imgs.length) * 90));
	}

	imgs.forEach(function (img) {
		if (img.complete) {
			loaded++;
		} else {
			img.addEventListener("load", imgDone);
			img.addEventListener("error", imgDone);
		}
	});
	setProgress(imgs.length ? Math.min(90, (loaded / imgs.length) * 90) : 10);

	return {
		done: function () {
			setProgress(100);
		}
	};
}

var sbPreloader = sbPreloaderInit();


/*
	section titles (.wa_title_ani_2) — words rise out of their masks, sharpen from
	a blur and turn from purple to white; split and parked behind the preloader
*/
var sbTitleItems = [];

function sbTitleSplit() {
	if (isRtl() || prefersReducedMotion()) return;
	if (!$(".wa_title_ani_2").length) return;

	$(".wa_title_ani_2").each(function (index, el) {

		var split = new SplitText(el, {
			type: "words",
			wordsClass: "sb-split-word"
		});

		split.words.forEach(function (word) {
			var mask = document.createElement("span");
			mask.className = "sb-split-mask";
			word.parentNode.insertBefore(mask, word);
			mask.appendChild(word);
		});

		gsap.set(split.words, {
			yPercent: 115,
			rotate: 6,
			opacity: 0,
			filter: "blur(10px)",
			color: "#8b72ff",
			transformOrigin: "0% 100%"
		});

		sbTitleItems.push({ el: el, words: split.words });
	});
}

function sbTitlePlay() {
	if (isRtl()) return;

	sbTitleItems.forEach(function (item) {
		gsap.to(item.words, {
			scrollTrigger: {
				trigger: item.el,
				start: "top 86%",
			},
			yPercent: 0,
			rotate: 0,
			opacity: 1,
			filter: "blur(0px)",
			color: "#fff",
			duration: 1.1,
			ease: "power4.out",
			stagger: .07,
			onComplete: function () {
				gsap.set(item.words, { clearProps: "filter,color,transform,opacity" });
			}
		});
	});
}


/*
	hero-1 — parked before the preloader lifts, played right after
*/
var sbHero = null;

function sbHeroPark() {
	if (prefersReducedMotion()) return;

	var title = document.querySelector(".sb-hero-1-title");
	if (!title) return;

	var hero = {
		pill: document.querySelector(".sb-hero-1-content .sb-subtitle-1"),
		title: title,
		box: title.querySelector(".sb-hero-1-title-box"),
		boxText: title.querySelector(".sb-hero-1-title-box-text"),
		disc: document.querySelector(".sb-hero-1-disc"),
		btns: document.querySelector(".sb-hero-1-content .btn-wrap"),
		img: document.querySelector(".sb-hero-1-img"),
		robot: document.querySelector(".sb-hero-1-robot"),
		words: []
	};

	// the plain words of the title become masked words, the capsule stays as it is
	Array.prototype.slice.call(title.childNodes).forEach(function (node) {
		if (node.nodeType !== 3) return;

		var frag = document.createDocumentFragment();
		node.textContent.split(/(\s+)/).forEach(function (part) {
			if (!part) return;
			if (!part.trim()) {
				frag.appendChild(document.createTextNode(" "));
				return;
			}

			var mask = document.createElement("span");
			var word = document.createElement("span");
			mask.className = "sb-split-mask";
			word.className = "sb-split-word";
			word.textContent = part;
			mask.appendChild(word);
			frag.appendChild(mask);
			hero.words.push(word);
		});
		title.replaceChild(frag, node);
	});

	gsap.set(hero.words, {
		yPercent: 115,
		rotate: 6,
		opacity: 0,
		filter: "blur(10px)",
		color: "#8b72ff",
		transformOrigin: "0% 100%"
	});
	gsap.set(hero.pill, { opacity: 0, y: 20, clipPath: "inset(0% 50% 0% 50% round 100px)" });
	gsap.set(hero.box, { opacity: 0, filter: "blur(12px)" });
	gsap.set(hero.boxText, { clipPath: "inset(0% 100% 0% 0%)" });
	gsap.set([hero.disc, hero.btns], { opacity: 0, y: 28, filter: "blur(6px)" });
	gsap.set(hero.img, { autoAlpha: 0, y: 90 });
	// the robot is never faded: half see-through it would show the dashboard behind it
	gsap.set(hero.robot, { visibility: "hidden", y: 90 });

	sbHero = hero;
}

function sbHeroPlay() {
	if (!sbHero) return;
	var hero = sbHero;

	gsap.timeline({
		defaults: { ease: "power3.out" },
		onComplete: function () {
			gsap.set([hero.pill, hero.box, hero.boxText, hero.disc, hero.btns, hero.img, hero.robot].concat(hero.words), { clearProps: "all" });
		}
	})
		.to(hero.pill, {
			opacity: 1,
			y: 0,
			clipPath: "inset(0% 0% 0% 0% round 100px)",
			duration: 1
		}, 0)
		.to(hero.words, {
			yPercent: 0,
			rotate: 0,
			opacity: 1,
			filter: "blur(0px)",
			color: "#fff",
			duration: 1.1,
			ease: "power4.out",
			stagger: .08
		}, .15)
		.to(hero.box, { opacity: 1, filter: "blur(0px)", duration: .8 }, .55)
		.to(hero.boxText, { clipPath: "inset(0% 0% 0% 0%)", duration: .9, ease: "power2.inOut" }, .65)
		.to(hero.disc, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1 }, .8)
		.to(hero.btns, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1 }, .95)
		.to(hero.img, { autoAlpha: 1, y: 0, duration: 1.3, ease: "power4.out" }, ">-.5")
		// the robot waits until the image has landed, so the two never cross mid-slide
		.set(hero.robot, { visibility: "visible" }, ">-.5")
		.to(hero.robot, { y: 0, duration: 1.1, ease: "power3.out" }, "<");
}

function sbHeroGlow() {
	gsap.fromTo(".sb-hero-1-bg-clr img, .sb-hero-1-bg-clr-3 img", {
		scaleX: 1,
		opacity: 0
	}, {
		scaleX: 1,
		opacity: 1,
		duration: 1.5,
		delay: .3,
		ease: "power2.out"
	});
}

// bottom glow: fades in once 40% of the hero has scrolled by, out again on the way up
function sbHeroBottomGlow() {
	gsap.to(".sb-hero-1-bg-clr-2", {
		opacity: 1,
		duration: 1.2,
		ease: "power2.out",
		scrollTrigger: {
			trigger: ".sb-hero-1-area",
			start: "top+=20% top",
			toggleActions: "play none none reverse",
		}
	});
}


/*
	partner title — the left line comes in from the left, the right one from the right
*/
function sbPartnerTitle() {
	if (!document.querySelector(".sb-partner-1-title")) return;

	var lines = document.querySelectorAll(".sb-partner-1-title-line");
	var trigger = {
		trigger: ".sb-partner-1-title",
		start: "top 90%"
	};

	gsap.fromTo(lines[0], {
		clipPath: "inset(0% 100% 0% 0%)",
		xPercent: -25
	}, {
		clipPath: "inset(0% 0% 0% 0%)",
		xPercent: 0,
		duration: 1.5,
		ease: "power3.out",
		scrollTrigger: trigger
	});

	gsap.fromTo(lines[1], {
		clipPath: "inset(0% 0% 0% 100%)",
		xPercent: 25
	}, {
		clipPath: "inset(0% 0% 0% 0%)",
		xPercent: 0,
		duration: 1.5,
		ease: "power3.out",
		scrollTrigger: trigger
	});
}


/*
	features
*/

// card-1 — toolbar fills and gets a sheen, tabs run in, chat panel is scanned in top-down
function sbFeaturesCard1() {
	if (!document.querySelector(".sb-features-1-card-1-top")) return;

	var el = {
		bar: document.querySelector(".sb-features-1-card-1-tags .bar"),
		tags: document.querySelector(".sb-features-1-card-1-tags .tag-img"),
		panel: document.querySelector(".sb-features-1-card-1-img"),
		panelImg: document.querySelector(".sb-features-1-card-1-img img")
	};

	gsap.set(el.bar, { opacity: 0, scaleX: 0, transformOrigin: "0% 50%" });
	gsap.set(el.tags, { opacity: 0, x: -24, clipPath: "inset(0% 100% 0% 0%)" });
	gsap.set(el.panel, { opacity: 0, y: 36 });
	gsap.set(el.panelImg, { clipPath: "inset(0% 0% 100% 0%)" });

	gsap.timeline({
		scrollTrigger: {
			trigger: ".sb-features-1-card-1",
			start: "top 75%",
			once: true
		},
		defaults: { ease: "power3.out" },
		onComplete: function () {
			gsap.set(Object.values(el), { clearProps: "all" });
		}
	})
		.to(el.bar, { opacity: 1, scaleX: 1, duration: .9 })
		.fromTo(el.bar, { "--sweep": "-100%" }, { "--sweep": "100%", duration: 1.1, ease: "power2.inOut" }, "-=.4")
		.to(el.tags, { opacity: 1, x: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 1.1 }, .25)
		.to(el.panel, { opacity: 1, y: 0, duration: .8 }, .5)
		.fromTo(el.panel, { "--scan-o": 1, "--scan": "0%" }, { "--scan": "100%", duration: 1.4, ease: "power2.inOut" }, .6)
		.to(el.panelImg, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power2.inOut" }, .6)
		.to(el.panel, { "--scan-o": 0, duration: .3 }, "-=.3");
}

// card-2 — bg slides down, badge-1 pops in, the arc draws out from the centre, badge-2 and 3 follow
function sbFeaturesCard2() {
	if (!document.querySelector(".sb-features-1-card-2-diagram")) return;

	var el = {
		bg: document.querySelector(".sb-features-1-card-2-bg"),
		badge1: document.querySelector(".sb-features-1-card-2-diagram .icon-badge-1"),
		line: document.querySelector(".sb-features-1-card-2-diagram .icon-line"),
		badges: document.querySelectorAll(".sb-features-1-card-2-diagram .icon-badge-2, .sb-features-1-card-2-diagram .icon-badge-3")
	};

	gsap.set(el.bg, { yPercent: -100, opacity: 0 });
	gsap.set([el.badge1, el.badges], { scale: 0, opacity: 0 });
	gsap.set(el.line, { "--a": "-10deg" });

	gsap.timeline({
		scrollTrigger: {
			trigger: ".sb-features-1-card-2",
			start: "top 75%",
			once: true
		},
		onComplete: function () {
			gsap.set([el.bg, el.badge1, el.line, el.badges], { clearProps: "all" });
		}
	})
		.to(el.bg, { yPercent: 0, opacity: 1, duration: 1.1, ease: "power3.out" })
		.to(el.badge1, { scale: 1, opacity: 1, duration: .7, ease: "back.out(1.7)" }, "-=.3")
		.to(el.line, { "--a": "100deg", duration: 1.3, ease: "sine.inOut" }, "<")
		.to(el.badges, { scale: 1, opacity: 1, duration: .7, ease: "back.out(1.7)" }, "-=.15");
}

// card-5 — the active menu item jumps to a random other item every 2s while on screen
function sbFeaturesMenu() {
	var menu = document.querySelector(".sb-features-1-card-5-menu");
	if (!menu) return;

	var items = menu.querySelectorAll("li");
	var visible = false;

	new IntersectionObserver(function (entries) {
		visible = entries[0].isIntersecting;
	}).observe(menu);

	setInterval(function () {
		if (!visible) return;

		var current = Math.max(Array.prototype.findIndex.call(items, function (li) {
			return li.classList.contains("active");
		}), 0);
		var next = (current + 1 + Math.floor(Math.random() * (items.length - 1))) % items.length;

		items[current].classList.remove("active");
		items[next].classList.add("active");
	}, 2000);
}


/*
	services — the bg image lights up once half of the section is on screen
*/
function sbServicesBg() {
	var area = document.querySelector(".sb-services-1-area");
	var bg = document.querySelector(".sb-services-1-bg");
	if (!area || !bg) return;

	gsap.set(bg, { opacity: 0, scale: 1.08, filter: "brightness(.2) blur(12px)" });

	gsap.to(bg, {
		opacity: 1,
		scale: 1,
		filter: "brightness(1) blur(0px)",
		duration: 1,
		ease: "power2.out",
		scrollTrigger: {
			trigger: area,
			// half of the section, capped at 80% of the viewport
			start: function () {
				return "top bottom-=" + Math.min(area.offsetHeight * .5, window.innerHeight * .8) + "px";
			},
			once: true,
			invalidateOnRefresh: true
		},
		onComplete: function () {
			gsap.set(bg, { clearProps: "all" });
		}
	});
}


/*
	testimonial — the glow line (::before) spreads out from the centre to both sides
*/
function sbTestimonialGlow() {
	var area = document.querySelector(".sb-testimonial-1-area");
	if (!area) return;

	gsap.set(area, { "--glow-x": 0 });

	gsap.to(area, {
		"--glow-x": 1,
		duration: 1.8,
		ease: "power2.out",
		scrollTrigger: {
			trigger: area,
			// the line sits on the bottom edge, so wait until it is well inside the viewport
			start: "bottom bottom-=150",
			once: true
		},
		onComplete: function () {
			gsap.set(area, { clearProps: "all" });
		}
	});
}


/*
	cta — the robot rolls in from the right in servo steps, then the spot light flickers on
*/
function sbCtaIntro() {
	var robot = document.querySelector(".sb-cta-1-robot");
	var light = document.querySelector(".sb-cta-1-light");
	if (!robot || !light) return;

	gsap.set(robot, { xPercent: 320, opacity: 0 });
	gsap.set(light, { opacity: 0 });

	var tl = gsap.timeline({
		scrollTrigger: {
			trigger: ".sb-cta-1-wrap",
			start: "top 95%",
			once: true
		},
		onComplete: function () {
			gsap.set([robot, light], { clearProps: "all" });
		}
	});

	tl.to(robot, { opacity: 1, duration: .15 });

	// quick slides with a hold and a small head tick at each stop, then a servo correction
	[
		{ x: 235, hold: .22 },
		{ x: 150, hold: .3 },
		{ x: 70, hold: .18 },
		{ x: 14, hold: .25 },
		{ x: -5, hold: .12 },
		{ x: 0, hold: 0 }
	].forEach(function (move) {
		tl
			.to(robot, { xPercent: move.x, duration: .2, ease: "power2.inOut" })
			.to(robot, { rotation: 1.6, duration: .05, ease: "none" })
			.to(robot, { rotation: 0, duration: .05, ease: "none" }, "+=" + move.hold);
	});

	tl
		.to(light, { opacity: .7, duration: .08 }, "+=.15")
		.to(light, { opacity: .1, duration: .1 })
		.to(light, { opacity: .85, duration: .08 })
		.to(light, { opacity: .25, duration: .12 })
		.to(light, { opacity: 1, duration: .9, ease: "power2.out" });
}


/*
	step-1 — falling dots in the background and the two dashes travelling along the connector paths
*/
function sbStepAnimations() {
	$(".sb-step-1-bg-dot circle").each(function () {
		var cy = parseFloat(this.getAttribute("cy"));
		var dur = gsap.utils.random(4, 8);
		var tl = gsap.timeline({ repeat: -1 });

		tl
			.set(this, { y: -cy, opacity: 0 })
			.to(this, { y: 163 - cy, duration: dur, ease: "none" }, 0)
			.to(this, { opacity: 1, duration: dur * 0.2 }, 0)
			.to(this, { opacity: 0, duration: dur * 0.8, ease: "none" }, dur * 0.2);

		// start mid-fall so the field is already populated on load
		tl.progress(Math.random());
	});

	$(".sb-step-1-line svg").each(function () {
		var $paths = $(this).find("path:not(.sb-step-1-line-dot)");
		var $dots = $(this).find(".sb-step-1-line-dot");

		$dots.each(function (index) {
			gsap.timeline({ repeat: -1, delay: index * 0.6 })
				.fromTo(this, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0)
				.to(this, {
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
				}, 0)
				.to(this, { opacity: 0, duration: 0.4 }, 2.8);
		});
	});
}


/*
	price-1 toggle — swaps every card between the monthly and the annual rate
*/
function sbPriceToggle() {
	$("#sb-price-1-toggle").on("change", function () {
		var yearly = $(this).is(":checked");

		$(".sb-price-1-toggle").toggleClass("is-yearly", yearly);
		$(".sb-price-1-toggle-label.monthly").toggleClass("active", !yearly);
		$(".sb-price-1-toggle-label.yearly").toggleClass("active", yearly);

		$(".sb-price-1-card .price").each(function () {
			var $amount = $(this).find(".amount");

			$amount.text($amount.data(yearly ? "yearly" : "monthly"));
			$(this).find(".duration").text(yearly ? "/per yearly" : "/per monthly");
		});
	});

	// the labels flip the switch as well
	$(".sb-price-1-toggle-label").on("click", function () {
		$("#sb-price-1-toggle").prop("checked", $(this).hasClass("yearly")).trigger("change");
	});
}


/*
	apps-1 ring — logos are spread around the ring in %, so it scales with the ring
*/
function sbAppsRing() {
	$(".sb-apps-1-logo").each(function () {
		var $items = $(this).find(".single-logo");
		var total = $items.length;

		$items.each(function (index) {
			// half a step of offset keeps two logos straddling the top of the ring
			var angle = ((index + 0.5) / total) * Math.PI * 2 - Math.PI / 2;

			// 45.17% of the ring width = the 542px mid-line of the band on the 1200px ring
			this.style.left = 50 + 45.17 * Math.cos(angle) + "%";
			this.style.top = 50 + 45.17 * Math.sin(angle) + "%";
		});
	});
}


/*
	page lifecycle
*/
function afterPreloader() {
	sbHeroGlow();
	sbPartnerTitle();
	sbFeaturesCard1();
	sbFeaturesCard2();
	sbFeaturesMenu();
	sbServicesBg();
	sbTestimonialGlow();
	sbCtaIntro();
	sbHeroPlay();
	sbTitlePlay();
}

function afterPageLoad() {
	if ($(".wow").length) {
		new WOW({
			boxClass: "wow",
			animateClass: "animated",
			offset: 100,
			mobile: true,
			live: true
		}).init();
	}
}

window.addEventListener("load", function () {

	// measure the triggers from a clean top-of-page state
	ScrollTrigger.clearScrollMemory("manual");
	window.scrollTo(0, 0);
	ScrollTrigger.refresh();

	// park the titles and the hero while the curtain is still up
	sbTitleSplit();
	sbHeroPark();

	if (sbPreloader) {
		sbPreloader.done();
	} else {
		afterPreloader();
	}

	afterPageLoad();
});

sbHeroBottomGlow();
sbStepAnimations();
sbPriceToggle();
sbAppsRing();

})(jQuery);
