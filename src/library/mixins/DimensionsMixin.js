import {getColorCssUnit, validateColorStringBool, validateDistanceOrBool} from "../scripts/color";

export const DimensionsMixin = {
    props: {
        /** Width
         * @values String (with unit), integer(px appended to end), boolean (on/off)
         */
        width: {
            default: false,
            type: [String, Number, Boolean],
            validator: (value) => validateDistanceOrBool(value)
        },
        /** Height
         * @values String (with unit), integer(px appended to end), boolean (on/off)
         */
        height: {
            default: false,
            type: [String, Number, Boolean],
            validator: (value) => validateDistanceOrBool(value)
        },
    },
    getColorCssUnit(value) {
        getColorCssUnit(value)
    }
}
