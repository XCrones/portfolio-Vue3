<script lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, maxLength } from '@vuelidate/validators';
import { defineComponent } from 'vue';
import { mapGetters, mapActions } from 'vuex';
import { PaginatorV2Service } from '@/ui/pahinatorV2/paginator-service';
import { Subscription } from 'rxjs';
import { ICategories } from '@/store/modules/todo/categories-module';
import { ITasks } from '@/store/modules/todo/tasks-module';
import { ITextShadow } from '@/ui/directives/text-neon-directive';

export default defineComponent({
  name: 'PopupComponent',
  setup() {
    return { v$: useVuelidate() };
  },
  validationConfig: {
    $lazy: true,
  },
  components: {},
  props: {},
  data() {
    return {
      formLengths: {
        name: { min: 4, max: 30 },
        categori: { min: 4, max: 10 },
        description: { min: 0, max: 100 },
      },
      categories: [],
      paginator: new PaginatorV2Service(),
      categori: '',
      editItem: {
        id: 0,
        name: 'undefined',
        category: '',
        priority: 0,
        date: '',
        status: false,
        description: '',
      },
      editItemRef$: new Subscription(),
    };
  },
  methods: {
    ...mapActions({
      update: 'todo/categories/UPDATE',
      close: 'todo/popup/CLOSE',
      saveItem: 'todo/popup/SAVE_ITEM',
    }),
    async onSubmitItem() {
      const isFormValid = await this.v$.$validate();
      if (isFormValid) {
        await this.saveItem(this.editItem);
      }
    },
    async onSubmitCategori() {
      const isFormValid = await this.v$.categori.$validate();

      if (isFormValid && this.categori.length > 0) {
        const category = this.categori as string;
        this.updateCategories([category], category);
        this.editItem.category = category;
        this.v$.categori.$reset();
        this.categori = '';
      }
    },
    closePopup() {
      this.v$.$reset();
      Object.assign(this.editItem, this.editItemPattern);
      this.close();
    },
    setPriority(value: number) {
      this.editItem.priority = value;
    },
    setCategory(category: string) {
      this.editItem.category = category;
    },
    async updateCategories(arrCategories: string[], currCategori: string) {
      const categoriesData: ICategories = {
        items: arrCategories,
        currCategori: currCategori,
      };
      this.categories = await this.update(categoriesData);
    },
    onKeyDown(event: any) {
      if (!!event && event['key'] === 'Escape') {
        this.closePopup();
      }
    },
  },
  computed: {
    ...mapGetters({
      neon: 'neon/GET_STATE_NEON',
      editItemRef: 'todo/popup/GET_EDIT_ITEM',
      getCategories: 'todo/tasks/CATEGORIES',
    }),
    editItemPattern(): ITasks {
      return {
        id: 0,
        name: 'undefined',
        category: '',
        priority: 0,
        date: '',
        status: false,
        description: '',
      };
    },
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
    this.paginator.init(3);
    const categories = this.getCategories;
    this.updateCategories(categories, '');
    this.editItemRef$ = this.editItemRef.subscribe((observer: ITasks) => {
      Object.assign(this.editItem, observer);
      this.editItem.name = observer.name;
      this.editItem.description = observer.description;
      this.updateCategories(categories, observer.category);
    });
  },
  mounted() {
    addEventListener('keydown', (event: any) => this.onKeyDown(event), true);
  },
  unmounted() {
    removeEventListener('keydown', (event: any) => this.onKeyDown(event), true);
    this.editItemRef$.unsubscribe();
  },
  validations() {
    return {
      editItem: {
        name: {
          required,
          minLength: minLength(this.formLengths.name.min),
          maxLength: maxLength(this.formLengths.name.max),
        },

        description: {
          minLength: minLength(this.formLengths.description.min),
          maxLength: maxLength(this.formLengths.description.max),
        },
      },

      categori: {
        minLength: minLength(this.formLengths.categori.min),
        maxLength: maxLength(this.formLengths.categori.max),
      },
    };
  },
});
</script>

