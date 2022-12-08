<script lang="ts">
import { PaginatorV2Service } from '@/ui/pahinatorV2/paginator-service';
import { mapGetters } from 'vuex';
import { ITextShadow } from '@/ui/directives/text-neon-directive';
import ShadowSevice from '@/ui/shadow-neon/shadow-neon';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HomeView',
  components: {},
  mixins: [],
  props: {},
  data() {
    return {
      paginatorService: new PaginatorV2Service(),
      shadowService: new ShadowSevice(),
    };
  },
  methods: {},
  computed: {
    ...mapGetters({
      neon: 'neon/GET_STATE_NEON',
      aboutMe: 'home/ABOUT_ME',
      mySkills: 'home/MY_SKILLS',
    }),
    metaTextShadow(): ITextShadow {
      return {
        isNeon: this.neon,
        color: this.colorGreen,
        colorShadow: this.colorNeonGreen,
        styleShadow: 'medium',
        isSetColor: true,
        isHover: false,
      };
    },
    colorGreen(): string {
      return this.shadowService.colorGreen;
    },
    colorNeonGreen(): string {
      return this.shadowService.colorNeonGreen;
    },
  },
  mounted() {
    this.paginatorService.init(6);
  },
});
</script>

<template>
  <div class="text-white py-[15px] px-[5px] flex flex-col h-full w-full">
    <h1 class="uppercase text-center text-[35px] md:text-[45px] title leading-[40px] py-7">
      {{ aboutMe.title }}
      <span v-textShadow="metaTextShadow" class="tracking-[1px] color-red transition-all duration-500">{{
        aboutMe.frameWork
      }}</span>
    </h1>
    <div class="flex flex-col md:flex-row about-me flex-[1_1_100%]">
      <div class="flex-[0_1_50%] flex justify-center items-center">
        <div class="w-full lg:max-w-[75%] ml-4">
          <h2 class="py-3 first-letter:uppercase text-xl">
            {{ aboutMe.greetings }}
          </h2>
          <h2 class="py-2 first-letter:uppercase text-[14px] md:text-[15px]">
            {{ aboutMe.whatIsThis }}
          </h2>
          <div class="flex flex-col ml-3 lg:ml-8">
            <div
              class="flex flex-row items-center text-[14px] md:text-base"
              v-for="(value, idx) in aboutMe.search"
              :key="idx"
            >
              <h3 class="flex-[0_1_40%] text-[#0fa]">
                {{ value.about }}
              </h3>
              <h3 class="flex-auto">{{ value.goal }}</h3>
            </div>
          </div>
          <h2 class="py-4 first-letter:uppercase text-[18px]">
            {{ aboutMe.subtitle }}
          </h2>
        </div>
      </div>
      <div class="flex-[0_1_50%] flex flex-col justify-between items-center">
        <h2 class="text-center first-letter:uppercase text-2xl pb-4">навыки</h2>
        <div
          class="flex-auto flex flex-col flex-nowrap lg:flex-row lg:flex-wrap w-full justify-start pl-2 items-start gap-y-3 lg:gap-y-0"
        >
          <div
            class="flex flex-row items-center flex-[0_1_50%] md:gap-x-2"
            v-for="(item, idx) of paginatorService.parse(mySkills)"
            :key="idx"
          >
            <div class="w-[64px] h-[64px] showImg">
              <img
                class="max-w-full max-h-full"
                :src="require(`@/assets/img/skills/${item.img}.png`)"
                :alt="item.img"
              />
            </div>
            <div class="">
              <h3 class="text-[15px] first-letter:uppercase showTitle">
                {{ item.title }}
              </h3>
              <h4 class="capitalize text-[13px] showText" v-for="(value, idxValue) of item.about" :key="idxValue">
                &nbsp; - &nbsp;{{ value }}
              </h4>
            </div>
          </div>
        </div>
        <div class="py-5 lg:py-2 flex flex-row gap-x-1">
          <button
            :class="{ 'link-active': paginatorService.isEqualPage(idx) }"
            class="border-0 bg-gray-600 w-6 h-6 text-center rounded-full"
            v-for="(page, idx) of paginatorService.pages(mySkills)"
            :key="idx"
            @click="paginatorService.setCurrPage(idx)"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.color-red {
  color: $color-green-neon;
}

.title {
  font-family: 'Yatra One', cursive;
}

.about-me {
  font-family: 'Fjalla One', sans-serif;
}

.link-active {
  background-color: #0284c7;
}

.showImg {
  animation: show-item 0.4s ease-out;
}

.showTitle {
  animation: show-item 0.5s ease-out;
}

.showText {
  animation: show-item 0.6s ease-out;
}

@keyframes show-item {
  0% {
    scale: 0;
    transform: translateX(-100px);
  }
  100% {
    scale: 1;
    transform: translateX(0px);
  }
}
</style>
