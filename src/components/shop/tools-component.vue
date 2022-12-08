<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapGetters } from 'vuex';

export default defineComponent({
  name: 'ToolsComponent',
  components: {},
  props: {},
  data() {
    return {
      modelSearch: '',
    };
  },
  methods: {
    ...mapActions({
      isHideFilters: 'shop/products/IS_HIDE_FILTER',
      stateCurrFilter: 'shop/products/STATE_CURR_FILTER',
      currFilter: 'shop/products/CURR_FILTER',
      setSearch: 'shop/products/SEARCH',
    }),
    toggleIsHideFilters() {
      this.isHideFilters(!this.getIsHideFilters);
    },
    toggleStateFilter() {
      this.stateCurrFilter(!this.getStateCurrFilter);
    },
    setCurrFilter(filter: string) {
      this.currFilter(filter);
      this.isHideFilters(true);
    },
    updateSearch() {
      this.setSearch(this.modelSearch);
    },
  },
  computed: {
    ...mapGetters({
      getCurrFilter: 'shop/products/CURR_FILTER',
      getIsHideFilters: 'shop/products/IS_HIDE_FILTER',
      getFilters: 'shop/products/FILTERS',
      getStateCurrFilter: 'shop/products/STATE_CURR_FILTER',
    }),
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  mounted() {},
});
</script>

<template>
  <div class="w-full flex flex-row items-center bg-purple-800 px-2 gap-x-1">
    <div class="flex-[0_1_50%] relative flex flex-row items-center justify-center gap-x-3">
      <button
        @click="toggleIsHideFilters()"
        type="button"
        class="btn-toggle flex flex-row items-center gap-x-1 text-xl"
      >
        <div class="">
          <i class="bi bi-funnel-fill"></i>
        </div>
        <div class="capitalize text-sm sm:text-base">{{ getCurrFilter }}</div>
      </button>
      <button
        @click="toggleStateFilter()"
        class="btn-state transition-all duration-300"
        :class="{ '-rotate-180': getStateCurrFilter }"
      >
        <div class="text-2xl">
          <i class="bi bi-filter-left"></i>
        </div>
      </button>
      <div
        :class="{ '-top-full scale-0 opacity-0': getIsHideFilters, 'top-full scale-1 opacity-1': !getIsHideFilters }"
        class="absolute z-20 top-full md:translate-x-1/2 left-0 bg-purple-800 py-2 flex flex-col gap-y-3 transition-all duration-300"
      >
        <button
          @click="setCurrFilter(item)"
          type="button"
          class="btn-set hover:bg-purple-500 px-5 w-full text-left"
          v-for="(item, idx) of getFilters"
          :key="idx"
        >
          <span class="first-letter:uppercase whitespace-nowrap text-sm sm:text-base">сортировать по {{ item }}</span>
        </button>
      </div>
    </div>
    <div class="flex-[0_1_50%] h-full w-full flex justify-center py-[10px]">
      <input
        @keyup="updateSearch()"
        v-model.trim="modelSearch"
        class="w-full sm:w-1/2 p-1 rounded-md text-black"
        type="text"
        placeholder="поиск"
      />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