<template>
  <form
    @submit.prevent="onSubmitItem()"
    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full sm:w-1/2 md:w-5/12 lg:w-[45%] bg-[rgba(31,39,56,0.98)] rounded-2xl"
  >
    <div class="h-full w-full flex flex-col p-2 gap-y-4">
      <div class="flex flex-row justify-between items-center relative horizontal-line">
        <div class="text-xs lg:text-base">
          {{ editItem.date }}
        </div>
        <button
          v-textShadow="metaTextShadow"
          @click="closePopup()"
          class="btn-close transition-all duration-500 text-xl lg:text-2xl"
          type="button"
        >
          <i class="bi bi-x-octagon"></i>
        </button>
      </div>
      <div class="flex flex-col items-center justify-center">
        <input
          v-model.trim="editItem.name"
          :maxlength="formLengths.name.max"
          type="text"
          placeholder="имя задачи"
          required
          class="w-11/12 px-2 py-[2px] text-white outline-none placeholder:text-white placeholder:text-sm text-sm text-center rounded-lg overflow-hidden bg-[rgba(105,124,161,0.5)]"
        />
        <div class="text-[12px] text-red-600" v-for="(error, index) of v$.editItem.name.$errors" :key="index">
          {{ error.$message }}
        </div>
      </div>
      <div class="flex flex-row gap-x-2 relative">
        <div class="flex-[0_1_50%] flex flex-col gap-y-2 justify-between vertical-line">
          <div class="text-center capitalize">приоритет:</div>
          <div class="flex flex-col gap-y-2">
            <div class="flex flex-row gap-x-3 p-1 items-center priorities">
              <button
                id="setPriority2"
                type="button"
                class="h-5 lg:h-7 w-5 lg:w-7 rounded-full bg-white relative"
                @click="setPriority(2)"
              >
                <div
                  :class="{ 'bg-red-600': editItem.priority === 2 }"
                  class="absolute top-1/2 left-1/2 h-3/4 w-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300"
                ></div>
              </button>
              <div class="capitalize text-sm">высокий</div>
            </div>
            <div class="flex flex-row gap-x-3 p-1 items-center priorities">
              <button
                id="setPriority1"
                type="button"
                class="h-5 lg:h-7 w-5 lg:w-7 rounded-full bg-white relative"
                @click="setPriority(1)"
              >
                <div
                  :class="{ 'bg-orange-600': editItem.priority === 1 }"
                  class="absolute top-1/2 left-1/2 h-3/4 w-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300"
                ></div>
              </button>
              <div class="capitalize text-sm">средний</div>
            </div>
            <div class="flex flex-row gap-x-3 p-1 items-center priorities">
              <button
                id="setPriority0"
                type="button"
                class="h-5 lg:h-7 w-5 lg:w-7 rounded-full bg-white relative"
                @click="setPriority(0)"
              >
                <div
                  :class="{ 'bg-green-600': editItem.priority === 0 }"
                  class="absolute top-1/2 left-1/2 h-3/4 w-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300"
                ></div>
              </button>
              <div class="capitalize text-sm">низкий</div>
            </div>
          </div>
          <div class="flex flex-col">
            <form @submit.prevent="onSubmitCategori()" class="flex flex-row gap-x-1 justify-center items-center">
              <input
                v-model.trim="categori"
                :maxlength="formLengths.categori.max"
                type="text"
                placeholder="новая категория"
                class="py-[1px] w-full text-white outline-none placeholder:text-white placeholder:text-xs text-center rounded-lg overflow-hidden bg-[rgba(105,124,161,0.5)]"
              />
              <button type="submit" class="btn-submit-category text-base transition-all duration-500">
                <i class="bi bi-save2"></i>
              </button>
            </form>
            <div class="text-[12px] text-red-600" v-for="(error, index) of v$.categori.$errors" :key="index">
              {{ error.$message }}
            </div>
          </div>
        </div>
        <div class="flex-[0_1_50%] flex flex-col gap-y-2 justify-between">
          <div class="text-center capitalize">категория:</div>
          <div class="flex flex-col gap-y-2">
            <div
              class="flex flex-row gap-x-3 items-center justify-end p-1 categories"
              v-for="item of paginator.parse(categories)"
              :key="item"
            >
              <div class="text-sm">
                {{ item }}
              </div>
              <button
                type="button"
                class="btn-set-category h-5 lg:h-7 w-5 lg:w-7 rounded-md bg-white relative"
                @click="setCategory(item)"
              >
                <div
                  class="absolute top-1/2 left-1/2 h-3/4 w-3/4 -translate-x-1/2 -translate-y-1/2 rounded-md transition-all duration-300"
                  :class="{ 'bg-sky-600': editItem.category === item }"
                ></div>
              </button>
            </div>
          </div>
          <div class="flex flex-row justify-end gap-x-1">
            <button
              type="button"
              class="btn-set-page border-0 bg-gray-600 w-5 h-5 text-center rounded-sm transition-all duration-300 flex justify-center items-center"
              :class="{ 'link-active': paginator.isEqualPage(idx) }"
              v-for="(value, idx) of paginator.pages(categories)"
              :key="idx"
              @click="paginator.setCurrPage(idx)"
            >
              {{ idx + 1 }}
            </button>
          </div>
        </div>
      </div>
      <div class="">
        <div class="">
          <textarea
            v-model.trim="editItem.description"
            placeholder="описание задачи"
            class="px-1 w-full h-15 text-white outline-none placeholder:text-white placeholder:text-sm text-sm resize-none rounded-lg overflow-hidden bg-[rgba(105,124,161,0.5)]"
          ></textarea>
          <div
            class="text-[12px] text-red-600 text-center"
            v-for="(error, index) of v$.editItem.description.$errors"
            :key="index"
          >
            {{ error.$message }}
          </div>
        </div>
      </div>
      <div class="flex flex-row justify-around gap-x-2 items-center">
        <button
          type="submit"
          class="btn-submit flex flex-row gap-x-2 items-center justify-between bg-green-700 p-2 hover:bg-green-500 rounded-md transition-all duration-300 w-1/2"
        >
          <div class="capitalize text-xs sm:text-sm">сохранить</div>
          <div class="">
            <i class="bi bi-check-square text-sm sm:text-xl"></i>
          </div>
        </button>
        <button
          type="button"
          @click="closePopup()"
          class="btn-cancel flex flex-row gap-x-2 items-center justify-between bg-red-700 hover:bg-red-500 p-2 rounded-md transition-all duration-300 w-1/2"
        >
          <div class="capitalize text-xs sm:text-sm">отмена</div>
          <div class="">
            <i class="bi bi-x-square text-sm sm:text-xl"></i>
          </div>
        </button>
      </div>
    </div>
  </form>
