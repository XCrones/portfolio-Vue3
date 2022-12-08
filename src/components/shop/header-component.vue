<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapGetters } from 'vuex';
import ToolsComponent from '@/components/shop/tools-component.vue';
import ProfileComponent from '@/components/shop/profile-component.vue';
import CartComponent from '@/components/shop/cart-component.vue';

export default defineComponent({
  name: 'HeaderCompoentn',
  components: {
    ToolsComponent,
    ProfileComponent,
    CartComponent,
  },
  props: {},
  data() {
    return {
      isOpenhamburger: true,
    };
  },
  methods: {
    ...mapActions({
      toggleCart: 'shop/TOGGLE_CART',
      toggleProfile: 'shop/TOGGLE_PROFILE',
    }),
    toggleHamburger() {
      this.isOpenhamburger = !this.isOpenhamburger;
    },
  },
  computed: {
    ...mapGetters({
      unprsingCart: 'shop/profile/UNPARSING_CART',
      isHideCart: 'shop/CART_IS_HIDE',
      isHideProfile: 'shop/PROFILE_IS_HIDE',
      isAuth: 'auth/IS_AUTH',
    }),
    sumCart(): number {
      return this.unprsingCart.length;
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  mounted() {},
});
</script>

<template>
  <div class="h-full w-full bg-purple-800 flex flex-col relative z-30">
    <nav class="h-full w-full flex flex-row justify-between items-center px-2 rounded-sm relative">
      <div class="text-xl title">
        <div class="first-letter:uppercase cursor-pointer">fake store</div>
      </div>
      <div class="flex-auto hidden sm:block">
        <ToolsComponent />
      </div>
      <div class="sm:hidden">
        <button
          @click="toggleHamburger()"
          type="button"
          class="btn-hamburger transition-all duration-300 text-2xl"
          :class="{ 'scale-150': !isOpenhamburger }"
        >
          <i class="bi bi-list"></i>
        </button>
      </div>
      <div class="flex flex-row items-center gap-x-3 text-[35px]">
        <div class="">
          <button type="button" class="btn-profile" @click="toggleProfile()">
            <i class="bi bi-person-check" v-if="isAuth"></i>
            <i class="bi bi-person-x" v-else></i>
          </button>
        </div>
        <div class="">
          <button @click="toggleCart()" type="button" class="relative btn-cart">
            <div
              class="absolute top-[30%] left-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center font-bold"
            >
              <div class="text-sm bg-white text-black px-1 rounded-full" v-if="sumCart > 0">
                {{ sumCart }}
              </div>
            </div>
            <i class="bi bi-cart2"></i>
          </button>
        </div>
      </div>
      <div
        :class="{ 'opacity-0 -right-full': isHideCart, 'opacity-1 right-0': !isHideCart }"
        class="absolute -bottom-1 translate-y-full w-full sm:w-96 bg-purple-800 z-20 transition-all ease-[cubic-bezier(0.35, 0, 0.25, 1)] duration-[400ms]"
      >
        <CartComponent @showProfile="toggleProfile()" @errAuth="toggleProfile()" />
      </div>
      <div
        :class="{ 'opacity-0 -right-full': isHideProfile, 'opacity-1 right-0': !isHideProfile }"
        class="absolute -bottom-1 translate-y-full w-full sm:w-96 bg-purple-800 z-20 transition-all ease-[cubic-bezier(0.35, 0, 0.25, 1)] duration-[400ms]"
      >
        <ProfileComponent />
      </div>
    </nav>
    <div
      :class="{ '-top-[30%] scale-0 opacity-0': isOpenhamburger, 'top-full scale-1 opacity-1': !isOpenhamburger }"
      class="sm:hidden absolute left-0 right-0 transition-all duration-300"
    >
      <ToolsComponent />
    </div>
  </div>
</template>

<style scoped lang="scss">
.title {
  font-family: 'Caladea', serif;
}
.material-icons {
  font-size: 55px;
  height: 55px;
  width: 55px;
}
</style>
