/* eslint-disable */
import {Model} from '@vuex-orm/core'
import {getRandomNumber} from "../scripts/generic";

export default class ProductMetaAttr extends Model {

    static fields() {
        return {
            id: this.number(() => getRandomNumber(10000000)),
            handle: this.string(null),
            value: this.attr(null),
            title: this.string(null), ///IDK MAYBE NOT
        }
    }
}

ProductMetaAttr.entity = 'productmetaattrs';

/*  PRODUCT META LOOKUP???

??????     "notforsale": true,

       reccomended:{
       id
       handle
       value

     }
     reccomended:[
     {
       id: generated
       handle: "kit"
       value: "yarn-for-andorra-wrap"
     },
      {
       id: generated
       handle: "yarn"
       value: "classic-worsted"
     }
    ]
    download:[
     {
       id: generated
       handle: "ravelry"
       value: ""https://www.ravelry.com/patterns/library/anika-6"
     }
     ]*/
