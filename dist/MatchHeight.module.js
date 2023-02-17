/*!
 * @author yomotsu
 * MatchHeight
 * https://github.com/yomotsu/MatchHeight
 * Released under the MIT License.
 */
function throttle(fn, threshold) {
    var last, deferTimer;
    return function () {
        var now = Date.now();
        if (last && now < last + threshold) {
            clearTimeout(deferTimer);
            deferTimer = setTimeout(function () {
                last = now;
                fn();
            }, threshold);
        }
        else {
            last = now;
            fn();
        }
    };
}

var errorThreshold = 1;
var initialized = false;
var elements;
var remains;
var MatchHeight = {
    init: function () {
        initialized = true;
        elements = document.querySelectorAll('[data-mh]');
        MatchHeight.update();
    },
    update: function () {
        if (!initialized) {
            MatchHeight.init();
            return;
        }
        if (elements.length === 0)
            return;
        remains = Array.prototype.map.call(elements, function (el) {
            return {
                el: el,
                top: 0,
                height: 0,
            };
        });
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
    remains.sort(function (a, b) { return a.top - b.top; });
    var processingTop = remains[0].top;
    var processingTargets = remains.filter(function (item) { return Math.abs(item.top - processingTop) <= errorThreshold; });
    var maxHeightInRow = Math.max.apply(Math, processingTargets.map(function (item) { return item.height; }));
    processingTargets.forEach(function (item) {
        var error = processingTop - item.top + errorThreshold;
        var paddingAndBorder = parseFloat(window.getComputedStyle(item.el).getPropertyValue('padding-top')) +
            parseFloat(window.getComputedStyle(item.el).getPropertyValue('padding-bottom')) +
            parseFloat(window.getComputedStyle(item.el).getPropertyValue('border-top-width')) +
            parseFloat(window.getComputedStyle(item.el).getPropertyValue('border-bottom-width'));
        item.el.style.minHeight = "".concat(maxHeightInRow - paddingAndBorder + error, "px");
    });
    remains.splice(0, processingTargets.length);
    if (0 < remains.length)
        process();
}

var throttledUpdate = throttle(MatchHeight.update, 200);
window.addEventListener('DOMContentLoaded', function onDomReady() {
    MatchHeight.init();
    window.removeEventListener('DOMContentLoaded', onDomReady);
});
window.addEventListener('load', function onLoad() {
    MatchHeight.update();
    window.removeEventListener('load', onLoad);
});
window.addEventListener('resize', throttledUpdate);

export { MatchHeight as default };
