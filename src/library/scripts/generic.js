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

export function getDigitCount(value) {
    return Math.log(toInteger(value)) * Math.LOG10E + 1 | 0;
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
