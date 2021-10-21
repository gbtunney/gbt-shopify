<script>
import {getRandomNumber} from "./../../scripts/generic"
import {isShopifyID} from "./../../scripts/shopify"
import * as R from "ramda";
import {LoaderMixin} from './../../mixins/LoaderMixin'
import {Editable_Defaults, USE_SERVER} from '../../settings'
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
} from '../..'
import {mapState} from "vuex";

export default {
  name: "ProductInstanceProvider",
  mixins: [LoaderMixin],
  components: {},
  data: function () {
    return {
      _refID: getRandomNumber(1000000),
      _handle: false,
      _initialized:false
    }
  },
  props: {
    useServer: {
      type:Boolean,
      default : USE_SERVER
    },
    id : {
      type: [Number],
      default: 666666666666
    },
    instance: {
      type: [Object, Boolean],
      default: false,
    },
    variant_id: {
      type: Number,  /* ID OR SID */
      default: 1,
    },
    handle: {
      type: [Boolean,String],  /* ID OR SID */
      default: false,
    },
    type:{
      type: String,
      default: "INSTANCE",
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
    instance: function (value, old) {
      console.log("instance changed.", value,old);
    // this.Instance = value;
    },
    variant: function (value) {
      console.log("variant changed.", value);
    },
    handle: function (value) {
       if ( value ){
         this.$data._refID = this.$props.id
         this.Handle = value;
         this.insertOrUpdateInstance(this.$props);
         console.log("handle changed.", value);

         if (!this.Product && this.Handle) {
           const response =  Product.api().fetchByHandle(this.Handle)
           console.error("loaded", response)
         }
       }

    },
  },
  async mounted() {
    console.log("propes" ,this.$props)
    this.$data._refID = this.$props.id
    this.Handle = this.$props.handle;
    this.insertOrUpdateInstance(this.$props);
    if (!this.Product && this.Handle) {
      const response =  await Product.api().fetchByHandle(this.Handle)
      console.error("loaded", response,this.Status, this.Handle)
    }
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
      let _option = false;
      if (R.is(String, option)) {
        _option = this.getOption(option, "handle")
      } else if (R.is(Object, option) && R.propIs(String, 'id', option)) _option = option;
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
    mapValuesToInstance() {
      if (!this.Instance) {
        const {message, quantity_editable, variant_editable, options_editable, add_to_cart_enabled} = this.$props;
        //map props to instance. //this is only if it is un init.
        return {
          id: this.$data._refID,

          message: "gillian t",
          quantity_editable: quantity_editable,
          variant_editable: variant_editable,
          options_editable: options_editable, //future pref dont know when implement
          add_to_cart_enabled: add_to_cart_enabled,
        }
      }
    },
    async insertOrUpdateInstance(_data = this.mapValuesToInstance()) {
      const response = await ProductInstanceBase.insertOrUpdate({
        data: _data
      })
    },
    async updateInstance(_data, instance) {
      console.log("trying to update instance", _data,instance)
      const response =  await ProductInstanceSingle.update({
        where: this.$data._refID,
        data: _data
      })
      this.$emit('changed', this.Instance,response)
      return response
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
    async addToCart(instance) {
      console.log("SERVER TRYING TO ADD ITEM ",instance, [this.Instance.NewLineItem] )
      var itemaddresponse = await Cart.api().addItems([this.Instance], this.$props.useServer)

      //console.log("SERVER REFRESH CART",[this.Instance.NewLineItem] )
      //var cartresponse = await Cart.api().fetchCart()
     // console.log("reloaded cart",cartresponse, this.Instance.$toJson())
    },
  },
  computed: {
    ...mapState('entities/products', {   //cartLoading
      isFetching:function (state){
       console.log("checking status", state.fetching)
        return false//state.fetching
      }
    }),
    Handle: {
      get: function () {   //variant_id
        if (this.$data._handle) return this.$data._handle;
        return this.$props.handle
      },
      set: function (value) {
        this.$data._handle = value;
      }
    },
        Ready: function () {
      if ( this.Status == "LOADING" ) return
      return (!this.isLoading && this.Product && this.Instance && this.SelectedVariant) ? true : false;
    },
    Status:function(){
      return Product.store().get('loader/getProductLoader')(this.Handle)
    },
    Instance: {
      get: function () {
        return ProductInstanceBase.query().whereId(this.$data._refID).with("Variant|Group").first();
      },
      set: async function (value) {
        if ( !value ) return;

        if ( ( value && value.id && value.handle )  ) {
          //hhas an id , not the same as refid.

         if  (value.id !=  this.$data._refID ){
         //  this.$data._refID = value.id;
           this.$data._refID = value.id;
           console.log("updatin no refffg!!", value)
           await this.insertOrUpdateInstance(value);

         }
        }else if ( value && !value.id ){
          await this.insertOrUpdateInstance({...value, id: this.$data._refID} )
        }
        if (  value && value.handle )  this.Handle = value.handle;

      //  console.log("tring to set instance!!!!!!!!!!!!!!!", this.insertOrUpdateInstance())
      }
    },
    SelectedVariant: {
      get: function () {
        if (!this.Instance || !this.Instance.VariantID || !this.Product) return;
        return Variant.query().whereId(this.Instance.VariantID).withAll().first()
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
      if ( this.Instance.type == "LINE_ITEM"){
        return this.Instance.quantity;
      }
      return (this.Ready && this.Instance.requested_quantity) ? this.Instance.requested_quantity : false
    },
    Product:   function () {
      if ( !this.Handle )return;
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
      return ProductImage.query().where("product_id", this.Product.id).orderBy('position').with('Variants.options.Variants').all()
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
