<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { mapGetters, mapActions } from 'vuex';
import AuthSignUp from '@/components/auth/auth-signup-component.vue';
import AuthSignIn from '@/components/auth/auth-signin-component.vue';
import LoadComponent, { ILoadMeta } from '@/components/ui/load-component.vue';

export default defineComponent({
  name: 'AuthComponent',
  components: {
    AuthSignUp,
    AuthSignIn,
    LoadComponent,
  },
  props: {
    showBtnClose: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
    callbackTryProfile: {
      required: true,
      type: Function,
    },
  },
  data() {
    return {
      isToggleForm: true,
      isLoad: false,
    };
  },
  methods: {
    ...mapActions({}),

    toggleForm() {
      this.isToggleForm = !this.isToggleForm;
    },

    closeProfile() {
      this.$emit('closeWindow');
    },

    userSingIn() {
      this.callbackTryProfile();
    },

    getIsLoad(state: boolean) {
      this.isLoad = state;
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
});
</script>

<template>
  <div class="h-full w-full p-3 overflow-hidden relative">
    <div v-if="isLoad" class="absolute top-0 left-0 h-full w-full bg-[#bdb5b556]">
      <LoadComponent :meta="metaLoad" />
    </div>
    <div v-if="!isToggleForm" id="signUp" class="h-full w-full">
      <AuthSignUp
        @isToggleForm="toggleForm()"
        @isCloseProfile="closeProfile()"
        :neonState="neon"
        @isUserSignIn="userSingIn()"
        @load="getIsLoad($event)"
        :showBtnClose="showBtnClose"
      >
      </AuthSignUp>
    </div>
    <div v-if="isToggleForm" id="signIn" class="h-full w-full">
      <AuthSignIn
        @isToggleForm="toggleForm()"
        @isCloseProfile="closeProfile()"
        :neonState="neon"
        @isUserSignIn="userSingIn()"
        @load="getIsLoad($event)"
        :showBtnClose="showBtnClose"
      >
      </AuthSignIn>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
