import { GetterTree, MutationTree, ActionTree } from 'vuex';

export interface INavItem {
  link: string;
  title: string;
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
}
const getters = <GetterTree<State, any>>{
  ITEMS_NAV(state): INavItem[] {
    return state.itemsNav;
  },
  IS_HIDE(state): boolean {
    return state.isHide;
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
