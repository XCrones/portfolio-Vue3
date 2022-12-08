import { GetterTree, MutationTree, ActionTree } from 'vuex';

export interface INavItem {
  link: string;
  title: string;
}

export interface IProjects {
  title: string;
  link: string | undefined;
}

class State {
  isHide = false;

  itemsNav: INavItem[] = [
    {
      link: 'home',
      title: 'главная',
    },
    {
      link: 'projects',
      title: 'проекты',
    },
    {
      link: 'contacts',
      title: 'контакты',
    },
  ];

  projects: IProjects[] = [
    {
      title: 'angular',
      link: 'https://any-dea-angular.web.app',
    },
    {
      title: 'react',
      link: undefined, //'https://any-dea-react.web.app'
    },
    {
      title: 'vue',
      link: 'https://anydea-vue.web.app/',
    },
  ];
}
const getters = <GetterTree<State, any>>{
  ITEMS_NAV(state): INavItem[] {
    return state.itemsNav;
  },
  IS_HIDE(state): boolean {
    return state.isHide;
  },
  PROJECTS(state): IProjects[] {
    return state.projects;
  },
};
const mutations = <MutationTree<State>>{
  SET_HIDE(state, stateIsHide) {
    state.isHide = stateIsHide;
  },
};
const actions = <ActionTree<State, any>>{
  SET_HIDE(context, stateIsHide) {
    context.commit('SET_HIDE', stateIsHide);
  },
};

const HeaderModule = {
  namespaced: true,
  state: new State(),
  getters: getters,
  mutations: mutations,
  actions: actions,
};

export default HeaderModule;
