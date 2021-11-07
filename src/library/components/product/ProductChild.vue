<script>
import {getRandomNumber, isInteger, toInteger,validateEnum} from "./../../scripts/generic"
import {isShopifyID} from "./../../scripts/shopify"
const R = window.R
import {LoaderMixin} from './../../mixins/LoaderMixin'
import {Editable_Defaults, LOAD_MODE, SELECTION_MODE_OPTIONS, USE_SERVER} from '../../settings'
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
} from '../../models'
import {mapState} from "vuex";
import Vue from "vue";

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
      return   Object.keys(Vue['$gbtconfig'].SELECTION_MODE_OPTIONS).indexOf(value) >= 0
      }
    },
    quantity_editable: {
      type: Boolean,
      default: Editable_Defaults["quantity"]
    },
    variant_editable: {
      type: Boolean,
      default: Editable_Defaults["variant"]
    },
    options_editable: {
      type: [Boolean, Array],
      default: Editable_Defaults["options"]
    },
    add_to_cart_enabled: {
      type: Boolean,
      default: Editable_Defaults["addToCart"]
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
        if (value && (value != this.$data._refID)) {
          // this.$data._refID = value;
          //    if (!this.Instance) {
          // const response = await this.insertOrUpdateInstance(this.$props);
          //console.log("TRDPOSNdsds", response)
          // }
        }
      }
    },
    handle: {
      immediate: true,
      handler(value, old) {
        if (value != this.Handle) {
          this.Handle = value;
          // this.doLoader(this.LoaderMode)
        }
      }
    }
  },
  mounted() {
    this.$data._refID = this.$props.id
    if (this.Instance) {
      this.Handle = this.Instance.handle
    } else {
      this.Handle = this.$props.handle
    }
    if (this.$props.selection_mode && SELECTION_MODE_OPTIONS[this.$props.selection_mode]) {
      //console.error("selection mode", SELECTION_MODE_OPTIONS[this.$props.selection_mode])
    }
  },
  methods: {
    doLoader(mode = this.$data._load_mode, handle = this.Handle) {
      if (!handle) return;
      console.log("doLoader :::::::::;", mode, handle)
      if (mode == 'LOAD_ALL') {
        //load all
         Product.api().fetchAll();
      } else if (mode == 'LOAD_HANDLE_ALWAYS') {
        //load by handle
        if (!handle) return;
         Product.api().fetchByHandle(handle)
      } else if (mode == 'LOAD_HANDLE_NOT_IN_DATABASE') {
        if (!handle) return;
        console.error("doLoader:  LOAD_HANDLE_NOT_IN_DATABASE:product",this.Status, this.Product,Product.getProductByHandle(handle))
        if (!Product.getProductByHandle(handle)) Product.api().fetchByHandle(handle)
      } else if (mode == 'LOAD_NEVER') {
        //do nothing? instance???
      }
    },
    async insertOrUpdateInstance(_data = {}) {
      return await ProductInstanceBase.insertOrUpdate({
        data: _data
      })
    },
    ///todo: replace
    async updateInstance(_data, instance) {
      console.log("trying to update instance", _data,instance)
      const response =  await ProductInstanceSingle.update({
        where: this.$data._refID,
        data: _data
      })
      this.$emit('changed', this.Instance,response)
      return response
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
    //todo: maybe use this below??
    // merges 2 arrays of optionvalues by the option index.
    OptionValueList: function (option) {
      if (!this.Ready || !option) return false;
      let that = this;
      let _option = this.Product.getOption(option)

      let _selectedOptions = this.SelectedOptionList

      //GILLIAN TODOOOOOOOOO,  PLEASE fix this has to do w busted id

      let valueListForOption = this.Product.getOptionValueList(option,"Variants")

    //  console.log("THE OPTION ID@!!",ProductOptionValue.all(),_option, valueListForOption,typeof valueListForOption)

      return valueListForOption.map(function (_value) {
       // console.log("valueeee!",_selectedOptions,_value,that.getMergedOptionArray(_selectedOptions, _value))

        let variantArr = that.getVariantsByOptionValues(that.getMergedOptionArray(_selectedOptions, _value));

        let isDisabled = false;
        if (variantArr && variantArr.length == 0) isDisabled = true;
        else if ((variantArr.length == 1 && variantArr[0].IsAvailable == false)) isDisabled = true;
        return {
          ..._value,
          $isDisabled: isDisabled,
          isSelected: that.isOptionValueSelected(_value),
        }
      })
    },
    isOptionValueSelected(_value) {
      if ( _value && _value.parent_handle &&  this.SelectedOption(_value.parent_handle) ) return (_value.id == this.SelectedOption(_value.parent_handle).id);
      return false;
    },
    SelectedOptionValue: function (option) {
     // if (!this.Ready) return;
      if (!option ) return false;
      return this.SelectedVariant.getOptionValue(option.id);
    },
    //these are good.  change to 'update selected'
    updateOption(option) {
      console.log("calling update option!!", option)
      if (!this.$props.enableoptions || !this.Product || !this.Product.id) return false
      if (option.product_id != this.Product.id) return
      //if option is editable , then search for it.
      //if (this.getIsOptionEditable(option.option_id)) {
      let newVarArray = this.getVariantsByOptionValues(this.getMergedOptionArray(this.SelectedOptionList, option));
      if (newVarArray && newVarArray.length == 1) this.updateVariant(newVarArray[0])
      // }
    },
    updateVariant(variant = {}, variant_editable = (this.Instance) ? this.Instance.variant_editable : this.$props.variant_editable) {  //TODO: change this name - i hate it.
      if (!variant_editable) return false;
      if (this.$props.ignoreInventory) this.SelectedVariant = variant; //doesnt do anythinggggg. override availability
      else if (variant.IsAvailable) this.SelectedVariant = variant;
    },

    //todo : move to variant or something
    getMergedOptionArray(oldArray = [], replaceArray = []) {
      if (!this.Product) return;
      ///make map of old array. this should be minimised someohw?
      let workingOptions = oldArray.reduce((accumulator, currentValue, currentIndex, array) => {
        return accumulator.set(currentValue.option_id, currentValue)
      }, new Map());
      if (replaceArray && replaceArray.length == 0) return Array.from(workingOptions.values())
      let _replaceArray = replaceArray;
   //   console.log("edsdsds",workingOptions,replaceArray)
      //if its a single value object push into array.
      if (replaceArray && R.is(Object, replaceArray) ) _replaceArray = [replaceArray]
      return Array.from(_replaceArray.reduce((accumulator, currentValue, currentIndex, array) => {
        return accumulator.set(currentValue.option_id, currentValue)
      }, workingOptions).values())
    },
    //replace w clone...
    async addToCart(instance) {
      console.log("SERVER TRYING TO ADD ITEM ",instance, [this.Instance.NewLineItem] )
      var itemaddresponse = await Cart.api().addItems([this.Instance], this.$props.useServer)
    },
    testFunction(){
      const productquery =   Product.getProductByObject({ product_type:"Patterns" });
      console.log("productquery ::: QUERY  ", Product.all(),productquery)
    },
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
    Handle: {
      get: function () {
        return this.$data._handle;
      },
      set: function (value) {
        this.$data._handle = value;
      }
    },
    Ready: function () {
      if (this.Status == "LOADING") return
      return (!this.isLoading && this.Product && this.Instance && this.SelectedVariant) ? true : false;
    },
    Status: function () {
      return "LOADING"
      //return  this.$store.getters['entities/products/getProductLoader'](this.Handle)
    },
    Instance: function () {
      if (this.$data._refID) {
        return ProductInstanceBase.query().whereId(this.$data._refID).with("Variant|Group").first();
      }
      return false;
    },
    SelectedVariant: {
      get: function () {
        if (!this.Instance || !this.Instance.variant_id || !this.Product) return;
        const shopifyID = this.Instance.getVariantPositionToID()
        if (shopifyID != this.Instance.variant_id) {
          console.log("-----------------NEED TO UPDATE ID!!", shopifyID, this.Instance.variant_id)
          this.updateInstance({variant_id: shopifyID})
        }
        return Variant.query().whereId(this.Instance.VariantID).with('options.Variants').first()
      },
      set: function (value) {
        if (!this.Instance || !this.Instance.variant_id || !this.Product) return;
        if ((value && !this.Instance.variant_id) || (value && value.id != this.Instance.variant_id)) {
          //NOTE: We are resetting the quantity here.
          this.updateInstance({variant_id: value.id, requested_quantity: 1})
          this.$emit('changed', this.SelectedVariant)
        }
      }
    },
    SelectedVariantImage: function () {
      if (!this.Ready) return;
      return this.SelectedVariant.Image
    },
    SelectedOptionList: function () {
      if (!this.Ready || !this.Instance.variant_id || this.SelectedVariant ) return
      return false;
      //todo: see withh
      /*
      let query = Variant.query().whereId(this.Instance.variant_id).with('options.Variants').first();
      if (!query || !R.propIs(Array, 'options', query)) return false;
      return query["options"]*/
    },
    RequestedQuantity: function () {
      if (!this.Ready) return;
        return this.Instance.quantity;
    },
    Product: function () {
      if (!this.Handle) return;
      return Product.getProductByHandle(this.Handle)
    },
    ProductImage: function () {
      if (!this.Product || !this.Ready) return;
      //pick image in position 1
      /// this.Product.Image  TODO: < idk why i cant use thihs????
      return ProductImage.query().where("product_id", this.Product.id).where("position", 1).orderBy('position').withAll().first()
    },
    Variants: function () {
      if (!this.Product || !this.Ready) return;
      return this.Product.Variants;
    },
    Options: function () {
      if (!this.$props.enableoptions || !this.Ready) return false
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
          RequestedQuantity: this.RequestedQuantity,
          UpdateInstance: this.updateInstance, //these are all functions
          UpdateOption: this.updateOption,
          UpdateVariant: this.updateVariant,
          addToCartEnabled: this.$props.add_to_cart_enabled,
          test: this.testFunction,
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