</template>

<style scoped lang="scss">
.link-active {
  background-color: rgb(2, 132, 199);
}

.priorities {
  &:first-child {
    border-radius: 15px 0 0 0;
  }
  &:last-child {
    border-radius: 0 0 0 15px;
  }
  &:nth-child(odd) {
    background: rgb(92, 131, 213);
    background: linear-gradient(90deg, #5c83d5 0%, #2e4678 30%, #1f2738 71%);
  }
  &:nth-child(even) {
    background: rgb(40, 75, 148);
    background: linear-gradient(90deg, #284b94 0%, #1f3461 30%, #1f2738 70%);
  }
}

.categories {
  &:first-child {
    border-radius: 0 15px 0 0;
  }
  &:last-child {
    border-radius: 0 0 15px 0;
  }
  &:nth-child(odd) {
    background: rgb(40, 75, 148);
    background: linear-gradient(270deg, #284b94 0%, #1f3461 30%, #1f2738 70%);
  }
  &:nth-child(even) {
    background: rgb(92, 131, 213);
    background: linear-gradient(270deg, #5c83d5 0%, #2e4678 30%, #1f2738 71%);
  }
}

.vertical-line::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1px;
  height: 60%;
  transform: translate(-50%, -50%);
  background-color: #5c83d5;
  border-radius: 20%;
  @include neon-shadow-box-medium(#5c83d5);
}

.horizontal-line:after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40%;
  height: 1px;
  transform: translate(-50%, -50%);
  background-color: #5c83d5;
  border-radius: 20%;
  @include neon-shadow-box-medium(#5c83d5);
}
</style>
