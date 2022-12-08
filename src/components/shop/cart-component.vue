<script lang="ts">
import { PaginatorV2Service } from '@/ui/pahinatorV2/paginator-service';
import { defineComponent } from 'vue';
import { mapGetters, mapActions } from 'vuex';

export default defineComponent({
  name: 'CartComponent',
  components: {},
  props: {},
  data() {
    return {
      paginator: new PaginatorV2Service(),
      titleLength: 30,
    };
  },
  methods: {
    ...mapActions({
      closeCart: 'shop/TOGGLE_CART',
      decrementItem: 'shop/profile/DECREMENT',
      incrementItem: 'shop/profile/INCREMENT',
      deleteItem: 'shop/profile/DELETE_ITEM',
      buyCart: 'shop/profile/BUY',
    }),

    buy() {
      if (this.isAuth) {
        if (this.cart.length > 0) {
          this.buyCart();
          this.$emit('showProfile');
        }
      } else {
        this.$emit('errAuth');
      }
    },

    onResize(event: any) {
      const width = event.target['innerWidth'];
      if (width != undefined) {
        if (width < 640) {
          this.titleLength = 15;
        } else {
          this.titleLength = 30;
        }
      }
    },
  },
  computed: {
    ...mapGetters({
      neon: 'neon/GET_STATE_NEON',
      cart: 'shop/profile/UNPARSING_CART',
      totalPrice: 'shop/profile/TOTAL_PRICE',
      isLoadData: 'shop/profile/IS_LOAD_CART',
      isAuth: 'auth/IS_AUTH',
      slicePrice: 'shop/SLICE_PRICE',
      titleSlice: 'shop/SLICE_TITLE',
    }),
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  mounted() {
    addEventListener('resize', (event: any) => this.onResize(event), true);
  },
  unmounted() {
    removeEventListener('resize', (event: any) => this.onResize(event), true);
  },
});
</script>

<template>
  <div class="h-[400px] w-full px-2 py-2 flex flex-col gap-y-3">
    <div class="flex flex-row justify-between items-center">
      <h3 class="flex-auto flex justify-center capitalize text-lg">корзина</h3>
      <button
        v-textShadow="{
          isNeon: this.neon,
          color: '',
          colorShadow: '#fff',
          styleShadow: 'medium',
          isSetColor: true,
          isHover: true,
        }"
        type="button"
        class="btn-close text-xl transition-all duration-300"
        @click="closeCart()"
      >
        <i class="bi bi-arrow-right-square"></i>
      </button>
    </div>
    <div class="flex-auto flex flex-col gap-y-2 relative">
      <div class="h-full flex justify-center items-center" v-if="cart.length < 1">
        <span v-if="!isLoadData" class="first-letter:uppercase">корзина пуста..</span>
      </div>
      <div v-if="isLoadData" class="absolute top-0 left-0 w-full h-full flex justify-center items-center">
        <div class="h-24 w-24">
          <img class="max-h-full max-w-full" :src="require(`@/assets/img/load.svg`)" alt="load" />
        </div>
      </div>
      <div
        class="flex flex-row justify-between items-center gap-x-3 px-2 bg-white text-black p-1 rounded-md"
        v-for="(item, idx) of paginator.parse(cart)"
        :key="idx"
      >
        <div class="w-12 h-[50px]">
          <img class="max-w-full max-h-full" :src="item.product.image" :alt="'product.image'" />
        </div>
        <div class="flex-auto flex flex-col justify-between">
          <div class="font-semibold first-letter:uppercase text-sm">
            {{
              item.product.title.length > titleLength ? titleSlice(item.product.title, titleLength) : item.product.title
            }}
          </div>
          <div class="flex flex-row justify-between">
            <div class="flex-auto flex flex-row items-center">
              <button
                v-textShadow="{
                  isNeon: this.neon,
                  color: '',
                  colorShadow: '#dc2626',
                  styleShadow: 'medium',
                  isSetColor: true,
                  isHover: true,
                }"
                @click="decrementItem(item.product.id)"
                type="button"
                class="btn-decr text-red-600 text-lg transition-all duration-300"
              >
                <i class="bi bi-dash-square-fill"></i>
              </button>
              <div class="flex-[0_1_40px] text-center font-semibold">
                <span>{{ item.count }}</span>
              </div>
              <button
                v-textShadow="{
                  isNeon: this.neon,
                  color: '',
                  colorShadow: '#16a34a',
                  styleShadow: 'medium',
                  isSetColor: true,
                  isHover: true,
                }"
                @click="incrementItem(item.product.id)"
                type="button"
                class="btn-incr text-green-600 text-lg transition-all duration-300"
              >
                <i class="bi bi-plus-square-fill"></i>
              </button>
            </div>
            <div class="font-semibold text-xs leading-6 sm:text-base">
              {{ slicePrice(item.count * item.product.price) }}
            </div>
          </div>
        </div>
        <div class="">
          <button
            v-textShadow="{
              isNeon: this.neon,
              color: '',
              colorShadow: '#991b1b',
              styleShadow: 'medium',
              isSetColor: true,
              isHover: true,
            }"
            @click="deleteItem(item.product.id)"
            type="button"
            class="btn-delete text-red-800 text-2xl transition-all duration-300"
          >
            <i class="bi bi-x-square-fill"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="flex flex-row justify-center items-center gap-1">
      <button
        @click="paginator.setCurrPage(idx)"
        type="button"
        class="btn-page border-0 bg-gray-600 w-7 h-7 text-center rounded-sm transition-all duration-300 flex justify-center items-center"
        :class="{ 'link-active': paginator.isEqualPage(idx) }"
        v-for="(page, idx) of paginator.pages(cart)"
        :key="idx"
      >
        {{ idx + 1 }}
      </button>
    </div>
    <div class="flex flex-row items-center gap-x-3">
      <div class="flex-[0_1_50%] text-center">
        <button
          @click="buy()"
          type="button"
          class="btn-buy w-full h-7 text-white rounded-md transition-all duration-300"
          :class="{
            'bg-orange-700 hover:bg-orange-500': cart.length > 0,
            'bg-slate-600 cursor-not-allowed': cart.length < 1,
          }"
        >
          оформить
        </button>
      </div>
      <div class="flex-[0_1_50%] text-center">
        <div class="border border-solid border-white rounded-md">
          {{ slicePrice(totalPrice) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.link-active {
  background-color: rgb(2, 132, 199);
}
</style>
