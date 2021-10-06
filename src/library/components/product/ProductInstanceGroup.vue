<script>
import {ProductInstanceSingle, ProductInstanceGroup} from "../..";
import {getRandomNumber} from "../../scripts/generic";

export default {
  name: "ProductInstanceGroup",
  components: {},
  data: function () {
    return {
      _refID: getRandomNumber(10000),
    }
  },
  props: {
    children: { //dont know if i need
      type: Array,
      default: function () {
        return [];
      }
    },
    variant: {
      type: Number,  /* ID OR SID */
      default: 1,
    },
  },
  methods: {
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
      console.log("dataaaa", instance)

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
    Instance: function () {
      return ProductInstanceGroup.query().where("id", this.$data._refID).withAllRecursive().first();
    },
    Children: function () {
      return ProductInstanceSingle.query().where("group_id", this.$data._refID).withAll().all();
    },
  },
  async mounted() {

    //TODO: replace this tomarrow.
    const mydata = {
      id: this.$data._refID,
      message: "i am a group",
      ProductInstances: [
        {
          variant_id: 22589282975862,
          group_id: this.$data._refID,
          message: "thhis is a test"
        }
      ]
    }
    const instance = await ProductInstanceGroup.insert({
      data: mydata
    })
    console.log("dataaaa", instance, mydata)
  },
  render() {
    return this.$scopedSlots.default(
        {
          GroupInstance: this.Instance,
          Children: this.Children,
          TotalPrice: () => (this.Instance) ? this.Instance.TotalPrice : false,
          ItemsAvailable: () => (this.Instance) ? this.Instance.IsAvailable : false,
          registerChild: this.registerChild,
        }
    )
  },
}
</script>
