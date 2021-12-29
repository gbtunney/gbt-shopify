<script>
import {getRandomNumber, isInteger, toInteger,validateEnum} from "./../../scripts/generic"
import {isShopifyID} from "./../../scripts/shopify"
const R = window.R
const RA = window.RA
import {LoaderMixin} from './../../mixins/LoaderMixin'

import options from "../../options.json"
const {EDITABLE_DEFAULTS,LOAD_MODE,SELECTION_MODE_OPTIONS } = options
console.log("SELECTION_MODE_OPTIONS",SELECTION_MODE_OPTIONS)
import {
  ProductInstanceSingle,
  Product,
  Variant,
  ProductImage,
  ProductOption,
  ProductOptionValue,
  VariantOption,
  Cart,
  LineItem, ProductInstanceBase
} from '../../orm/models'
import {mapState} from "vuex";
import Vue from "vue";
import {getEntity} from "../../orm/functions";

const defaultInstance = ProductInstanceSingle.fields();

export default {
  name: "ProductChild",
  mixins: [LoaderMixin],
  components: {},
  data: function () {
    return {
      _refID: false,
      _handle: false,
      _initialized:false,
    }
  },
  props: {
    id : {
      type: [Number],
      default: getRandomNumber(1000000),
    },
    handle: {
      type: [Boolean,String],  /* ID OR SID */
      default:  defaultInstance.handle.value,
    },
    variant_id: {
      type: Number,  /* ID OR SID */
      default: defaultInstance.variant_id.value,
    },
    type:{
      type: String,
      default:  defaultInstance.type.value,
    },
    group_id: {
      type: [Boolean, Number],
      default: false,
    },
    message: {
      type: String,  /* ID OR SID */
      default: 'test nessage1111',
    },
    selection_mode:{
      type: [String,Boolean],
      default: defaultInstance.selection_mode.value,
      validator: function(value){
        return   Object.keys(SELECTION_MODE_OPTIONS).indexOf(value) >= 0
      }
    },
    load_handle: {
      type: Boolean,
      default: false,
    },
    quantity_editable: {
      type: Boolean,
      default: EDITABLE_DEFAULTS["quantity"]
    },
    variant_editable: {
      type: Boolean,
      default: EDITABLE_DEFAULTS["variant"]
    },
    options_editable: {
      type: [Boolean, Array],
      default: EDITABLE_DEFAULTS["options"]
    },
    add_to_cart_enabled: {
      type: Boolean,
      default: EDITABLE_DEFAULTS["addToCart"]
    },
    load_mode: {
      type: [Boolean, String, Number],
      default: "LOAD_HANDLE_NOT_IN_DATABASE",
      //TODO CHANGE VALIDATOR TO MY FUNCTION
      validator: function (value) {
        if (R.isEmpty(value)) return false;
        if (R.is(String, value)) return LOAD_MODE.includes(value)
        if (isInteger(value) && LOAD_MODE.length >= toInteger(value)) {
          const index = toInteger(value);
          return (LOAD_MODE[index]) ? true : false
        }
        return false
      }
    },
    enableoptions: {
      type: Boolean,
      default: true,
    },
    variant_priority: {  //this if a shopify id is found in variant, and it has an available product.
      type: Boolean,
      default: true,
    }
  },
  watch: {
    id: {
      immediate: true,
      handler(value, oldValue) {
        if (value/* && (value != this.RefID)*/) {
          //console.log(" id changed from " ,value)
          this.insertOrUpdateInstance(this.$props);
        }
      }
    },
    load_handle: {
      immediate: true,
      handler(newValue, oldValue) {
        //console.log(" load_handle changed from " + oldValue + " to " + newValue)
         this.initializeInstance()
      }
    },
    handle: {
      immediate: true,
      async handler(newValue, oldValue) {
        //if (newValue != this.Handle) {
       //  // console.log(" Handle changed from " + oldValue + " to " + newValue)
          //his.initializeInstance()
          if (!this.Instance){
            const entities =this.insertOrUpdateInstance(this.$props);
            console.log("THE HANDLE IS!!! !!!   ", entities)
          }
       // }
      }
    }
  },
  mounted() {
    if (this.$props.selection_mode && SELECTION_MODE_OPTIONS[this.$props.selection_mode]) {
      console.error("selection mode", SELECTION_MODE_OPTIONS[this.$props.selection_mode])
    }
  },
  methods: {
    initializeInstance(data = this.$props) {
      const {handle, load_mode, load_handle} = this.$props
      if (!this.Product || handle != this.Product.handle)
        if (load_handle) {
          this.$store.dispatch("productloader/load_items", [[this.$props], load_mode])
        }
    },
    insertOrUpdateInstance(_data = {}) {
      return ProductInstanceBase.insertOrUpdate({
        data: _data
      })
    },
    ///todo: replace
    updateInstance(_data, instance) {
      const response =  ProductInstanceSingle.update({
        where: this.RefID,
        data: _data
      })
      //this.$emit('changed', this.Instance, response)
      return response
    },
    async removeInstance(instance) {
      //todo: finish
      return
    },
    //reduces the variant list by relevant options.
    getVariantsByOptionValues(option_value_array, boolRequireAll = true) {
      if (!option_value_array || option_value_array.length == 0) return false;
      if (option_value_array && option_value_array.length == 1) return option_value_array[0].Variants

      const mappedArray = option_value_array.map(function (value) {
        return value.Variants;
      }).filter(function (_variants) {
        //todo:ref.$props.ignoreInventory
        return (_variants && _variants.length > 0) ? true : false;
      })
      if (option_value_array.length != mappedArray.length) return []
      return mappedArray.reduce((acc, item) => {
        return R.innerJoin(
            (record0, record1) => record0.id === record1.id,
            acc,
            item
        );
      }, mappedArray[0]);
    },
    OptionValueList: function (option) {
      if (!this.Product || !this.Instance | !option) return false;
     // console.log("total amoubnt if values ",option, ProductOptionValue.query().where("product_id",this.Product.id ).count() )

      let that = this;
      let valueListForOption = this.Product.getOptionValueList(option, "Variants|Images")
      return valueListForOption.map(function (_value) {
      // console.log( "VALUULUU compare!!!",_value,_value.compareColor('#FF0000') )
        let variantArr = that.getVariantsByOptionValues(that.getMergedOptionArray(_value));
        let isDisabled = false;
        if (variantArr && variantArr.length == 0) isDisabled = true;
        else if ((variantArr.length == 1 && variantArr[0].IsAvailable == false)) isDisabled = true;
        return {
          ..._value,
          $isDisabled: isDisabled,
          isSelected: that.isOptionValueSelected(_value),
         thumbnail : _value.Thumbnail
        }
      })
    },
    isOptionValueSelected(_value) {
      if (!_value || !_value.parent_handle) return false
      const selected_value_for_parent = this.SelectedVariant.getOptionValue(_value.parent_handle)
      if (selected_value_for_parent) return (_value["$id"] == selected_value_for_parent["$id"]);
      return false;
    },
    SelectedOptionValue: function (option) {
      if (!this.Ready) return;
      if (!option) return false;
      return this.SelectedVariant.getOptionValue(option.handle);
    },
    //these are good.  change to 'update selected'
    updateOption(option) {
      if (!this.$props.enableoptions || !this.Product || !this.Product.id) return false
      let newVarArray = this.getVariantsByOptionValues(this.getMergedOptionArray(option));
      console.log("updateOption ::: Called", newVarArray, getEntity(option) )
      if (newVarArray && newVarArray.length == 1) this.updateVariant(newVarArray[0])
    },
    updateVariant(variant = {}, variant_editable = (this.Instance) ? this.Instance.variant_editable : this.$props.variant_editable) {  //TODO: change this name - i hate it.
      if (!variant_editable) return false;
      console.log("variant update  ::: Called", variant )
      if (this.$props.ignoreInventory) this.SelectedVariant = variant; //doesnt do anythinggggg. override availability
      else if (variant.IsAvailable) this.SelectedVariant = variant;
    },
    //todo : move to variant or something
    getMergedOptionArray(value) {
      const value_map = R.indexBy(R.prop('parent_handle'), (!RA.isArray(value)) ? [value] : value);
      return [...Object.values({...this.SelectedVariant.getOptionValueIndexedBy(), ...value_map})]
    },
    //replace w clone...
    async addToCart(instance) {
      console.log("SERVER TRYING TO ADD ITEM ",instance, [this.Instance.NewLineItem] )
      var itemaddresponse = await Cart.api().addItems([this.Instance], this.$props.useServer)
    },
   /* setThumbnail(){

    }*/
  },
  computed: {
    ...mapState('entities/products', {   //cartLoading
      isFetching:function (state){
        console.log("checking status", state.fetching)
        return false//state.fetching
      }
    }),
    LoaderMode: function () {
      const value = this.$props.load_mode;
      if (R.isEmpty(value)) return false;

      if (R.is(String, value) && LOAD_MODE.includes(value)) {
        return value;
      }
      if (isInteger(value) && LOAD_MODE.length >= toInteger(value)) {
        const index = toInteger(value);
        return (LOAD_MODE[index]) ? LOAD_MODE[index] : false;
      }
      return false
    },
    RefID: function () {
      return this.$props.id
    },
    Handle: function () {
      return this.$props.handle
    },
    Ready: function () {
      // if (this.Status == "LOADING") return
      return (!this.isLoading && this.Product && this.Instance && this.SelectedVariant) ? true : false;
    },
    Status: function () {
      return "LOADING"
      //return  this.$store.getters['entities/products/getProductLoader'](this.Handle)
    },
    Instance: function () {
      if (this.RefID) {
        return ProductInstanceBase.query().whereId(this.RefID).with("Variant|Group").first();
      }
      return false;
    },
    SelectedVariant: {
      get: function () {
        if (!this.Instance || !this.Instance.variant_id || !this.Product) return;
        const shopifyID = this.Instance.getVariantPositionToID()
        if (shopifyID != this.Instance.variant_id) {
          console.log("-----------------variant is position, need to update to SID", shopifyID, this.Instance.variant_id)
          this.updateInstance({variant_id: shopifyID})
        }
        return Variant.query().whereId(this.Instance.variant_id).with('options.Variants|image').first()
      },
      set: function (value) {
        if (!this.Instance || !this.Instance.variant_id || !this.Product) return;
        if ((value && !this.Instance.variant_id) || (value && value.id != this.Instance.variant_id)) {
          //NOTE: We are resetting the quantity here.
          this.updateInstance({variant_id: value.id, quantity: 1})
          this.$emit('changed', this.SelectedVariant)
        }
      }
    },
    SelectedVariantImage: function () {
      if (!this.Ready) return;
      return this.SelectedVariant.Image
    },
    SelectedOptionList: function () {
      if (!this.Ready || !this.Instance.variant_id || !this.SelectedVariant) return
      return this.SelectedVariant.options;
    },
    Quantity: function () {
      if (!this.Ready) return;
      return this.Instance.quantity;
    },
    QuantityAvailable: function () {
      if (!this.Ready ||  !this.Instance.variant_id || !this.SelectedVariant) return;
      return ( this.SelectedVariant.inventory_quantity -  this.Instance.quantity);
    },
    Product: function () {
      if (!this.Handle) return;
      return Product.getProductByHandle(this.Handle)
    },
    ProductImage: function () {
      //todo: fix
      if (!this.Product || !this.Ready) return;
      return ProductImage.query().where("product_id", this.Product.id).where("position", 1).orderBy('position').withAll().first()
    },
    Variants: function () {
      if (!this.Product || !this.Instance) return;
      return this.Product.Variants;
    },
    Options: function () {
      if (!this.Product || !this.Instance) return;
      //if (!this.$props.enableoptions || !this.Ready) return false
      return this.Product.Options;
    },
    Images: function () {
      if (!this.Product || !this.Variants) return; //todo: use  ready?
      return this.Product.Images;
    },
  },
  render() {
    return this.$scopedSlots.default(
        {
          Loading: this.isLoading,
          Ready: this.Ready,

          /** Gets multiple items.  */
          Variants: this.Variants,
          Images: this.Images,
          Options: this.Options,
          OptionValueList: this.OptionValueList, //FUNCTION  function thhat gets list option values by optionidid

          /** Gets single items.  */
          Product: this.Product,
          ProductImage: this.ProductImage,
          SelectedVariant: this.SelectedVariant,
          SelectedVariantImage: this.SelectedVariantImage,
          SelectedOptionList: this.SelectedOptionList, //  returns an array
          /** function that returns a optionvalue for a given option */
          SelectedOptionValue: this.SelectedOptionValue,//FUNCTION single optionvalues by option

          //instance variables
          Instance: this.Instance,
          QuantityAvailable: this.QuantityAvailable,
          Quantity: this.Quantity,
          UpdateInstance: this.updateInstance, //these are all functions
          UpdateOption: this.updateOption,
          UpdateVariant: this.updateVariant,
          addToCartEnabled: this.$props.add_to_cart_enabled,
          addToCart: this.addToCart,
          loadTest: this.Status,
          /*addToCart: (variant,qty) => Shopify.addItem( this.SelectedVariant, 2  )*/
        }
    )
  },
}
</script>
<!--
//{ Loading,Variants,Images,Options,OptionValueList,
// Product,ProductImage,SelectedVariant,SelectedVariantImage,SelectedOptionList,SelectedOption,
// RequestedQuantity , UpdateInstance , UpdateOption,UpdateVariant,addToCartEnabled}
-->
