<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, maxLength, email } from '@vuelidate/validators';
import { IAuth } from '@/store/modules/auth/auth-module';
import { mapActions } from 'vuex';

export default defineComponent({
  name: 'AuthSignIn',
  setup() {
    return { v$: useVuelidate() };
  },
  validationConfig: {
    $lazy: true,
  },
  components: {},
  props: {
    showBtnClose: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
    neonState: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
  },
  data() {
    return {
      email: '',
      password: '',
      response: '',
      length: {
        max: 10,
        min: 4,
      },
    };
  },
  methods: {
    ...mapActions({
      signIn: 'auth/SIGN_IN',
    }),

    toggleForm() {
      this.$emit('isToggleForm');
    },

    closeProfile() {
      this.$emit('isCloseProfile');
    },

    async onSubmit() {
      const isFormValid = await this.v$.$validate();
      if (isFormValid) {
        this.$emit('load', true);

        const user: IAuth = {
          email: this.email as string,
          password: this.password as string,
        };

        await this.signIn(user)
          .then(() => {
            this.email = '';
            this.password = '';
            this.v$.$reset();
            this.$emit('isUserSignIn');
          })
          .catch((err) => {
            this.response = err;
            this.password = '';
            this.v$.password.$reset();
          })
          .finally(() => this.$emit('load', false));
      }
    },
  },
  computed: {
    isValidFrom(): boolean {
      return this.v$.$invalid;
    },
    isResponse(): boolean {
      return this.response.length > 0 ? true : false;
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  mounted() {},
  validations() {
    return {
      email: {
        email,
        required,
      },
      password: {
        required,
        minLength: minLength(this.length.min),
        maxLength: maxLength(this.length.max),
      },
    };
  },
});
</script>

<template>
  <form class="h-full w-full flex flex-col justify-center gap-y-3" @submit.prevent="onSubmit()">
    <div class="flex flex-row justify-between items-center gap-x-1">
      <h2 class="capitalize text-xl text-center flex-auto">вход</h2>
      <button
        v-if="showBtnClose"
        v-textShadow="{
          isNeon: this.neonState,
          color: '',
          colorShadow: '#fff',
          styleShadow: 'medium',
          isSetColor: true,
          isHover: true,
        }"
        type="button"
        class="btn-close text-xl transition-all duration-300"
        @click="closeProfile()"
      >
        <i class="bi bi-arrow-right-square"></i>
      </button>
    </div>
    <div class="flex flex-col gap-y-1">
      <label for="email" class="capitalize text-sm">email: </label>
      <input
        @blur="v$.email.$touch"
        @focus="response = ''"
        id="email"
        type="email"
        v-model.trim="email"
        class="text-black px-2 py-1 rounded-lg overflow-hidden text-sm"
      />
      <div
        class="text-xs text-white text-center first-letter:uppercase"
        v-for="(error, index) of v$.email.$errors"
        :key="index"
      >
        {{ error.$message }}
      </div>
      <div v-if="isResponse" class="text-xs text-white text-center first-letter:uppercase">
        {{ response }}
      </div>
    </div>
    <div class="flex flex-col gap-y-1">
      <label for="pass1" class="capitalize text-sm">password: </label>
      <input
        @blur="v$.password.$touch"
        :maxlength="length.max"
        id="pass1"
        type="password"
        v-model.trim="password"
        class="text-black px-2 py-1 rounded-lg overflow-hidden text-sm"
      />
      <div
        class="text-xs text-white text-center first-letter:uppercase"
        v-for="(error, index) of v$.password.$errors"
        :key="index"
      >
        {{ error.$message }}
      </div>
    </div>
    <div class="w-full">
      <button
        :disabled="isValidFrom"
        type="submit"
        class="btn-submit capitalize w-full p-1 transition-all duration-300"
        :class="{
          'bg-sky-700 hover:bg-sky-500': !isValidFrom,
          'bg-slate-500 cursor-not-allowed': isValidFrom,
        }"
      >
        отправить
      </button>
    </div>
    <div class="flex flex-row items-center justify-center gap-x-1">
      <span class="first-letter:uppercase">нет аккаунта?</span>
      <button
        @click="toggleForm()"
        type="button"
        class="btn-toggle flex flex-row gap-x-2 hover:text-sky-500 transition-all duration-300"
      >
        <div class="capitalize">регистрация</div>
        <i class="bi bi-arrow-right-square"></i>
      </button>
    </div>
  </form>
</template>

<style scoped lang="scss"></style>
