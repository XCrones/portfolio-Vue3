import { GetterTree, MutationTree, ActionTree } from 'vuex';
import { IProductsV2 } from './products';

class State {
  isHide = true;
  product: IProductsV2 = {
    id: 0,
    title: '',
    price: 0,
    description: '',
    category: '',
    image: '',
    rating: {
      rate: 0,
      count: 0,
    },
  };
}

const getters = <GetterTree<State, any>>{
  IS_HIDE(state): boolean {
    return state.isHide;
  },
  PRODUCT(state): IProductsV2 {
    return state.product;
  },
};

const mutations = <MutationTree<State>>{
  SHOW(state, product: IProductsV2) {
    state.product = product;
    state.isHide = false;
  },
  CLOSE(state) {
    state.isHide = true;
  },
};

const actions = <ActionTree<State, any>>{
  SHOW(context, product: IProductsV2) {
    context.commit('SHOW', product);
  },

  CLOSE(context) {
    context.commit('CLOSE');
  },
};

const ShopPopupModule = {
  namespaced: true,
  state: new State(),
  getters: getters,
  mutations: mutations,
  actions: actions,
};

export default ShopPopupModule;
