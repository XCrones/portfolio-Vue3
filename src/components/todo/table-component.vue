<script lang="ts">
import { IModal } from '@/store/modules/todo/modal-module';
import { ISorting, ITasks, IToggleStatus } from '@/store/modules/todo/tasks-module';
import { Subscription } from 'rxjs';
import { defineComponent } from 'vue';
import { mapGetters, mapActions } from 'vuex';

export default defineComponent({
  name: 'TableComponent',
  components: {},
  props: {},
  data() {
    return {
      taskList$: new Subscription(),
      tasks: new Array<ITasks>(),
      filterSort: '',
      stateFilter: false,
      innerWidth: 0,
    };
  },
  methods: {
    ...mapActions({
      setEditItem: 'todo/popup/SET_EDIT_ITEM',
      setDeleteTask: 'todo/modal/SET_DELETE_TASK',
      toggleStatus: 'todo/tasks/TOGGLE_STATUS',
      sort: 'todo/tasks/SORT',
    }),
    editItem(item: ITasks) {
      if (!item.status) {
        this.setEditItem(item);
      }
    },

    deleteItem(item: ITasks) {
      const deleteDate: IModal = {
        isGlobal: false,
        id: item.id,
        title: item.name,
      };
      this.setDeleteTask(deleteDate);
    },

    completeItem(id: number) {
      const itemToggleStatus: IToggleStatus = {
        itemId: id,
      };
      this.toggleStatus(itemToggleStatus);
    },

    toggleFilter(value: string) {
      this.stateFilter = this.filterSort === value ? !this.stateFilter : false;
      this.filterSort = value;
      const params: ISorting = {
        type: value,
        state: this.stateFilter,
      };
      this.sort(params);
    },

    parsePriority(value: number): string {
      return value === 0 ? 'низкий' : value === 1 ? 'средний' : 'высокий';
    },
    windowWidth(): number {
      return window.innerWidth;
    },
    onResize(event: any) {
      this.innerWidth = event.target['innerWidth'];
    },
  },
  computed: {
    ...mapGetters({
      taskList: 'todo/tasks/TASK_LIST',
      theadTable: 'todo/tasks/THEAD_TABLE',
    }),
  },
  mounted() {
    this.taskList$ = this.taskList.subscribe((observer: ITasks[]) => {
      if (observer != undefined) {
        this.tasks = observer;
      }
    });
    this.innerWidth = window.innerWidth;
    addEventListener('resize', (event: any) => this.onResize(event), true);
  },
  unmounted() {
    this.taskList$.unsubscribe();
    removeEventListener('resize', (event: any) => this.onResize(event), true);
  },
});
</script>

<template>
  <table class="w-full border-separate border-spacing-y-2 table-todos">
    <thead>
      <tr class="capitalize">
        <th
          v-tableResize="{
            filter: value.filter,
            width: innerWidth,
          }"
          v-for="(value, idx) of theadTable"
          :key="idx"
          class="border-b-2 border-solid border-white pb-2"
        >
          <div class="flex flex-row gap-x-2 justify-center items-center">
            <div class="text-[18px] text-sm lg:text-base">{{ value.title }}</div>
            <button
              :id="'btn-filter-' + idx"
              class=""
              :class="{
                'rotate-180': filterSort === value.filter && stateFilter,
                'rotate-0': filterSort === value.filter && !stateFilter,
              }"
              @click="toggleFilter(value.filter)"
            >
              <i
                class="bi bi-sort-down-alt text-2xl"
                :class="{ 'text-white': filterSort === value.filter, 'text-gray-600': filterSort != value.filter }"
              ></i>
            </button>
          </div>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        @dblclick="editItem(item)"
        v-for="(item, idx) of tasks"
        :key="idx"
        class="outline outline-1 outline-[#ffffff80] cursor-pointer text-[18px] transition-all duration-500 select-none"
        :class="{ 'bg-[#474e5fbb] cursor-not-allowed': item.status, 'hover:bg-[#00ff9559]': !item.status }"
      >
        <td class="px-3 py-3 relative text-sm lg:text-base" :class="{ triangle: item.status }">
          {{ item.name }}
        </td>
        <td class="hidden sm:table-cell px-3 py-3 text-center">
          {{ item.category }}
        </td>
        <td class="hidden md:table-cell px-3 py-3 text-center">
          {{ parsePriority(item.priority) }}
        </td>
        <td class="hidden lg:table-cell px-3 py-3 text-center">
          {{ item.date }}
        </td>
        <td class="px-3 py-3 text-center">
          <div class="sm:text-xl md:text-2xl text-black flex flex-row justify-center items-center gap-x-3">
            <button
              class="btn-edit w-6 sm:w-7 md:w-8 bg-[#3a69a7] rounded-md overflow-hidden"
              :class="{ 'bg-[#485363] cursor-not-allowed': item.status }"
              @click="editItem(item)"
            >
              <i class="bi bi-pencil-square"></i>
            </button>
            <button
              class="btn-delete w-6 sm:w-7 md:w-8 bg-[#ec1414] rounded-md overflow-hidden"
              @click="deleteItem(item)"
            >
              <i class="bi bi-trash"></i>
            </button>
            <button
              class="btn-complete w-6 sm:w-7 md:w-8 bg-white rounded-md overflow-hidden text-white transition-all duration-300"
              @click="completeItem(item.id)"
              :class="{ 'bg-[#15814f]': item.status }"
            >
              <i class="bi bi-check2"></i>
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped lang="scss">
.table-todos {
  font-family: 'Fjalla One', sans-serif;
}
.triangle {
  position: relative;
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 0;
    width: 0;
    border-top: 15px solid #00ff62;
    border-right: 15px solid transparent;
  }
}
</style>
