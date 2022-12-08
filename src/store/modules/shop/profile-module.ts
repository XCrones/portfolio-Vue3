import { Subscription } from 'rxjs';
import { GetterTree, MutationTree, ActionTree } from 'vuex';
import { IUpdateCart, IUpdateProfile } from './firestore-module';
import { ISetItemStorage } from './localstorage-module';
import { IProductsV2 } from './products';
import { IPurchasesItem, IPurchasesProducts } from './purchase-module';

export interface IUnparsingCart {
  product: IProductsV2;
  count: number;
}

export interface ICartItem {
  id: number;
  count: number;
}

export interface IProfileV2 {
  cart: ICartItem[];
  purchases: IPurchasesItem[];
}

export interface IMakeCart {
  arr: ICartItem[];
  deleteFromLocal: boolean;
}

export interface IUpdateCarts {
  updateFromServer: boolean;
  id: number;
}

export interface IUpdateFromServer {
  onlyCart: boolean;
  item: ICartItem;
}

class State {
  products: IProductsV2[] = [];
  totalPrice = 0;

  unparsingCart: IUnparsingCart[] = [];

  profile$!: Subscription;
  profile: IProfileV2 = {
    cart: [],
    purchases: [],
  };

  isLoadDataPurchases = false;
  isLoadDataCart = false;
}
const getters = <GetterTree<State, any>>{
  PURCHASES(state): Array<IPurchasesItem> {
    return state.profile.purchases;
  },
  UNPARSING_CART(state): IUnparsingCart[] {
    return state.unparsingCart;
  },
  IS_LOAD_PURCHASES(state): boolean {
    return state.isLoadDataPurchases;
  },
  IS_LOAD_CART(state): boolean {
    return state.isLoadDataCart;
  },
  TOTAL_PRICE(state): number {
    return state.totalPrice;
  },
  IS_IN_CART:
    (state) =>
    (id: number): boolean => {
      const search = state.unparsingCart.find((value) => value.product.id === id);
      // eslint-disable-next-line no-extra-boolean-cast
      return !!search?.product?.id ? true : false;
    },
  FIND_ITEM:
    (state) =>
    (id: number): IUnparsingCart | undefined => {
      return state.unparsingCart.find((v) => v.product.id === id);
    },
  PROFILE(state): IProfileV2 {
    return state.profile;
  },
};

const mutations = <MutationTree<State>>{
  UPDATE_CARTS(state, parsingCart: ICartItem[]) {
    state.profile.cart = parsingCart;
  },
  BUY(state, purchasesItem: IPurchasesItem) {
    state.profile.purchases.push(purchasesItem);
  },
  PUSH_TO_UNPARSING_CART(state, data: IUnparsingCart) {
    state.unparsingCart.push(data);
  },
  SET_PURCHASES(state, arr: IPurchasesItem[]) {
    state.profile.purchases = arr;
  },
  CALC_TOTAL_PRICE(state) {
    try {
      if (!!state.unparsingCart && state.unparsingCart.length > 0) {
        const sums = state.unparsingCart.map((item) => item.product.price * item.count);
        const result = sums.reduce(function (sum, current) {
          return sum + current;
        }, 0);
        state.totalPrice = result;
      } else {
        state.totalPrice = 0;
      }
    } catch (e) {
      state.totalPrice = 0;
    }
  },
};

