<script lang="ts">
import ShadowSevice from '@/ui/shadow-neon/shadow-neon';
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

export default defineComponent({
  name: 'ContactsView',
  components: {},
  props: {},
  data() {
    return {
      activeLink: '',
      isCopied: false,
      bgBlue: '#343c4e',
      bgLink: '#284ca0',
      shadowService: new ShadowSevice(),
    };
  },
  methods: {
    toggleLink(link: string) {
      this.activeLink = this.activeLink === link ? '' : link;
      this.isCopied = false;
    },
    async onCopy(value: string) {
      try {
        await navigator.clipboard.writeText(value);
        this.isCopied = true;
      } catch (e) {
        this.isCopied = false;
      }
    },
    animContacts() {
      let time = 300;
      for (let index = 0; index < this.contacts.length; index++) {
        const element = this.contacts[index];
        setTimeout(() => {
          this.toggleLink(element.service);
        }, time);
        time += 300;
      }
      setTimeout(() => {
        this.toggleLink('');
      }, time);
    },
    getLink(value: string): string {
      return value;
    },
  },
  computed: {
    ...mapGetters({
      contacts: 'contacts/contacts',
      neon: 'neon/GET_STATE_NEON',
    }),
    colorGreen(): string {
      return this.shadowService.colorGreen;
    },
    colorNeonGreen(): string {
      return this.shadowService.colorNeonGreen;
    },
  },
  mounted() {
    this.animContacts();
  },
});
</script>

<template>
  <div class="flex flex-col h-full w-full text-white justify-center items-center py-8 overflow-hidden">
    <div class="flex flex-col lg:flex-row">
      <button
        class="capitalize flex flex-col lg:flex-row items-center transition-button relative"
        v-for="(contact, idx) of contacts"
        :key="idx"
        :class="{ '-translate-x-[80%] lg:-translate-x-[0px] lg:-translate-y-[120px]': activeLink === contact.service }"
      >
        <div
          v-if="idx != 0"
          :class="{
            'scale-0': idx != contacts.length - 1 && activeLink === contact.service,
            'shadow-neon-red': neon,
          }"
          class="h-9 lg:h-1 w-1 lg:w-9 transition-button"
          :style="{ background: colorGreen }"
        ></div>
        <div
          @click="toggleLink(contact.service)"
          :class="{ 'shadow-neon-red': neon }"
          class="inline-block rounded-2xl p-4 lg:p-6 transition-all duration-500 border-[5px] border-solid"
          :style="{ 'border-color': colorNeonGreen, background: bgBlue }"
        >
          <div class="w-[64px] h-[64px]">
            <img
              class="transition-button w-full h-full"
              :class="{ grayscale: activeLink === contact.service, 'grayscale-0': activeLink != contact.service }"
              :src="require(`@/assets/img/contacts/${contact.img}.png`)"
              :alt="contact.img"
            />
          </div>
        </div>
        <div
          v-if="idx != contacts.length - 1"
          :class="{ 'scale-0 lg:scale-100': idx != 0 && activeLink === contact.service, 'shadow-neon-red': neon }"
          class="h-9 lg:h-1 w-1 lg:w-9 transition-button"
          :style="{ background: colorGreen }"
        ></div>
        <div
          class="absolute top-1/2 -translate-y-1/2 flex flex-row items-center gap-x-2 transition-all duration-[200] ease-show-elem"
          :class="{
            'left-[130%] lg:-left-[60%]': idx === contacts.length - 1,
            'left-[129%] lg:left-[110%]': idx != contacts.length - 1,
            'opacity-0 scale-0': activeLink != contact.service,
            'opacity-1 scale-1': activeLink === contact.service,
          }"
        >
          <button @click="onCopy(contact.localLink)" type="button" class="">
            <span
              class="material-icons !text-3xl hover:text-[#00c3ff] transition-all duration-300 border-2 border-solid rounded-lg"
              :style="{ background: bgBlue, 'border-color': bgLink }"
              v-if="!isCopied"
              >add_link</span
            >
            <span
              class="material-icons text-green-500 !text-3xl hover:text-[#00c3ff] transition-all duration-300 border-2 border-solid rounded-lg"
              :style="{ background: bgBlue, 'border-color': bgLink }"
              v-if="isCopied"
              >done</span
            >
          </button>
          <a class="" :href="contact.link" target="_blank">
            <span
              class="material-icons !text-3xl hover:text-[#00c3ff] transition-all duration-300 border-2 border-solid rounded-lg"
              :style="{ background: bgBlue, 'border-color': bgLink }"
              >arrow_outward</span
            ></a
          >
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.transition-button {
  @include transition-shadow(0.4);
}

.shadow-neon-red {
  @include neon-shadow-box-medium($color-green-shadow);
}
</style>
