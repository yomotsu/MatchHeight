/*!
 * @author yomotsu
 * MatchHeight
 * https://github.com/yomotsu/MatchHeight
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.MatchHeight = factory());
}(this, (function () { 'use strict';

	function throttle(fn, threshhold) {

		var last = void 0,
		    deferTimer = void 0;

		return function () {

			var now = Date.now();

			if (last && now < last + threshhold) {

				clearTimeout(deferTimer);
				deferTimer = setTimeout(function () {

					last = now;
					fn();
				}, threshhold);
			} else {

				last = now;
				fn();
			}
		};
	}

	var elements = void 0;
	var remains = void 0;

	var MatchHeight$1 = {
		init: function init() {

			elements = document.querySelectorAll('[data-mh]');
			this.update();
		},
		update: function update() {

			remains = Array.prototype.map.call(elements, function (el) {
				return { el: el };
			});
			// remove all height before
			remains.forEach(function (item) {
				item.el.style.minHeight = 'auto';
			});
			prosess();
		}
	};

	function prosess() {

		remains.forEach(function (item) {

			var bb = item.el.getBoundingClientRect();

			item.top = bb.top;
			item.height = bb.height;
		});

		remains.sort(function (a, b) {
			return a.top - b.top;
		});
		var prosessingTop = remains[0].top;
		var prosessingTargets = remains.filter(function (item) {
			return item.top === prosessingTop;
		});
		var maxHeightInRow = prosessingTargets.reduce(function (max, item) {
			return Math.max(max, item.height);
		}, 0);

		prosessingTargets.forEach(function (item) {

			var paddingAndBorder = parseFloat(window.getComputedStyle(item.el).getPropertyValue('padding-top'), 10) + parseFloat(window.getComputedStyle(item.el).getPropertyValue('padding-bottom'), 10) + parseFloat(window.getComputedStyle(item.el).getPropertyValue('border-top-width'), 10) + parseFloat(window.getComputedStyle(item.el).getPropertyValue('border-bottom-width'), 10);
			item.el.style.minHeight = maxHeightInRow - paddingAndBorder + 'px';
		});

		remains.splice(0, prosessingTargets.length);

		if (0 < remains.length) prosess();
	}

	var throttledUpdate = throttle(MatchHeight$1.update, 200);

	MatchHeight$1.init();
	window.addEventListener('resize', throttledUpdate);

	return MatchHeight$1;

})));
