const flattenColorPalette = require("tailwindcss/lib/util/flattenColorPalette")
    .default;

const defaultVariablesNames = {
    colors: "color",
    screens: "screen",
    fontFamily: "font",
    fontSize: "text",
    fontWeight: "font",
    lineHeight: "leading",
    letterSpacing: "tracking",
    backgroundSize: "bg",
    borderWidth: "border",
    borderRadius: "rounded",
    width: "w",
    height: "h",
    minWidth: "min-w",
    minHeight: "min-h",
    maxWidth: "max-w",
    maxHeight: "max-h",
    padding: "p",
    margin: "m",
    boxShadow: "shadows",
    zIndex: "z",
    opacity: "opacity",
};

module.exports = ({addUtilities, addComponents, theme, config, variants}) => {
    const flatten_colors = flattenColorPalette(theme('colors'));
    //const flatten_text = flattenColorPalette(theme('colors'));
    const exampleObj =
        {
            'backgroundColor': 'bg',
            'borderColor': 'border',
            'textColor': 'text',
            'textColor': 'fg-fill'
        }
    const colorTypeObject = Array.from(Object.entries(exampleObj)).map(function ([key, value]) {
        //theme('screens', {})
        let variantsArr = variants(key)
         const newvariantsArr  = variantsArr.reduce((accumulator, currentValue, currentIndex, array) => {
           return [...accumulator, ...(currentValue == "responsive") ? Object.keys(theme('screens', {})) : [currentValue] ]
         }, []);
        return {
            prefix: value,
            variants: newvariantsArr
        }
    })
    let colorDataObject = {}

     const tw_color_export = Object.entries(flatten_colors).reduce((accumulator, currentValue, currentIndex, array) => {
         const [_key, _value] = currentValue
       return { ...accumulator, ...{ [ _key ]:_value}}
     }, {});
   /* const tw_color_export = Array.from(Object.entries(flatten_colors)).map((value, key) => {
        const [_key, _value] = value
        return {...colorDataObject, ...{[_key]: _value}}
    })*/
    const colorObject = {
        swatches: tw_color_export,
        types: colorTypeObject
    }
    console.log(JSON.stringify(colorObject, null, "  "))
};

