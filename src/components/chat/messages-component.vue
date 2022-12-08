<script lang="ts">
import { IMessagesItem } from '@/store/modules/chat/profile-module';
import { Subscription } from 'rxjs';
import { defineComponent } from 'vue';
import { mapActions, mapGetters } from 'vuex';

export default defineComponent({
  name: 'MessagesComponent',
  components: {},
  props: {},
  data() {
    return {
      currChat$: new Subscription(),
      messages$: new Subscription(),
      messages: [],
      currChat: '',
      message: '',
    };
  },
  methods: {
    ...mapActions({
      tryDeleteMessage: 'chat/profile/DELETE_MESSAGE',
    }),
    deleteMessage(message: IMessagesItem) {
      if (message.uid === this.uid) {
        this.tryDeleteMessage(message);
      }
    },
    parseTime(value: string): string {
      // eslint-disable-next-line no-extra-boolean-cast
      if (!!value) {
        let getTime = value.split('T')[1];
        let time = getTime.split(':');
        time.pop();
        return time.join(':');
      }
      return value;
    },
  },
  computed: {
    ...mapGetters({
      getCurrChat: 'chat/profile/CURR_CHAT',
      getMessages: 'chat/profile/MESSAGES',
      userData: 'auth/USER_DATA',
    }),
    uid(): string {
      return this.userData.uid;
    },
  },
  mounted() {
    this.currChat$ = this.getCurrChat.subscribe((observer: string | null) => {
      // eslint-disable-next-line no-extra-boolean-cast
      if (!!observer) {
        this.currChat = observer;
      } else {
        this.currChat = '';
      }
    });

    this.messages$ = this.getMessages.subscribe((observer: any) => {
      // eslint-disable-next-line no-extra-boolean-cast
      if (!!observer) {
        this.messages = observer;
      }
    });
  },
  unmounted() {
    this.currChat$.unsubscribe();
    this.messages$.unsubscribe();
  },
});
</script>

<template>
  <div class="h-full flex justify-center items-center" v-if="messages.length < 1 && currChat.length > 0">
    сообщений нет..
  </div>
  <div v-if="messages.length > 0" class="messages h-full flex flex-col gap-y-3 p-2 relative">
    <div
      class="messages__item w-full flex last:pb-4"
      v-for="(item, idx) of messages"
      :key="idx"
      :class="{
        'justify-start': item.uid != uid,
        'justify-end': item.uid === uid,
      }"
    >
      <div class="flex flex-row gap-x-1 items-end">
        <div
          :class="{
            'order-last': item.uid === uid,
          }"
          class="h-5 w-5"
        >
          <img class="w-full h-full" :src="require(`@/assets/img/chat/user.png`)" :alt="'user'" />
        </div>
        <div
          :class="{
            'rounded-bl-3xl': item.uid === uid,
            'rounded-br-3xl': item.uid != uid,
          }"
          class="flex flex-col gap-x-1 bg-[#2525308c] rounded-tl-3xl rounded-tr-3xl p-2"
        >
          <div
            class="text-sm capitalize"
            :class="{
              'text-right text-sky-400': item.uid === uid,
              'text-left text-orange-400': item.uid != uid,
            }"
          >
            {{ item.name }}
          </div>
          <div class="max-w-[200px] min-w-[80px] break-all text-sm">
            {{ item.message }}
          </div>
          <div
            class="w-full flex flex-row px-1 h-4 items-center"
            :class="{
              'justify-between': item.uid === uid,
              'justify-end': item.uid != uid,
            }"
          >
            <button
              :disabled="'disabled' ? item.uid != uid : ''"
              @click="deleteMessage(item)"
              :class="{
                'order-last': item.uid === uid,
                hidden: item.uid != uid,
              }"
              type="button"
              class="messages__delete text-red-700 hover:text-red-500 transition-all duration-300"
            >
              <i class="bi bi-trash2-fill"></i>
            </button>
            <div class="messages__date text-xs">
              {{ parseTime(item.date) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
