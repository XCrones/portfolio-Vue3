import { GetterTree, MutationTree, ActionTree } from 'vuex';
import { ICartItem, IProfileV2 } from './profile-module';
import { IPurchasesItem, IPurchasesProducts } from './purchase-module';
import { setDoc, doc, updateDoc, onSnapshot, Unsubscribe, getDoc } from 'firebase/firestore';
import { dataBase } from '@/firebase/firebase';
import { BehaviorSubject, Subject } from 'rxjs';

const COLLECTION = 'shop-users';

export interface IFieldsDb {
  cart: 'cart';
  purchases: 'purchases';
}

export interface IUpdate {
  uid: string;
  data: ICartItem[] | IProfileV2 | IPurchasesProducts;
}

export interface IUpdateCart {
  item: ICartItem[];
  uid: string;
}

export interface IUpdatePurchases {
  item: IPurchasesItem[];
  uid: string;
}

export interface IUpdateProfile {
  cart: ICartItem[];
  purchases: IPurchasesItem[];
  uid: string;
}

class State {
  fieldDB: IFieldsDb = {
    cart: 'cart',
    purchases: 'purchases',
  };

  profile$: BehaviorSubject<IProfileV2 | undefined> = new BehaviorSubject<IProfileV2 | undefined>(undefined);
  profileref$!: Unsubscribe;
}

const getters = <GetterTree<State, any>>{
  FIELDS_DB(state): IFieldsDb {
    return state.fieldDB;
  },
};

const mutations = <MutationTree<State>>{};

const actions = <ActionTree<State, any>>{
  async CHECK_FIELDS(context, uid: string) {
    const docRef = doc(dataBase, COLLECTION, uid);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();

    try {
      const hasKeyCart = Object.prototype.hasOwnProperty.call(data, context.state.fieldDB.cart);
      if (!hasKeyCart) {
        const cuCart: IUpdateCart = {
          uid: uid,
          item: [],
        };
        await context.dispatch('UPDATE_CART', cuCart, { root: false });
      }
    } catch (e) {
      const cuCart: IUpdateCart = {
        uid: uid,
        item: [],
      };
      await context.dispatch('UPDATE_CART', cuCart, { root: false });
    }

    try {
      const hasKeyPurchases = Object.prototype.hasOwnProperty.call(data, context.state.fieldDB.purchases);
      if (!hasKeyPurchases) {
        const cuPurchases: IUpdatePurchases = {
          item: [],
          uid: uid,
        };
        await context.dispatch('UPDATE_PURCHASES', cuPurchases, { root: false });
      }
    } catch (e) {
      const cuPurchases: IUpdatePurchases = {
        item: [],
        uid: uid,
      };
      await context.dispatch('UPDATE_PURCHASES', cuPurchases, { root: false });
    }
  },

  async GET_PROFILE(context, uid: string): Promise<Subject<IProfileV2 | undefined>> {
    await context.dispatch('CHECK_FIELDS', uid);

    context.state.profileref$ = onSnapshot(doc(dataBase, COLLECTION, uid), (doc: any) => {
      // eslint-disable-next-line no-extra-boolean-cast
      if (!!doc.data()) {
        context.state.profile$.next(doc.data());
      }
    });

    return context.state.profile$;
  },

  async UNSUB_PROFILE(context) {
    context.state.profileref$();
  },

  async UPDATE_CART(context, data: IUpdateCart) {
    const db = doc(dataBase, COLLECTION, data.uid);
    try {
      await updateDoc(db, {
        cart: data.item,
      });
    } catch (err) {
      await setDoc(db, {
        cart: data.item,
      });
    }
  },

  async UPDATE_PURCHASES(context, data: IUpdateCart) {
    const db = doc(dataBase, COLLECTION, data.uid);
    try {
      await updateDoc(db, {
        purchases: data.item,
      });
    } catch (err) {
      await setDoc(db, {
        purchases: data.item,
      });
    }
  },

  async UPDATE_PROFILE(context, data: IUpdateProfile) {
    const db = doc(dataBase, COLLECTION, data.uid);
    try {
      await updateDoc(db, {
        cart: data.cart,
        purchases: data.purchases,
      });
    } catch (err) {
      await setDoc(db, {
        cart: data.cart,
        purchases: data.purchases,
      });
    }
  },
};

const FirestoreModule = {
  namespaced: true,
  state: new State(),
  getters: getters,
  mutations: mutations,
  actions: actions,
};

export default FirestoreModule;
