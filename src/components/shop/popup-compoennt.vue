<script lang="ts">
import { ITextShadow } from '@/ui/directives/text-neon-directive';
import { IProductsV2 } from '@/store/modules/shop/products';
import { defineComponent } from 'vue';
import { mapGetters, mapActions } from 'vuex';

export default defineComponent({
  name: 'PopupComponent',
  components: {},
  props: {},
  data() {
    return {};
  },
  methods: {
    ...mapActions({
      addToCart: 'shop/profile/ADD_CART',
      toggleCart: 'shop/TOGGLE_CART',
      close: 'shop/popup/CLOSE',
    }),
    addCart(item: IProductsV2) {
      this.addToCart(item);
    },
    calcRate(rate: number): number {
      return (rate * 100) / 5;
    },
    calcCount(count: number): number {
      return (count * 100) / 1000;
    },
    closePopup() {
      this.close();
    },
    onKeyDown(event: any) {
      if (!!event && event['key'] === 'Escape') {
        this.closePopup();
      }
    },
  },
  computed: {
    ...mapGetters({
      isInCart: 'shop/profile/IS_IN_CART',
      slicePrice: 'shop/SLICE_PRICE',
      neon: 'neon/GET_STATE_NEON',
      product: 'shop/popup/PRODUCT',
    }),
    metaTextShadow(): ITextShadow {
      return {
        isNeon: this.neon,
        color: '',
        colorShadow: '#fff',
        styleShadow: 'medium',
        isSetColor: true,
        isHover: true,
      };
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  mounted() {
    addEventListener('keydown', (event: any) => this.onKeyDown(event), true);
  },
  unmounted() {
    removeEventListener('keydown', (event: any) => this.onKeyDown(event), true);
  },
});
</script>

<template>
  <div
    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-1/2 md:w-5/12 lg:w-[30%] bg-[rgba(31,39,56,0.98)] rounded-2xl"
  >
    <div class="h-full w-full flex flex-col p-2 gap-y-4 font">
      <div class="flex flex-row justify-end items-center relative horizontal-line">
        <button
          v-textShadow="metaTextShadow"
          class="btn-close transition-all duration-500 text-xl lg:text-2xl"
          @click="closePopup()"
          type="button"
        >
          <i class="bi bi-x-octagon"></i>
        </button>
      </div>
      <div class="flex flex-row gap-x-3 items-center bg-white text-black p-2 rounded-lg">
        <div class="flex-[0_1_30%]">
          <div class="w-[100px] h-[100px] flex justify-center items-center">
            <img class="max-w-full max-h-full" :src="product.image" :alt="'image'" />
          </div>
        </div>
        <div class="flex-auto">
          <div class="font-semibold first-letter:uppercase text-sm">
            {{ product.title }}
          </div>
        </div>
      </div>
      <div class="bg-white text-black p-2 rounded-lg">
        <div class="flex flex-col justify-between gap-y-1 text-sm min-h-[150px]">
          <div class="text-sm first-letter:uppercase">
            {{ product.description }}
          </div>
          <div class="w-full h-full">
            <div class="flex flex-row items-center justify-center gap-x-1 text-md">
              <div class="capitalize flex-[0_1_40%]">rate:</div>
              <div class="relative border border-solid border-slate-500 h-3 w-full flex-auto rounded-sm">
                <div
                  class="h-full absolute"
                  :style="{ width: calcRate(product.rating.rate) + '%' }"
                  :class="{
                    'bg-red-600': product.rating.rate < 1.6,
                    'bg-yellow-600': product.rating.rate >= 1.6 && product.rating.rate < 3.2,

                    'bg-green-600': product.rating.rate >= 3.2,
                  }"
                ></div>
                <div
                  class="absolute top-1/2 left-1/3 h-full w-[2px] bg-slate-500 -translate-y-1/2 -translate-x-1/2"
                ></div>
                <div
                  class="absolute top-1/2 left-2/3 h-full w-[2px] bg-slate-500 -translate-y-1/2 -translate-x-1/2"
                ></div>
              </div>
            </div>
            <div class="flex flex-row items-center justify-center gap-x-1 text-md">
              <div class="capitalize flex-[0_1_40%]">count:</div>
              <div class="relative border border-solid border-slate-500 h-3 w-full flex-auto rounded-sm">
                <div
                  class="h-full absolute"
                  :style="{ width: calcCount(product.rating.count) + '%' }"
                  :class="{
                    'bg-red-600': product.rating.count < 333,
                    'bg-yellow-600': product.rating.count >= 333 && product.rating.count < 667,

                    'bg-green-600': product.rating.count >= 667,
                  }"
                ></div>
                <div
                  class="absolute top-1/2 left-1/3 h-full w-[2px] bg-slate-500 -translate-y-1/2 -translate-x-1/2"
                ></div>
                <div
                  class="absolute top-1/2 left-2/3 h-full w-[2px] bg-slate-500 -translate-y-1/2 -translate-x-1/2"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-row items-center gap-x-3">
        <div class="flex-[0_1_50%] text-center">
          <button
            @click="addCart(product)"
            type="button"
            class="btn-buy bg-green-800 w-full h-7 text-white hover:bg-green-500 rounded-md transition-all duration-300"
            v-if="!isInCart(product.id)"
          >
            купить
          </button>
          <button
            type="button"
            class="bg-orange-700 w-full h-7 text-white hover:bg-orange-500 rounded-md transition-all duration-300"
            v-else
          >
            в корзине
          </button>
        </div>
        <div class="flex-[0_1_50%] text-center">
          <div class="price border border-solid border-white rounded-md">
            {{ slicePrice(product.price) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.font {
  font-family: Arial, Helvetica, sans-serif;
}
</style>
