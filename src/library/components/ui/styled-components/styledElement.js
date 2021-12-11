import styled from 'vue-styled-components'
import {
    getColorCssUnit,
    getDistanceCssUnit,
} from "../../../scripts/color"

import {DimensionsMixin} from "../../../mixins/DimensionsMixin"
import {colorThemeMixin} from "../../../mixins/ColorMixins"

const getCSSString = function (value = false, property = false) {
    if (!value || !property) return ""
    return `${property}:${value};`
}

const _StyledElement = styled('div', {...colorThemeMixin.props, ...DimensionsMixin.props})`
  ${props => getCSSString(getColorCssUnit(props.color), "color")};
  ${props => getCSSString(getColorCssUnit(props.bg_color), "background-color")};
  ${props => getCSSString(getDistanceCssUnit(props.width), "width")};
  ${props => getCSSString(getDistanceCssUnit(props.height), "height")};
`

export default {
    functional: true,
    extends: _StyledElement,
    mixins: [DimensionsMixin, colorThemeMixin],
}
