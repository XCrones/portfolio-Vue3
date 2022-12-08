<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapGetters } from 'vuex';
import ProjectMenuComponent from '@/components/project-menu/project-menu-component.vue';
import InfoComponent from '@/components/info/info-component.vue';
import ProductsComponent from '@/components/shop/products-component.vue';
import PopupComponent from '@/components/shop/popup-compoennt.vue';
import HeaderComponent from '@/components/shop/header-component.vue';

export default defineComponent({
  name: 'ShopView',
  components: {
    ProjectMenuComponent,
    InfoComponent,
    ProductsComponent,
    PopupComponent,
    HeaderComponent,
  },
  props: {},
  data() {
    return {
      metaMenu: {
        link: 'https://github.com/XCrones/portfolio-Vue3/tree/main/src/views/shop',
        title: 'shop',
        color: '#00c3ff',
      },
    };
  },
  methods: {
    ...mapActions({
      setIsHideProjects: 'projects/SET_IS_HIDE',
      isHideHeader: 'header/SET_HIDE',
    }),
  },
  computed: {
    ...mapGetters({
      isHidePopup: 'shop/popup/IS_HIDE',
      isHideInfo: 'info/IS_HIDE',
      aboutData: 'shop/about/ABOUT_PROJECT',
    }),
  },
  mounted() {
    this.setIsHideProjects(true);
    this.isHideHeader(true);
  },
  unmounted() {
    this.setIsHideProjects(false);
    this.isHideHeader(false);
  },
});
</script>

<template>
  <div class="h-full w-full flex flex-col px-2 pb-3">
    <ProjectMenuComponent :metaData="metaMenu" />
    <div class="flex flex-col relative w-full h-full gap-y-5">
      <div class="h-22 md:h-14">
        <HeaderComponent />
      </div>
      <div class="flex-auto h-full w-full">
        <ProductsComponent />
      </div>
      <div
        :class="{ 'opacity-0 scale-0': isHidePopup, 'opacity-1 scale-1': !isHidePopup }"
        class="absolute top-0 left-0 w-full h-full bg-[#29557979] z-50 transition-all duration-300 ease-show-elem"
      >
        <PopupComponent />
      </div>
      <div
        :class="{ 'opacity-0 scale-0': isHideInfo, 'opacity-1 scale-1': !isHideInfo }"
        class="absolute top-0 left-0 w-full h-full bg-[#29557979] z-50 transition-all duration-300 ease-show-elem"
      >
        <InfoComponent :info="aboutData" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
