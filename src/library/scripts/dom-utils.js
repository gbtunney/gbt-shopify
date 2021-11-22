/** Faster rounding function to avoid heavy use of Math.round  */
function round(n) {
    return (n + 0.5) << 0;
}

/**
 * Wrapper for getBoundingClientRect that returns a
 * subset ('top','left') and includes a 'width' and 'height'.
 * It also rounds the pixel measurements to the nearest integer value
 *
 * @param {HTMLElement|jQuery} DOM element to get rectangle for
 * @returns {Object}
 */
function getRect(element) {
    var el = element.jquery ? element[0] : element,
        rect = el.getBoundingClientRect();
    return {
        top: round(rect.top),
        left: round(rect.left),
        height: round(rect.bottom) - round(rect.top),
        width: round(rect.right) - round(rect.left)
    };
}

/** Implementation of getElementsByClassName, for IE 9 and below */
var getElementsByClassName = function(className, parentElement) {
    var children = (parentElement || document.body).getElementsByTagName('*'),
        elements = [],
        classRE = new RegExp('\\b' + className + '\\b'),
        child;

    for (var i = 0, length = children.length; i < length; i++) {
        child = children[i];
        if (classRE.test(child.className)) {
            elements.push(child);
        }
    }
    return elements;
};

/**
 * Wrap an HTMLElement around each element in a list of elements
 * Modified global function based on Kevin Jurkowski's implementation
 * here: http://stackoverflow.com/questions/3337587/wrapping-a-dom-element-using-pure-javascript/13169465#13169465
 */
function wrap(wrapper, elms) {
    if (!elms.length) {
        elms = [elms];
    }

    for (var i = elms.length - 1; i >= 0; i--) {
        var child = (i > 0) ? wrapper.cloneNode(true) : wrapper;
        var el    = elms[i];

        var parent  = el.parentNode;
        var sibling = el.nextSibling;

        child.appendChild(el);

        if (sibling) {
            parent.insertBefore(child, sibling);
        } else {
            parent.appendChild(child);
        }
    }
}

/**
 * Wrap an HTMLElement around another set of elements
 * Modified global function based on Kevin Jurkowski's implementation
 * here: http://stackoverflow.com/questions/3337587/wrapping-a-dom-element-using-pure-javascript/13169465#13169465
 */
export const wrapAll = function (wrapper, elms) {
    var el = elms.length ? elms[0] : elms,
        parent  = el.parentNode,
        sibling = el.nextSibling;

    wrapper.appendChild(el);

    while (elms.length) {
        wrapper.appendChild(elms[0]);
    }

    if (sibling) {
        parent.insertBefore(wrapper, sibling);
    }
    else {
        parent.appendChild(wrapper);
    }
}
export default wrapAll
/** IE8 and below don't have getComputedStyle, so polyfill it... */
var getStyle = (function() {
    window.getComputedStyle = window.getComputedStyle || function(el, prop) {
        this.el = el;
        this.getPropertyValue = function(prop) {
            var re = /(\-([a-z]){1})/g;
            if (prop == 'float') {  prop = 'styleFloat'; }
            if (re.test(prop)) {
                prop = prop.replace(re, function() {
                    return arguments[2].toUpperCase();
                });
            }
            return el.currentStyle[prop] ? el.currentStyle[prop] : null;
        };
    };

    // This version calls getPropertyValue() automatically
    return function(el, prop) {
        return window.getComputedStyle(el, null).getPropertyValue(prop);
    };
})();


/**
 * Determine the line-height for a given element. This
 * is a best guess, as the element may not have uniform line
 * height.
 *
 * @param {HTMLElement|jQuery} - DOM element object
 * @return {Number} - the line height as an integer
 */
function getLineHeight(element) {
    var el = element.jquery ? element[0] : element,
        lineheight = getStyle(el, 'line-height'),
        fontsize = getStyle(el, 'font-size');

    if (lineheight == 'normal') {
        lineheight = Math.floor(parseInt(fontsize, 10) * 1.2);
    }
    return parseInt(lineheight, 10);  // in px
}
