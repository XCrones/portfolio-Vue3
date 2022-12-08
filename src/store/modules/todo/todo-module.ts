import { GetterTree, MutationTree, ActionTree } from 'vuex';
import AboutModule from './about-module';
import TodoCategoriModule from './categories-module';
import TodoModalModule from './modal-module';
import TodoPopupModule from './popup-module';
import TodoTasksModule from './tasks-module';

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

const TodoModule = {
  namespaced: true,
  state: new State(),
  getters: getters,
  mutations: mutations,
  actions: actions,
  modules: {
    about: AboutModule,
    tasks: TodoTasksModule,
    modal: TodoModalModule,
    popup: TodoPopupModule,
    categories: TodoCategoriModule,
  },
};

export default TodoModule;
