/*!
 * @author yomotsu
 * MatchHeight
 * https://github.com/yomotsu/MatchHeight
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.MatchHeight = factory());
})(this, (function () { 'use strict';

	function throttle(fn, threshold) {
	    let last, deferTimer;
	    return function () {
	        const now = Date.now();
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

	const errorThreshold = 1;
	class MatchHeight {
	    constructor(selector = '[data-mh]') {
	        this._remains = [];
	        this._selector = selector;
	        const update = this.update.bind(this);
	        const throttledUpdate = throttle(update, 200);
	        if (document.readyState === 'loading') {
	            document.addEventListener('DOMContentLoaded', update, { once: true });
	        }
	        if (document.readyState === 'interactive') {
	            document.addEventListener('load', update, { once: true });
	        }
	        else {
	            update();
	        }
	        window.addEventListener('resize', throttledUpdate);
	        this.disconnect = () => {
	            window.removeEventListener('resize', throttledUpdate);
	        };
	    }
	    update() {
	        const elements = document.querySelectorAll(this._selector);
	        if (elements.length === 0)
	            return;
	        this._remains = Array.prototype.map.call(elements, (el) => {
	            return {
	                el,
	                top: 0,
	                height: 0,
	            };
	        });
	        this._remains.forEach((item) => {
	            item.el.style.minHeight = '';
	        });
	        this._process();
	    }
	    _process() {
	        this._remains.forEach((item) => {
	            const bb = item.el.getBoundingClientRect();
	            item.top = bb.top;
	            item.height = bb.height;
	        });
	        this._remains.sort((a, b) => a.top - b.top);
	        const processingTop = this._remains[0].top;
	        const processingTargets = this._remains.filter(item => Math.abs(item.top - processingTop) <= errorThreshold);
	        const maxHeightInRow = Math.max(...processingTargets.map((item) => item.height));
	        processingTargets.forEach((item) => {
	            const error = processingTop - item.top + errorThreshold;
	            const getPropertyValue = (value) => window.getComputedStyle(item.el).getPropertyValue(value);
	            const isBorderBox = getPropertyValue('box-sizing') === 'border-box';
	            if (isBorderBox) {
	                item.el.style.minHeight = `${maxHeightInRow + error}px`;
	            }
	            else {
	                const paddingAndBorder = parseFloat(getPropertyValue('padding-top')) +
	                    parseFloat(getPropertyValue('padding-bottom')) +
	                    parseFloat(getPropertyValue('border-top-width')) +
	                    parseFloat(getPropertyValue('border-bottom-width'));
	                item.el.style.minHeight = `${maxHeightInRow - paddingAndBorder + error}px`;
	            }
	        });
	        this._remains.splice(0, processingTargets.length);
	        if (0 < this._remains.length)
	            this._process();
	    }
	}

	return MatchHeight;

}));
