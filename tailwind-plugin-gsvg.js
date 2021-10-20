const flattenColorPalette = require("tailwindcss/lib/util/flattenColorPalette")
    .default;
const CUSTOM_NAME = "fill";

module.exports = ({addUtilities, addComponents, theme, config}) => {
    const flatten = flattenColorPalette(theme('colors'));
    const tailwindPrefix = config("prefix", "");
    const svgTheme = Array.from(Object.entries(flatten)).map((value, key) => {
        const [_key, _value] = value
        return {
            [`.${tailwindPrefix}bg-${CUSTOM_NAME}-${_key}`]: {
                "background-color": `${_value}`
            },
            [`.${tailwindPrefix}fg-${CUSTOM_NAME}-${_key}`]: {
                "color": `${value}`,
                ['path, rect,g,circle']: {
                    fill: `${_value}`
                }
            }

        }
    })
    const svgComponent = {
        '.g-svg': {
            display: 'inline-block',
            '& svg': {
                display: 'block',
                width: '100%',
                height: '100%'
            },
        },
    }
    addUtilities(svgTheme)
    addComponents(svgComponent)
};
