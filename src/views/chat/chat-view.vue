<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapGetters } from 'vuex';
import ProjectMenuComponent from '@/components/project-menu/project-menu-component.vue';
import RoomComponent from '@/components/chat/room-component.vue';
import InfoComponent from '@/components/info/info-component.vue';
import AddCrateComponent from '@/components/chat/add-create-component.vue';
import AuthComponent from '@/components/auth/auth-component.vue';

export default defineComponent({
  name: 'ChatView',
  components: {
    ProjectMenuComponent,
    RoomComponent,
    InfoComponent,
    AddCrateComponent,
    AuthComponent,
  },
  props: {},
  data() {
    return {
      metaMenu: {
        link: 'https://github.com/XCrones/portfolio-angular-14/tree/main/src/app/modules/chat',
        title: 'chat',
        color: '#00c3ff',
      },
      isLoadJoinCreate: false,
      responseCreate: '',
    };
  },
  methods: {
    ...mapActions({
      setIsHideProjects: 'projects/SET_IS_HIDE',
      isHideHeader: 'header/SET_HIDE',
      tryProfile: 'chat/profile/TRY_PROFILE',
      setIsHideCreate: 'chat/profile/IS_HIDE_CREATE',
      setIsHideJoin: 'chat/profile/IS_HIDE_JOIN',
      tryCreateChat: 'chat/profile/CREATE_CHAT',
      tryJoinChat: 'chat/profile/JOIN_CHAT',
    }),

    async createChat(nameChat: string) {
      this.isLoadJoinCreate = true;
      this.responseCreate = '';
      const result = await this.tryCreateChat(nameChat);
      if (result) {
        this.resetJoinCreate();
      } else {
        this.responseCreate = 'имя чата занято';
      }
      this.isLoadJoinCreate = false;
    },

    async joinChat(nameChat: string) {
      this.isLoadJoinCreate = true;
      this.responseCreate = '';
      const result = await this.tryJoinChat(nameChat);
      if (result) {
        this.resetJoinCreate();
      } else {
        this.responseCreate = `чата ${nameChat} не существует`;
      }
      this.isLoadJoinCreate = false;
    },

    resetJoinCreate() {
      this.isLoadJoinCreate = false;
      this.responseCreate = '';
      this.setIsHideCreate(true);
      this.setIsHideJoin(true);
    },
  },
  computed: {
    ...mapGetters({
      isHideInfo: 'info/IS_HIDE',
      aboutData: 'chat/about/ABOUT_PROJECT',
      isAuth: 'auth/IS_AUTH',
      neon: 'neon/GET_STATE_NEON',
      isLoadProfile: 'chat/profile/IS_LOAD_PROFILE',
      isHideCreate: 'chat/profile/IS_HIDE_CREATE',
      isHideJoin: 'chat/profile/IS_HIDE_JOIN',
    }),
  },
  mounted() {
    this.setIsHideProjects(true);
    this.isHideHeader(true);
    this.tryProfile();
  },
  unmounted() {
    this.setIsHideProjects(false);
    this.isHideHeader(false);
  },
});
</script>

<template>
  <div class="h-full w-full flex flex-col px-2 pb-3">
    <ProjectMenuComponent :metaData="metaMenu" />
    <div class="flex flex-row items-center justify-center relative gap-x-2 w-full h-full">
      <div class="flex-grow-0 flex-shrink basis-full sm:basis-[70%] lg:basis-[50%] h-full relative">
        <RoomComponent />
        <div v-if="isLoadProfile" class="absolute top-0 left-0 w-full h-full flex justify-center items-center">
          <div class="w-32 h-32 z-[2]">
            <img class="max-h-full max-w-full" :src="require(`@/assets/img/load-chat.svg`)" alt="load" />
          </div>
        </div>
      </div>
      <div
        :class="{ 'opacity-0 scale-0': isHideInfo, 'opacity-1 scale-1': !isHideInfo }"
        class="absolute top-0 left-0 w-full h-full bg-[#29557979] z-50 transition-all duration-300 ease-[cubic-bezier(0.35, 0, 0.25, 1)]"
      >
        <InfoComponent :info="aboutData" />
      </div>
      <div
        :class="{ 'opacity-0 scale-0': isAuth, 'opacity-1 scale-1': !isAuth }"
        class="absolute top-0 left-0 w-full h-full z-10 transition-all duration-300 ease-[cubic-bezier(0.35, 0, 0.25, 1)]"
      >
        <div class="h-full flex justify-center items-center">
          <div class="flex-grow-0 flex-shrink basis-full sm:basis-[50%] lg:basis-[30%] bg-[#1d3a52c5] rounded-[6px]">
            <AuthComponent :showBtnClose="false" :callbackTryProfile="tryProfile"></AuthComponent>
          </div>
        </div>
      </div>
      <div
        :class="{ 'opacity-0 scale-0': isHideCreate, 'opacity-1 scale-1': !isHideCreate }"
        class="absolute top-0 left-0 w-full h-full z-10 transition-all duration-300 ease-[cubic-bezier(0.35, 0, 0.25, 1)]"
      >
        <div class="h-full flex justify-center items-center">
          <div class="flex-grow-0 flex-shrink basis-full sm:basis-2/5 bg-[#1d3a52c5] rounded-[6px]">
            <AddCrateComponent
              v-if="!isHideCreate"
              @nameChat="createChat"
              @isCancel="resetJoinCreate"
              :isLoad="isLoadJoinCreate"
              :responseErr="responseCreate"
              @isJoinChat="joinChat"
            >
              <template v-slot:btnSubmit>
                <span class="inline-block">создать</span>
              </template>
              <template v-slot:nameForm>
                <span class="inline-block">создать</span>
              </template>
            </AddCrateComponent>
          </div>
        </div>
      </div>
      <div
        :class="{ 'opacity-0 scale-0': isHideJoin, 'opacity-1 scale-1': !isHideJoin }"
        class="absolute top-0 left-0 w-full h-full z-10 transition-all duration-300 ease-[cubic-bezier(0.35, 0, 0.25, 1)]"
      >
        <div class="h-full flex justify-center items-center">
          <div class="flex-grow-0 flex-shrink basis-full sm:basis-2/5 bg-[#1d3a52c5] rounded-[6px]">
            <AddCrateComponent
              v-if="!isHideJoin"
              @nameChat="joinChat"
              @isCancel="resetJoinCreate"
              :isLoad="isLoadJoinCreate"
              :responseErr="responseCreate"
              @isCretaeChat="createChat"
            >
              <template v-slot:btnSubmit>
                <span class="inline-block">присоединится</span>
              </template>
              <template v-slot:nameForm>
                <span class="inline-block">присоединится</span>
              </template>
            </AddCrateComponent>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
