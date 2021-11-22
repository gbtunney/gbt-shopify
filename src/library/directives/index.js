// noinspection JSVoidFunctionReturnValueUsed

import {randomInt, renameKeys} from "@/library/scripts/generic";

const R = window.R
const RA = window.RA
import {contains, trim} from '../scripts/stringUtils'
import {wrapAll} from '../scripts/dom-utils'


export const vWrap = {
    bind: function (el, binding, vnode) {
        //wrapper class   <<< check to see if it has parent  , otherwise create it.
        //wrapper el ( if no class
        // sibling --   root + '*'

        // wrapAll( el  )
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
        console.log("DIRECTIVE CALLED", el, wrapperEl, binding)
    }
}
export default vWrap;

export const vTW = {
    bind: function (el, binding, vnode) {
        const _el = el

        //********UID
        const rootSelector = `v-tw-${randomInt(10, 15000)}`;

        ///*****root element
        let dataObbject = {[binding.arg]: (binding.value) ? binding.value : false};
        const [variant = false] = Array.from(Object.keys(binding.modifiers));
        const classes = (dataObbject.cxlasses) ? dataObbject.classes : false;

        ///*****apply classes to root element
        const classestoDom = explodeClassesString(classes, variant)
        _el.classList.add(rootSelector, ...classestoDom)

        ///*****get classes to children arg
        const children = (dataObbject.children) ? dataObbject.children : [];
        var temp = children.forEach(function (item) {
            const key = (Object.keys(item).length > 0) ? Object.keys(item)[0] : false;
            const classes_child = explodeClassesString((Object.values(item).length > 0) ? Object.values(item)[0] : false, variant)
            const uid = `${rootSelector}-child`;

            ///*****apply classes to children elements
            _el.querySelectorAll(key).forEach(el => {
                el.classList.add(uid, ...classes_child)
            })
        })
    }
}

const trimCharsBlacklist = ['.', "'", '"', ' ', '-', "[", "]", "(", ")"]
const regexpExplodeClases = new RegExp(/[ x,]+/) ///spliter

//keep
export const outertrimFunc = function (string) {
    return R.trim(RA.trimCharsEnd(trimCharsBlacklist, RA.trimCharsStart(trimCharsBlacklist, convToArray(string).toString())))
}
//keep/
export const explodeClassesString = function (string = '', _prefix = false, delimiter = ":") {
    if (!string) return []
    let prefix = (_prefix == false || _prefix == "false") ? false : outertrimFunc(_prefix);
    return outertrimFunc(string).split(regexpExplodeClases).map(function (item) {
        return (prefix) ? `${prefix}${delimiter}${outertrimFunc(item)}` : outertrimFunc(item)
    })
}
//keep
export const convToArray = function (value) {
    return [...[value]]
}
