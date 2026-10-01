// notice-popup — open / close the panel and the monetize tooltip
(function () {
	var popup = document.getElementById("txr-notice-popup");
	if (!popup) return;

	var stage = popup.querySelector("[data-txr-stage]");
	var panel = popup.querySelector("[data-txr-panel]");
	var pill = popup.querySelector("[data-txr-open]");
	var tipBtn = popup.querySelector("[data-txr-tooltip-trigger]");
	var tip = popup.querySelector("[data-txr-tooltip]");

	// the stage height follows the visible block (panel or pill)
	function setHeight() {
		var collapsed = stage.classList.contains("is-collapsed");
		stage.style.height = (collapsed ? pill.offsetHeight : panel.offsetHeight) + "px";
	}

	function toggle(collapse) {
		stage.classList.toggle("is-collapsed", collapse);
		setHeight();
		try {
			sessionStorage.setItem("txrNoticePopup", collapse ? "closed" : "open");
		} catch (e) {}
	}

	try {
		if (sessionStorage.getItem("txrNoticePopup") === "closed") {
			stage.classList.add("is-collapsed");
		}
	} catch (e) {}

	setHeight();
	window.addEventListener("resize", setHeight);
	window.addEventListener("load", setHeight);

	popup.querySelector("[data-txr-close]").addEventListener("click", function () {
		toggle(true);
	});

	pill.addEventListener("click", function () {
		toggle(false);
	});

	// tooltip opens on tap for touch screens
	if (tipBtn && tip) {
		tipBtn.addEventListener("click", function (e) {
			e.stopPropagation();
			var open = tip.classList.toggle("is-visible");
			tipBtn.setAttribute("aria-expanded", open);
		});

		document.addEventListener("click", function () {
			tip.classList.remove("is-visible");
			tipBtn.setAttribute("aria-expanded", "false");
		});
	}
})();
