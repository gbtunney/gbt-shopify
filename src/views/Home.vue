<template>
  <div class="home">
    <product-instance-group>
      <div slot-scope="{GroupInstance,Children,registerChild}">
        <div v-for="child in Children">
          <product-instance-provider v-if="child.Variant && child.Variant.id" :variant="child.Variant.id" :instance="child">
            <div slot-scope="{Ready, Product,SelectedVariant,RequestedQuantity}">
              <div v-if="Product">
                Child::{{ Product.title }} -{{ SelectedVariant.title }}
              </div>
            </div>
          </product-instance-provider>
        </div>
      </div>
    </product-instance-group>

    <product-instance-provider :options_editable="true" handle="local" :variant="22589282975862">
      <!--ff
//{ Loading,Variants,Images,Options,OptionValueList,
// Product,ProductImage,SelectedVariant,SelectedVariantImage,SelectedOptionList,SelectedOption,
// RequestedQuantity , UpdateInstance , UpdateOption,UpdateVariant,addToCartEnabled,addToCart}
-->

      <div slot-scope="{Loading,Variants,Images,Options,OptionValueList,
      Product,ProductImage,SelectedVariant,SelectedVariantImage,SelectedOptionList,SelectedOption,
      RequestedQuantity ,Instance, UpdateInstance , UpdateOption,UpdateVariant,addToCartEnabled,addToCart
       }"
          id="shopify-section-product-template" class="shopify-section"><!-- /templates/product.liquid -->
        <div v-if="Product">

          <hr>
          Variant
          <hr>

          <div v-if="SelectedVariant" class="quantity-wrapper">
            requested quantity : {{ RequestedQuantity }}
            quantity {{ SelectedVariant.inventory_quantity }}
            <h5 v-if="SelectedVariant">available units: {{ SelectedVariant.inventory_quantity }}</h5>
            <gQuantityPicker
                @change="UpdateInstance({ requested_quantity: $event},Instance)"
                :value="RequestedQuantity"
                :min="0"
                :max="SelectedVariant.inventory_quantity">
            </gQuantityPicker>
            <!--
                       <button class="bg-primary text-light border" @click="UpdateItem(item)">{{ item.Variant.Price }} @ {{ item.requested_quantity }} -&#45;&#45;&#45;&#45;Add to cart :: {{ item.TotalPrice }}</button>
            -->
            <button @click="registerChild(Instance)">REGISTER TO GROUPPPPPP</button>
            <button @click="addToCart"> ADD TO CART {{ SelectedVariant.Price | toCurrency }} @ {{ RequestedQuantity }}</button>
            <span> Total: {{ Instance.TotalPrice | toCurrency }}</span>
          </div>


          <!--<span>TOTAL :{{Instance.TotalPrice}} </span>-->
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
                &lt;!&ndash;
                <span :style="image? '' : 'hidden' " style="height: 1.5em; width:auto;aspect-ratio: 1; " class=" border border-primary-dk  mr-8 ">
                  <img v-if='image' :src="image.src" class="object-cover"/>
                </span>&ndash;&gt;
                <span :class="isSelected? 'font-bold' : '' ">{{ title }} </span>
              </div>
            </template>
            <template #selected-option-container="{ option, deselect, multiple, disabled }">
              <div class="vs__selected">
                <span v-if="option.Product">{{ option.Product.title }} / </span>
                <span>{{ option.title }}</span>
              </div>
            </template>
          </v-select>


          <div
              v-if="Options"
              v-for="productOption in Options"
              class="product-option-wrapper m-8">
            <v-select autocomplete="on"
                v-if="OptionValueList(productOption)"
                @option:selecting="UpdateOption"
                :value="SelectedOption(productOption)"
                :options="OptionValueList(productOption)"
                :selectable="option => !option['$isDisabled']"
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
                <div class="vs__selected">
                  <span class="font-bold">{{ productOption.title }}:</span>
                  <span>{{ option.title }}</span>
                </div>
              </template>
            </v-select>
          </div>
        </div>
      </div>


    </product-instance-provider>
    <product-instance-provider :options_editable="true" handle="balance" :variant="7">
      <!--ff
