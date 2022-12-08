<script lang="ts">
import InfoComponent from '@/components/info/info-component.vue';
import ProjectMenuComponent from '@/components/project-menu/project-menu-component.vue';
import ModalComponent from '@/components/todo/modal-component.vue';
import PanelComponent from '@/components/todo/panel.component.vue';
import PopupComponent from '@/components/todo/popup-component.vue';
import TableComponent from '@/components/todo/table-component.vue';
import { mapActions, mapGetters } from 'vuex';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TodoView',
  components: {
    ProjectMenuComponent,
    InfoComponent,
    PanelComponent,
    TableComponent,
    ModalComponent,
    PopupComponent,
  },
  props: {},
  data() {
    return {
      metaMenu: {
        link: 'https://github.com/XCrones/portfolio-Vue3/tree/main/src/views/todo',
        title: 'todo',
        color: '#00c3ff',
      },
    };
  },
  methods: {
    ...mapActions({
      setIsHideProjects: 'projects/SET_IS_HIDE',
      isHideHeader: 'header/SET_HIDE',
    }),
  },
  computed: {
    ...mapGetters({
      isHideModal: 'todo/modal/IS_HIDE',
      isHidePopup: 'todo/popup/IS_HIDE',
      isHideInfo: 'info/IS_HIDE',
      aboutData: 'todo/about/ABOUT_PROJECT',
    }),
  },
  mounted() {
    this.setIsHideProjects(true);
    this.isHideHeader(true);
  },
  unmounted() {
    this.setIsHideProjects(false);
    this.isHideHeader(false);
  },
});
</script>

<template>
  <div class="h-full w-full flex flex-col px-2 lg:px-9 pb-3">
    <ProjectMenuComponent :metaData="metaMenu" />
    <div class="h-full w-full flex flex-col gap-y-2 lg:gap-y-5 relative">
      <div class="flex-auto">
        <PanelComponent />
      </div>
      <div class="flex-auto h-full w-full">
        <TableComponent />
      </div>
      <div
        :class="{ 'opacity-0 scale-0': isHideModal, 'opacity-1 scale-1': !isHideModal }"
        class="absolute top-0 left-0 w-full h-full bg-[#29557979] z-20 transition-all duration-300 ease-[cubic-bezier(0.35, 0, 0.25, 1)]"
      >
        <ModalComponent />
      </div>
      <div
        :class="{ 'opacity-0 scale-0': isHidePopup, 'opacity-1 scale-1': !isHidePopup }"
        class="absolute top-0 left-0 w-full h-full bg-[#29557979] z-20 transition-all duration-300 ease-[cubic-bezier(0.35, 0, 0.25, 1)]"
      >
        <PopupComponent />
      </div>
      <div
        :class="{ 'opacity-0 scale-0': isHideInfo, 'opacity-1 scale-1': !isHideInfo }"
        class="absolute top-0 left-0 w-full h-full bg-[#29557979] z-20 transition-all duration-300 ease-[cubic-bezier(0.35, 0, 0.25, 1)]"
      >
        <InfoComponent :info="aboutData" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
