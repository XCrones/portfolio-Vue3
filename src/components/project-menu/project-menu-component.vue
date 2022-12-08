<script lang="ts">
import { IBoxShadow } from '@/ui/directives/box-neon-directive';
import { ITextShadow } from '@/ui/directives/text-neon-directive';
import { mapGetters, mapActions } from 'vuex';
import { defineComponent, PropType } from 'vue';
import { IProjectMenu } from '@/store/modules/project-menu/project-menu-module';

export default defineComponent({
  name: 'ProjectMenuComponent',
  components: {},
  props: {
    metaData: {
      type: Object as PropType<IProjectMenu>,
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions({
      headerSetHide: 'header/SET_HIDE',
      infoToggleHide: 'info/TOGGLE_IS_HIDE',
    }),
    navBack() {
      this.$router.push('/projects');
    },
    toggleHideHeader() {
      this.headerSetHide(!this.headerIsHide);
    },
    showAbout() {
      this.infoToggleHide();
    },
  },
  computed: {
    ...mapGetters({
      headerIsHide: 'header/IS_HIDE',
      infoIsHide: 'info/IS_HIDE',
      neon: 'neon/GET_STATE_NEON',
    }),
    metaBoxShadow(): IBoxShadow {
      return {
        color: this.metaData.color,
        style: 'light',
        neon: this.neon,
        hover: false,
      };
    },
    metaTextShadow(): ITextShadow {
      return {
        isNeon: this.neon,
        color: this.metaData.color,
        colorShadow: this.metaData.color,
        styleShadow: 'medium',
        isSetColor: true,
        isHover: true,
      };
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  mounted() {},
});
</script>

<template>
  <div class="flex flex-row justify-between items-center py-4 px-2">
    <div class="p-1">
      <button
        @click="navBack()"
        v-textShadow="metaTextShadow"
        v-boxShadow="metaBoxShadow"
        class="btn-back h-[35px] md:h-[50px] w-[50px] md:w-[70px] transition-all duration-300 border-2 border-solid border-sky-500 rounded-xl md:rounded-2xl"
      >
        <i class="bi bi-arrow-left text-2xl md:text-4xl"></i>
      </button>
    </div>
    <div class="uppercase gap-x-1 md:gap-x-3 select-none text-2xl md:text-4xl">
      <span class="title inline-block tracking-[2px] pr-1 md:pr-2">
        {{ metaData.title }}
      </span>
      <button
        @click="toggleHideHeader()"
        class="btn-hide inline-block w-[36px] h-[36px] transition-all duration-300"
        v-rotateShadow="{
          color: metaData.color,
          colorShadow: metaData.color,
          styleShadow: 'medium',
          isRotate: !headerIsHide,
          isNeon: neon,
          isFixedShadow: true,
          isHover: true,
          isFixedColor: true,
        }"
      >
        <i class="bi bi-chevron-double-down leading-2"></i>
      </button>
    </div>
    <div class="text-2xl md:text-3xl">
      <button
        @click="showAbout()"
        class="btn-about inline-block w-[30px] h-[30px] transition-all duration-300 leading-4 mr-1 md:mr-2"
        v-rotateShadow="{
          color: metaData.color,
          colorShadow: metaData.color,
          styleShadow: 'medium',
          isRotate: !infoIsHide,
          isNeon: neon,
          isFixedShadow: true,
          isHover: true,
          isFixedColor: true,
        }"
      >
        <i class="bi bi-info-circle"></i>
      </button>
      <a
        :href="metaData.link"
        v-textShadow="metaTextShadow"
        target="_blank"
        class="inline-block w-[30px] h-[30px] transition-all duration-300 leading-4"
      >
        <i class="bi bi-link-45deg"></i>
      </a>
    </div>
  </div>
</template>

<style scoped lang="scss">
.title {
  font-family: 'Fjalla One', sans-serif;
}
</style>
