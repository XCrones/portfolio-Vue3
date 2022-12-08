import { GetterTree, MutationTree, ActionTree } from 'vuex';

class State {
  isHide = false;
}
const getters = <GetterTree<State, any>>{
  IS_HIDE(state): boolean {
    return state.isHide;
  },
};
const mutations = <MutationTree<State>>{
  SET_IS_HIDE(state, isHide: boolean) {
    state.isHide = isHide;
  },
};
const actions = <ActionTree<State, any>>{
  SET_IS_HIDE(context, isHide: boolean) {
    context.commit('SET_IS_HIDE', isHide);
  },
};

const ProjectsModule = {
  namespaced: true,
  state: new State(),
  getters: getters,
  mutations: mutations,
  actions: actions,
};

export default ProjectsModule;
