import { GetterTree, MutationTree, ActionTree } from 'vuex';
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '@/firebase/firebase';

export interface IErrors {
  error: string;
  title: string;
}

export interface IAuth {
  email: string;
  password: string;
}

interface IParseUser {
  uid: string | undefined;
  email: string | undefined;
  name?: string | undefined;
}

class State {
  isAuth = false;
  readonly errCode: Array<IErrors> = [
    {
      error: 'auth/email-already-in-use',
      title: 'пользователь с таким email уже имется',
    },
    {
      error: 'auth/user-not-found',
      title: 'нет такого пользователя',
    },
    {
      error: 'auth/wrong-password',
      title: 'неправильный email или пароль',
    },
    {
      error: 'auth/too-many-requests',
      title: 'слишком много попыток, повторите позже',
    },
    {
      error: 'auth/configuration-not-found',
      title: 'ошибка конфигурации',
    },
  ];

  userData: IParseUser = {
    uid: undefined,
    email: undefined,
    name: undefined,
  };
}

const getters = <GetterTree<State, any>>{
  SEARCH_ERROR:
    (state) =>
    (errCode: string): string => {
      const findErr = state.errCode.find((v) => v.error.toLowerCase().trim() === errCode.toLowerCase().trim());
      // eslint-disable-next-line no-extra-boolean-cast
      if (!!findErr) {
        return findErr.title;
      } else {
        return errCode;
      }
    },

  USER_DATA(state): IParseUser {
    return state.userData;
  },
  IS_AUTH(state): boolean {
    // eslint-disable-next-line no-extra-boolean-cast
    return !!state.userData.uid ? true : false;
  },
};

const mutations = <MutationTree<State>>{};

const actions = <ActionTree<State, any>>{
  async TRY_USER(context): Promise<IParseUser | undefined> {
    return new Promise((resolve, reject) => {
      const unsub = onAuthStateChanged(auth, (user) => {
        if (user) {
          unsub();
          // eslint-disable-next-line no-extra-boolean-cast
          const name = !!user.email ? user.email.split('@')[0] : undefined;
          const userData: IParseUser = {
            email: user.email || undefined,
            name: name,
            uid: user.uid || undefined,
          };
          Object.assign(context.state.userData, userData);
          resolve(userData);
        } else {
          unsub();
          reject(undefined);
        }
      });
    });
  },

  async SIGN_IN(context, userData: IAuth): Promise<string | null> {
    return new Promise((resolve, reject) => {
      setPersistence(auth, browserLocalPersistence)
        .then(() => {
          return signInWithEmailAndPassword(auth, userData.email, userData.password);
        })
        .then(() => {
          resolve(null);
        })
        .catch((error) => {
          const parseError = context.getters.SEARCH_ERROR(error.code);
          reject(parseError);
        });
    });
  },

  SIGN_UP(context, userData: IAuth): Promise<string | null> {
    return new Promise((resolve, reject) => {
      setPersistence(auth, browserLocalPersistence)
        .then(() => {
          return createUserWithEmailAndPassword(auth, userData.email, userData.password);
        })
        .then(() => {
          resolve(null);
        })
        .catch((error) => {
          const parseError = context.getters.SEARCH_ERROR(error.code);
          reject(parseError);
        });
    });
  },

  SIGN_OUT(context) {
    signOut(auth).then(() => {
      const userData: IParseUser = {
        email: undefined,
        name: undefined,
        uid: undefined,
      };
      Object.assign(context.state.userData, userData);
    });
  },
};

const AuthModule = {
  namespaced: true,
  state: new State(),
  getters: getters,
  mutations: mutations,
  actions: actions,
};

export default AuthModule;
