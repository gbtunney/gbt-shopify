<script>
import {ProductInstanceBase, ProductInstanceSingle} from "../../../orm/models";

export default {
  name: "InstanceProvider",
  data: function () {
    return {}
  },
  methods:{
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
  },
  props: {},
  render() {
    return this.$scopedSlots.default({})
  }
}
</script>
