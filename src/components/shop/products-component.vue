<script lang="ts">
import { IProductsV2 } from '@/store/modules/shop/products';
import { PaginatorV2Service } from '@/ui/pahinatorV2/paginator-service';
import { Subscription } from 'rxjs';
import { defineComponent } from 'vue';
import { mapGetters, mapActions } from 'vuex';

export default defineComponent({
  name: 'ProductsComponent',
  components: {},
  props: {},
  data() {
    return {
      paginator: new PaginatorV2Service(),
      productsV2$: Subscription,
      productsV2: [],
    };
  },
  methods: {
    ...mapActions({
      addToCart: 'shop/profile/ADD_CART',
      show: 'shop/popup/SHOW',
      toggleCart: 'shop/TOGGLE_CART',
      tryProfile: 'shop/profile/TRY_PROFILE',
      tryProducts: 'shop/products/TRY_PRODUCTS',
    }),
    addCart(item: IProductsV2) {
      this.addToCart(item);
    },

    isHidePopup(item: IProductsV2) {
      this.show(item);
    },

    calcRate(rate: number): number {
      return (rate * 100) / 5;
    },
    sorting(arr: IProductsV2[]): IProductsV2[] {
      let filter = this.currFilter;
      let stateFilter = this.stateCurrFilter;
      switch (filter) {
        case 'цене':
          return arr.sort((a, b) => (stateFilter ? a.price - b.price : b.price - a.price));
        case 'рейтингу':
          return arr.sort((a, b) => (stateFilter ? a.rating.rate - b.rating.rate : b.rating.rate - a.rating.rate));
        case 'остатку':
          return arr.sort((a, b) => (stateFilter ? a.rating.count - b.rating.count : b.rating.count - a.rating.count));
        default:
          return arr;
      }
    },
    showCart() {
      this.toggleCart();
    },
    async initProducts() {
      await this.tryProducts();
      await this.tryProfile();
      this.productsV2$ = await this.getAll.subscribe((observer: any) => {
        this.productsV2 = observer;
      });
    },
  },
  computed: {
    ...mapGetters({
      getAll: 'shop/products/GET_ALL',
      neon: 'neon/GET_STATE_NEON',
      search: 'shop/products/SEARCH',
      isInCart: 'shop/profile/IS_IN_CART',
      currFilter: 'shop/products/CURR_FILTER',
      stateCurrFilter: 'shop/products/STATE_CURR_FILTER',
      slicePrice: 'shop/SLICE_PRICE',
      titleSlice: 'shop/SLICE_TITLE',
    }),
    isSearch(): boolean {
      return this.search.length < 1 ? false : true;
    },
    parseProducts(): IProductsV2[] {
      return !this.isSearch ? this.paginator.parse(this.productsV2Sorting) : this.productsV2Sorting;
    },
    productsV2Sorting(): IProductsV2[] {
      return this.sorting(this.productsV2);
    },
    transformProducts(): IProductsV2[] {
      return this.parseProducts.filter((v) => v.title.toLowerCase().trim().includes(this.search.toLowerCase().trim()));
    },
  },
  beforeMount() {
    this.paginator.init(8);
    this.initProducts();
  },
});
</script>

<template>
  <div class="w-full h-full border-separate border-spacing-y-2 relative">
    <div class="h-full w-full flex flex-col gap-y-4 sm:flex-row">
      <div class="flex-auto flex flex-row flex-wrap gap-3 justify-center items-center">
        <div
          class="show-item flex-[0_1_290px] h-44 flex flex-col justify-between p-2 rounded-lg bg-white text-black transition-all duration-200"
          v-for="(product, idx) of transformProducts"
          :key="idx"
        >
          <div class="flex flex-row h-full gap-x-2 justify-between items-center">
            <div class="flex-[0_1_50%] h-full flex flex-col gap-y-2 justify-evenly">
              <div class="underline underline-offset-4 font-bold">
                {{ slicePrice(product.price) }}
              </div>
              <div class="font-semibold first-letter:uppercase text-xs">
                {{ product.title.length > 50 ? titleSlice(product.title, 50) : product.title }}
              </div>
              <div class="flex flex-row items-center justify-center gap-x-1 text-md">
                <div class="capitalize flex-[0_1_50%]">rate:</div>
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
            </div>
            <div class="flex-[0_1_50%] h-[100px] flex justify-center items-center overflow-hidden">
              <img class="max-w-full max-h-full" :src="product.image" :alt="'product.image'" />
            </div>
          </div>
          <div class="flex flex-row items-center gap-x-2">
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
                @click="showCart()"
                type="button"
                class="btn-cart bg-orange-700 w-full h-7 text-white hover:bg-orange-500 rounded-md transition-all duration-300"
                v-else
              >
                в корзине
              </button>
            </div>
            <div class="flex-[0_1_50%] text-center">
              <button
                @click="isHidePopup(product)"
                type="button"
                class="btn-about bg-sky-800 w-full h-7 text-white hover:bg-sky-500 rounded-md transition-all duration-300"
              >
                подробнее
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-row sm:flex-col justify-center items-center gap-1" v-if="!isSearch">
        <button
          type="button"
          class="btn-page border-0 bg-gray-600 w-7 h-7 text-center rounded-sm transition-all duration-300 flex justify-center items-center"
          :class="{ 'link-active': paginator.isEqualPage(idxPage) }"
          v-for="(page, idxPage) of paginator.pages(productsV2)"
          :key="idxPage"
          @click="paginator.setCurrPage(idxPage)"
        >
          {{ idxPage + 1 }}
        </button>
      </div>
    </div>
    <div
      v-if="productsV2.length === 0"
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
    >
      <img :src="require(`@/assets/img/load.svg`)" alt="load" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.link-active {
  background-color: rgb(2, 132, 199);
}
.font {
  font-family: Arial, Helvetica, sans-serif;
}
.material-icons {
  font-size: 55px;
  height: 55px;
  width: 55px;
}
.show-item {
  animation: show-item 0.2s cubic-bezier(0.39, 0.575, 0.565, 1);
}
@keyframes show-item {
  0% {
    scale: 0;
  }
  100% {
    scale: 1;
  }
}
</style>
