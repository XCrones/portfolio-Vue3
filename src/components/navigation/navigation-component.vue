<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

export default defineComponent({
  name: 'NavigationComponent',
  components: {},
  props: {},
  data() {
    return {};
  },
  methods: {},
  computed: {
    ...mapGetters({
      neon: 'neon/GET_STATE_NEON',
      itemsNav: 'header/ITEMS_NAV',
    }),
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  mounted() {},
});
</script>

<template>
  <nav class="h-full w-full">
    <ul class="h-full w-full flex flex-row justify-evenly items-center md:text-xl capitalize z-0">
      <li :class="{ 'shadow-green': neon }" class="" v-for="item in itemsNav" :key="item">
        <router-link :to="{ name: item.link }" class="transition-all duration-500 tracking-[1px] text-white">
          {{ item.title }}
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
.router-link-active {
  color: $color-green-neon;
}
.shadow-green .router-link-active {
  @include neon-shadow-text-light($color-green-neon);
}
</style>
