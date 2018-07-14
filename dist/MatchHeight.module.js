/*!
 * @author yomotsu
 * MatchHeight
 * https://github.com/yomotsu/MatchHeight
 * Released under the MIT License.
 */
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

var initialized = false;
var elements = void 0;
var remains = void 0;

var MatchHeight$1 = {
	init: function init() {

		initialized = true;
		elements = document.querySelectorAll('[data-mh]');
		this.update();
	},
	update: function update() {

		if (!initialized) {

			this.init();
			return;
		}

		if (elements.length === 0) return;

		remains = Array.prototype.map.call(elements, function (el) {

			return { el: el };
		});
		// remove all height before
		remains.forEach(function (item) {

			item.el.style.minHeight = '';
		});
		process();
	}
};

function process() {

	remains.forEach(function (item) {

		var bb = item.el.getBoundingClientRect();

		item.top = bb.top;
		item.height = bb.height;
	});

	remains.sort(function (a, b) {
		return a.top - b.top;
	});

	var processingTop = remains[0].top;
	var processingTargets = remains.filter(function (item) {
		return item.top === processingTop;
	});
	var maxHeightInRow = Math.max.apply(Math, processingTargets.map(function (item) {
		return item.height;
	}));

	processingTargets.forEach(function (item) {

		var paddingAndBorder = parseFloat(window.getComputedStyle(item.el).getPropertyValue('padding-top'), 10) + parseFloat(window.getComputedStyle(item.el).getPropertyValue('padding-bottom'), 10) + parseFloat(window.getComputedStyle(item.el).getPropertyValue('border-top-width'), 10) + parseFloat(window.getComputedStyle(item.el).getPropertyValue('border-bottom-width'), 10);
		item.el.style.minHeight = maxHeightInRow - paddingAndBorder + 'px';
	});

	remains.splice(0, processingTargets.length);

	if (0 < remains.length) process();
}

var throttledUpdate = throttle(MatchHeight$1.update, 200);

window.addEventListener('DOMContentLoaded', function onDomReady() {

	MatchHeight$1.init();
	window.removeEventListener('DOMContentLoaded', onDomReady);
});
window.addEventListener('load', function onLoad() {

	MatchHeight$1.update();
	window.removeEventListener('load', onLoad);
});

window.addEventListener('resize', throttledUpdate);

export default MatchHeight$1;
