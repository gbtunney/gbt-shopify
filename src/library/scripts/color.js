import chroma from "chroma-js";
import {
    COMPARATOR_OPTIONS,
    isInteger,
    toInteger,
    testNumComparator,
    validateEnum,
    validateStringByArray,
    outertrimFunc
} from "./generic";
import * as R from "ramda";
import {isAbsoluteUnit, isPercentageUnit} from "is-valid-css-unit";

export const getContrastMax = function (hex_color = false, threshold = .3, comparator = 'lte') {
    if (!hex_color || !chroma.valid(hex_color)) return
    const lum = .5 - (.5 - chroma(hex_color).luminance())
    return testNumComparator(lum, threshold, comparator) ? 'white' : 'black'
}

///only validate if its a valid chroma color
export const validateColorOrBool = function (value) {
    if ( R.is(Boolean, value)  || value === "true" || value === "false" ) return true
    //if ( value === false || value === "false" )
    const valueClean = outertrimFunc((value).toString(), css_blacklist)
    return chroma.valid(valueClean)
}
export const validateLuminanceThreshold = function (value) {
    return (validateEnum(value.comparator, COMPARATOR_OPTIONS) && R.is(Number, value.threshold))
}

const css_blacklist = [" ", ";"]

const Color_Var_Prefix = ['--color-']
const Color_Unit_Strings = [...Color_Var_Prefix, 'var(' ]

///only validate if its a valid chroma color
/**
 * validate value
 * @values css variable, valid chroma.js color, boolean (on/off)
 */
export const validateColorStringBool = function (value) {
    if (R.is(Boolean, value)) return true
    if (R.is(String, value) && !R.isEmpty(value)) {
        const valueClean = outertrimFunc((value).toString(), css_blacklist)
        if (chroma.valid(valueClean) || validateStringByArray(valueClean, Color_Unit_Strings)) return true
    }
    return false
}
/**
 * get ColorValue
 * @values css variable, valid chroma.js color, boolean (on/off)
 */
export function getColorCssUnit(value) {
    if (!validateColorStringBool(value)) return false
    const valueClean = outertrimFunc((value).toString(), css_blacklist)
    if ( chroma.valid(valueClean) ) return chroma(valueClean).hex()
    if (validateStringByArray(valueClean, Color_Var_Prefix)) return `var(${valueClean})`
    return valueClean//if its a proper string
}



////css distance
const Distance_Var_Prefix = ['--w-', '--h-']
const Distance_Unit_Strings = [...Distance_Var_Prefix, 'var(', 'calc(', 'auto', 'initial']

export const validateDistanceOrBool = function (value) {
    if (value === false || value === "false") return true
    if (isInteger(value)) return true
    if (R.is(String, value) && !R.isEmpty(value)) {
        const valueClean = outertrimFunc((value).toString(), css_blacklist)

        if (isAbsoluteUnit(valueClean) || isPercentageUnit(valueClean) || validateStringByArray(valueClean, Distance_Unit_Strings)) return true
    }
    return false
}

export function getDistanceCssUnit(value) {
    if (!validateDistanceOrBool(value)) return false
    const valueClean = outertrimFunc((value).toString(), css_blacklist)
    if (isInteger(valueClean)) return `${toInteger(valueClean)}px`
    if (validateStringByArray(valueClean, Distance_Var_Prefix)) return `var(${valueClean})`
    return valueClean//if its a proper string
}
