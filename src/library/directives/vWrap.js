import {randomInt, renameKeys} from "@/library/scripts/generic";

const R = window.R
const RA = window.RA
import {contains, trim} from '../scripts/stringUtils'

const wrapAll = (target, wrapper_el = 'div', wrapper = document.createElement(wrapper_el)) => {
    [...target.childnodes].forEach(child => wrapper.appendChild(child))
    console.log("target", target, wrapper)
    target.appendChild(wrapper)
    return wrapper
}

export const vWrap = {
    bind: function (el, binding, vnode) {
        // wrapAll( el  )

        /*    var s = JSON.stringify
            el.innerHTML =
                'name: '       + s(binding.name) + '<br>' +
                'value: '      + s(binding.value) + '<br>' +
                'expression: ' + s(binding.expression) + '<br>' +
                'argument: '   + s(binding.arg) + '<br>' +
                'modifiers: '  + s(binding.modifiers) + '<br>' +
                'vnode keys: ' + Object.keys(vnode).join(', ')*/

        const defaultel = 'div'
        const wrapper_classes = ['v-wrap', 'v-wrap-parent-class']


        var clone = vnode.elm.cloneNode(true);
        const wrapperEl = document.createElement(defaultel);
        wrapperEl.appendChild(clone)
        //el.innerHTML(wrapperEl)
        //wrapperEl.appendChild( vnode.elm.cloneNode(true))
        wrapperEl.classList.add(...wrapper_classes, 'progress', 'is-medium', 'is-info');

        var cloneEl = vnode.elm.cloneNode(true);
        el.innerHTML = ""
        el.appendChild(cloneEl)

        //parentDiv.replaceChild(sp1, sp2);
        el.firstChild.parentNode.innerHTML = "ffffff"

        el.replaceWith(wrapperEl)
        //el.firstChild.parentNode.appendChild(cloneEl)
        //  el.firstChild.parentNode.replaceWith(wrapperEl)

        // clone.parentNode.replaceWith(el);
        //  el.replaceWith(clone);
        //  el.parentNode//.replaceChild(clone, el);

        //clone.appendChild(wrapperEl)
        //
        // wrapperEl.classList.add('gbt-list', 'progress', 'is-medium', 'is-info');

        console.log("DIRECTIVE CALLED", el, wrapperEl, binding)
    }
}

export const vTW = {
    bind: function (el, binding, vnode) {
        let _el = el
        let arr = []
        const rootSelector = `v-tw-${randomInt(10, 15000)}`;
        _el.classList.add(rootSelector);
        /*    var s = JSON.stringify
            el.innerHTML =
                'name: '       + s(binding.name) + '<br>' +
                'value: '      + s(binding.value) + '<br>' +
                'expression: ' + s(binding.expression) + '<br>' +
                'argument: '   + s(binding.arg) + '<br>' +
                'modifiers: '  + s(binding.modifiers) + '<br>' +
                'vnode keys: ' + Object.keys(vnode).join(', ')*/

        //IF ITS AN OBJECT
        if (RA.isObj(binding.value)) {
            //todo ::: parse this in same way?
            let replacedKeyObj = {}
            Object.entries({...binding.value}).forEach(function ([key, value]) {
                const [selector, variant = false] = trimSpaces(key).split(":").reverse()
                if (selector.toString().includes('self')) {
                    //_key = key.replace("self", `.${rootSelector}`);
                }
                ///replace values with variant prefix
                replacedKeyObj = {...replacedKeyObj, ...{[selector]: toArrCleaned(value, variant)}}
            })
            //add classes to decendants
            Object.entries(replacedKeyObj).forEach(function ([key, value]) {
                let _value = value;
                _el.querySelectorAll(key).forEach(el => {
                    el.classList.add(..._value)
                })
            })

        }
        if (!R.isEmpty(binding.value)) {
            el.classList.add(...toArrCleaned(binding.value));
        }
    }
}
const toArrCleaned = function (_value, _prefix = false) {
    const prefix = _prefix
    let arr = []
    if (RA.isObj(_value)) return
    if (RA.isArray(_value)) arr = _value
    if (RA.isString(_value)) arr = trimSpaces(_value).split(" ")
    arr = arr.map(function (item) {
        return cleanClassSelector(item)
    })
    return arr.reduce((accumulator, currentValue, currentIndex, array) => {
        const _string = `${(prefix == false) ? '' : `${prefix}:`}${currentValue}`
        return [...accumulator, ...(!R.isEmpty(currentValue)) ? [_string] : []];
    }, []);
}

const cleanClassSelector = function (_value) {
    return RA.trimCharsStart('.', trimSpaces(_value))
}
const trimSpaces = function (_value) {
    return RA.trimRight(RA.trimLeft(_value.toString()))
}
export default vWrap
