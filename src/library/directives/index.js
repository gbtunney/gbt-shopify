// noinspection JSVoidFunctionReturnValueUsed
import {randomInt, renameKeys} from "@/library/scripts/generic";
import faker from "faker"

const R = window.R
const RA = window.RA
import {contains, sentenceCase, trim} from '../scripts/stringUtils'
import {wrapAll} from '../scripts/dom-utils'

export const vFaker = {
    bind: function (el, binding, vnode) {
        const {arg=false,value=false} = binding
        const [variant = false] = Array.from(Object.keys(binding.modifiers));
        console.log("FAKER DIRECTIVE CALLED",binding.arg,":::::::::::",getFakeString(arg,value,variant) )
        el.innerHTML=getFakeString(arg,value,variant)
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
    update: function (el, binding, vnode) {
        const _el = el

       // console.log("directive  updated!!!!!!", el,binding)
        //********UID
        const rootSelector = `v-tw-${randomInt(10, 15000)}`;

        ///*****root element
        let dataObject = {}
        if ( !binding.arg && binding.value && RA.isObject(binding.value)){
            dataObject =binding.value;
        }else if(binding.arg){
            dataObject=   {[binding.arg]: (binding.value) ? binding.value : false};
        }
        console.log("dataobject  updated!!!!!!", dataObject)


        const [variant = false] = Array.from(Object.keys(binding.modifiers));
        const classes = (dataObject.classes) ? dataObject.classes : false;

        ///*****apply classes to root element
        const classestoDom = explodeClassesString(classes, variant)
        _el.classList.add(rootSelector, ...classestoDom)

        ///*****parent argument
        const parentclasses  =  explodeClassesString((dataObject.parent) ? dataObject.parent : false, variant)
        const parent_uid = `${rootSelector}-parent`;
        //hack
        vnode.context.$nextTick(() => {
            vnode.elm.parentElement.classList.add(parent_uid, ...parentclasses)
        });

        //todo: make this work w all siblings
        ///*****siblings argument
        const siblingclasses  =  explodeClassesString((dataObject.sibling) ? dataObject.sibling : false, variant)
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

const trimCharsBlacklist = ['.', "'", '"', ' ', '-', "[", "]", "(", ")"]
const regexpExplodeClases = new RegExp(/[ ,]+/) ///spliter

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
