<script lang="ts">
import { ITextShadow } from '@/ui/directives/text-neon-directive';
import { mapActions, mapGetters } from 'vuex';
import { defineComponent, PropType } from 'vue';
import { IInfoProject } from '@/store/modules/todo/about-module';

export default defineComponent({
  name: 'InfoComponent',
  components: {},
  props: {
    info: {
      required: true,
      type: Array as PropType<IInfoProject[]>,
    },
  },
  data() {
    return {
      nameProject: 'undefined',
      tempData: Array(0),
    };
  },
  methods: {
    ...mapActions({
      isHide: 'info/TOGGLE_IS_HIDE',
    }),
    deleteNameProject(arr: IInfoProject[]) {
      let tempIndex = arr.findIndex((value) => typeof value['nameProject'] !== 'undefined');

      this.nameProject = tempIndex === -1 ? 'undefined' : String(this.info[tempIndex].nameProject);

      this.tempData = [...this.info];
      if (tempIndex != -1) {
        this.tempData.splice(tempIndex, 1);
      }
    },
    close() {
      this.isHide(true);
    },
  },
  computed: {
    ...mapGetters({
      neon: 'neon/GET_STATE_NEON',
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
  beforeMount() {
    this.deleteNameProject(this.info);
  },
});
</script>

<template>
  <div
    class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-full sm:w-3/5 lg:w-2/5 xl:w-2/5 bg-[rgba(31,39,56,0.98)] rounded-2xl"
  >
    <div class="h-full w-full flex flex-col p-2 gap-y-1">
      <div class="flex flex-row">
        <div class="flex-auto h-full w-full text-center first-letter:uppercase text-sm sm:text-base">
          представляю вам проект:
          <div class="underline underline-offset-4 block sm:inline-block">"{{ nameProject }}"</div>
        </div>
        <div class="flex-[0_1_40px]">
          <button
            v-textShadow="metaTextShadow"
            @click="close()"
            type="button"
            class="w-full h-full flex justify-center items-center transition-all duration-500 text-2xl"
          >
            <i class="bi bi-x-octagon"></i>
          </button>
        </div>
      </div>
      <div class="fonts">
        <div class="" v-for="(value, index) of tempData" :key="index">
          <div class="flex flex-row pl-1 gap-x-1 items-center">
            <div class="text-xs">
              <i class="bi bi-circle-fill text-sky-500"></i>
            </div>
            <div class="first-letter:uppercase text-[15px] sm:text-[16px]">
              {{ value.title }}<span class="" v-if="value?.subtitle">&nbsp;:</span>
              <span class="" v-if="!value?.subtitle">.</span>
            </div>
          </div>
          <div class="leading-4 flex flex-col gap-y-0.5">
            <div class="flex flex-row pl-5 gap-x-1 items-center" v-for="(subtitle, idx) of value.subtitle" :key="idx">
              <div class="text-xs">
                <i class="bi bi-circle-fill text-green-500"></i>
              </div>
              <div class="flex-auto text-[15px] sm:text-[16px]">{{ subtitle }}&nbsp;;</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.fonts {
  font-family: 'EB Garamond', serif;
}
</style>
