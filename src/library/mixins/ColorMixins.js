import {
    getColorCssUnit, getContrastMax,
    validateColorOrBool,
    validateColorStringBool,
    validateLuminanceThreshold
} from "../scripts/color";
import chroma from "chroma-js";

export const colorThemeMixin = {
   props:{
       /**
       	 * Sets the background color
         * @values css variable, valid chroma.js color, boolean (on/off)
        */
       bg_color: {
           default: false,
           type: [Boolean, String],
           validator:  (value) => validateColorStringBool(value)
       },
       /**
        * Sets the background color
        * @values css variable, valid chroma.js color, boolean (on/off)
        */
       color: {
           default: false,
           type: [Boolean, String],
           validator:  (value) => validateColorStringBool(value)
       },
   },
    getColorCssUnit(value) {
        getColorCssUnit(value)
    }
}

//TODO: excepts hex value only
export const colorMixin = {
    props:{
        /**
         * Sets color ( no css variables )
         * @values valid chroma.js color, boolean (on/off)
         */
        hex_color: {
            default: false,
            type: [Boolean, String],
            validator:  (value) => validateColorOrBool(value)
        },
        /**
         * Sets luminance threshold
         * @values threshold: Number
         * @values comparator: gt,gte,lt,lte
         */
        luminance_threshold: {
            type: Object,
            default: function () {
                return {
                    threshold: .3, //number
                    comparator: 'lte'
                }//string: ramda function - gt,gte,lt,lte
            },
            validator:  (value) => validateLuminanceThreshold(value)
        },
    },
}


const getColorVar = function(props){
    return (props.color === true ||props.color === "true" )
        ? getContrastMax( chroma.valid( props.bg_color), props.luminance_threshold.threshold, props.luminance_threshold.comparator)
        : getColorCssUnit(props.color)
}
