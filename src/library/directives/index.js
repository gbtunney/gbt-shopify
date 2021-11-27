// noinspection JSVoidFunctionReturnValueUsed
import {randomInt, renameKeys} from "@/library/scripts/generic";
import faker from "faker"

const R = window.R
const RA = window.RA
import {contains, sentenceCase, trim} from '../scripts/stringUtils'
import {wrapAll} from '../scripts/dom-utils'
import {convToArray, isArray, isInteger, outertrimFunc, toInteger} from "../scripts/generic";

export const vFaker = {
    bind: function (el, binding, vnode) {
        const {arg = false, value = false} = binding
        const [variant = false] = Array.from(Object.keys(binding.modifiers));
        console.log("FAKER DIRECTIVE CALLED", binding.arg, ":::::::::::", getFakeString(arg, value, variant))
        el.innerHTML = getFakeString(arg, value, variant)
    }
}
/* * FAKER  *
* @param {string}- arg  - faker model name OR shortcuts= p,s,ss,h,w,  n,int, f,d
* @param {string} - variant ---- formatter: uppercase,lowercase,cap */
const getFakeString = function (_arg = false, _value = false, _variant = false) {
    if (!_arg) {
        //*********THE DEFAULT@@!!!!!!!!
        return formatString((_value) ? _value : faker.lorem.word(), _variant)
    } else if (_arg && faker[_arg] && _value) return (faker[_arg][_value]) ? formatString(faker[_arg][_value](), _variant) : `faker error: arg:${_arg} value:${_value}`
    else if (_arg == 'p') return formatString(faker.lorem.paragraph(), _variant)
    else if (_arg == 's') return formatString(faker.lorem.sentence(), _variant)
    else if (_arg == 'ss') return formatString(faker.lorem.sentences(), _variant)
    else if (_arg == 'h' || _arg == 'ws') return formatString(faker.lorem.words(), _variant)
    else if (_arg == 'w') return formatString(faker.lorem.word(), _variant)
    else if (_arg == 'int' || _arg == 'n') return formatString(faker.random.number(), _variant)
    else if (_arg == 'f' || _arg == 'd') return formatString(faker.random.float(), _variant)
    return _value
}
const formatString = function (str, format = false) {
    if (!format) return str
    if (format == 'cap') return sentenceCase(str)
    else if (format == 'uppercase') return String(str).toUpperCase();
    else if (format == 'lowercase') return String(str).toLowerCase();
    return str
}
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
        const UID = randomInt(10, 15000)
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
            console.warn("VWRAP CALLED!!!!!!!! ", testel)
        });
    }
}

export default vWrap;
const validateDataObj = function(value){
    if (value && isArray(value) && value.length >0 ) return false
    if ( value && RA.isObject(value) && R.has('type')(value)) return true
    return
}
//todo: add remove classes maybe??
export const vTWFunction = function (el, binding, vnode){
    const _el = el
    const UID = randomInt(10, 15000)
    _el.setAttribute(`data-tw-id-${UID}`, UID)

    //********UID
    let dataObjDefault = {
        variant: false,
        limit: false,
        classes: false,
        type: "root",
        operation: "add",
        selector: '*' ///only needed for sibling or children
    }
    if (!binding.value) return
    let dataArray = (isArray(binding.value)) ? binding.value : [binding.value]
    let modifiers = {
        variant: false,
        limit: false
    }
    if (binding.arg) modifiers = {...modifiers, type: binding.arg}
    //assign modifiers
    Array.from(Object.keys(binding.modifiers)).forEach(function (modifier) {
        if (isInteger(modifier)) {
            modifiers = {...modifiers, limit: toInteger(modifier)}
        } else if (RA.isString(modifier) && (modifier).toString().length > 0) {
            modifiers = {...modifiers, variant: modifier}
        }
    })

    console.log("TW DIRECTIVE CALLED -",dataArray, modifiers)
    dataArray.forEach(function (dataObj) {
        let workingDataObj = {};
        if (RA.isObject(dataObj) && R.has('classes')(dataObj)) {
            workingDataObj = {...workingDataObj, ...dataObj};
        } else if (RA.isString(dataObj) || isArray(dataObj)) {
            workingDataObj = {...workingDataObj, ...{classes: dataObj}};
        }
        //*******merge defaults, override with modifiers
        workingDataObj = {...dataObjDefault, ...{...modifiers,...workingDataObj}}
        //******* explode classes to array
        const _classes = explodeClassesString(workingDataObj.classes, workingDataObj.variant)
        workingDataObj = {...workingDataObj, classes: _classes}

        vnode.context.$nextTick(() => {
            const {
                type = 'root',
                selector = "*",
                limit = false,
                operation = 'add',
                classes = false
            } = workingDataObj
            const uid_selector = `[data-tw-id-${UID}="${UID}"] `

            let elemmentArr = []
            if (type == 'parent') elemmentArr = [_el.parentElement]
            else if (type == 'sibling') elemmentArr = document.querySelectorAll(`${uid_selector} ~ ${selector}`)
            else if (type == 'children') elemmentArr = document.querySelectorAll(`${uid_selector} ${selector}`)
            else {
                elemmentArr = document.querySelectorAll(uid_selector)
            }
            elemmentArr = Array.from(elemmentArr)
            if (limit !== false) elemmentArr = elemmentArr.slice(0, limit)

            if (operation == 'add') {
                elemmentArr.forEach(el => {
                    el.classList.add(...(classes && classes.length > 0) ? [`v-tw-${UID}-${type}`, ...classes] : [`v-tw-${UID}-${type}`])
                })
            } else if (operation == 'remove') {
                elemmentArr.forEach(el => {
                    el.classList.remove(...(classes && classes.length > 0) ? [`v-tw-${UID}-${type}`, ...classes] : [`v-tw-${UID}-${type}`])
                })
            }
            console.log("-------QUERY SELECTOR", workingDataObj, UID, elemmentArr)
        });
    })
}
export const vTW = {
    bind: function (...args) {
        vTWFunction(...args)
    },
    update: function (...args) {
        vTWFunction(...args)

    }
}

const regexpExplodeClases = new RegExp(/[ ,]+/) ///spliter

//keep/
export const explodeClassesString = function (string = '', _prefix = false, delimiter = ":") {
    if (!string) return []

    let prefix = (_prefix == false || _prefix == "false") ? false : outertrimFunc(convToArray(_prefix));
    return outertrimFunc(convToArray(string)).split(regexpExplodeClases).map(function (item) {
        return (prefix) ? `${prefix}${delimiter}${outertrimFunc(convToArray(item))}` : outertrimFunc(convToArray(item))
    })
}
