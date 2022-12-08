import { GetterTree, MutationTree, ActionTree } from 'vuex';
import ProductsModule from './products';
import PopupModule from './popup-module';
import AboutModule from './about-module';
import ProfileModule from './profile-module';
import PurchaseModule from './purchase-module';
import FirestoreModule from './firestore-module';
import LocalStorageModule from './localstorage-module';

class State {
  cartIsHide = true;
  profileIsHide = true;
}

const getters = <GetterTree<State, any>>{
  CART_IS_HIDE(state): boolean {
    return state.cartIsHide;
  },
  PROFILE_IS_HIDE(state): boolean {
    return state.profileIsHide;
  },
  SLICE_PRICE:
    (state) =>
    (price: string): string => {
      const value = +price;
      const val = (value / 1).toFixed(2).replace(',', '.');
      return `USD ${val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    },

  SLICE_TITLE:
    (state) =>
    (value: string, maxLength: number): string => {
      return `${value.slice(0, maxLength)}...`;
    },
};

const mutations = <MutationTree<State>>{
  TOGGLE_CART(state) {
    state.profileIsHide = !state.profileIsHide ? true : state.profileIsHide;
    state.cartIsHide = !state.cartIsHide;
  },
  TOGGLE_PROFILE(state) {
    state.cartIsHide = !state.cartIsHide ? true : state.cartIsHide;
    state.profileIsHide = !state.profileIsHide;
  },
};

const actions = <ActionTree<State, any>>{
  TOGGLE_CART(context) {
    context.commit('TOGGLE_CART');
  },

  TOGGLE_PROFILE(context) {
    context.commit('TOGGLE_PROFILE');
  },
};

const ShopModule = {
  namespaced: true,
  state: new State(),
  getters: getters,
  mutations: mutations,
  actions: actions,
  modules: {
    popup: PopupModule,
    products: ProductsModule,
    about: AboutModule,
    profile: ProfileModule,
    purchase: PurchaseModule,
    firestore: FirestoreModule,
    localStorage: LocalStorageModule,
  },
};

export default ShopModule;
