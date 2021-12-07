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
    const textShadow = {
        'text-shadow': {
            'text-shadow': '0 2px 4px rgba(0,0,0,0.10)',
            '&-md': {
                'text-shadow': '0 4px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08);'
            },
            '&-lg': {
                'text-shadow': '0 15px 30px rgba(0,0,0,0.11), 0 5px 15px rgba(0,0,0,0.08)'
            },
            '&-npne': {
                'text-shadow': 'none'
            }
        }
    }
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
    addUtilities(textShadow)
    addUtilities(svgTheme)
    addComponents(svgComponent)
};
