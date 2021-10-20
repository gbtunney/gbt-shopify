/**
 * Tailwind CSS configuration file
 *
 * docs: https://tailwindcss.com/docs/configuration
 * default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
const path = require('path')
const colors = require('tailwindcss/colors')
const plugin = require('tailwindcss/plugin')

//merge function for less mess
const mergeSystemFont = function (_family, _system_family = DEFAULT_FONTS.serif) {
  return [_family, ..._system_family]
};

//get color function bc i dont get thhe color() or theme() functiuobs in tailwind
const getColor = function (_key, _variant = "500", _source = CUSTOM_BASE_COLORS) {
  if (CUSTOM_BASE_COLORS[_key] && CUSTOM_BASE_COLORS[_key][_variant]) return CUSTOM_BASE_COLORS[_key][_variant]
  return
};
// plugin config function
const getPluginConfig = function (_config = PLUGIN_CONFIG) {
  let arr = [];
  for (const [_key, _plugin_config] of Object.entries(_config)) {
    if (_config[_key]['enabled'] && _config[_key]['source']) {
      arr.push(_config[_key]['source']);
    }
  }
  //console.log(`There are ${key} ${_plugin_config}s`)
  if (arr.length >= 0) return arr;
  return;
}


///**** CURRATED DEFAULT COLORS ****(***///
const DEFAULT_THEME_COLORS = {
  transparent: 'transparent',
  current: 'currentColor',
  black: colors.black,
  white: colors.white,
  gray: colors.trueGray,
  indigo: colors.indigo,
  red: colors.rose,
  yellow: colors.amber,
}

///**** PROJECT CUSTOM (BASE) COLORS **** uses numbers for shades. ***///
const CUSTOM_BASE_COLORS = {
  'corn': {
    'DEFAULT': '#efc618',
    '50': '#fefcf3',
    '100': '#fdf9e8',
    '200': '#fbf1c5',
    '300': '#f9e8a3',
    '400': '#f4d75d',
    '500': '#efc618',
    '600': '#d7b216',
    '700': '#b39512',
    '800': '#8f770e',
    '900': '#75610c'
  },
  'gumleaf': {
    "DEFAULT":'#afd3c2',
    '50': '#fbfdfc',
    '100': '#f7fbf9',
    '200': '#ebf4f0',
    '300': '#dfede7',
    '400': '#c7e0d4',
    '500': '#afd3c2',
    '600': '#9ebeaf',
    '700': '#839e92',
    '800': '#697f74',
    '900': '#56675f'
  },
  "brandGrey": {
    "lt": "#555555",
    "dk": "#585858",
  },
}

///**** PROJECT CUSTOM (BRAND) COLORS **** use base values to reference ***///
const CUSTOM_THEME_COLORS = {

  /** PRIMARY ACCENT ----  BRAND MINT GREEN COLOR w defaults */
  "accent-primary": {
    "lt": getColor('gumleaf', '300'),
    "DEFAULT": getColor('gumleaf', '500'),
    "dk": getColor('gumleaf', '700'),
  },
  /** SECONDARY ACCENT ----  BRAND YELLOW COLOR w defaults  */
  "accent-secondary": {
    "lt": getColor('corn', '300'),
    "DEFAULT": getColor('corn', '500'),
    "dk": getColor('corn', '700'),
  },
  "dark": {
    "lt": getColor('brandGrey', 'lt'),
    "DEFAULT": getColor('brandGrey', 'dk'),
    "dk": getColor('brandGrey', 'dk'),
  },
  "light": {   ///TODO : UPDATE someday with maybe a tint or something??????
    "lt": colors.white,
    "DEFAULT": colors.white,
    "dk": colors.white,
  },
  "primary": {
    "lt": getColor('brandGrey', 'lt'),
    "DEFAULT": getColor('brandGrey', 'dk'),
    "dk": getColor('brandGrey', 'dk'),
  },
}

///**** PROJECT CUSTOM SYSTEM FONTS *******///
const DEFAULT_FONTS = {
  sans: ['Optima', 'sans-serif'],
  serif: ['Garamond', 'Georgia', 'serif'],
};

///**** PROJECT CUSTOM (BASE) FONTS *******///
const CUSTOM_BASE_FONTS = {
  'garamond': mergeSystemFont('adobe-garamond-pro', DEFAULT_FONTS.serif),
  'cormorant': mergeSystemFont('cormorantgaramond', DEFAULT_FONTS.serif),

  /** Accent/ Sans  Font Candidates */
  /** CRONOS */
  'cronos': mergeSystemFont('cronos-pro-display', DEFAULT_FONTS.sans),

  /** CORSO */
  'corso-medium': mergeSystemFont('Corso Medium', DEFAULT_FONTS.sans),
  'corso-regular': mergeSystemFont('Corso Regular', DEFAULT_FONTS.sans),

  /** MONTTSERRAT */
  'mont': mergeSystemFont('montserrat', DEFAULT_FONTS.sans),//todo: figure out where thihs is being loaded?
}

///**** PROJECT CUSTOM (BRAND) FONTS **** use base values to reference ***///
const CUSTOM_THEME_FONTS = {
  'primary': CUSTOM_BASE_FONTS.garamond,
  'secondary': CUSTOM_BASE_FONTS.cronos,
  'accent': CUSTOM_BASE_FONTS.cormorant,
};

///**** Plugin config enable / disable ***///
const PLUGIN_CONFIG = {
  'typography': {
    enabled: false,
    source: require('@tailwindcss/typography'),
  },
  'forms': {
    enabled: false,
    source: require('@tailwindcss/forms'),
  },
  'aspect-ratio': {
    enabled: false,
    source: require('@tailwindcss/aspect-ratio'),
  },
  'css-variables': {
    enabled: false,
    source: require('tailwind-css-variables')(
        { /*modules*/}, {postcssEachVariables: true}
    )
  },
  'gsvg': {
    enabled:true,
    source: require('./tailwind-plugin-gsvg')
  },
  /*  **Custom plugins** */
  'rotate': false,
  'icons': false,
}

///****Tailwind css theme config ***///
const TAILWIND_THEME_CONFIG = {
      /** THEME */
      colors: {...CUSTOM_BASE_COLORS ,...DEFAULT_THEME_COLORS},
      fontFamily: {...DEFAULT_FONTS,...CUSTOM_BASE_FONTS},

      /** EXTEND THEME */
      extend: {
        colors: CUSTOM_THEME_COLORS,
        fontFamily: CUSTOM_THEME_FONTS,
      },

      /** THEME EXTRAS - (not extended)  */
      container: {
        /*center: true,
        padding: '1rem'*/
      },
      rotate: {
        '45': '45deg',
        '90': '90deg',
        '180': '180deg',
        '270': '270deg',
      },
    };

module.exports = {
  theme: TAILWIND_THEME_CONFIG,
  variants: {},
  darkMode: false,
  plugins: getPluginConfig(),
  purge: {
    // learn more on https://tailwindcss.com/docs/controlling-file-size/#removing-unused-css
    enabled: process.env.NODE_ENV === 'production',
    content: [
      path.resolve(__dirname, '**/*.{js,vue}'),
      path.resolve(__dirname, '../shopify/**/*.liquid')
    ]
  }
}
