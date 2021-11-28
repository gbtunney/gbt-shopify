import faker from "faker"
const R = window.R
const RA = window.RA
import {sentenceCase} from '../scripts/stringUtils'

export const vFaker = {
    bind: function (el, binding, vnode) {
        const {arg = false, value = false} = binding
        const [variant = false] = Array.from(Object.keys(binding.modifiers));
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
