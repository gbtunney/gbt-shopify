<template>
  <div
      :class="['gQuantityPicker', controlsType==='updown'? 'updown' : '']" >
    <button
        type="button"
        v-if="controls"
        class=""
        @mousedown="start(decrement)"
        @touchstart="$event.preventDefault(); start(decrement)"
        @touchend="$event.preventDefault(); stop($event)"
        :disabled="disabled || numericValue <= min"
    >
      -
    </button>
    <input
        :name="name"
        ref="input"
        type="number"
        :class="['numeric-input', this.controls ? '':'no-control']"
        :value="numericValue"
        :placeholder="placeholder"
        :max="max"
        :min="min"
        @input="inputHandler($event.target.value)"
        @change="onChange"
        @blur="onBlur"
        @focus="onFocus"
        :autofocus="autofocus"
        :disabled="disabled"
        :readonly="readonly"
    >
    <button
        type="button"
        v-if="controls"
        class=""
        @mousedown="start(increment)"
        @touchstart="$event.preventDefault(); start(increment)"
        @touchend="$event.preventDefault(); stop($event)"
        :disabled="disabled || numericValue >= max"
    >
      +
    </button>
  </div>
</template>
<script>
const timeInterval = 100

export default {
  name: 'gQuantityPicker',
  props: {
    name: String,
    value: Number,
    placeholder: String,
    min: {
      type: Number,
      default: -Infinity
    },
    max: {
      type: Number,
      default: Infinity
    },
    step: {
      type: Number,
      default: 1
    },
    align: {
      type: String,
      default: 'left'
    },
    size: {
      type: String,
      default: '150px'
    },
    precision: {
      type: Number,
      validator (val) {
        return val >= 0 && Number.isInteger(val)
      }
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    controls: {
      type: Boolean,
      default: true
    },
    controlsType: {
      type: String,
      default: 'plusminus'
    }

  },
  data () {
    return {
      numericValue: null,
      interval: null,
      startTime: null,
      handler: Function
    }
  },
  watch: {
    // Watch for value change
    value: {
      immediate: true,
      // handle the changed value
      handler (val) {
        let newValue = val
        if (newValue) {
          newValue = this.toPrecision(newValue, this.precision)
          if (newValue >= this.max) {
            newValue = this.max
          }
          if (newValue <= this.min) {
            newValue = this.min
          }
          if (newValue !== val) {
            this.$emit('input', newValue)
          }
        }
        this.numericValue = newValue
      }
    }
  },
  methods: {
    /**
     * Function convert value to number
     * @param val
     * @returns {number | Number}
     */
    toNumber (val) {
      let num = parseFloat(val)
      if (isNaN(val) || !isFinite(val)) {
        num = 0
      }
      return num
    },
    /**
     * Function to return fixed decimal precision of input val
     * @param val
     * @param precision
     * @returns {number | Number}
     */
    toPrecision (val, precision) {
      return precision !== undefined ? parseFloat(val.toFixed(precision)) : val
    },
    /**
     * Increment the current numeric value
     */
    increment () {
      if (!this.readonly) this.updateValue(this.toNumber(this.numericValue) + this.step)
    },
    /**
     * Decrement the current numeric value
     */
    decrement () {
      if (!this.readonly) this.updateValue(this.toNumber(this.numericValue) - this.step)
    },
    /**
     * Handle value on Input
     */
    inputHandler (val) {
      this.updateValue(this.toNumber(val), val)
    },
    /**
     * Update value on operation performed
     * @param val
     */
    updateValue: function (val, strVal = null) {
      const oldVal = this.numericValue
      val = this.toPrecision(val, this.precision)
      if (val >= this.max) {
        val = this.max
      }
      if (val <= this.min) {
        val = this.min
      }
      if (val === oldVal) {
        this.$refs.input.value = strVal && val === this.toNumber(strVal) ? strVal : val
        return
      }
      this.numericValue = val
      this.$emit('input', val)
    },
    /**
     *  Start a repetitive call to increment and decrement method after a timeInterval on mousedown event and will stop on mouseup event on controls
     * @param handler - increment or decrement method
     */
    start (handler) {
      document.addEventListener('mouseup', this.stop)
      this.startTime = new Date()
      this.handler = handler
      clearInterval(this.interval)
      this.interval = setInterval(handler, timeInterval)
    },
    /**
     * clear interval on mouseup event and remove the listener
     * @param evt - event to be removed
     */
    stop (evt) {
      document.removeEventListener(evt.type, this.stop)
      if (new Date() - this.startTime < timeInterval) {
        this.handler()
      }
      clearInterval(this.interval)
      this.interval = null
      this.handler = null
      this.startTime = null
      if (this.value !== this.numericValue) this.$emit('change', this.numericValue)
    },
    /**
     * On blur event trigger
     * @param event - blur event on input
     */
    onBlur (event) {
      this.$emit('blur', event)
    },
    /**
     * On focus event trigger on input
     * @param event
     */
    onFocus (event) {
      this.$emit('focus', event)
    },
    /**
     * On change event trigger on input
     * @param event
     */
    onChange (event) {
      this.$emit('change', this.numericValue)
    },
    /**
     * focus method to set the focus on input
     */
    focus () {
      if (!this.disabled) {
        this.$refs.input.focus()
      }
    },
    /**
     * blur to be trigger on input
     */
    blur () {
      this.$refs.input.blur()
    }
  },
  beforeDestroy () {
    clearInterval(this.interval)
    this.interval = null
    this.handler = null
    this.startTime = null
  }
}
</script>
<style lang="postcss" type="text/css" scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>
