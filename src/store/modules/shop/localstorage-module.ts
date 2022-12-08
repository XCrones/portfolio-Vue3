import { GetterTree, MutationTree, ActionTree } from 'vuex';

export interface ISetItemStorage {
  key: string;
  value: string;
}

class State {}
const getters = <GetterTree<State, any>>{};
const mutations = <MutationTree<State>>{};
const actions = <ActionTree<State, any>>{
  GET_ITEM(context, key: string): string {
    if (key != undefined && key != null) {
      const temp = localStorage.getItem(key);
      // eslint-disable-next-line no-extra-boolean-cast
      return !!temp ? temp : '';
    }
    return '';
  },
  SET_ITEM(context, data: ISetItemStorage) {
    if (data.key != undefined && data.key != null) {
      localStorage.setItem(data.key, data.value);
    }
  },
  REMOVE_ITEM(context, key: string) {
    if (key != undefined && key != null) {
      localStorage.removeItem(key);
    }
  },
};

const LocalStorageModule = {
  namespaced: true,
  state: new State(),
  getters: getters,
  mutations: mutations,
  actions: actions,
};

export default LocalStorageModule;
