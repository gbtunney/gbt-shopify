import * as R from 'ramda'

export function getRandomNumber(_multiplier = 100, _digits = 3) {
    //TODO: make actuall functionx
    return Math.floor(Math.random() * _multiplier)
}

export function getContainsLetter(str) {
    let _str = String(str)
    return _str.length === 1 && _str.match(/[a-z]/i);
}

export function stringContainsNumber(str) {
    let _str = String(str)
    return /\d/.test(_str);
}

export function stringContainsUppercase(value  ,_char = "ANY" ){
    if ( ! stringContainsNumber(_char ) )  return /[A-Z]/.test(String(value))
    return /[A-Z]/.test(String(value).charAt(toInteger(_char)))
}

export function toInteger(value , _default =0 ) {
    //cast as string and see if it contains a number && no errors
    if (value && stringContainsNumber(value)) return parseInt(value);
    return _default;
}

export function isInteger(value) {
    return (Number(value) == toInteger(value)) ? true : false
}

export function getDigitCount(value) {
    return Math.log(toInteger(value)) * Math.LOG10E + 1 | 0;
}

/**
 * Rename multiple keys of an object at once
 * @constructor
 * @param {object} keysMap - object with mapping keys | example {name: 'firstName', job: 'passion'}
 * @param {object}  -obj - the object to remap. | example {name: 'Bobo', job: 'Front-End Master'}
 * @return {object} - source : https://www.freecodecamp.org/news/30-seconds-of-code-rename-many-object-keys-in-javascript-268f279c7bfa/
 */
export const renameKeys = (keysMap = {}, obj = {}) =>
    Object.keys(obj).reduce(
        (acc, key) => ({
            ...acc,
            ...{[keysMap[key] || key]: obj[key]}
        }),
        {}
    );
/**
 * validateEnum
 * @author=Gillian
 * @constructor
 * @param {*} value - Value to validate ( todo: add string )
 * @param {object,array } _enum  - Enum string values
 * @return {boolean} case_sensitive - invalidates if case doesnt match exactly.
 */
export function validateEnum(value = false, _enum = [], case_sensitive = false) {
    if (!value || R.isEmpty(_enum)) return false
    let _enumArray = _enum; //set the array value
    if (R.is(Array, _enumArray)) return (_enumArray.indexOf((!case_sensitive) ? String(value).toLowerCase() : value) >= 0) ? true : false;
    if (R.is(Object, _enum) && !R.is(Array, _enum)) _enumArray = Object.keys(_enum); ///for some reason ramda  and value = ["2","3" ] returns true for both Array && Object
}

//this is an enum values
const CLONE_MODES = ["pick", "omit"]
const CLONE_MODES_OBJ = {pick: "pick", omit: "omit"}

/**
 cloneObject
 * @author=Gillian
 * @constructor
 * @param {object} value - Object with key/values
 * @param {boolean, string(enum) } - false: clone all props. ['pick','omit ]- calls ramda func to white/black list
 * @return {object} -
 */
export function cloneObject(value = {}, mode = false, id_list = [], mode_list = CLONE_MODES) {
    let returnvalue = {...value};
    if (mode && !R.isEmpty(value) && validateEnum(mode, mode_list, true)) {
        returnvalue = R.call(R[String(mode).toLowerCase()], id_list, value)
    }
    return returnvalue;
}

export function slugify(value) {
    if (value == null
        || value == ""
        || value == "null"
        || value == undefined
        || (R.type(value) == "Boolean")
        || (R.type(value) == "Array")
        || (R.type(value) == "Object"))
        return;

    // https://gist.github.com/mathewbyrne/1280286
    return value.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '')             // Trim - from end of text
        .replace(/[\s_-]+/g, '-');
}
