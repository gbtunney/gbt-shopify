<template>
  <div class="product-swiper-wrapper" >
    <swiper class="background-brand-mint" ref="mySwiper" :options="swiperOptions">
      <swiper-slide v-for="image,index in Images" :key="index">
          <img :data-src="image.getSrc(1200)" :alt="image.title" class="swiper-lazy">
      </swiper-slide>
    </swiper>
    <div v-if="Images" :class="Images.length < 1 ? 'hidden' : ''"
        class="product-swiper-navigation absolute">
      <button class="btn-button-next hover:bg-accent-secondary  disabled:opacity-50 disabled:bg-accent-primary ">< Right</button>
      <button class="btn-button-prev disabled:bg-accent-primary disabled:opacity-50 disabled:bg-accent-primary ">Left ></button>
    </div>
  </div>
</template>

<script>
import {Swiper, SwiperSlide} from 'vue-awesome-swiper'
import 'swiper/swiper.min.css'
//import "swiper/components/zoom/zoom.min.css"
//import "swiper/components/navigation/navigation.min.css"
//import "swiper/components/pagination/pagination.min.css"
import "swiper/components/lazy/lazy.min.css"
// import Swiper core and required modules
import SwiperCore, {Lazy,
  Zoom,Navigation,Pagination
} from 'swiper/core';

// install Swiper modules
SwiperCore.use([Navigation,Pagination,Lazy]);

//lazy loader: data-src
export default {
  name: "App",
  components: {
    Swiper,
    SwiperSlide
  },
  props: {
    images: {
      type: [Array, Boolean],
      default: () => []
    },
    index: {
      type: Number,
      default: 1
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.$swiper
    },
    Images() {
      return this.$props.images;
    },
  },
  watch: {
    index: function (value) {
      this.goToImageIndex(value);
    }
  },
  methods: {
    goToImageIndex: function (index) {
      if (this.swiper.activeIndex != (index - 1)) this.swiper.slideTo((index - 1), 0, false)
      else return;
    },
  },
  data: function () {
    return {
      swiperOptions: {
        navigation: {
          nextEl: ".btn-button-next",
          prevEl: ".btn-button-prev",
        },
        /* pagination: {
           el: '.swiper-pagination'
         },*/
        centeredSlides: true,
        slidesPerView: 1,
        preloadImages: false,
        // Enable lazy loading
        lazy: {
          loadPrevNext: true,
        },
        //spaceBetween: 0,
      }
    }
  }
}
</script>
<style lang="postcss" type="text/css" scoped>
>>> .swiper-wrapper{
  height:100%;
  max-height: 100vh;
}
>>> .swiper-slide {
  height:auto;
}
>>> .swiper-slide>img {
  width: 100%;height: 100%;
  object-fit: contain;
}
</style>
