import { BehaviorSubject, Subject } from 'rxjs';
import { GetterTree, MutationTree, ActionTree } from 'vuex';

export interface IPurchasesProducts {
  id: number;
  count: number;
  price: number;
}

export interface IPurchasesItem {
  date: string;
  products: IPurchasesProducts[];
}

export interface ISelectPurchaseItem {
  count: number;
  price: number;
  title: string;
  image: string;
}

export interface ISelectPurchase {
  date: string;
  price: number;
  items: ISelectPurchaseItem[];
}

class State {
  isHide = true;
  purchase$: BehaviorSubject<ISelectPurchase> = new BehaviorSubject<ISelectPurchase>({
    date: '',
    price: 0,
    items: [],
  });
}
const getters = <GetterTree<State, any>>{
  PURCHASE(state): Subject<ISelectPurchase> {
    return state.purchase$;
  },
  IS_HIDE(state): boolean {
    return state.isHide;
  },
};
const mutations = <MutationTree<State>>{
  TOGGLE_IS_HIDE(state) {
    state.isHide = !state.isHide;
  },
  OPEN(state, purchase: ISelectPurchase) {
    state.purchase$.next(purchase);
    state.isHide = false;
  },
  CLOSE(state) {
    state.purchase$.next({
      date: '',
      price: 0,
      items: [],
    });
    state.isHide = true;
  },
};
const actions = <ActionTree<State, any>>{
  TOGGLE_IS_HIDE(context) {
    context.commit('TOGGLE_IS_HIDE');
  },
  CLOSE(context) {
    context.commit('CLOSE');
  },
  OPEN(context, purchase: IPurchasesItem) {
    const searchItemRoot = context.rootGetters['shop/products/FIND_ITEM'];

    // eslint-disable-next-line no-extra-boolean-cast
    if (!!searchItemRoot) {
      const makingPurchase: ISelectPurchase = {
        date: '',
        price: 0,
        items: [],
      };

      purchase.products.map((v) => {
        const tempItem = searchItemRoot(v.id);
        // eslint-disable-next-line no-extra-boolean-cast
        if (!!tempItem) {
          makingPurchase.date = purchase.date;
          makingPurchase.price += v.count * v.price;
          makingPurchase.items.push({
            count: v.count,
            price: v.price,
            title: tempItem.title,
            image: tempItem.image,
          });
          context.commit('OPEN', makingPurchase);
        }
      });
    }
  },
};

const PurchaseModule = {
  namespaced: true,
  state: new State(),
  getters: getters,
  mutations: mutations,
  actions: actions,
};

export default PurchaseModule;
