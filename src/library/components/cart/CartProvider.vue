<script>
import {ProductInstanceSingle, ProductInstanceGroup, LineItem,Cart,ProductGroupBase} from "../..";
import {getRandomNumber} from "../../scripts/generic";
import {USE_SERVER} from "../../settings"
import {mapState} from "vuex";
import * as R from "ramda";
const {omit} = R

export default {
  name: "cart",
  components: {},
  data: function () {
    return {
      _refID: getRandomNumber(10000),
    }
  },
  props: {
    useServer: {
      type:Boolean,
      default : USE_SERVER
    },
    debugMode: {
      type:Boolean,
      default : true
    },
    instance: {
      type: [Object, Boolean],
      default: false,
    },
    variant: {
      type: Number,  /* ID OR SID */
      default: 1,
    },
  },
  watch: {
    instance: {
      immediate: true,
      handler(newValue, oldValue) {
        this.init();
      }
    }
  },
  methods: {
    RemoveLineItem(instance) {
      console.log("tryingto delete " , instance )
      instance.$delete();
      if (instance && instance.id) {
        return {[instance.id]: 0}
      }
      return false;
    },
    UpdateLineItem(instance) { ///node thihs is also in the lineitem model????.
      var test;
      if (instance && instance.id && instance.quantity) {
        test = {[instance.id]: instance.quantity}
      }
      Cart.api().updateItems([test],this.$props.useServer)
      return test;
    },
    updateAll(instance){
      var test = Object.fromEntries(this.Items.reduce((accumulator, currentValue, currentIndex, array) => {
        if (currentValue && currentValue.id && currentValue.quantity) {
          return  accumulator.set(currentValue.id,currentValue.quantity)
        }
      }, new Map()) )
      if ( this.$props.useServer) {
        console.warn("Update ALL LineItem::::::::", test)
      }else{
        ///SERVICE CALL HERE????
      }
      return test;
    },
    async addToCart2() {
      var junkitem = {
        id: 22589265510518,
        quantity: 2,
        properties: {
          message: "color b"
        }
      }
      var itemaddresponse = await Cart.api().addItems([this.Instance.LineItem, junkitem])
      var cartresponse = await Cart.api().fetchCart()
      console.log("reloaded cart", cartresponse, this.Instance.$toJson())
    },
    async init() {
      if (!this.$props.instance) return
      let that = this
      //Cart HAS TO BE merged with an id with a number.
      if ( this.$props.instance ){
        const response = await Cart.insert({
          data: { ...this.$props.instance, id: this.$data._refID}
        })
        if (this.Instance){
          await Cart.commit((state) => {
            state.checkoutId = that.Instance.token
            state.cart = that.Instance;//Cart.query().where("token", state.checkoutId).withAll().first();
          })
        }
       // this.$store.commit('loader/addProductLoader', {handle:"test",status:"testingfggg"})
      }
      /*
      let that = this
      const response = await Cart.api().fetchCart();

      await Cart.commit((state) => {

        if (state.checkoutId) {
          console.log("qurrrtrrrrring gggggg", state, Cart.query().where("token", state.checkoutId).withAll().first())
          state.cart = Cart.query().where("token", state.checkoutId).withAll().first();
          if ( state.cart && state.cart.id) that.$data._refID  = state.cart.id;
        }

      })
      console.log("completess")*/
    },
  },
  computed: {
    ...mapState('entities/cart', {   //cartLoading
      isCartLoading: (state) => state.fetching,
      cart: (state) => state.cart
    }),
    Instance: function () {
      return Cart.query().where("id", this.$data._refID).withAllRecursive().first();
    },
    Items: function () {
      return LineItem.query().where("group_id", this.$data._refID).withAll().all();
    },
  },
  async mounted() {
    this.init();
  },
  render() {
    return this.$scopedSlots.default(
        {
          Cart: this.Instance,
          isCartLoading: this.isCartLoading,
          TotalPrice: () => (this.Instance) ? this.Instance.TotalPrice : false,
          ItemsAvailable: () => (this.Instance) ? this.Instance.IsAvailable : false,
          Children: this.Items,
          LineItems: this.Items,
          UpdateLineItem:this.UpdateLineItem,
          RemoveLineItem: this.RemoveLineItem
        }
    )
  },
}
</script>
