import { GetterTree, MutationTree, ActionTree } from 'vuex';

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

const InfoModule = {
  namespaced: true,
  state: new State(),
  getters: getters,
  mutations: mutations,
  actions: actions,
};

export default InfoModule;
