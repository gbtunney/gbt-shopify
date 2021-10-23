<template>
<div>
<product-instance-provider2 :variant_id="4" :handle="'local'">
  <div slot-scope="{Loading,Variants,Images,Options,OptionValueList,
      Product,ProductImage,SelectedVariant,SelectedVariantImage,SelectedOptionList,SelectedOption,
      RequestedQuantity ,Instance, UpdateInstance , UpdateOption,UpdateVariant,addToCartEnabled,addToCart
       }"><h3 v-if="Product">{{Product.title}}</h3>
    <hr>OPTIONS

    <div
        v-for="productOption,index in Options" v-bind:key="index"
        class="product-option-wrapper m-8">
     {{SelectedOption(productOption)}}
      <v-select autocomplete="on"
          v-if="OptionValueList(productOption)"
          @option:selecting="UpdateOption"
          :value="SelectedOption(productOption)"
          :options="OptionValueList(productOption)"
          label="title"
          :autoscroll=true
          :clearable=false>
        <template #option="{ title , isSelected,$isDisabled ,Thumbnail }">
          <div
              :class="isSelected ? 'bg-primary-lt' : '' "
              class="flex font-secondary uppercase items-center text-lg flex-row h-full w-full p-2.5">

            &lt;!&ndash;
            <span :style="Thumbnail? '' : 'hidden' " style="height: 1.5em; width:auto;aspect-ratio: 1; " class=" border border-primary-dk  mr-8 ">
                            <img v-if='Thumbnail' :src="Thumbnail.getSrc(150)" class="object-cover"/>
                          </span>
            &ndash;&gt;

            <span :class="isSelected? 'font-bold' : '' ">{{ $isDisabled }}-{{ title }}</span>

          </div>
        </template>
        <template #selected-option-container="{ option, deselect, multiple, disabled }">
          <SfProperty :name="productOption.title" :value="option.title" />
        </template>
      </v-select>
    </div>
    <hr>Variants
    <v-select autocomplete="on"
        v-if="Variants"
        :value="SelectedVariant"
        @option:selecting="UpdateVariant"
        :options="Variants"
        label="title"
        :clearable=false
    >
      <template #option="{ isSelected,title,$isDisabled ,image }">

        <div
            :class="isSelected? 'bg-primary-lt' : '' "
            class="flex font-secondary uppercase items-center text-lg flex-row h-full w-full p-2.5">
          <SfProductOption color="#ff0000" :label="title">
            <template #color="" >
              <div v-if="image"
                  class="sf-product-option__color">
                <img v-if='image' :src="image.src" class="object-cover"/>
              </div>

            </template>
          </SfProductOption>

          <!--                <span :class="isSelected? 'font-bold' : '' ">{{ title }} </span>-->
        </div>
      </template>
      <template #selected-option-container="{ option, deselect, multiple, disabled }">
        <div class="vs__selected">
          <span v-if="option.Product">{{ option.Product.title }} / </span>
          <span>{{ option.title }}</span>
        </div>
      </template>
    </v-select>
<hr>
  </div>
</product-instance-provider2>

</div>
</template>

<script>
import ProductInstanceProvider2 from '@/library/components/product/ProductInstanceProvider2.vue'; // @ is an alias to /src
import vSelect from 'vue-select'
import { SfProductOption ,SfQuantitySelector,SfProperty,SfButton,SfIcon,SfGallery,SfImage} from "@storefront-ui/vue";

export default {
  name: "Test",
  components:{  ProductInstanceProvider2,vSelect,SfProductOption}
}
</script>
<style   type="text/css" lang="scss" src="@storefront-ui/vue/styles.scss"></style>
