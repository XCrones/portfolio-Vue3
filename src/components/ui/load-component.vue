<script lang="ts">
import { defineComponent, PropType } from 'vue';

export interface ILoadMeta {
  color: string;
  style: string;
  neon: boolean;
  hover: boolean;
}

export default defineComponent({
  name: 'LoadComponent',
  components: {},
  props: {
    meta: {
      required: true,
      type: Array as PropType<ILoadMeta[]>,
      default() {
        return [
          { color: '#ff0000', style: '', neon: false, hover: false },
          { color: '#008000', style: '', neon: false, hover: false },
          { color: '#0000ff', style: '', neon: false, hover: false },
        ];
      },
    },
  },
  data() {
    return {
      animationStartMs: 500,
      animationPeriod: 200,
    };
  },
  methods: {
    timeAnimationMs(idx: number): string {
      const time = idx + 1 > 1 ? this.animationPeriod * idx + this.animationStartMs : this.animationStartMs;
      return `${time}ms`;
    },
  },
  computed: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  mounted() {},
});
</script>

<template>
  <div class="h-full w-full relative">
    <div
      v-for="(item, idx) of meta"
      :key="idx"
      v-boxShadow="{
        color: item.color,
        style: item.style,
        neon: item.neon,
        hover: item.hover,
      }"
      :style="{ background: item.color, 'animation-duration': timeAnimationMs(idx) }"
      class="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 h-[30px] w-[30px] rounded-full animate-load"
    ></div>
  </div>
</template>

<style scoped lang="scss"></style>
