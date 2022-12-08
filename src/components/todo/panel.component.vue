<script lang="ts">
import { defineComponent } from 'vue';
import { Subscription } from 'rxjs';
import { ITasks, IToggleStatus } from '@/store/modules/todo/tasks-module';
import { mapGetters, mapActions } from 'vuex';
import { IModal } from '@/store/modules/todo/modal-module';

export default defineComponent({
  name: 'PanelComponent',
  components: {},
  props: {},
  data() {
    return {
      tasks: new Array<ITasks>(),
      tasks$: new Subscription(),
    };
  },
  methods: {
    ...mapActions({
      createNew: 'todo/popup/CREATE_NEW',
      setDeleteTask: 'todo/modal/SET_DELETE_TASK',
      toggleStatus: 'todo/tasks/TOGGLE_STATUS',
    }),
    createNewTask() {
      this.createNew();
    },

    deleteAllTasks() {
      const deleteDate: IModal = {
        isGlobal: true,
        id: -1,
        title: '',
      };
      this.setDeleteTask(deleteDate);
    },

    async completeAllTasks() {
      const param: IToggleStatus = {
        itemId: -1,
        isGlobal: true,
        statusGlobal: true,
      };
      await this.toggleStatus(param);
    },

    setAllTasks() {
      const param: IToggleStatus = {
        itemId: -1,
        isGlobal: true,
        statusGlobal: false,
      };
      this.toggleStatus(param);
    },
  },
  computed: {
    ...mapGetters({
      taskList: 'todo/tasks/TASK_LIST',
      neon: 'neon/GET_STATE_NEON',
    }),
    sumTasks(): number {
      return this.tasks.length;
    },
    pctOkTasks(): number {
      return Math.round((100 * this.tasks.filter((item: ITasks) => item.status).length) / this.tasks.length);
    },
    sumOkTasks(): number {
      return this.tasks.filter((item: ITasks) => item.status).length;
    },
    pctNokTasks(): number {
      return Math.round((100 * this.tasks.filter((item: ITasks) => !item.status).length) / this.tasks.length);
    },
    sumNokTasks(): number {
      return this.tasks.filter((item: ITasks) => !item.status).length;
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeMount() {
    this.tasks$ = this.taskList.subscribe((observer: ITasks[]) => {
      this.tasks = observer;
    });
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  mounted() {},
  unmounted() {
    this.tasks$.unsubscribe();
  },
});
</script>

<template>
  <div class="h-full w-full flex flex-col gap-y-2 sm:flex-row sm:gap-x-4 lg:gap-8">
    <div class="flex-[0_1_50%] flex flex-col gap-y-1 capitalize progress text-[14px] sm:text-base">
      <div
        v-boxShadow="{
          color: '#800080',
          style: 'medium',
          neon: neon,
          hover: true,
        }"
        class="flex flex-row justify-between items-center border border-solid border-gray-300 rounded-md px-1 relative overflow-hidden transition-all duretion-200"
      >
        <div
          :style="{ width: sumTasks > 0 ? 100 + '%' : 0 + '%' }"
          class="absolute left-0 top-0 h-full z-0 transition-all duration-700 bg-[#800080]"
        ></div>
        <span class="z-10">всего:</span>
        <span class="z-10">{{ sumTasks }}</span>
      </div>
      <div
        v-boxShadow="{
          color: '#15814f',
          style: 'medium',
          neon: neon,
          hover: true,
        }"
        class="flex flex-row justify-between items-center border border-solid border-gray-300 rounded-md px-1 relative overflow-hidden transition-all duretion-200"
      >
        <div
          :style="{ width: pctOkTasks > 0 ? pctOkTasks + '%' : 0 + 'px' }"
          class="absolute left-0 top-0 h-full z-0 transition-all duration-700 bg-[#15814f]"
        ></div>
        <span class="flex-[0_1_25%] z-10">выполнено:</span>
        <span class="flex-auto text-center z-10"> {{ pctOkTasks > 0 ? pctOkTasks : 0 }}% </span>
        <span class="flex-[0_1_10%] text-right z-10">{{ sumOkTasks }}</span>
      </div>
      <div
        v-boxShadow="{
          color: '#ec1414',
          style: 'medium',
          neon: neon,
          hover: true,
        }"
        class="flex flex-row justify-between items-center border border-solid border-gray-300 rounded-md px-1 relative overflow-hidden transition-all duretion-200"
      >
        <div
          :style="{ width: pctNokTasks > 0 ? pctNokTasks + '%' : 0 + 'px' }"
          class="absolute left-0 top-0 h-full z-0 transition-all duration-700 bg-[#ec1414]"
        ></div>

        <span class="flex-[0_1_25%] z-10">назначено:</span>
        <span class="flex-auto text-center z-10"> {{ pctNokTasks > 0 ? pctNokTasks : 0 }}% </span>
        <span class="flex-[0_1_10%] text-right z-10">{{ sumNokTasks }}</span>
      </div>
    </div>
    <div class="flex-[0_1_50%] flex flex-row gap-x-2">
      <div class="flex-[0_1_50%] flex flex-col justify-between gap-y-2">
        <button
          @click="createNewTask()"
          v-boxShadow="{
            color: '#2284b1',
            style: 'medium',
            neon: neon,
            hover: true,
          }"
          class="btn-create flex flex-row justify-between items-center h-8 sm:h-10 bg-[#2284b1] px-2 rounded-lg border border-solid border-gray-400 panel-btn transition-all duretion-200"
        >
          <div class="first-letter:uppercase text-xs md:text-base">создать</div>
          <i class="bi bi-plus-square text-sm xl:text-xl"></i>
        </button>
        <button
          @click="deleteAllTasks()"
          v-boxShadow="{
            color: '#ec1414',
            style: 'medium',
            neon: neon,
            hover: true,
          }"
          class="btn-delete flex flex-row justify-between items-center h-8 sm:h-10 bg-[#ec1414] px-2 rounded-lg border border-solid border-gray-400 panel-btn transition-all duretion-200"
        >
          <div class="first-letter:uppercase text-xs md:text-base">удалить всё</div>
          <i class="bi bi-trash text-sm xl:text-xl"></i>
        </button>
      </div>
      <div class="flex-[0_1_50%] flex flex-col justify-between gap-y-2">
        <button
          @click="completeAllTasks()"
          v-boxShadow="{
            color: '#15814f',
            style: 'medium',
            neon: neon,
            hover: true,
          }"
          class="btn-complete flex flex-row justify-between items-center h-8 sm:h-10 bg-[#15814f] px-2 rounded-lg border border-solid border-gray-400 panel-btn transition-all duretion-200"
        >
          <div class="first-letter:uppercase text-xs md:text-base">выполнить всё</div>
          <i class="bi bi-clipboard-check text-sm xl:text-xl"></i>
        </button>
        <button
          @click="setAllTasks()"
          v-boxShadow="{
            color: '#993199',
            style: 'medium',
            neon: neon,
            hover: true,
          }"
          class="btn-set flex flex-row justify-between items-center h-8 sm:h-10 bg-[#993199] px-2 rounded-lg border border-solid border-gray-400 panel-btn transition-all duretion-200"
        >
          <div class="first-letter:uppercase text-xs md:text-base">назначить всё</div>
          <i class="bi bi-clipboard2 text-sm xl:text-xl"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.progress {
  font-family: 'EB Garamond', serif;
}
</style>
