// noinspection JSVoidFunctionReturnValueUsed
import {randomInt, renameKeys} from "@/library/scripts/generic";
import faker from "faker"

const R = window.R
const RA = window.RA
import {contains, sentenceCase, trim} from '../scripts/stringUtils'
import {wrapAll} from '../scripts/dom-utils'
import {convToArray, outertrimFunc, toInteger} from "../scripts/generic";

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

const wrapNodes = function (elArray = [], parentClasses = false, element = 'div', remove = true) {
    if (!elArray || elArray.length == 0) return

    const _remove = remove;
    const newDiv = document.createElement(element);
    const [firstElement] = elArray
    const parentfirstEl = firstElement.parentElement;
    if (parentClasses) newDiv.classList.add(...parentClasses);

    elArray.forEach(el => {
        newDiv.appendChild(el.cloneNode(true))
    })

    parentfirstEl.insertBefore(newDiv, firstElement)

    elArray.forEach(el => {
        if (_remove) el.remove()
    })

}

/* let allSiblings = []
              document.querySelectorAll(`.${parentSelector} > * `).forEach(el => {
                  if ( el != _el ){
                      allSiblings.push( el );
                  }
                  //  el.classList.add(uid, ...classes_child)
              })*/
export const vWrap = {
    bind: function (el, binding, vnode) {
        const _el = el
        let dataObject = {}
        if (!binding.arg && binding.value && RA.isObject(binding.value)) {
            dataObject = binding.value;
        } else if (binding.arg) {
            dataObject = {[binding.arg]: (binding.value) ? binding.value : false};
        } else if (R.is(String, binding.value)) {
            dataObject = {classes: binding.value}
        }
        const [variant = false] = Array.from(Object.keys(binding.modifiers));

        ///*****explode parent classes
        const parentClassesAddl = explodeClassesString((dataObject.classes) ? dataObject.classes : false)
        const defaultel = (dataObject.el) ? dataObject.el : 'div'
        const limit = (dataObject.limit) ? toInteger(dataObject.limit) : false
        const removeElements = true;

        //********UID
        const rootSelectorUID = `v-wrap-${randomInt(10, 15000)}`;
        _el.classList.add(rootSelectorUID)

        const parentSelector = `${rootSelectorUID}-parent`//`v-wrap-${randomInt(10, 15000)}`
        const siblingClassesNext = `${rootSelectorUID}-sibling`//`v-wrap-${randomInt(10, 15000)}`
        //  const siblingSelectorPrev=  `${rootSelectorUID}-prevsibling`//`v-wrap-${randomInt(10, 15000)}`

        const parentSelArr = (parentClassesAddl && parentClassesAddl.length > 0) ? [parentSelector, ...parentClassesAddl] : [parentSelector]

        vnode.context.$nextTick(() => {
            //add parent class.
            if (_el.parentElement) {
                //  _el.parentElement.classList.add(parentSelector)
            }
            const sibs = Array.from(document.querySelectorAll(`.${rootSelectorUID} ~ * `))
            sibs.forEach(el => {
                el.classList.add(siblingClassesNext)
            })

            const elArr = (variant == 'siblings') ?
                [_el, ...(limit === false) ? sibs : sibs.slice(0, limit)]
                : [_el]
            console.warn("direct sibling!@!!!!", parentSelArr, elArr, limit)
            wrapNodes(elArr, parentSelArr)
        });
    }
}
export default vWrap;

//todo: add remove classes maybe??
export const vTW = {
    update: function (el, binding, vnode) {
        const _el = el
        //********UID
        const rootSelector = `v-tw-${randomInt(10, 15000)}`;

        ///*****root element
        let dataObject = {}
        if (!binding.arg && binding.value && RA.isObject(binding.value)) {
            dataObject = binding.value;
        } else if (binding.arg) {
            dataObject = {[binding.arg]: (binding.value) ? binding.value : false};
        }
        const [variant = false] = Array.from(Object.keys(binding.modifiers));
        const classes = (dataObject.classes) ? dataObject.classes : false;

        ///*****apply classes to root element
        const classestoDom = explodeClassesString(classes, variant)
        _el.classList.add(rootSelector, ...classestoDom)

        ///*****parent argument
        const parentclasses = explodeClassesString((dataObject.parent) ? dataObject.parent : false, variant)
        const parent_uid = `${rootSelector}-parent`;
        //hack
        vnode.context.$nextTick(() => {
            vnode.elm.parentElement.classList.add(parent_uid, ...parentclasses)
        });

        //todo: make this work w all siblings
        ///*****siblings argument
        const siblingclasses = explodeClassesString((dataObject.sibling) ? dataObject.sibling : false, variant)
        const sibling_uid = `${rootSelector}-sibling`;
        vnode.context.$nextTick(() => {
            vnode.elm.nextElementSibling.classList.add(sibling_uid, ...siblingclasses)
        });

        ///*****get classes to children arg
        const children = (dataObject.children) ? dataObject.children : [];
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

const regexpExplodeClases = new RegExp(/[ ,]+/) ///spliter

//keep/
export const explodeClassesString = function (string = '', _prefix = false, delimiter = ":") {
    if (!string) return []

    let prefix = (_prefix == false || _prefix == "false") ? false : outertrimFunc(convToArray(_prefix));
    return outertrimFunc(convToArray(string)).split(regexpExplodeClases).map(function (item) {
        return (prefix) ? `${prefix}${delimiter}${outertrimFunc(convToArray(item))}` : outertrimFunc(convToArray(item))
    })
}
