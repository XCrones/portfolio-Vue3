import axios from 'axios';
import { BehaviorSubject, Subject } from 'rxjs';
import { GetterTree, MutationTree, ActionTree } from 'vuex';

const apiBaseURL = 'https://fakestoreapi.com';

export interface IProductsV2 {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

class State {
  readonly filters = ['цене', 'рейтингу', 'остатку'];
  сurrFilter: string = this.filters[0];
  stateCurrFilter = true;
  isHideFilters = true;
  search = '';
  products$: BehaviorSubject<IProductsV2[]> = new BehaviorSubject<IProductsV2[]>([]);
}
const getters = <GetterTree<State, any>>{
  GET_ALL(state): Subject<IProductsV2[]> {
    return state.products$;
  },
  FIND_ITEM:
    (state) =>
    (id: number): IProductsV2 | undefined => {
      return state.products$.value.find((product) => product.id === id);
    },
  FILTERS(state): string[] {
    return state.filters;
  },
  CURR_FILTER(state): string {
    return state.сurrFilter;
  },
  IS_HIDE_FILTER(state): boolean {
    return state.isHideFilters;
  },
  STATE_CURR_FILTER(state): boolean {
    return state.stateCurrFilter;
  },
  SEARCH(state): string {
    return state.search;
  },
};

const mutations = <MutationTree<State>>{
  CURR_FILTER(state, value: string) {
    state.сurrFilter = value;
  },
  IS_HIDE_FILTER(state, value: boolean) {
    state.isHideFilters = value;
  },
  STATE_CURR_FILTER(state, value: boolean) {
    state.stateCurrFilter = value;
  },
  SEARCH(state, value: string) {
    state.search = value;
  },
};

const actions = <ActionTree<State, any>>{
  CURR_FILTER(context, value: string) {
    context.commit('CURR_FILTER', value);
  },
  IS_HIDE_FILTER(context, value: boolean) {
    context.commit('IS_HIDE_FILTER', value);
  },
  STATE_CURR_FILTER(context, value: boolean) {
    context.commit('STATE_CURR_FILTER', value);
  },
  SEARCH(context, value: string) {
    context.commit('SEARCH', value);
  },
  async TRY_PRODUCTS(context) {
    await axios.get(`${apiBaseURL}/products`).then((response) => context.state.products$.next(response.data));
  },
};

const ProductsModule = {
  namespaced: true,
  state: new State(),
  getters: getters,
  mutations: mutations,
  actions: actions,
};

export default ProductsModule;
