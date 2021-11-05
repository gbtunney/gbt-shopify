<script>
import {Editable_Defaults, LOAD_MODE, SELECTION_MODE_OPTIONS, USE_SERVER} from "../../settings";
import {getRandomNumber, isInteger, toInteger} from "../../scripts/generic";
const R = window.R
import {
  Product,
  Variant,
  ProductImage,
  ProductOption,
  ProductOptionValue,
  VariantOption,
  Cart,
  LineItem,
  ProductInstanceSingle,
  ProductInstanceBase,
  ProductGroupBase,
  ProductInstanceGroup,

} from '../../models'

const defaultInstance = ProductGroupBase.fields();

export default {
  name: "GroupInstance",
  components: {},
  data: function () {
    return {
      _refID: false,
      _handle: false,
      _initialized:false,
    }
  },
  props: {
    variant_id: {
      type: [Number,Boolean],  /* ID OR SID */
      default: false ,/*defaultInstance.variant_id.value,*/
    },
    handle: {
      type: [Boolean,String],  /* ID OR SID */
      default:  false,//defaultInstance.handle.value,
    },
    //************** NOT NEEDED above??? ...name *****************//
    id : {
      type: [Number],
      default: getRandomNumber(1000000),
    },
    items:{
      type: [Array],
      default:  () => ["emtyyy"],
    },
    type:{
      type: String,
      default:  defaultInstance.type.value,
    },
    item_count:{
      type: [Number],
      default:  defaultInstance.item_count.value,
    },
    note: {
      type: String,  /* ID OR SID */
      default:   defaultInstance.note.value,
    },
   /* selection_mode:{
      type: [String,Boolean],
      default: `defaultInstance`.selection_mode.value,
      validator: function(value){
        return   Object.keys(SELECTION_MODE_OPTIONS).indexOf(value) >= 0
      }*/
    //},
    childprops:{
      type: Object,
      default: function(){
          return  {
            load_mode: "LOAD_HANDLE_NOT_IN_DATABASE",
            quantity_editable: true,
            variant_editable: true,
            add_to_cart_enabled: true,
            options_editable: false,
          }
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
  watch:{
    id: {
      immediate: true,
    async  handler(value, oldValue) {
        if (value && (value != this.$data._refID)) this.$data._refID = value;
        console.log("counts" ,  ProductInstanceSingle.all(), ProductInstanceBase.all(),ProductInstanceGroup.all())
        console.log("ID IS BEING CHANGED!!!!!!!!! new:", value, "old:", oldValue, "ref",
            this.$data._refID, "Instance", this.Instance,
       "props!!", this.$props )
        const response = await this.insertOrUpdateInstance(this.$props);


        console.log("TRDPOSNdsds", response)
      }
    },
  },
/*  async mounted(){

  },*/
  computed:{
    Instance: function () {
      //return this.getCart
      return ProductInstanceBase.query().where("group_id", this.$data._refID).withAll().all();

    },
    Items: function () { const that = this;
      const items = ProductInstanceBase.query().where("group_id", this.$data._refID).withAll().all();
     return items;
      /*const merged = items.map(function(item){
      return item.$toJson();
        //return R.omit(["$isDirty", "$isNew"],item.$toJson())//{...item.$toJson(),...that.$props.childprops}
      })
      console.log("merged!!!!!!",merged)
      return merged*/
    },
    ItemProps:function(){
      return {
      /*  load_mode: "LOAD_HANDLE_NOT_IN_DATABASE",*/
        quantity_editable: true,
        variant_editable: true,
        add_to_cart_enabled: true,
        options_editable: false,}
    }
  },
  methods:{
    async insertOrUpdateInstance(_data = {}) {
      console.log("insserting " , _data)
      return await ProductInstanceGroup.insertOrUpdate({
        data: _data
      })
      /*return await ProductGroupBase.insertOrUpdate({
        data: _data
      })*/
    },
  },
  render() {
    return this.$scopedSlots.default(
        {
          Children: this.Items,
          Items: this.Items,
          ID: this.$data._refID,
          note: this.$props.note,
          ItemProps: this.ItemProps
          /*Cart:this.getCart,
          isCartLoading: false,
          TotalPrice: () => (this.Instance) ? this.Instance.TotalPrice : false,
          ItemsAvailable: () => (this.Instance) ? this.Instance.IsAvailable : false,
          Children: this.Items,
          LineItems: this.Items,
          UpdateLineItem:this.UpdateLineItem,*/
        }
    )
  },
}
</script>
