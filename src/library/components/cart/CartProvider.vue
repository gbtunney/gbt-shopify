<script>
import {ProductInstanceSingle, ProductInstanceGroup, LineItem,Cart} from "../..";
import {getRandomNumber} from "../../scripts/generic";
import {mapState} from "vuex";

export default {
  name: "cart",
  components: {},
  data: function () {
    return {
      _refID: getRandomNumber(10000),
    }
  },
  props: {
    instance: {
      type: [Object, Boolean],
      default: false,
    },
    variant: {
      type: Number,  /* ID OR SID */
      default: 1,
    },
  },

  methods: {
    removeItem(item) {
      // Shopify.removeItem(item)
    },
    updateItemQuantity(item, qty) {
      console.log(item, qty)
      //Shopify.updateItemQuantity(item, qty)
    },
    async addToCart() {
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
    async initializeInstanceGroup(dataObj) {
      const _testData = {
        message: "this is a test grtoup[ instance",
        ProductInstances: [
          {
            variant_id: 22589282975862,
            group_id: this.$data._refID,
            message: "thhis is a test"
          }
        ]
      }

      ////this overrides.
      const default_data = {
        id: this.$data._refID,
        message: this.$props.message
      }

      const _data = {..._testData, ...default_data};
      const instance = await ProductInstanceGroup.insert({
        data: _data
      })
    },
    async registerChild(_child) {
      await ProductInstanceSingle.update({
        where: _child.id,
        data: {
          group_id: this.$data._refID
        }
      })
      console.log("trying to register a child", this.Children, this.Instance)
    }
  },
  computed: {
    ...mapState('entities/cart', {   //cartLoading
      isCartLoading: (state) => state.fetching_cart,
      cart: (state) => state.cart
    }),
    Instance: function () {
      return ProductInstanceGroup.query().where("id", this.$data._refID).withAllRecursive().first();
    },
    Items: function () {
      return LineItem.query().where("group_id", this.$data._refID).withAll().all();
    },
  },
  async mounted() {

    let that = this
    const response = await Cart.api().fetchCart();

    await Cart.commit((state) => {

      if (state.checkoutId) {
        console.log("qurrrtrrrrring gggggg", state, Cart.query().where("token", state.checkoutId).withAll().first())
        state.cart = Cart.query().where("token", state.checkoutId).withAll().first();
        if ( state.cart && state.cart.id) that.$data._refID  = state.cart.id;
      }

    })
  },
  render() {
    return this.$scopedSlots.default(
        {
          Cart: this.cart,
          isCartLoading: this.isCartLoading,
          TotalPrice: () => (this.Instance) ? this.Instance.TotalPrice : false,
          ItemsAvailable: () => (this.Instance) ? this.Instance.IsAvailable : false,
          Children: this.Items,
          LineItems: this.Items
        }
    )
  },
}
</script>
