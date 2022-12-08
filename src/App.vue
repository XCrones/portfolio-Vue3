<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import FooterComponent from './components/footer/footer-component.vue';
import HeaderComponent from './components/header/header-component.vue';
import { mapGetters } from 'vuex';
import ShadowSevice from '@/ui/shadow-neon/shadow-neon';
import { IBoxShadow } from '@/ui/directives/box-neon-directive';

@Options({
  components: {
    HeaderComponent,
    FooterComponent,
  },
  props: {},
  data() {
    return {
      shadowService: new ShadowSevice(),
    };
  },
  methods: {},
  computed: {
    ...mapGetters({
      isHideHeader: 'header/IS_HIDE',
      neon: 'neon/GET_STATE_NEON',
    }),
    metaBoxShadow(): IBoxShadow {
      return {
        color: this.shadowService.colorGreen,
        style: 'medium',
        neon: this.neon,
        hover: false,
      };
    },
  },
})
export default class App extends Vue {}
</script>

<template>
  <div id="app" class="min-h-screen flex flex-col bg-[#1f2738] relative">
    <header v-if="!isHideHeader" class="flex-[0_1_80px] h-full flex">
      <div class="min-h-full min-w-full flex-auto">
        <header-component />
      </div>
    </header>
    <main
      v-boxShadow="metaBoxShadow"
      class="flex-auto m-[10px] rounded-[5px] overflow-hidden main-bg transition-all duration-500 flex"
    >
      <div class="min-h-full min-w-full flex-auto">
        <router-view />
      </div>
    </main>
    <footer class="flex-[0_1_40px] h-full flex">
      <div class="min-h-full min-w-full flex-auto">
        <footer-component />
      </div>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.main-bg {
  background: #1f2738;
  background: linear-gradient(180deg, #1f2738 0%, #212c44 8%, #1c2946 18%, #1f2738 30%, #141b29 74%);
}
</style>
