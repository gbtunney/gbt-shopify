<script>
import {getRandomNumber} from "./../../scripts/generic"
import {isShopifyID} from "./../../scripts/shopify"
import * as R from "ramda";

import {LoaderMixin} from './../../mixins/LoaderMixin'
import {Editable_Defaults} from '../../settings'
import {
  ProductInstanceSingle,
  Product,
  Variant,
  ProductImage,
  ProductOption,
  ProductOptionValue,
  VariantOption
} from '../..'

export default {
  name: "ProductInstanceProvider",
  mixins: [LoaderMixin],
  components: {},
  data: function () {
    return {
      _refID: getRandomNumber(1000000),
      _handle: false
    }
  },
  props: {
    instance: {
      type: [Object, Boolean],
      default: false,
    },
    handle: {
      type: [String, Boolean],
      default: false
    },
    variant: {
      type: Number,  /* ID OR SID */
      default: 1,
    },
    message: {
      type: String,  /* ID OR SID */
      default: 'test nessage1111',
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
    instance: function (value) {
      console.log("instance changed.", value);
    },
    handle: function (value) {
      console.log("handle changed.", value);
      //look at priority here. todo: needs check.
      if (value ) this.Handle = value;
    },
    variant: function (value) {
      console.log("variant changed.", value);
    },
  },
  created() {
    this.isLoading = true;
   this.Handle = this.$props.handle;
    if (this.Product) this.isLoading = false
  },
  async mounted() {
    this.Handle = this.$props.handle;
    //TODO: fix this please , wont work with groups, no pivots.
    if (this.$props.instance && this.$props.instance.id) {
      this.$data._refID = this.$props.instance.id;
      if (!this.$props.handle && !this.$data._handle) {
        //testing to see if variant is available.
        let variantid = (this.$props.instance.variant_id) ? this.$props.instance.variant_id : this.$props.variant;
        let _variant = (isShopifyID(variantid)) ? this.getVariant(variantid, "id") : false;
        if (_variant && _variant.Product) this.$data._handle = _variant.Product.handle;
        console.log("overriding the handle ", _variant, this.$data._handle);
      }
    }
    if (!this.Product) {
      const response = await Product.api().fetchByHandle(this.Handle)
    }
    if (this.Product && !this.Instance) {
      await this.insertOrUpdateInstance(
          {...this.mapValuesToInstance(), ...{variant_id: this.DefaultVariant.id}}
      );
      await this.createVariantOptionPivot();
    }
    console.log("setting hamdle id", this.Instance, this.Handle, this.Product, this.$props.instance.id)
  },
  methods: {
    getOption(index = false, index_prop = "id", getAll = false) {
      if (!this.$props.enableoptions) return false
      if (!this.Ready || !index) return
      /////query all options.!!
      if (index == true) return ProductOption.query().where("product_id", this.Product.id).orderBy('position').withAll().all()
      else if (getAll) return ProductOption.query().where(index_prop, index).orderBy('position').withAll().all()
      return ProductOption.query().where(index_prop, index).orderBy('position').withAll().first()
    },
    //TODO, please get this to take multiple querys? so all can be routed?
    getVariant(index = false, index_prop = "product_id", getAll = false) {   //get all returns an array
      if (index == true) return Variant.query().where(index_prop, this.Product.id).orderBy('position').withAll().all()    ////this defaults to thhe product id
      else if (getAll) return Variant.query().where(index_prop, index).orderBy('position').withAll().all()
      return Variant.query().where(index_prop, index).orderBy('position').withAll().first()
    },
    //reduces the variant list by relevant options.
    getVariantsByOptionValues(option_value_array, boolRequireAll = true) {
      if (!option_value_array || option_value_array.length == 0) return false;
      if (option_value_array && option_value_array.length == 1) return option_value_array[0].Variants

      var mappedArray = option_value_array.map(function (value) {
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
      let _option = false;
      if (R.is(String, option)) {
        _option = this.getOption(option, "handle")
      } else if (R.is(Object, option) && R.propIs(String, 'id', option)) _option = option;
      let that = this;
      let _selectedOptions = this.SelectedOptionList
      let valueListForOption = ProductOptionValue
          .query()
          .where("product_id", this.Product.id)
          .where("option_id", _option.id)
          .orderBy('position')
          .with("Variants")
          .all();
      return valueListForOption.map(function (_value) {
        let variantArr = that.getVariantsByOptionValues(that.getMergedOptionArray(_selectedOptions, _value));
        let isDisabled = false;
        if (variantArr && variantArr.length == 0) isDisabled = true;
        else if ((variantArr.length == 1 && variantArr[0].IsAvailable == false)) isDisabled = true;
        return {
          ..._value,
          $isDisabled: isDisabled,
          isSelected: that.isOptionSelected(_value),
        }
      })
    },
    isOptionSelected(_value) {
      if (!_value || !R.propIs(String, 'id', _value)) return false;
      if (_value.Option && this.SelectedOption(_value.Option)) return (_value.id == this.SelectedOption(_value.Option).id);
      return false;
    },
    SelectedOption: function (option) {
      if (!this.Ready) return;
      if (!option || !R.propIs(String, 'id', option)) return false;
      return this.SelectedVariant.getOptionValue(option.id);
    },
    //these are good.  change to 'update selected'
    updateOption(option) {
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
    mapValuesToInstance() {
      if (!this.Instance) {
        const {message, quantity_editable, variant_editable, options_editable, add_to_cart_enabled} = this.$props;
        //map props to instance. //this is only if it is un init.
        return {
          id: this.$data._refID,
          /* variant_id: this.DefaultVariant.id,*/
          message: message,
          quantity_editable: quantity_editable,
          variant_editable: variant_editable,
          options_editable: options_editable, //future pref dont know when implement
          add_to_cart_enabled: add_to_cart_enabled,
        }
      }
    },
    async insertOrUpdateInstance(_data = this.mapValuesToInstance()) {
      const response = await ProductInstanceSingle.insertOrUpdate({
        data: _data
      })
      console.log("insertOrUpdateInstance", response)
    },
    async updateInstance(_data) {
      console.log("trying to update instance", _data)
      return await ProductInstanceSingle.update({
        where: this.$data._refID,
        data: _data
      })
    },
    async createVariantOptionPivot() {
      //todo : probably should change this to init sequence.
      //this function creates a pivot table so options can directly link to variants.
      await this.Variants.forEach(function (_variant) {
        let variant = _variant;
        _variant.options.forEach(function (option_value) {
          VariantOption.insert({
            data: {
              variant_id: variant.id,
              option_value_id: option_value.id,
              thumbnail_id: (variant.Image) ? variant.Image.id : false
            }
          })
        })
      })
    },
    getMergedOptionArray(oldArray = [], replaceArray = []) {
      if (!this.Product) return;
      ///make map of old array. this should be minimised someohw?
      let workingOptions = oldArray.reduce((accumulator, currentValue, currentIndex, array) => {
        return accumulator.set(currentValue.option_id, currentValue)
      }, new Map());
      if (replaceArray && replaceArray.length == 0) return Array.from(workingOptions.values())
      let _replaceArray = replaceArray;

      //if its a single value object push into array.
      if (replaceArray && R.is(Object, replaceArray) && R.propIs(String, 'id', replaceArray)) _replaceArray = [replaceArray]
      return Array.from(_replaceArray.reduce((accumulator, currentValue, currentIndex, array) => {
        return accumulator.set(currentValue.option_id, currentValue)
      }, workingOptions).values())
    },
    addToCart() {
      console.log("adding to cart", this.Instance.$toJson())

      //addToCart: (variant: ShopifyBuy.ProductVariant, qty: number) => Shopify.addItem(variant, qty),
    }
  },
  computed: {
    Ready: function () {
      return (this.Product && this.Instance && this.SelectedVariant) ? true : false;
    },
    Handle: {
      get: function () {   //variant_id
        if (this.$data._handle) return this.$data._handle;
      },
      set: function (value) {
        this.$data._handle = value;
      }
    },
    Instance: {
      get: function () {
        return ProductInstanceSingle.query().whereId(this.$data._refID).with("Variant|Group").first();
      },
      set: async function (value) {
        console.log("tring to set instance!!!!!!!!!!!!!!!", this.insertOrUpdateInstance())

        //   this.$data._refID = value;
      }
    },
    SelectedVariant: {
      get: function () {
        if (!this.Instance || !this.Instance.variant_id || !this.Product) return;
        return Variant.query().whereId(this.Instance.variant_id).withAll().first()
      },
      set: function (value) {
        if (!this.Instance || !this.Instance.variant_id || !this.Product) return;
        if ((value && !this.Instance.variant_id) || (value && value.id != this.Instance.variant_id)) {
          //NOTE: We are resetting the quantity here.
          this.updateInstance({variant_id: value.id, requested_quantity: 1})
          console.log("variant after ", this.SelectedVariant);
          this.$emit('changed', this.SelectedVariant)
        }
      }
    },
    SelectedVariantImage: function () {
      if (!this.Ready) return;
      return this.SelectedVariant.Image
    },
    SelectedOptionList: function () {
      if (!this.Ready || !this.Instance.variant_id) return
      let query = Variant.query().whereId(this.Instance.variant_id).with('options.Variants').first();
      if (!query || !R.propIs(Array, 'options', query)) return false;
      return query["options"]
    },
    RequestedQuantity: function () {
      if (!this.Ready) return;
      return (this.Ready && this.Instance.requested_quantity) ? this.Instance.requested_quantity : false
    },
    DefaultVariant: function () {
      // if (!this.Product) return
      if (isShopifyID(this.$props.variant)) return this.getVariant(this.$props.variant, "id")
      //if it is  an index.
      let position_index = parseInt(this.$props.variant)
      return Variant.query()
          .where("product_id", this.Product.id)
          .where("position", position_index)
          .withAll().first()
    },
    Product: function () {
      return Product.query().where("handle", this.Handle).withAll().first();
    },
    ProductImage: function () {
      if (!this.Product || !this.Ready) return;
      //pick image in position 1
      return ProductImage.query().where("product_id", this.Product.id).where("position", 1).orderBy('position').withAll().first()
    },
    Variants: function () {
      if (!this.Product || !this.Ready) return;
      return this.getVariant(true)
    },
    Options: function () {
      if (!this.$props.enableoptions || !this.Ready) return false
      return this.getOption(this.Product.id, "product_id", true)
    },
    Images: function () {
      if (!this.Product) return;
      if (!this.Variants) return;
      return ProductImage.query().where("product_id", this.Product.id).orderBy('position').withAll().all()
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
          SelectedOption: this.SelectedOption,//FUNCTION single optionvalues by option

          //instance variables
          Instance: this.Instance,
          RequestedQuantity: this.RequestedQuantity,

          UpdateInstance: this.updateInstance, //these are all functions
          UpdateOption: this.updateOption,
          UpdateVariant: this.updateVariant,

          addToCartEnabled: this.$props.add_to_cart_enabled,
          testOptionMap: this.getOption,
          addToCart: this.addToCart,
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