const actions = <ActionTree<State, any>>{
  async UPDATE_CARTS(context, updateCarts: IUpdateCarts) {
    context.commit('CALC_TOTAL_PRICE');

    const isAuth = context.rootGetters['auth/IS_AUTH'];

    const parsingCart: ICartItem[] = context.state.unparsingCart.map((item) => {
      const parsingItemCart: ICartItem = {
        id: item.product.id,
        count: item.count,
      };
      return parsingItemCart;
    });

    context.commit('UPDATE_CARTS', parsingCart);

    const fieldCart = context.rootGetters['shop/firestore/FIELDS_DB']?.cart;

    // eslint-disable-next-line no-extra-boolean-cast
    if (!!fieldCart) {
      const dataStorage: ISetItemStorage = {
        key: fieldCart,
        value: JSON.stringify(context.state.profile.cart),
      };
      await context.dispatch('shop/localStorage/SET_ITEM', dataStorage, { root: true });
    }

    if (updateCarts.updateFromServer && isAuth) {
      const uid = context.rootGetters['auth/USER_DATA']?.uid;
      // eslint-disable-next-line no-extra-boolean-cast
      if (!!uid) {
        const updateCart: IUpdateCart = {
          item: context.state.profile.cart,
          uid: uid,
        };
        await context.dispatch('shop/firestore/UPDATE_CART', updateCart, { root: true });
      }
    }
  },

  async PROFILE_SIGN_OUT(context) {
    try {
      context.state.profile$.unsubscribe();
      // eslint-disable-next-line no-empty
    } catch (e) {}
    await context.dispatch('CLEAR_PROFILE', true, { root: false });
    await context.dispatch('auth/SIGN_OUT', null, { root: true });
  },

  async CLEAR_PROFILE(context, deleteLocalCart: boolean) {
    context.state.profile.cart.length = 0;
    context.state.profile.purchases.length = 0;
    context.state.unparsingCart.length = 0;
    if (deleteLocalCart) {
      await context.dispatch('DELETE_LOCAL_CART', null, { root: false });
    }
  },

  CLEAR_CARTS(context, deleteLocalCart: boolean) {
    context.state.profile.cart.length = 0;
    context.state.unparsingCart.length = 0;
    if (deleteLocalCart) {
      context.dispatch('DELETE_LOCAL_CART', null, { root: false });
    }
  },

  async DELETE_LOCAL_CART(context) {
    const fieldCart = context.rootGetters['shop/firestore/FIELDS_DB']?.cart;
    await context.dispatch('shop/localStorage/REMOVE_ITEM', fieldCart, { root: true });
  },

  async ADD_CART(context, item: IProductsV2) {
    try {
      const searchItem = context.getters.FIND_ITEM(item.id);
      // eslint-disable-next-line no-extra-boolean-cast
      if (!searchItem) {
        const tempItem: IUnparsingCart = {
          product: item,
          count: 1,
        };
        context.commit('PUSH_TO_UNPARSING_CART', tempItem);
      } else {
        searchItem.count++;
      }
      const updateCarts: IUpdateCarts = {
        updateFromServer: true,
        id: item.id,
      };
      await context.dispatch('UPDATE_CARTS', updateCarts, { root: false });
    } catch (e) {
      console.log(`error add new item to cart, id: ${item.id}`);
    }
  },

  async DECREMENT(context, id: number) {
    try {
      const searchItem = context.state.unparsingCart.find((value) => value.product.id === id);
      if (!!searchItem && searchItem.count > 1) {
        searchItem.count--;
        const updateCarts: IUpdateCarts = {
          updateFromServer: true,
          id: id,
        };
        await context.dispatch('UPDATE_CARTS', updateCarts, { root: false });
      } else {
        await context.dispatch('DELETE_ITEM', id, { root: false });
      }
    } catch (e) {
      console.log(`error decr item from cart, id: ${id}`);
    }
  },

  async INCREMENT(context, id: number) {
    try {
      const searchItem = context.state.unparsingCart.find((value) => value.product.id === id);
      if (!!searchItem && searchItem.count > 0) {
        searchItem.count++;
        const updateCarts: IUpdateCarts = {
          updateFromServer: true,
          id: id,
        };
        await context.dispatch('UPDATE_CARTS', updateCarts, { root: false });
      }
    } catch (e) {
      console.log(`error increm item from cart, id: ${id}`);
    }
  },

  async DELETE_ITEM(context, id: number) {
    try {
      const tempIdx = context.state.unparsingCart.findIndex((value) => value.product.id === id);
      if (tempIdx !== -1) {
        context.state.unparsingCart.splice(tempIdx, 1);
        const updateCarts: IUpdateCarts = {
          updateFromServer: true,
          id: id,
        };
        await context.dispatch('UPDATE_CARTS', updateCarts, { root: false });
      }
    } catch (e) {
      console.log(`delete cart err, no found item, id: ${id}`);
    }
  },

  async BUY(context) {
    if (context.state.unparsingCart.length > 0) {
      const date = new Date().toISOString().split('T')[0] + 'T' + new Date().toLocaleString().split(',')[1].trim();

      const tempItem: IPurchasesItem = {
        date: date,
        products: [],
      };

      context.state.unparsingCart.map((v) => {
        const parsingItem: IPurchasesProducts = {
          id: v.product.id,
          count: v.count,
          price: v.product.price,
        };
        tempItem.products.push(parsingItem);
      });

      context.commit('BUY', tempItem);
      await context.dispatch('CLEAR_CARTS', true, { root: false });

      const uid = context.rootGetters['auth/USER_DATA']?.uid;

      // eslint-disable-next-line no-extra-boolean-cast
      if (!!uid) {
        const updateProfile: IUpdateProfile = {
          cart: context.state.profile.cart,
          purchases: context.state.profile.purchases,
          uid: uid,
        };
        await context.dispatch('shop/firestore/UPDATE_PROFILE', updateProfile, { root: true });
      }
    }
  },

  async TRY_PROFILE(context) {
    context.state.isLoadDataPurchases = true;
    context.state.isLoadDataCart = true;

    try {
      await context.dispatch('auth/TRY_USER', null, { root: true });
      const userId = context.rootGetters['auth/USER_DATA']?.uid;
      // eslint-disable-next-line no-extra-boolean-cast
      if (!!userId) {
        await context.dispatch('PROFILE_FROM_SERVER', userId, { root: false });
      }
    } catch (e) {
      context.state.isLoadDataPurchases = false;
      await context.dispatch('CART_FROM_LOCAL', null, { root: false });
    }
  },

  async CART_FROM_LOCAL(context) {
    try {
      const fieldCart = context.rootGetters['shop/firestore/FIELDS_DB']?.cart;
      const searchProfile = await context.dispatch('shop/localStorage/GET_ITEM', fieldCart, { root: true });
      // eslint-disable-next-line no-extra-boolean-cast
      if (!!searchProfile) {
        const parsingCart = JSON.parse(searchProfile);
        if (Array.isArray(parsingCart) && parsingCart.length > 0) {
          const dataMakeCart: IMakeCart = {
            arr: parsingCart,
            deleteFromLocal: false,
          };
          await context.dispatch('MAKE_CART', dataMakeCart, { root: false });
          const updateCarts: IUpdateCarts = {
            updateFromServer: false,
            id: -1,
          };
          await context.dispatch('UPDATE_CARTS', updateCarts, { root: false });
        }
      }
      context.state.isLoadDataCart = false;
    } catch (err) {
      context.state.isLoadDataCart = false;
      console.log(`local cart not found`);
    }
  },

  async PROFILE_FROM_SERVER(context, uid: string) {
    try {
      const fieldCart = context.rootGetters['shop/firestore/FIELDS_DB']?.cart;
      const fieldPurchases = context.rootGetters['shop/firestore/FIELDS_DB']?.purchases;

      const profileRef = await context.dispatch('shop/firestore/GET_PROFILE', uid, { root: true });

      context.state.profile$ = profileRef.subscribe((observer: any) => {
        if (observer != undefined) {
          const searchCart = observer[fieldCart];
          const searchProfile = observer[fieldPurchases];

          if (!!searchCart && Array.isArray(searchCart)) {
            const tempCart: Array<ICartItem> = searchCart;
            const dataMakeCart: IMakeCart = {
              arr: tempCart,
              deleteFromLocal: true,
            };
            //! await //!!!! MAKE_CART!!!
            context.dispatch('MAKE_CART', dataMakeCart, { root: false });
            context.state.isLoadDataCart = false;
          } else {
            context.state.isLoadDataCart = false;
          }
          if (!!searchProfile && Array.isArray(searchProfile)) {
            const tempPurchases: IPurchasesItem[] = searchProfile;
            context.commit('SET_PURCHASES', tempPurchases);
            context.state.isLoadDataPurchases = false;
          } else {
            context.state.isLoadDataPurchases = false;
          }
        }
      });
    } catch (e) {
      context.state.isLoadDataPurchases = false;
      context.state.isLoadDataCart = false;
      console.log('err get profile from server');
    }
  },

  async MAKE_CART(context, dataMakeCart: IMakeCart) {
    const isAuth = context.rootGetters['auth/IS_AUTH'];
    if (isAuth) {
      await context.dispatch('CLEAR_PROFILE', dataMakeCart.deleteFromLocal, { root: false });
    }

    const searchItemRoot = context.rootGetters['shop/products/FIND_ITEM'];

    // eslint-disable-next-line no-extra-boolean-cast
    if (!!searchItemRoot) {
      dataMakeCart.arr.map((item) => {
        const searchItem = searchItemRoot(item.id);
        // eslint-disable-next-line no-extra-boolean-cast
        if (!!searchItem) {
          const tempUnparsingItem: IUnparsingCart = {
            product: searchItem,
            count: item.count,
          };
          context.commit('PUSH_TO_UNPARSING_CART', tempUnparsingItem);
        }
      });
    }
    context.state.isLoadDataCart = false;
  },
};

const ProfileModule = {
  namespaced: true,
  state: new State(),
  getters: getters,
  mutations: mutations,
  actions: actions,
};

export default ProfileModule;
