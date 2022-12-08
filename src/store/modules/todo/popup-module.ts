import { BehaviorSubject, Subject } from 'rxjs';
import { GetterTree, MutationTree, ActionTree } from 'vuex';
import { ITasks } from './tasks-module';

class State {
  isHide = true;
  isNew = false;
  editItem$: BehaviorSubject<ITasks> = new BehaviorSubject<ITasks>({
    id: 0,
    name: '',
    category: 'none',
    priority: 0,
    date: '',
    status: false,
    description: '',
  });
}
const getters = <GetterTree<State, any>>{
  IS_HIDE(state): boolean {
    return state.isHide;
  },
  GET_EDIT_ITEM(state): Subject<ITasks> {
    return state.editItem$;
  },
};
const mutations = <MutationTree<State>>{
  TOGGLE_IS_HIDE(state) {
    state.isHide = !state.isHide;
  },
  CLOSE(state) {
    state.isHide = true;
  },
  SET_EDIT_ITEM(state, item) {
    state.isNew = false;
    state.isHide = false;
    state.editItem$.next(item);
  },
  CREATE_NEW(state) {
    state.isNew = true;
    state.isHide = false;
    state.editItem$.next({
      id: 0,
      name: '',
      category: 'none',
      priority: 0,
      date: '',
      status: false,
      description: '',
    });
  },
};
const actions = <ActionTree<State, any>>{
  TOGGLE_IS_HIDE(context) {
    context.commit('TOGGLE_IS_HIDE');
  },
  CLOSE(context) {
    context.commit('CLOSE');
  },
  SET_EDIT_ITEM(context, item: ITasks) {
    context.commit('SET_EDIT_ITEM', item);
  },
  CREATE_NEW(state) {
    state.commit('CREATE_NEW');
  },
  async SAVE_ITEM(context, item: ITasks) {
    if (context.state.isNew) {
      await context.dispatch('todo/tasks/PUSH_NEW', item, { root: true });
    } else {
      await context.dispatch('todo/tasks/SAVE_EDITED', item, { root: true });
    }
    context.commit('CLOSE');
  },
};

const TodoPopupModule = {
  namespaced: true,
  state: new State(),
  getters: getters,
  mutations: mutations,
  actions: actions,
};

export default TodoPopupModule;
