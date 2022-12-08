import { GetterTree, MutationTree, ActionTree } from 'vuex';

class State {
  neon = true;
}
const getters = <GetterTree<State, any>>{
  GET_STATE_NEON(state): boolean {
    return state.neon;
  },
};
const mutations = <MutationTree<State>>{
  TOGGLE_NEON(state) {
    state.neon = !state.neon;
  },
};
const actions = <ActionTree<State, any>>{
  TOGGLE_NEON(context) {
    context.commit('TOGGLE_NEON');
  },
};
const NeonModule = {
  namespaced: true,
  state: new State(),
  getters: getters,
  mutations: mutations,
  actions: actions,
};

export default NeonModule;
