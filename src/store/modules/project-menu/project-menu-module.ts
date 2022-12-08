import { GetterTree, MutationTree, ActionTree } from 'vuex';

export interface IProjectMenu {
  link: string;
  title: string;
  color: string;
}

class State {
  isHide = true;
}
const getters = <GetterTree<State, any>>{
  IS_HIDE(state): boolean {
    return state.isHide;
  },
};
const mutations = <MutationTree<State>>{
  TOGGLE_IS_HIDE(state) {
    state.isHide = !state.isHide;
  },
};
const actions = <ActionTree<State, any>>{
  TOGGLE_IS_HIDE(context) {
    context.commit('TOGGLE_IS_HIDE');
  },
};

const ProjectMenuModule = {
  namespaced: true,
  state: new State(),
  getters: getters,
  mutations: mutations,
  actions: actions,
};

export default ProjectMenuModule;
