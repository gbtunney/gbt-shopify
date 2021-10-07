// {isVariantAvailable, isShopifyID, isGetMaxQuantity, shopifyMediaURL }

import {getDigitCount, stringContainsNumber, toInteger} from "./generic";

/**
 * isShopifyID
 * @constructor
 * @param {*} value - value to validate
 * @return {boolean} bool if invalid
 * - isInteger = true AND value > 9 digits */
export function isShopifyID(value = false, min_digits =9) {
    return ( getDigitCount(value) >= min_digits ) ? true : false;
}

/**
 * ShopifyMediaURL
 * @constructor
 * @param {string} src - Shopify Image url. (usually from ProductImage)
 * @param {string}  - dimensions '100x100'
 * @return {string} - url. ? needs validate?
 * bc they make it a pain in the ass to get a specific size image. IDEA? maybe do aspect ratio instead
 */
export function ShopifyMediaURL(src = "", width = false, height = false) {
    if (!width) return src;
    let _width = toInteger(width)
    let _height = toInteger(height)
    if (_height == 0) _height = _width;
    const dimensions = `${_width}x${_height}`
    // remove any current image size then add the new image size
    return src
        .replace(/_(pico|icon|thumb|small|compact|medium|large|grande|original|1024x1024|2048x2048|master)+\./g, '.')
        .replace(/\.jpg|\.png|\.gif|\.jpeg/g, function (match) {
            return '_' + dimensions + match;
        });
}
