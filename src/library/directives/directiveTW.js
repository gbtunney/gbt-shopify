// noinspection JSVoidFunctionReturnValueUsed
import {randomInt} from "./../scripts/generic";
const R = window.R
const RA = window.RA
import { isArray, isInteger, toInteger} from "../scripts/generic";
import {explodeClassesString} from "./index";

//todo: add remove classes maybe??
export const vTWFunction = function (el, binding, vnode) {
    const _el = el
    //********UID
    let dataObjDefault = {
        variant: false,
        limit: false,
        classes: false,
        type: "root",
        operation: "add",
        selector: '*' ///only needed for sibling or children
    }

    let {value = []} = binding
    let {modifiers: preparseModifiers = []} = binding

    if (value.length == 0 && !binding.classes) return
    if (value.length == 0 && binding.classes) value = binding.classes

    let dataArray = (isArray(value)) ? value : [value]
    let modifiers = {
        variant: false,
        limit: false
    }
    if (binding.variant) modifiers = {...modifiers, variant: binding.variant}
    if (binding.limit) modifiers = {...modifiers, limit: binding.limit}
    if (binding.arg) modifiers = {...modifiers, type: binding.arg}

    //assign modifiers
    Array.from(Object.keys(preparseModifiers)).forEach(function (modifier) {
        if (isInteger(modifier)) {
            modifiers = {...modifiers, limit: toInteger(modifier)}
        } else if (RA.isString(modifier) && (modifier).toString().length > 0 && modifier != 'limit') {
            modifiers = {...modifiers, variant: modifier}
        }
    })
    dataArray.forEach(function (dataObj) {
        let workingDataObj = {};
        if (RA.isObject(dataObj) && R.has('classes')(dataObj)) {
            workingDataObj = {...workingDataObj, ...dataObj};
        } else if (RA.isString(dataObj) || isArray(dataObj)) {
            workingDataObj = {...workingDataObj, ...{classes: dataObj}};
        }
        //*******merge defaults, override with modifiers
        workingDataObj = {...dataObjDefault, ...{...modifiers, ...workingDataObj}}
        //******* explode classes to array
        const _classes = explodeClassesString(workingDataObj.classes, workingDataObj.variant)
        workingDataObj = {...workingDataObj, classes: _classes}

        const opFunc = function () {
            const {
                type = 'root',
                selector = "+ *",
                limit = false,
                operation = 'add',
                classes = false,
                id = false
            } = workingDataObj

            /* * UID * */
            const UID = (id && id > 0) ? id : randomInt(10, 15000)
            _el.setAttribute(`data-tw-id-${UID}`, UID)
            const uid_selector = `[data-tw-id-${UID}="${UID}"] `

            let elemmentArr = []
            if (type == 'parent') elemmentArr = [_el.parentElement]
            else if (type == 'sibling') elemmentArr = document.querySelectorAll(`${uid_selector} ~ ${selector}`)
            else if (type == 'children') elemmentArr = document.querySelectorAll(`${uid_selector} ${selector}`)
            else {
                elemmentArr = document.querySelectorAll(uid_selector)
            }
            elemmentArr = Array.from(elemmentArr)
            if (elemmentArr && elemmentArr.length <= 0) return
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
        }
        if (_classes && _classes.length > 0) opFunc()
    })
}
export const vTW = {
    inserted: function (...args) {
        vTWFunction(...args)
    },
    update: function (...args) {
        vTWFunction(...args)
    }
}
