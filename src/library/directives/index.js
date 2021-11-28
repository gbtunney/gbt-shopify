import {vWrap} from './directiveWrap'
import {vTW} from './directiveTW'
import {vFaker} from "./directiveFaker";
import {convToArray, outertrimFunc} from "../scripts/generic";

const regexpExplodeClases = new RegExp(/[ ,]+/) ///spliter
//keep/
export const explodeClassesString = function (string = '', _prefix = false, delimiter = ":") {
    if (!string || string.length == 0) return []
    let prefix = (_prefix == false || _prefix == "false") ? false : outertrimFunc(convToArray(_prefix));
    return outertrimFunc(convToArray(string)).split(regexpExplodeClases).map(function (item) {
        return (prefix) ? `${prefix}${delimiter}${outertrimFunc(convToArray(item))}` : outertrimFunc(convToArray(item))
    }).filter(function (_item) {
        if (_item && _item.length < 2) return false
        return true
    })
}

export {
    vWrap,
    vTW,
    vFaker,
}
export default vTW;
