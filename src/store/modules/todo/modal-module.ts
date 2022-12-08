import { GetterTree, MutationTree, ActionTree } from 'vuex';
import { IDelete } from './tasks-module';

export interface IModal {
  isGlobal: boolean;
  id: number;
  title: string;
}

class State {
  isHide = true;
  dataDelete: IModal = {
    id: 0,
    isGlobal: false,
    title: 'empty',
  };
}
const getters = <GetterTree<State, any>>{
  IS_HIDE(state): boolean {
    return state.isHide;
  },
  DELETE_TITLE(state): string {
    return state.dataDelete.title;
  },
};
const mutations = <MutationTree<State>>{
  TOGGLE_IS_HIDE(state) {
    state.isHide = !state.isHide;
  },
  SET_DELETE_TASK(state, dataDelete: IModal) {
    Object.assign(state.dataDelete, dataDelete);
    if (state.dataDelete.isGlobal) {
      state.dataDelete.title = 'удалить всё?';
    }
    state.isHide = false;
  },
};
const actions = <ActionTree<State, any>>{
  TOGGLE_IS_HIDE(context) {
    context.commit('TOGGLE_IS_HIDE');
  },
  SET_DELETE_TASK(context, dataDelete: IModal) {
    context.commit('SET_DELETE_TASK', dataDelete);
  },
  CONFIRM(context, response: boolean) {
    if (!context.state.dataDelete.isGlobal) {
      if (response) {
        const deleteItem: IDelete = {
          itemId: context.state.dataDelete.id,
        };
        context.dispatch('todo/tasks/TASK_DELETE', deleteItem, { root: true });
      }
    } else {
      if (response) {
        const deleteItem: IDelete = {
          itemId: 0,
          isGlobal: response,
        };
        context.dispatch('todo/tasks/TASK_DELETE', deleteItem, { root: true });
      }
    }
    context.state.isHide = true;
  },
};

const TodoModalModule = {
  namespaced: true,
  state: new State(),
  getters: getters,
  mutations: mutations,
  actions: actions,
};

export default TodoModalModule;
