window.R = R
const R = window.R

/* * Asset URL Mixin for Shopify!!! * */
export const ShopifyAssetURLMixin = {
    computed: {
        ShopifyAssetURL() {
            return (this.$store.get('global/asset_url')) ? this.$store.get('global/asset_url') : ''
        }
    },
    props: {
        asset_url: {
            type: String,
            default: ""
        },
    },
    watch: {
        asset_url: {
            immediate: true,
            handler(newValue, oldValue) {
                console.log(" asset_url changed from " + oldValue + " to " + newValue)
                const [asseturl] = (this.$props.asset_url).toString().split('____')
                this.$store.set('global/asset_url', `http:${asseturl}`)
            }
        }
    },
    methods: {
        getShopifyAssetURL(file = false) {
            return (file && R.is(String, file) && !R.isEmpty(file)) ? `${this.ShopifyAssetURL}${file}` : `${this.ShopifyAssetURL}`
        }
    }
}
export default ShopifyAssetURLMixin
