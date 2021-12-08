import { Model } from '@vuex-orm/core'
import {getRandomNumber} from "../scripts/generic"
import settings from "./../settings.json"
const {UID_LENGTH} = settings

export default class Shop extends Model {
    static entity = 'shop'
    static fields() {
        return {
            id: this.uid(() =>getRandomNumber(UID_LENGTH)),
            description:this.string(),
            name:this.string(),
        }
    }
}
//Shop.entity = 'shop';
const shop_schema = {
    "name": "Shop",
    "description": "Shop represents a collection of the general settings and information about the shop.",
    "fields": [
        {
            "name": "articles",
            "description": "List of the shop' articles.",
            "args": [
                {
                    "name": "first",
                    "description": "Returns up to the first `n` elements from the list.",
                    "type": {
                        "name": "Int",
                        "kind": "SCALAR",
                        "ofType": null,
                        "__typename": "__Type"
                    },
                    "__typename": "__InputValue"
                },
                {
                    "name": "after",
                    "description": "Returns the elements that come after the specified cursor.",
                    "type": {
                        "name": "String",
                        "kind": "SCALAR",
                        "ofType": null,
                        "__typename": "__Type"
                    },
                    "__typename": "__InputValue"
                },
                {
                    "name": "last",
                    "description": "Returns up to the last `n` elements from the list.",
                    "type": {
                        "name": "Int",
                        "kind": "SCALAR",
                        "ofType": null,
                        "__typename": "__Type"
                    },
                    "__typename": "__InputValue"
                },
                {
                    "name": "before",
                    "description": "Returns the elements that come before the specified cursor.",
                    "type": {
                        "name": "String",
                        "kind": "SCALAR",
                        "ofType": null,
                        "__typename": "__Type"
                    },
                    "__typename": "__InputValue"
                },
                {
                    "name": "reverse",
                    "description": "Reverse the order of the underlying list.",
                    "type": {
                        "name": "Boolean",
                        "kind": "SCALAR",
                        "ofType": null,
                        "__typename": "__Type"
                    },
                    "__typename": "__InputValue"
                },
                {
                    "name": "sortKey",
                    "description": "Sort the underlying list by the given key.",
                    "type": {
                        "name": "ArticleSortKeys",
                        "kind": "ENUM",
                        "ofType": null,
                        "__typename": "__Type"
                    },
                    "__typename": "__InputValue"
                },
                {
                    "name": "query",
                    "description": "Supported filter parameters:\n - `author`\n - `blog_title`\n - `created_at`\n - `tag`\n - `updated_at`\n\nSee the detailed [search syntax](https://help.shopify.com/api/getting-started/search-syntax)\nfor more information about using filters.\n",
                    "type": {
                        "name": "String",
                        "kind": "SCALAR",
                        "ofType": null,
                        "__typename": "__Type"
                    },
                    "__typename": "__InputValue"
                }
            ],
            "type": {
                "name": null,
                "kind": "NON_NULL",
                "ofType": {
                    "kind": "OBJECT",
                    "name": "ArticleConnection",
                    "ofType": null,
                    "__typename": "__Type"
                },
                "__typename": "__Type"
            },
            "__typename": "__Field"
        },
        {
            "name": "blogs",
            "description": "List of the shop' blogs.",
            "args": [
                {
                    "name": "first",
                    "description": "Returns up to the first `n` elements from the list.",
                    "type": {
                        "name": "Int",
                        "kind": "SCALAR",
                        "ofType": null,
                        "__typename": "__Type"
                    },
                    "__typename": "__InputValue"
                },
                {
                    "name": "after",
                    "description": "Returns the elements that come after the specified cursor.",
                    "type": {
                        "name": "String",
                        "kind": "SCALAR",
                        "ofType": null,
                        "__typename": "__Type"
                    },
                    "__typename": "__InputValue"
                },
                {
                    "name": "last",
                    "description": "Returns up to the last `n` elements from the list.",
                    "type": {
                        "name": "Int",
                        "kind": "SCALAR",
                        "ofType": null,
                        "__typename": "__Type"
                    },
                    "__typename": "__InputValue"
                },
                {
                    "name": "before",
                    "description": "Returns the elements that come before the specified cursor.",
                    "type": {
                        "name": "String",
                        "kind": "SCALAR",
                        "ofType": null,
                        "__typename": "__Type"
                    },
                    "__typename": "__InputValue"
                },
                {
                    "name": "reverse",
                    "description": "Reverse the order of the underlying list.",
                    "type": {
                        "name": "Boolean",
                        "kind": "SCALAR",
                        "ofType": null,
                        "__typename": "__Type"
                    },
                    "__typename": "__InputValue"
                },
                {
                    "name": "sortKey",
                    "description": "Sort the underlying list by the given key.",
                    "type": {
                        "name": "BlogSortKeys",
                        "kind": "ENUM",
                        "ofType": null,
                        "__typename": "__Type"
                    },
                    "__typename": "__InputValue"
                },
                {
                    "name": "query",
                    "description": "Supported filter parameters:\n - `created_at`\n - `handle`\n - `title`\n - `updated_at`\n\nSee the detailed [search syntax](https://help.shopify.com/api/getting-started/search-syntax)\nfor more information about using filters.\n",
                    "type": {
                        "name": "String",
                        "kind": "SCALAR",
                        "ofType": null,
                        "__typename": "__Type"
                    },
                    "__typename": "__InputValue"
                }
            ],
            "type": {
                "name": null,
                "kind": "NON_NULL",
                "ofType": {
                    "kind": "OBJECT",
                    "name": "BlogConnection",
                    "ofType": null,
                    "__typename": "__Type"
                },
                "__typename": "__Type"
            },
            "__typename": "__Field"
        },
        {
            "name": "collectionByHandle",
            "description": "Find a collection by its handle.",
            "args": [
                {
                    "name": "handle",
                    "description": "The handle of the collection.",
                    "type": {
                        "name": null,
                        "kind": "NON_NULL",
                        "ofType": {
                            "kind": "SCALAR",
                            "name": "String",
                            "ofType": null,
                            "__typename": "__Type"
                        },
                        "__typename": "__Type"
                    },
                    "__typename": "__InputValue"
                }
            ],
            "type": {
                "name": "Collection",
                "kind": "OBJECT",
                "ofType": null,
                "__typename": "__Type"
            },
            "__typename": "__Field"
        },
        {
            "name": "collections",
            "description": "List of the shop’s collections.",
            "args": [
                {
                    "name": "first",
                    "description": "Returns up to the first `n` elements from the list.",
                    "type": {
                        "name": "Int",
                        "kind": "SCALAR",
                        "ofType": null,
                        "__typename": "__Type"
                    },
                    "__typename": "__InputValue"
                },
                {
                    "name": "after",
                    "description": "Returns the elements that come after the specified cursor.",
                    "type": {
                        "name": "String",
                        "kind": "SCALAR",
                        "ofType": null,
                        "__typename": "__Type"
                    },
                    "__typename": "__InputValue"
                },
                {
                    "name": "last",
                    "description": "Returns up to the last `n` elements from the list.",
                    "type": {
                        "name": "Int",
                        "kind": "SCALAR",
                        "ofType": null,
                        "__typename": "__Type"
                    },
                    "__typename": "__InputValue"
                },
                {
                    "name": "before",
                    "description": "Returns the elements that come before the specified cursor.",
                    "type": {
                        "name": "String",
                        "kind": "SCALAR",
                        "ofType": null,
                        "__typename": "__Type"
                    },
                    "__typename": "__InputValue"
                },
                {
                    "name": "reverse",
                    "description": "Reverse the order of the underlying list.",
                    "type": {
                        "name": "Boolean",
                        "kind": "SCALAR",
                        "ofType": null,
                        "__typename": "__Type"
                    },
                    "__typename": "__InputValue"
                },
                {
                    "name": "sortKey",
                    "description": "Sort the underlying list by the given key.",
                    "type": {
                        "name": "CollectionSortKeys",
                        "kind": "ENUM",
                        "ofType": null,
                        "__typename": "__Type"
                    },
                    "__typename": "__InputValue"
                },
                {
                    "name": "query",
                    "description": "Supported filter parameters:\n - `collection_type`\n - `title`\n - `updated_at`\n\nSee the detailed [search syntax](https://help.shopify.com/api/getting-started/search-syntax)\nfor more information about using filters.\n",
                    "type": {
                        "name": "String",
                        "kind": "SCALAR",
                        "ofType": null,
                        "__typename": "__Type"
                    },
                    "__typename": "__InputValue"
                }
            ],
            "type": {
                "name": null,
                "kind": "NON_NULL",
                "ofType": {
                    "kind": "OBJECT",
                    "name": "CollectionConnection",
                    "ofType": null,
                    "__typename": "__Type"
                },
                "__typename": "__Type"
            },
            "__typename": "__Field"
        },
        {
            "name": "currencyCode",
            "description": "The three-letter code for the currency that the shop accepts.",
            "args": [],
            "type": {
                "name": null,
                "kind": "NON_NULL",
                "ofType": {
                    "kind": "ENUM",
                    "name": "CurrencyCode",
                    "ofType": null,
                    "__typename": "__Type"
                },
                "__typename": "__Type"
            },
            "__typename": "__Field"
        },
        {
            "name": "description",
            "description": "A description of the shop.",
            "args": [],
            "type": {
                "name": "String",
                "kind": "SCALAR",
                "ofType": null,
                "__typename": "__Type"
            },
            "__typename": "__Field"
        },
        {
            "name": "moneyFormat",
            "description": "A string representing the way currency is formatted when the currency isn’t specified.",
            "args": [],
            "type": {
                "name": null,
                "kind": "NON_NULL",
                "ofType": {
                    "kind": "SCALAR",
                    "name": "String",
                    "ofType": null,
                    "__typename": "__Type"
                },
                "__typename": "__Type"
            },
            "__typename": "__Field"
        },
        {
            "name": "name",
            "description": "The shop’s name.",
            "args": [],
            "type": {
                "name": null,
                "kind": "NON_NULL",
                "ofType": {
                    "kind": "SCALAR",
                    "name": "String",
                    "ofType": null,
                    "__typename": "__Type"
                },
                "__typename": "__Type"
            },
            "__typename": "__Field"
        },
        {
            "name": "paymentSettings",
            "description": "Settings related to payments.",
            "args": [],
            "type": {
                "name": null,
                "kind": "NON_NULL",
                "ofType": {
                    "kind": "OBJECT",
                    "name": "PaymentSettings",
                    "ofType": null,
                    "__typename": "__Type"
                },
                "__typename": "__Type"
            },
            "__typename": "__Field"
        },
        {
            "name": "primaryDomain",
            "description": "The shop’s primary domain.",
            "args": [],
            "type": {
                "name": null,
                "kind": "NON_NULL",
                "ofType": {
                    "kind": "OBJECT",
                    "name": "Domain",
                    "ofType": null,
                    "__typename": "__Type"
                },
                "__typename": "__Type"
            },
            "__typename": "__Field"
        },
        {
            "name": "privacyPolicy",
            "description": "The shop’s privacy policy.",
            "args": [],
            "type": {
                "name": "ShopPolicy",
                "kind": "OBJECT",
                "ofType": null,
                "__typename": "__Type"
            },
            "__typename": "__Field"
        },
        {
            "name": "productByHandle",
            "description": "Find a product by its handle.",
            "args": [
                {
                    "name": "handle",
                    "description": "The handle of the product.",
                    "type": {
                        "name": null,
                        "kind": "NON_NULL",
                        "ofType": {
                            "kind": "SCALAR",
                            "name": "String",
                            "ofType": null,
                            "__typename": "__Type"
                        },
                        "__typename": "__Type"
                    },
                    "__typename": "__InputValue"
                }
            ],
            "type": {
                "name": "Product",
                "kind": "OBJECT",
                "ofType": null,
                "__typename": "__Type"
            },
            "__typename": "__Field"
        },
        {
            "name": "productTags",
            "description": "A list of tags that have been added to products.\nAdditional access scope required: unauthenticated_read_product_tags.\n",
            "args": [
                {
                    "name": "first",
                    "description": "Returns up to the first `n` elements from the list.",
                    "type": {
                        "name": null,
                        "kind": "NON_NULL",
                        "ofType": {
                            "kind": "SCALAR",
                            "name": "Int",
                            "ofType": null,
                            "__typename": "__Type"
                        },
                        "__typename": "__Type"
                    },
                    "__typename": "__InputValue"
                }
            ],
            "type": {
                "name": null,
                "kind": "NON_NULL",
                "ofType": {
                    "kind": "OBJECT",
                    "name": "StringConnection",
                    "ofType": null,
                    "__typename": "__Type"
                },
                "__typename": "__Type"
            },
            "__typename": "__Field"
        },
        {
            "name": "productTypes",
            "description": "List of the shop’s product types.",
            "args": [
                {
                    "name": "first",
                    "description": "Returns up to the first `n` elements from the list.",
                    "type": {
                        "name": null,
                        "kind": "NON_NULL",
                        "ofType": {
                            "kind": "SCALAR",
                            "name": "Int",
                            "ofType": null,
                            "__typename": "__Type"
                        },
                        "__typename": "__Type"
                    },
                    "__typename": "__InputValue"
                }
            ],
            "type": {
                "name": null,
                "kind": "NON_NULL",
                "ofType": {
                    "kind": "OBJECT",
                    "name": "StringConnection",
                    "ofType": null,
                    "__typename": "__Type"
                },
                "__typename": "__Type"
            },
            "__typename": "__Field"
        },
        {
            "name": "products",
            "description": "List of the shop’s products.",
            "args": [
                {
                    "name": "first",
                    "description": "Returns up to the first `n` elements from the list.",
                    "type": {
                        "name": "Int",
                        "kind": "SCALAR",
                        "ofType": null,
                        "__typename": "__Type"
                    },
                    "__typename": "__InputValue"
                },
                {
                    "name": "after",
                    "description": "Returns the elements that come after the specified cursor.",
                    "type": {
                        "name": "String",
                        "kind": "SCALAR",
                        "ofType": null,
                        "__typename": "__Type"
                    },
                    "__typename": "__InputValue"
                },
                {
                    "name": "last",
                    "description": "Returns up to the last `n` elements from the list.",
                    "type": {
                        "name": "Int",
                        "kind": "SCALAR",
                        "ofType": null,
                        "__typename": "__Type"
                    },
                    "__typename": "__InputValue"
                },
                {
                    "name": "before",
                    "description": "Returns the elements that come before the specified cursor.",
                    "type": {
                        "name": "String",
                        "kind": "SCALAR",
                        "ofType": null,
                        "__typename": "__Type"
                    },
                    "__typename": "__InputValue"
                },
                {
                    "name": "reverse",
                    "description": "Reverse the order of the underlying list.",
                    "type": {
                        "name": "Boolean",
                        "kind": "SCALAR",
                        "ofType": null,
                        "__typename": "__Type"
                    },
                    "__typename": "__InputValue"
                },
                {
                    "name": "sortKey",
                    "description": "Sort the underlying list by the given key.",
                    "type": {
                        "name": "ProductSortKeys",
                        "kind": "ENUM",
                        "ofType": null,
                        "__typename": "__Type"
                    },
                    "__typename": "__InputValue"
                },
                {
                    "name": "query",
                    "description": "Supported filter parameters:\n - `available_for_sale`\n - `created_at`\n - `product_type`\n - `tag`\n - `title`\n - `updated_at`\n - `variants.price`\n - `vendor`\n\nSee the detailed [search syntax](https://help.shopify.com/api/getting-started/search-syntax)\nfor more information about using filters.\n",
                    "type": {
                        "name": "String",
                        "kind": "SCALAR",
                        "ofType": null,
                        "__typename": "__Type"
                    },
                    "__typename": "__InputValue"
                }
            ],
            "type": {
                "name": null,
                "kind": "NON_NULL",
                "ofType": {
                    "kind": "OBJECT",
                    "name": "ProductConnection",
                    "ofType": null,
                    "__typename": "__Type"
                },
                "__typename": "__Type"
            },
            "__typename": "__Field"
        },
        {
            "name": "refundPolicy",
            "description": "The shop’s refund policy.",
            "args": [],
            "type": {
                "name": "ShopPolicy",
                "kind": "OBJECT",
                "ofType": null,
                "__typename": "__Type"
            },
            "__typename": "__Field"
        },
        {
            "name": "shippingPolicy",
            "description": "The shop’s shipping policy.",
            "args": [],
            "type": {
                "name": "ShopPolicy",
                "kind": "OBJECT",
                "ofType": null,
                "__typename": "__Type"
            },
            "__typename": "__Field"
        },
        {
            "name": "shipsToCountries",
            "description": "Countries that the shop ships to.",
            "args": [],
            "type": {
                "name": null,
                "kind": "NON_NULL",
                "ofType": {
                    "kind": "LIST",
                    "name": null,
                    "ofType": {
                        "kind": "NON_NULL",
                        "name": null,
                        "ofType": {
                            "kind": "ENUM",
                            "name": "CountryCode",
                            "__typename": "__Type"
                        },
                        "__typename": "__Type"
                    },
                    "__typename": "__Type"
                },
                "__typename": "__Type"
            },
            "__typename": "__Field"
        },
        {
            "name": "shopifyPaymentsAccountId",
            "description": "The shop’s Shopify Payments account id.",
            "args": [],
            "type": {
                "name": "String",
                "kind": "SCALAR",
                "ofType": null,
                "__typename": "__Type"
            },
            "__typename": "__Field"
        },
        {
            "name": "termsOfService",
            "description": "The shop’s terms of service.",
            "args": [],
            "type": {
                "name": "ShopPolicy",
                "kind": "OBJECT",
                "ofType": null,
                "__typename": "__Type"
            },
            "__typename": "__Field"
        }
    ],
    "inputFields": null,
    "__typename": "__Type"
}
