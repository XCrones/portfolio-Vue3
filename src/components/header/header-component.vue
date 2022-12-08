<script lang="ts">
import { ITextShadow } from '@/ui/directives/text-neon-directive';
import { defineComponent } from 'vue';
import { mapActions, mapGetters } from 'vuex';
import NavigationComponent from '../navigation/navigation-component.vue';

export default defineComponent({
  name: 'HeaderComponent',
  components: {
    NavigationComponent,
  },
  props: {},
  data() {
    return {
      isOpenHamburger: false,
    };
  },
  methods: {
    ...mapActions({
      toggleNeon: 'neon/TOGGLE_NEON',
    }),
    toggleHamburger() {
      this.isOpenHamburger = !this.isOpenHamburger;
    },
  },
  computed: {
    ...mapGetters({
      neon: 'neon/GET_STATE_NEON',
    }),
    iconNeon(): string {
      return this.neon ? 'lightbulb' : 'lightbulb_outline';
    },
    metaTextShadow(): ITextShadow {
      return {
        isNeon: this.neon,
        color: '#fff',
        colorShadow: '#fff',
        styleShadow: 'medium',
        isSetColor: true,
        isHover: false,
      };
    },
  },
});
</script>

<template>
  <div class="px-2 md:px-3 xl:px-4 h-full w-full relative z-50">
    <div class="h-full w-full flex flex-row justify-between items-center text-white fonts">
      <div
        :class="{ 'title-shadow': neon }"
        class="flicker transition-all duration-500 tracking-[1px] text-xl md:text-2xl capitalize px-3 py-[2px] border-solid border-2 border-[#00c3ff] rounded-lg"
      >
        anydea
      </div>

      <div class="flex-auto h-full w-full hidden md:block">
        <navigation-component />
      </div>

      <div class="">
        <button
          v-textShadow="metaTextShadow"
          class="btn-neon border-[3px] border-white w-[70px] h-9 relative rounded-2xl overflow-hidden"
          @click="toggleNeon()"
        >
          <i
            class="material-icons absolute top-1/2 left-0 -translate-y-1/2 transition-all ease-in duration-150"
            :class="{ 'left-[80%] -translate-x-1/2': !neon }"
            >{{ iconNeon }}</i
          >
        </button>
      </div>

      <div class="md:hidden">
        <button
          @click="toggleHamburger()"
          class="btn-hambr flex flex-col gap-y-2 relative"
          :class="{ 'toggle-hamburger': isOpenHamburger }"
        >
          <div
            :class="{ 'title-shadow': neon }"
            class="h-1 w-10 bg-white hambuger-line-1 transition-all duration-300"
          ></div>
          <div
            :class="{ 'title-shadow': neon }"
            class="h-1 w-10 bg-white hambuger-line-2 transition-all duration-300"
          ></div>
          <div
            :class="{ 'title-shadow': neon }"
            class="h-1 w-10 bg-white hambuger-line-3 transition-all duration-300"
          ></div>
        </button>
      </div>
    </div>
    <div
      :class="{ 'top-[-150px]': !isOpenHamburger, 'top-[70px]': isOpenHamburger }"
      class="absolute top-full -left-0 -right-0 h-full md:hidden bg-[#1f2738] transition-all duration-[600ms] ease-out"
    >
      <navigation-component />
    </div>
  </div>
</template>

<style scoped lang="scss">
.material-icons {
  font-size: 25px;
  height: 25px;
  width: 25px;
}

.fonts {
  font-family: 'Fjalla One', sans-serif;
}

.title-shadow {
  @include neon-shadow-box-light(#00c3ff);
}

.flicker {
  animation: flicker 3.8s infinite alternate;
}

.toggle-hamburger .hambuger-line-1 {
  transform: translate(0, 12px) rotate(-45deg);
}

.toggle-hamburger .hambuger-line-2 {
  scale: 0;
}

.toggle-hamburger .hambuger-line-3 {
  transform: translate(0, -12px) rotate(45deg);
}

@keyframes flicker {
  0%,
  18%,
  22%,
  25%,
  53%,
  57%,
  100% {
    @include neon-shadow-text-light($color-red-shadow);
    color: $color-red-shadow;
  }

  20%,
  80%,
  55% {
    text-shadow: none;
    color: #fff;
  }
}
</style>
