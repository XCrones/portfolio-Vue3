<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters, mapActions } from 'vuex';

export default defineComponent({
  name: 'ModalComponent',
  components: {},
  props: {},
  data() {
    return {};
  },
  methods: {
    ...mapActions({
      confirm: 'todo/modal/CONFIRM',
    }),
    isDelete(response: boolean) {
      this.confirm(response);
    },
    onKeyDown(event: any) {
      if (!!event && event['key'] === 'Escape') {
        this.isDelete(false);
      }
    },
  },
  computed: {
    ...mapGetters({
      title: 'todo/modal/DELETE_TITLE',
    }),
  },
  mounted() {
    addEventListener('keydown', (event: any) => this.onKeyDown(event), true);
  },
  unmounted() {
    removeEventListener('keydown', (event: any) => this.onKeyDown(event), true);
  },
});
</script>

<template>
  <div
    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 sm:w-2/4 lg:w-1/3 h-[35%] bg-[rgba(31,39,56,0.95)] rounded-2xl"
  >
    <div class="h-full w-full flex flex-col justify-between p-2">
      <div class="text-center capitalize text-lg">подтверждение</div>
      <div class="text-center underline underline-offset-4">
        {{ title }}
      </div>
      <div class="flex flex-row justify-around gap-x-2 items-center">
        <button
          @click="isDelete(true)"
          class="btn-delete flex flex-row gap-x-2 items-center justify-between bg-green-700 p-2 hover:bg-green-500 rounded-md transition-all duration-300 w-1/2"
        >
          <div class="capitalize text-xs sm:text-sm">удалить</div>
          <div class="">
            <i class="bi bi-check-square text-sm sm:text-xl"></i>
          </div>
        </button>
        <button
          @click="isDelete(false)"
          class="btn-cancel flex flex-row gap-x-2 items-center justify-between bg-red-700 hover:bg-red-500 p-2 rounded-md transition-all duration-300 w-1/2"
        >
          <div class="capitalize text-xs sm:text-sm">отмена</div>
          <div class="">
            <i class="bi bi-x-square text-sm sm:text-xl"></i>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
