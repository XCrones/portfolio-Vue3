import { GetterTree, MutationTree, ActionTree } from 'vuex';

export interface ICategories {
  items: string[];
  currCategori: string;
}

export interface ICategoriMoveUp {
  arr: string[];
  currCategori: string;
}

class State {
  readonly defaultCategori: string = 'none';
  categories: string[] = [];
}
const getters = <GetterTree<State, any>>{};
const mutations = <MutationTree<State>>{};
const actions = <ActionTree<State, any>>{
  async makeUniqCategories(context, arr: string[]): Promise<string[]> {
    const tempArr = [...context.state.categories, ...arr, context.state.defaultCategori];
    const uniqSet = new Set(tempArr);
    return await context.dispatch('sortCategories', [...uniqSet]);
  },

  sortCategories(context, arr: Array<string>): string[] {
    arr.sort(function (a, b) {
      return a < b ? -1 : a > b ? 1 : 0;
    });
    return [...arr];
  },

  moveUpCurrCategori(context, obj: ICategoriMoveUp): string[] {
    if (obj.currCategori != null || obj.currCategori != undefined) {
      obj.currCategori = obj.currCategori.length < 1 ? context.state.defaultCategori : obj.currCategori;
      if (obj.arr.includes(obj.currCategori)) {
        const fromIndex = obj.arr.indexOf(obj.currCategori);
        obj.arr.splice(fromIndex, 1);
      }
      obj.arr.unshift(obj.currCategori);
    }
    return obj.arr;
  },

  async UPDATE(context, data: ICategories): Promise<string[]> {
    const uniqCategories = await context.dispatch('makeUniqCategories', data.items, { root: false });
    const moveUp: ICategoriMoveUp = {
      arr: uniqCategories,
      currCategori: data.currCategori,
    };
    context.state.categories = await context.dispatch('moveUpCurrCategori', moveUp, { root: false });

    if (context.state.categories.length > 24) {
      context.state.categories.length = 24;
    }
    return context.state.categories;
  },
};

const TodoCategoriModule = {
  namespaced: true,
  state: new State(),
  getters: getters,
  mutations: mutations,
  actions: actions,
};

export default TodoCategoriModule;
