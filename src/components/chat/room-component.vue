<script lang="ts">
import { Subscription } from 'rxjs';
import { defineComponent } from 'vue';
import { mapActions, mapGetters } from 'vuex';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, maxLength } from '@vuelidate/validators';
import MessagesComponent from '@/components/chat/messages-component.vue';

export default defineComponent({
  name: 'RoomComponent',
  components: {
    MessagesComponent,
  },
  props: {},
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      currChat$: new Subscription(),
      messages$: new Subscription(),
      isHideProfile: true,
      textAreaRows: 1,
      currChat: '',
      message: '',
      isLockControl: false,
      messageLength: {
        min: 1,
        max: 200,
      },
    };
  },
  methods: {
    ...mapActions({
      trySetCurrChat: 'chat/profile/SET_CURR_CHAT',
      tryOutChat: 'chat/profile/OUT_CHAT',
      trySignOut: 'chat/profile/SIGN_OUT',
      isHideCreate: 'chat/profile/IS_HIDE_CREATE',
      isHideJoin: 'chat/profile/IS_HIDE_JOIN',
      addMessage: 'chat/profile/ADD_MESSAGE',
    }),
    toggleProfile() {
      this.isHideProfile = !this.isHideProfile;
    },
    setCurrChat(chat: string) {
      this.trySetCurrChat(chat);
    },
    outChat(chatName: string) {
      this.tryOutChat(chatName);
    },
    signOut() {
      this.trySignOut();
      this.isHideProfile = true;
    },
    async onSubmit() {
      const isFormValid = await this.v$.$validate();

      if (isFormValid) {
        const message = this.message;
        this.addMessage(message);
        this.v$.$reset();
        this.message = '';
      }
    },
    onKeyUp(event: any) {
      if (event.key === 'Enter' && !event.shiftKey) {
        this.onSubmit();
      }
    },
    create() {
      this.isHideCreate(false);
    },
    join() {
      this.isHideJoin(false);
    },
  },
  computed: {
    ...mapGetters({
      neon: 'neon/GET_STATE_NEON',
      getCurrChat: 'chat/profile/CURR_CHAT',
      messages: 'chat/profile/MESSAGES',
      chats: 'chat/profile/CHATS',
      isLoad: 'chat/profile/IS_LOAD_PROFILE',
      userData: 'auth/USER_DATA',
    }),
    isSelectChat(): boolean {
      return this.currChat.trim() && this.currChat.length > 0 ? false : true;
    },
    isChats(): boolean {
      return this.chats.length >= 0 ? true : false;
    },
    userName(): string | undefined {
      // eslint-disable-next-line no-extra-boolean-cast
      return !!this.userData.name ? this.userData.name : 'user';
    },
  },
  mounted() {
    this.currChat$ = this.getCurrChat.subscribe((observer: string | null) => {
      // eslint-disable-next-line no-extra-boolean-cast
      if (!!observer) {
        this.currChat = observer;
        this.isHideProfile = true;
        this.isLockControl = false;
      } else {
        this.isLockControl = true;
        this.currChat = '';
      }
    });

    this.messages$ = this.messages.subscribe((observer: any) => {
      this.$nextTick(() => {
        setTimeout(() => {
          const el = document.getElementById('messagesItems');
          // eslint-disable-next-line no-extra-boolean-cast
          if (!!el) {
            el.scrollTop = el.scrollHeight;
          }
        }, 100);
      });
    });
  },
  unmounted() {
    this.currChat$.unsubscribe();
    this.messages$.unsubscribe();
  },
  validations() {
    return {
      message: {
        required,
        minLength: minLength(this.messageLength.min),
        maxLength: maxLength(this.messageLength.max),
      },
    };
  },
});
</script>

