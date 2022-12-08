<script lang="ts">
import { defineComponent } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, maxLength } from '@vuelidate/validators';
import LoadComponent, { ILoadMeta } from '@/components/ui/load-component.vue';
import { mapGetters } from 'vuex';

export default defineComponent({
  name: 'AddCrateComponent',
  setup() {
    return { v$: useVuelidate() };
  },
  components: {
    LoadComponent,
  },
  props: {
    responseErr: {
      required: true,
      type: String,
      default() {
        return '';
      },
    },
    isLoad: {
      required: true,
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  data() {
    return {
      nameLength: {
        min: 1,
        max: 20,
      },
      name: '',
    };
  },
  methods: {
    cancel() {
      this.$emit('isCancel');
    },
    async onSubmit() {
      const isFormValid = await this.v$.name.$validate();
      const name = this.name;
      // eslint-disable-next-line no-extra-boolean-cast
      if (!!isFormValid && name.length > 0) {
        this.$emit('nameChat', name);
        this.v$.$reset();
      }
    },
    async createChat() {
      const isFormValid = await this.v$.name.$validate();
      const name = this.name;
      // eslint-disable-next-line no-extra-boolean-cast
      if (!!isFormValid && name.length > 0) {
        this.$emit('isCretaeChat', name);
        this.v$.$reset();
      }
    },
    async joinChat() {
      const isFormValid = await this.v$.name.$validate();
      const name = this.name;
      // eslint-disable-next-line no-extra-boolean-cast
      if (!!isFormValid && name.length > 0) {
        this.$emit('isJoinChat', name);
        this.v$.$reset();
      }
    },
    isJoin(value: string): boolean {
      return value.includes('занято');
    },
    isCreate(value: string): boolean {
      return value.includes('не существует');
    },
  },
  computed: {
    ...mapGetters({
      neon: 'neon/GET_STATE_NEON',
    }),
    metaLoad(): ILoadMeta[] {
      return [
        { color: '#ff0000', style: 'medium', neon: this.neon, hover: false },
        { color: '#008000', style: 'medium', neon: this.neon, hover: false },
        { color: '#0000ff', style: 'medium', neon: this.neon, hover: false },
      ];
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  mounted() {},
  validations() {
    return {
      name: {
        required,
        minLength: minLength(this.nameLength.min),
        maxLength: maxLength(this.nameLength.max),
      },
    };
  },
});
</script>

<template>
  <form class="h-full w-full flex flex-col justify-center gap-y-3 p-2 relative" @submit.prevent="onSubmit()">
    <div v-if="isLoad" class="absolute top-0 left-0 h-full w-full bg-[#bdb5b556] overflow-hidden">
      <LoadComponent :meta="metaLoad" />
    </div>
    <h2 class="capitalize text-xl text-center w-full">
      <slot name="nameForm"></slot>
    </h2>
    <div class="flex flex-col gap-y-2">
      <label class="first-letter:uppercase text-sm text-center">имя чата:</label>
      <input
        class="text-black px-2 py-1 rounded-lg overflow-hidden text-sm text-center"
        :maxlength="nameLength.max"
        type="text"
        v-model.trim="name"
      />

      <div
        class="text-xs text-white text-center first-letter:uppercase"
        v-for="(error, index) of v$.name.$errors"
        :key="index"
      >
        {{ error.$message }}
      </div>
      <div class="text-xs text-white text-center first-letter:uppercase" v-if="responseErr.length > 0">
        {{ responseErr }}.&nbsp;
        <button
          v-if="isCreate(responseErr)"
          @click="createChat()"
          type="button"
          class="btn-iscreate capitalize text-orange-500 hover:text-orange-400"
        >
          создать?
        </button>
        <button
          v-if="isJoin(responseErr)"
          @click="joinChat()"
          type="button"
          class="btn-isjoin capitalize text-orange-500 hover:text-orange-400"
        >
          присоединится?
        </button>
      </div>
    </div>
    <div class="flex flex-row justify-around gap-x-2 items-center">
      <button
        type="submit"
        class="btn-submit flex flex-row gap-x-2 items-center justify-between bg-green-700 py-1 px-2 hover:bg-green-500 rounded-md transition-all duration-300 w-1/2"
      >
        <div class="capitalize text-xs sm:text-sm">
          <slot name="btnSubmit"></slot>
        </div>
        <div class="">
          <i class="bi bi-check-square text-sm sm:text-xl"></i>
        </div>
      </button>
      <button
        type="button"
        @click="cancel()"
        class="btn-cancel flex flex-row gap-x-2 items-center justify-between bg-red-700 hover:bg-red-500 py-1 px-2 rounded-md transition-all duration-300 w-1/2"
      >
        <div class="capitalize text-xs sm:text-sm">отмена</div>
        <div class="">
          <i class="bi bi-x-square text-sm sm:text-xl"></i>
        </div>
      </button>
    </div>
  </form>
</template>

<style scoped lang="scss"></style>
