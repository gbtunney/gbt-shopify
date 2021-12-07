<template>
  <cart-provider>
    <div slot-scope="{Cart,isCartLoading , LineItems}">
      <div v-if="!isCartLoading">
        {{LineItems}}
          <div  class="cart ajaxcart">
            <div class="ajaxcart__inner ajaxcart__inner has-fixed-footer">
              <div class="ajaxcart__product">
            </div>
            <!--        <div class="ajaxcart__inner ajaxcart__inner has-fixed-footer">
                      {{#items}}
                      <div class="ajaxcart__product">
                        <div class="ajaxcart__row" data-line="{{line}}">
                          <div class="grid">
                            <div class="grid__item one-quarter">
                              <a href="{{url}}" class="ajaxcart__product-image"><img src="{{img}}" alt="{{name}}"></a>
                            </div>
                            <div class="grid__item three-quarters">
                              <div class="ajaxcart__product-name&#45;&#45;wrapper">
                                <a href="{{url}}" class="ajaxcart__product-name">{{{name}}}</a>
                                {{#if variation}}
                                <span class="ajaxcart__product-meta">{{variation}}</span>
                                {{/if}}
                                {{#if sellingPlanAllocation}}
                                <span class="ajaxcart__product-meta">{{sellingPlanAllocation.selling_plan.name}}</span>
                                {{/if}}
                                {{#properties}}
                                {{#each this}}
                                {{#if this}}
                                <span class="ajaxcart__product-meta">{{@key}}: {{this}}</span>
                                {{/if}}
                                {{/each}}
                                {{/properties}}
                              </div>

                              <div class="grid&#45;&#45;full">
                                <div class="grid__item one-half">
                                  <div class="ajaxcart__qty">
                                    <button type="button" class="ajaxcart__qty-adjust ajaxcart__qty&#45;&#45;minus icon-fallback-text" data-id="{{key}}" data-qty="{{itemMinus}}" data-line="{{line}}" aria-label="{% endraw %}{{ 'cart.general.reduce_quantity' | t }}{% raw %}">
                                      <span class="icon icon-minus" aria-hidden="true"></span>
                                      <span class="fallback-text" aria-hidden="true">&minus;</span>
                                    </button>
                                    <input type="text" name="updates[]" class="ajaxcart__qty-num" value="{{itemQty}}" min="0" data-id="{{key}}" data-line="{{line}}" aria-label="quantity" pattern="[0-9]*">
                                    <button type="button" class="ajaxcart__qty-adjust ajaxcart__qty&#45;&#45;plus icon-fallback-text" data-id="{{key}}" data-line="{{line}}" data-qty="{{itemAdd}}" aria-label="{% endraw %}{{ 'cart.general.increase_quantity' | t }}{% raw %}">
                                      <span class="icon icon-plus" aria-hidden="true"></span>
                                      <span class="fallback-text" aria-hidden="true">+</span>
                                    </button>
                                  </div>
                                </div>
                                <div class="grid__item one-half text-right">
                                  {{#if discountsApplied}}
                                  <span class="visually-hidden">{% endraw %}{{ 'products.general.regular_price' | t }}{% raw %}</span>
                                  <del class="ajaxcart__price">{{{price}}}</del>
                                  <span class="visually-hidden">{% endraw %}{{ 'products.general.sale_price' | t }}{% raw %}</span>
                                  <span class="ajaxcart__price">{{{discountedPrice}}}</span>
                                  {{else}}
                                  <span class="ajaxcart__price">{{{price}}}</span>
                                  {{/if}}
                                  {{#if unitPrice}}
                                  <span class="visually-hidden">{% endraw %}{{ 'products.general.unit_price' | t }}{% raw %}</span>
                                  <span class="cart__unit-price">
                                    {% endraw %}
                                      {%- capture unit_price_separator -%}
                                        <span aria-hidden="true">/</span><span class="visually-hidden">&nbsp;{{ 'general.accessibility.unit_price_separator' | t }}&nbsp;</span>
                                      {%- endcapture -%}
                                    {% raw %}

                                    <span>{{{ unitPrice.price }}}</span>{% endraw %}{{- unit_price_separator -}}{% raw %}{{#if unitPrice.addRefererenceValue }}{{{ unitPrice.reference_value }}}{{/if}}{{{ unitPrice.reference_unit }}}
                                  </span>
                                  {{/if}}
                                </div>
                              </div>
                              {{#if discountsApplied}}
                              <div class="grid&#45;&#45;full">
                                <div class="grid__item text-right">
                                  <ul class="order-discount order-discount&#45;&#45;list order-discount&#45;&#45;title order-discount&#45;&#45;ajax-cart order-discount&#45;&#45;ajax-cart-list" aria-label="{% endraw %}{{ 'customer.order.discount' | t }}{% raw %}">
                                    {{#each discounts}}
                                    <li class="order-discount__item">
                                      <span class="icon icon-saletag" aria-hidden="true"></span>{{ this.discount_application.title }} (-{{{ this.formattedAmount }}})
                                    </li>
                                    {{/each}}
                                  </ul>
                                </div>
                              </div>
                              {{/if}}
                            </div>
                          </div>
                        </div>
                      </div>
                      {{/items}}

                      {% endraw %}{% if settings.cart_notes_enable %}{% raw %}
                      <div>
                        <label for="CartSpecialInstructions" class="ajaxcart__note">{% endraw %}{{ 'cart.general.note' | t }}{% raw %}</label>
                        <textarea name="note" class="input-full" id="CartSpecialInstructions">{{note}}</textarea>
                      </div>
                      {% endraw %}{% endif %}{% raw %}
                    </div>
                    <div class="ajaxcart__footer ajaxcart__footer&#45;&#45;fixed">
                      <div class="grid&#45;&#45;full">
                        {{#if cartDiscountsApplied}}
                        {{#each cartDiscounts}}
                        <div class="grid__item two-thirds ajaxcart__discounts">
                            <span class="order-discount order-discount&#45;&#45;title order-discount&#45;&#45;ajax-cart">
                              <span class="icon icon-saletag" aria-hidden="true"></span><span class="visually-hidden">{% endraw %}{{ 'customer.order.discount' | t }}{% raw %}:</span>{{ this.title }}
                            </span>
                        </div>
                        <div class="grid__item one-third text-right">
                          <span class="ajaxcart__price">-{{{ this.formattedAmount }}}</span>
                        </div>
                        {{/each}}
                        {{/if}}
                        <div class="grid__item two-thirds">
                          <p class="ajaxcart__subtotal">{% endraw %}{{ 'cart.general.subtotal' | t }}{% raw %}</p>
                        </div>
                        <div class="grid__item one-third text-right">
                          <p class="ajaxcart__subtotal">{{{totalPrice}}}</p>
                        </div>
                      </div>

                      <p class="ajaxcart__policies">{% endraw %}
                        {%- capture taxes_shipping_checkout -%}
                        {%- if cart.taxes_included and shop.shipping_policy.body != blank -%}
                        {{ 'cart.general.taxes_included_and_shipping_policy_html' | t: link: shop.shipping_policy.url }}
                        {%- elsif cart.taxes_included -%}
                        {{ 'cart.general.taxes_included_but_shipping_at_checkout' | t }}
                        {%- elsif shop.shipping_policy.body != blank -%}
                        {{ 'cart.general.taxes_and_shipping_policy_at_checkout_html' | t: link: shop.shipping_policy.url }}
                        {%- else -%}
                        {{ 'cart.general.taxes_and_shipping_at_checkout' | t }}
                        {%- endif -%}
                        {%- endcapture -%}
                        {{ taxes_shipping_checkout }}
                        {% raw %}</p>
                      <button type="submit" class="btn&#45;&#45;secondary btn&#45;&#45;full cart__checkout" name="checkout">
                        {% endraw %}{{ 'cart.general.checkout' | t }}{% raw %} <span class="icon icon-arrow-right" aria-hidden="true"></span>
                      </button>
                    </div>-->
          </div>
        </div>




    </div>
  </cart-provider>

</template>

<script>
import { SfCollectedProduct } from "@storefront-ui/vue";

export default {

/*<SfCollectedProduct
    :qty="qty"
    :class="classes"
    @input="qty = $event"
    @click:remove="this['click:remove']"
    :image="image"
    :image-width="imageWidth"
    :image-height="imageHeight"
    :title="title"

 */
}
</script>

<style scoped>

</style>
