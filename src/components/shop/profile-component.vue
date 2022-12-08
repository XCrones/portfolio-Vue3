<script lang="ts">
import { IPurchasesItem } from '@/store/modules/shop/purchase-module';
import { PaginatorV2Service } from '@/ui/pahinatorV2/paginator-service';
import { defineComponent } from 'vue';
import { mapGetters, mapActions } from 'vuex';
import AuthComponent from '@/components/auth/auth-component.vue';
import PurchaseComponent from '@/components/shop/purchase-component.vue';
import { Subscription } from 'rxjs';

export default defineComponent({
  name: 'ProfileComponent',
  components: {
    AuthComponent,
    PurchaseComponent,
  },
  props: {},
  data() {
    return {
      paginator: new PaginatorV2Service(),
    };
  },
  methods: {
    ...mapActions({
      profileSignOut: 'shop/profile/PROFILE_SIGN_OUT',
      openPurchase: 'shop/purchase/OPEN',
      toggleProfile: 'shop/TOGGLE_PROFILE',
      tryProfile: 'shop/profile/TRY_PROFILE',
    }),

    signOut() {
      this.profileSignOut();
    },

    totalPrice(item: IPurchasesItem): number {
      return item.products.reduce(function (sum, current) {
        return sum + current.price * current.count;
      }, 0);
    },

    isCloseProfile() {
      this.toggleProfile();
    },

    onResize(event: any) {
      const width = event.target['innerWidth'];
      if (width != undefined) {
        if (width < 640) {
          this.paginator.init(6);
        } else {
          this.paginator.init(5);
        }
      }
    },
  },
  computed: {
    ...mapGetters({
      neon: 'neon/GET_STATE_NEON',
      purchases: 'shop/profile/PURCHASES',
      purchaseIsHide: 'shop/purchase/IS_HIDE',
      isAuth: 'auth/IS_AUTH',
      isLoadData: 'shop/profile/IS_LOAD_PURCHASES',
      userData: 'auth/USER_DATA',
      titleSlice: 'shop/SLICE_TITLE',
      slicePrice: 'shop/SLICE_PRICE',
    }),
    userName(): string {
      // eslint-disable-next-line no-extra-boolean-cast
      return !!this.userData['name'] ? this.userData['name'] : '';
    },
  },
  mounted() {
    addEventListener('resize', (event: any) => this.onResize(event), true);
  },
  unmounted() {
    removeEventListener('resize', (event: any) => this.onResize(event), true);
  },
});
</script>

<template>
  <div class="h-[400px] w-full px-2 py-2 flex flex-col justify-between gap-y-3" v-if="purchaseIsHide && isAuth">
    <div class="flex flex-row justify-between items-center">
      <h3 class="capitalize">{{ userName }}</h3>
      <h3 class="capitalize text-lg">профиль</h3>
      <button
        v-textShadow="{
          isNeon: this.neon,
          color: '',
          colorShadow: '#fff',
          styleShadow: 'medium',
          isSetColor: true,
          isHover: true,
        }"
        class="btn-close text-xl transition-all duration-300"
        @click="isCloseProfile()"
      >
        <i class="bi bi-arrow-right-square"></i>
      </button>
    </div>
    <div class="flex-[0_1_100%] flex flex-col gap-y-2 relative">
      <div class="h-full flex justify-center items-center" v-if="purchases.length < 1">
        <span v-if="!isLoadData" class="first-letter:uppercase">нет покупок..</span>
        <div v-if="isLoadData" class="absolute top-0 left-0 w-full h-full flex justify-center items-center">
          <div class="h-24 w-24">
            <img class="max-h-full max-w-full" :src="require(`@/assets/img/load.svg`)" alt="load" />
          </div>
        </div>
      </div>
      <button
        @click="openPurchase(item)"
        class="btn-purchase flex flex-row justify-between items-center gap-x-3 py-[10px] px-2 bg-white text-black rounded-md text-xs md:text-base"
        v-for="(item, idx) of paginator.parse(purchases)"
        :key="idx"
      >
        <div class="">{{ item.date }}</div>
        <div class="font-semibold">
          {{ slicePrice(totalPrice(item)) }}
        </div>
      </button>
    </div>
    <div class="flex flex-row justify-center items-center gap-1">
      <button
        @click="paginator.setCurrPage(idx)"
        type="button"
        class="btn-page border-0 bg-gray-600 w-7 h-7 text-center rounded-sm transition-all duration-300 flex justify-center items-center"
        :class="{ 'link-active': paginator.isEqualPage(idx) }"
        v-for="(page, idx) of paginator.pages(purchases)"
        :key="idx"
      >
        {{ idx + 1 }}
      </button>
    </div>
    <div class="w-full text-center">
      <button
        @click="signOut()"
        type="button"
        class="btn-signout bg-sky-700 w-full h-7 text-white hover:bg-sky-500 rounded-md transition-all duration-300"
      >
        выйти
      </button>
    </div>
  </div>
  <div class="w-full h-[400px]" v-if="!purchaseIsHide && isAuth">
    <PurchaseComponent />
  </div>
  <div class="w-full h-full" v-if="!isAuth">
    <AuthComponent
      :showBtnClose="true"
      :callbackTryProfile="tryProfile"
      @closeWindow="isCloseProfile()"
    ></AuthComponent>
  </div>
</template>

<style scoped lang="scss">
.link-active {
  background-color: rgb(2, 132, 199);
}
</style>