//{ Loading,Variants,Images,Options,OptionValueList,
// Product,ProductImage,SelectedVariant,SelectedVariantImage,SelectedOptionList,SelectedOption,
// RequestedQuantity , UpdateInstance , UpdateOption,UpdateVariant,addToCartEnabled,addToCart}
-->

      <div slot-scope="{Loading,Variants,Images,Options,OptionValueList,
      Product,ProductImage,SelectedVariant,SelectedVariantImage,SelectedOptionList,SelectedOption,
      RequestedQuantity ,Instance, UpdateInstance , UpdateOption,UpdateVariant,addToCartEnabled,addToCart
       }"
          id="shopify-section-product-template" class="shopify-section"><!-- /templates/product.liquid -->
        <div v-if="Product">

          <hr>
          Variant
          <hr>

          <div v-if="SelectedVariant" class="quantity-wrapper">
            requested quantity : {{ RequestedQuantity }}
            quantity {{ SelectedVariant.inventory_quantity }}
            <h5 v-if="SelectedVariant">available units: {{ SelectedVariant.inventory_quantity }}</h5>
            <gQuantityPicker
                @change="UpdateInstance({ requested_quantity: $event},Instance)"
                :value="RequestedQuantity"
                :min="0"
                :max="SelectedVariant.inventory_quantity">
            </gQuantityPicker>
            <!--
                       <button class="bg-primary text-light border" @click="UpdateItem(item)">{{ item.Variant.Price }} @ {{ item.requested_quantity }} -&#45;&#45;&#45;&#45;Add to cart :: {{ item.TotalPrice }}</button>
            -->
            <button @click="registerChild(Instance)">REGISTER TO GROUPPPPPP</button>
            <button @click="addToCart"> ADD TO CART {{ SelectedVariant.Price }} @ {{ RequestedQuantity }}</button>
            <span> Total: {{ Instance.TotalPrice }}</span>
          </div>


          <!--<span>TOTAL :{{Instance.TotalPrice}} </span>-->
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
                &lt;!&ndash;
                <span :style="image? '' : 'hidden' " style="height: 1.5em; width:auto;aspect-ratio: 1; " class=" border border-primary-dk  mr-8 ">
                  <img v-if='image' :src="image.src" class="object-cover"/>
                </span>&ndash;&gt;
                <span :class="isSelected? 'font-bold' : '' ">{{ title }} </span>
              </div>
            </template>
            <template #selected-option-container="{ option, deselect, multiple, disabled }">
              <div class="vs__selected">
                <span v-if="option.Product">{{ option.Product.title }} / </span>
                <span>{{ option.title }}</span>
              </div>
            </template>
          </v-select>


          <div
              v-if="Options"
              v-for="productOption in Options"
              class="product-option-wrapper m-8">
            <v-select autocomplete="on"
                v-if="OptionValueList(productOption)"
                @option:selecting="UpdateOption"
                :value="SelectedOption(productOption)"
                :options="OptionValueList(productOption)"
                :selectable="option => !option['$isDisabled']"
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
                <div class="vs__selected">
                  <span class="font-bold">{{ productOption.title }}:</span>
                  <span>{{ option.title }}</span>
                </div>
              </template>
            </v-select>
          </div>
        </div>
      </div>

    </product-instance-provider>
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import vSelect from 'vue-select'
import ProductInstanceProvider from '@/library/components/product/ProductInstanceProvider.vue'; // @ is an alias to /src
import gQuantityPicker from '@/library/components/ui/gQuantityPicker.vue';
import ProductInstanceGroup from '@/library/components/product/ProductInstanceGroup.vue'; // @ is an alias to /src
export default Vue.extend({
  name: 'Home',
  components: {
    HelloWorld,ProductInstanceProvider,vSelect,
    ProductInstanceGroup,
    gQuantityPicker
  },
  async mounted(){

    let formData = {

      'items': [{

        'id': 36110175633573,

        'quantity': 2

      }]
    };
  }
});
</script>