<template>
  <div class="h-full flex flex-col scroll">
    <div class="flex-[0_0_40px] flex flex-row justify-between items-center bg-cyan-800 rounded-tl-lg rounded-tr-lg p-3">
      <div class="relative h-full">
        <button
          @click="toggleProfile()"
          type="button"
          class="btn-profile min-w-[100px] h-full capitalize py-1 px-2 rounded-t-md bg-sky-700 hover:bg-sky-500 transition-all duration-300"
          :class="{
            'rounded-b-md ': isHideProfile,
            'bg-sky-600': !isHideProfile,
            grayscale: isLoad,
          }"
        >
          {{ userName }}
          <span :class="{ 'rotate-180': !isHideProfile }" class="inline-block transition-all duration-200">
            <i class="bi bi-caret-down-fill"></i
          ></span>
        </button>
        <div
          :class="{ 'opacity-0 scale-0': isHideProfile, 'opacity-1 scale-1': !isHideProfile }"
          class="absolute top-full left-0 bg-sky-700 flex flex-col gap-y-1 py-1 z-10 last:rounded-b-lg transition-all duration-100 ease-[cubic-bezier(0.35, 0, 0.25, 1)]"
        >
          <button
            @click="create()"
            type="button"
            class="btn-create capitalize hover:bg-teal-500 transition-all duration-300 text-left p-1"
          >
            создать
          </button>
          <button
            @click="join()"
            type="button"
            class="btn-join capitalize hover:bg-teal-500 transition-all duration-300 text-left p-1"
          >
            присоединится
          </button>
          <div class="text-center hover:bg-sky-500 transition-all duration-300">
            <div class="menu text-center relative flex flex-row gap-x-2 justify-between items-center p-1">
              <div class="capitalize">чаты</div>
              <div class=""><i class="bi bi-caret-right-fill"></i></div>
              <ul
                v-if="chats.length > 0"
                class="menu__submenu absolute top-0 left-full flex flex-col w-full bg-sky-700 capitalize"
              >
                <li
                  class="hover:bg-sky-500 flex flex-row justify-between my-1 p-1"
                  :class="{ 'bg-teal-500': chat === currChat }"
                  v-for="(chat, idx) of chats"
                  :key="idx"
                >
                  <button type="button" class="btn-join-chat capitalize w-full text-left" @click="setCurrChat(chat)">
                    {{ chat }}
                  </button>
                  <div class="flex-[0_1_25%] bg-purple-500 rounded">
                    <button @click="outChat(chat)" type="button" class="btn-out-chat text-red-600 hover:text-red-400">
                      <i class="bi bi-x-lg"></i>
                    </button>
                  </div>
                </li>
              </ul>
              <div
                v-if="chats.length < 1"
                class="menu__submenu absolute top-0 left-full w-full whitespace-nowrap bg-sky-700 first-letter:uppercase"
              >
                пусто
              </div>
            </div>
          </div>
          <button
            @click="signOut()"
            type="button"
            class="btn-signout capitalize hover:bg-red-500 transition-all duration-300 text-left p-1"
          >
            выйти
          </button>
        </div>
      </div>
      <div class="flex flex-row gap-x-3 items-center justify-center">
        <h3 class="first-letter:uppercase min-w-[50px] text-center">
          {{ currChat }}
        </h3>
        <div class="h-6 w-6">
          <img
            :class="{ grayscale: currChat === undefined }"
            class="max-h-full max-w-full"
            :src="require(`@/assets/img/chat/icon-room.png`)"
            :alt="'chat'"
          />
        </div>
      </div>
    </div>
    <div id="messagesItems" class="messages flex-[0_0_365px] overflow-y-auto relative h-full">
      <MessagesComponent />
      <div v-if="isLoad" class="absolute top-0 left-0 w-full h-full flex justify-center items-center">
        <div class="w-32 h-32 z-[2]">
          <img class="w-full h-full" :src="require(`@/assets/img/load-chat.svg`)" :alt="'load'" />
        </div>
      </div>
      <div
        v-if="currChat.length < 1"
        class="absolute top-0 left-0 w-full h-full bg-[#6964649c] flex justify-center items-center"
      >
        <span v-if="!isLoad" class="first-letter:uppercase">чат не выбран</span>
      </div>
    </div>
    <form
      class="flex-[0_0_64px] flex flex-row gap-x-3 items-center bg-cyan-800 rounded-bl-lg rounded-br-lg overflow-hidden p-2"
      @submit.prevent="onSubmit()"
    >
      <div class="flex-auto flex w-full">
        <textarea
          class="text-black w-full h-full p-2 rounded-lg resize-none"
          :rows="textAreaRows"
          :disabled="'disabled' ? isSelectChat : ''"
          @keyup="onKeyUp($event)"
          :maxLength="messageLength.max"
          v-model.trim="message"
        ></textarea>
      </div>
      <button
        class="btn-submit text-2xl transition-all duration-300"
        :class="{ 'text-slate-400': isSelectChat }"
        :disabled="'disabled' ? isSelectChat : ''"
        v-textShadow="{
          isNeon: this.neon,
          color: '#fff',
          colorShadow: '#fff',
          styleShadow: 'medium',
          isSetColor: true,
          isHover: true,
        }"
        type="submit"
      >
        <i class="bi bi-send-fill"></i>
      </button>
    </form>
  </div>
</template>

<style scoped lang="scss">
.messages {
  background: #c25986;
  background: linear-gradient(42deg, #c25986 0%, #5a88bf 100%) fixed;
}

.scroll {
  ::-webkit-scrollbar {
    width: 10px;
    background-color: #143861;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #843465;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: #995780;
  }
}

.menu {
  &:hover {
    .menu__submenu {
      display: block;
    }
  }
  &__submenu {
    display: none;
  }
}
</style>
