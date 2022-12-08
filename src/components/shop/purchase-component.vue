<script lang="ts">
import { PaginatorV2Service } from '@/ui/pahinatorV2/paginator-service';
import { Subscription } from 'rxjs';
import { defineComponent } from 'vue';
import { mapGetters, mapActions } from 'vuex';

export default defineComponent({
  name: 'PurchaseComponent',
  components: {},
  props: {},
  data() {
    return {
      paginator: new PaginatorV2Service(),
      titleLength: 30,
      purchase$: new Subscription(),
      purchase: {},
    };
  },
  methods: {
    ...mapActions({
      close: 'shop/purchase/CLOSE',
    }),

    exit() {
      this.close();
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
      getPurchase: 'shop/purchase/PURCHASE',
      slicePrice: 'shop/SLICE_PRICE',
      titleSlice: 'shop/SLICE_TITLE',
    }),
  },
  mounted() {
    addEventListener('resize', (event: any) => this.onResize(event), true);
    this.purchase$ = this.getPurchase.subscribe((observer: any) => {
      this.purchase = observer;
    });
  },
  unmounted() {
    removeEventListener('resize', (event: any) => this.onResize(event), true);
    this.purchase$.unsubscribe();
  },
});
</script>

<template>
  <div class="h-full w-full px-2 py-2 flex flex-col justify-between gap-y-3">
    <div class="flex flex-row justify-between items-center">
      <h3 class="capitalize text-lg">{{ purchase.date }}</h3>
      <h3 class="capitalize text-lg">
        {{ slicePrice(purchase.price) }}
      </h3>
    </div>
    <div class="flex-auto h-full flex flex-col gap-y-2">
      <div
        class="flex flex-row justify-between items-center gap-x-3 px-2 bg-white text-black p-1 rounded-md"
        v-for="(item, idx) of paginator.parse(purchase.items)"
        :key="idx"
      >
        <div class="w-12 h-[50px]">
          <img class="max-w-full max-h-full" :src="item.image" :alt="'product.image'" />
        </div>
        <div class="flex-auto flex flex-col justify-between">
          <div class="font-semibold first-letter:uppercase text-sm sm:text-base">
            {{ item.title.length > titleLength ? titleSlice(item.title, titleLength) : item.title }}
          </div>
          <div class="flex flex-row justify-between">
            <div class="text-xs leading-6 sm:text-base">
              <span class="capitalize">count:&nbsp;</span>
              <span class="font-semibold">{{ item.count }}</span>
            </div>
            <div class="font-semibold text-xs leading-6 sm:text-base">
              {{ slicePrice(item.price * item.count) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-row justify-center items-center gap-1">
      <button
        @click="paginator.setCurrPage(idx)"
        type="button"
        class="btn-page border-0 bg-gray-600 w-7 h-7 text-center rounded-sm transition-all duration-300 flex justify-center items-center"
        :class="{ 'link-active': paginator.isEqualPage(idx) }"
        v-for="(page, idx) of paginator.pages(purchase.items)"
        :key="idx"
      >
        {{ idx + 1 }}
      </button>
    </div>
    <div class="w-full text-center">
      <button
        @click="exit()"
        type="button"
        class="btn-back bg-sky-700 w-full h-7 text-white hover:bg-sky-500 rounded-md transition-all duration-300"
      >
        назад
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.link-active {
  background-color: rgb(2, 132, 199);
}
</style>
