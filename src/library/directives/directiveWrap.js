// noinspection JSVoidFunctionReturnValueUsed
import {explodeClassesString} from "./index";

const R = window.R
const RA = window.RA
import {randomInt} from "@/library/scripts/generic";
import {isInteger, toInteger} from "../scripts/generic";

const createNewElement = function (_attr = {}, _classes = false, el = 'div') {
    const newEl = document.createElement(el);
    Object.entries(_attr).forEach(function ([key, value]) {
        newEl.setAttribute(key, value)
    })
    if (_classes && _classes.length > 0) newEl.classList.add(..._classes)
    return newEl
}
const wrapChildren = function (elArray, ...args) {
    if (!elArray || elArray.length == 0) return
    const newEl = createNewElement(...args)
    const [firstElement] = elArray
    const parentfirstEl = firstElement.parentElement;
    elArray.forEach(el => {
        newEl.appendChild(el.cloneNode(true))
    })
    parentfirstEl.insertBefore(newEl, firstElement)
    elArray.forEach(el => {
        el.remove()
    })
    return newEl;
}

export const vWrap = {
    bind: function (el, binding, vnode) {
        const _el = el
        const UID = (binding && binding.id && binding.id > 0) ? binding.id : randomInt(10, 15000)
        //********UID
        const rootClass = `v-wrap-${UID}`;
        _el.classList.add(rootClass)

        const parentUIDClass = `${rootClass}-parent`//`v-wrap-${randomInt(10, 15000)}`
        const siblingUIDClass = `${rootClass}-sibling`//`v-wrap-${randomInt(10, 15000)}`

        ///ASSIGN DATAOBJJECT
        let dataObject = {'data-wrap-id': UID};
        if (binding.value && RA.isObject(binding.value)) {
            dataObject = {...dataObject, ...binding.value}
        } else if (binding.arg && RA.isString(binding.value)) {
            dataObject = {...dataObject, [binding.arg]: binding.value}
        } else if (RA.isString(binding.value)) {
            dataObject = {...dataObject, class: binding.value}
        }
        let parentClasses = explodeClassesString((dataObject.class) ? dataObject.class : false)
        dataObject = R.omit(['class'], dataObject)
        dataObject = {...dataObject, class: parentUIDClass}

        ///ASSIGN MODIFIERS
        let modifiers = {
            el: 'div',
            siblings: false,
            limit: false
        }
        Array.from(Object.keys(binding.modifiers)).forEach(function (modifier) {
            if (isInteger(modifier)) {
                modifiers = {...modifiers, siblings: true, limit: toInteger(modifier)}
            } else if (modifier == "*") {
                modifiers = {...modifiers, siblings: true, limit: false}
            } else if (RA.isString(modifier)) {
                modifiers = {...modifiers, el: modifier}
            }
        })
        let childArray = [_el]
        vnode.context.$nextTick(() => {
            if (modifiers.siblings) {
                let sibs = Array.from(document.querySelectorAll(`.${rootClass} ~ * `))
                if (modifiers.limit !== false) sibs = sibs.slice(0, modifiers.limit)
                sibs.forEach(el => {
                    el.classList.add(siblingUIDClass)
                })
                if (sibs && sibs.length > 0) childArray = [...childArray, ...sibs]
            }
            const testel = wrapChildren(childArray, dataObject, parentClasses, modifiers.el)
        });
    }
}
export default vWrap;
