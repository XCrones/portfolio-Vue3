<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters, mapActions } from 'vuex';

export default defineComponent({
  name: 'ProjectsView',
  components: {},
  props: {},
  data() {
    return {};
  },
  methods: {
    ...mapActions({
      setIsHideProjects: 'projects/SET_IS_HIDE',
    }),
  },
  computed: {
    ...mapGetters({
      neon: 'neon/GET_STATE_NEON',
      isHidePorjects: 'projects/IS_HIDE',
    }),
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  mounted() {},
});
</script>

<template>
  <div class="flex-[1_1_100%] h-full w-full text-white">
    <div
      v-if="!isHidePorjects"
      class="projects-items h-full w-full flex flex-col md:flex-row justify-center items-center gap-y-5 py-4 md:py-0 md:gap-x-10"
    >
      <router-link
        class="shadow flex flex-col gap-y-8 justify-center items-center border-solid border border-white rounded-2xl pl-16 pr-9 py-16 relative hover:-translate-x-[25%] md:hover:-translate-x-0 md:hover:-translate-y-10 link"
        routerLink="todo"
        :to="{ name: 'todo' }"
      >
        <span class="text-center uppercase text-2xl relative link__title">todo</span>
        <i class="material-icons w-[64px] text-center !text-6xl">checklist</i>
        <ul class="link__rings">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <div class="link__bookmark"></div>
      </router-link>
      <router-link
        class="flex flex-col gap-y-8 justify-center items-center border-solid border border-white rounded-2xl pl-16 pr-9 py-16 relative hover:-translate-x-[25%] md:hover:-translate-x-0 md:hover:-translate-y-10 link"
        :to="{ name: 'shop' }"
      >
        <span class="text-center uppercase text-2xl relative link__title">shop</span>
        <i class="material-icons w-[64px] text-center !text-6xl">shopping_cart_checkout</i>
        <ul class="link__rings">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <div class="link__bookmark"></div>
      </router-link>
      <router-link
        class="flex flex-col gap-y-8 justify-center items-center border-solid border border-white rounded-2xl pl-16 pr-9 py-16 relative hover:-translate-x-[25%] md:hover:-translate-x-0 md:hover:-translate-y-10 link"
        :to="{ name: 'chat' }"
      >
        <span class="text-center uppercase text-2xl relative link__title">chat</span>
        <i class="material-icons w-[64px] text-center !text-6xl">chat</i>
        <ul class="link__rings">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <div class="link__bookmark"></div>
      </router-link>
    </div>
    <router-view />
  </div>
</template>

<style scoped lang="scss">
$color-bg-hover: #ff00ff;

@mixin transition() {
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@mixin link-bg() {
  background: #11688a;
  background: linear-gradient(50deg, #11688a 0%, #0c2541 72%);
}

.shadow {
  -webkit-box-shadow: 4px 4px 27px -4px rgba(158, 165, 171, 0.2);
  -moz-box-shadow: 4px 4px 27px -4px rgba(158, 165, 171, 0.2);
  box-shadow: 4px 4px 27px -4px rgba(158, 165, 171, 0.2);
}

.link {
  font-family: 'Alkalami', serif;
  @include link-bg();
  @include transition();

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 30px;
    width: 2px;
    height: 100%;
    background-color: #fff;
    @include transition();
  }
  &__title::before {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: #fff;
    @include transition();
  }
  &__title::after {
    content: '';
    position: absolute;
    bottom: -13px;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: #fff;
    @include transition();
  }
  &__rings {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 20%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    row-gap: 15px;
    li {
      height: 13px;
      width: 13px;
      background-color: #afa8a6;
      border-radius: 50%;
      position: relative;
      transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        height: 50%;
        width: 50%;
        border-radius: 50%;
        @include link-bg();
      }
    }
  }
  &__bookmark {
    position: absolute;
    top: 0;
    right: 15px;
    width: 20px;
    height: 40px;
    background-color: #ff0037;
    border-radius: 0 0 5px 5px;
    @include transition();
    &:after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      width: 0;
      height: 0;
      transform: translate(-50%, -100%);
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 20px solid #0c2541;
    }
  }

  &:nth-child(1) {
    animation: show-item 0.7s ease-out;
  }
  &:nth-child(2) {
    animation: show-item 0.5s ease-out;
  }
  &:nth-child(3) {
    animation: show-item 0.3s ease-out;
  }
}

.link:hover {
  @include neon-shadow-box-medium($color-bg-hover);

  &::before,
  .link__title::before,
  .link__title::after,
  .link__rings > li {
    background-color: $color-bg-hover;
    @include neon-shadow-box-light($color-bg-hover);
  }
  .material-icons {
    @include neon-shadow-text-light($color-bg-hover);
  }
  .link__bookmark {
    background-color: $color-bg-hover;
  }
}

@keyframes show-item {
  0% {
    opacity: 0;
    transform: translateX(-50%);
  }
  100% {
    opacity: 1;
    transform: translateX(0%);
  }
}
</style>
