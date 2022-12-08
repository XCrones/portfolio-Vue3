import { Subscription, BehaviorSubject, Subject } from 'rxjs';
import { GetterTree, MutationTree, ActionTree } from 'vuex';
import { IChatMessage, IChatUser } from './firestore-module';

export interface IMessagesItem {
  uid: string;
  name: string;
  message: string;
  date: string;
}

class State {
  profile$!: Subscription;
  chats$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  messagesRef$!: Subscription;
  messages$: BehaviorSubject<IMessagesItem[]> = new BehaviorSubject<IMessagesItem[]>([]);

  currChat$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  isLoadProfile = false;
  isHideCreate = true;
  isHideJoin = true;
}

const getters = <GetterTree<State, any>>{
  MESSAGES(state): Subject<IMessagesItem[]> {
    return state.messages$;
  },
  CHATS(state): string[] {
    return state.chats$.value;
  },
  IS_LOAD_PROFILE(state): boolean {
    return state.isLoadProfile;
  },
  CURR_CHAT(state): Subject<string | null> {
    return state.currChat$;
  },
  IS_HIDE_CREATE(state): boolean {
    return state.isHideCreate;
  },
  IS_HIDE_JOIN(state): boolean {
    return state.isHideJoin;
  },
};

const mutations = <MutationTree<State>>{
  IS_HIDE_CREATE(state, stateHide: boolean) {
    state.isHideCreate = stateHide;
  },
  IS_HIDE_JOIN(state, stateHide: boolean) {
    state.isHideJoin = stateHide;
  },
};

const actions = <ActionTree<State, any>>{
  IS_HIDE_CREATE(context, stateHide: boolean) {
    context.commit('IS_HIDE_CREATE', stateHide);
  },

  IS_HIDE_JOIN(context, stateHide: boolean) {
    context.commit('IS_HIDE_JOIN', stateHide);
  },

  async TRY_PROFILE(context) {
    context.state.isLoadProfile = true;

    try {
      await context.dispatch('auth/TRY_USER', null, { root: true });
      const uid = context.rootGetters['auth/USER_DATA']?.uid;
      const fieldChats = context.rootGetters['chat/firestore/FIELD_PROFILE']?.chats;

      const profileRef = await context.dispatch('chat/firestore/GET_PROFILE', uid, { root: true });

      context.state.profile$ = profileRef.subscribe((observer: any) => {
        context.state.isLoadProfile = false;
        const searchFieldChats = observer[fieldChats];

        // eslint-disable-next-line no-extra-boolean-cast
        if (!!searchFieldChats) {
          context.state.chats$.next(searchFieldChats);
        }
      });
    } catch (e) {
      context.state.isLoadProfile = false;
      console.log('try profile err', e);
    }
  },

  async SIGN_OUT(context) {
    await context.dispatch('auth/SIGN_OUT', null, { root: true });
    context.state.profile$.unsubscribe();
    context.state.chats$.value.length = 0;
    context.state.currChat$.next(null);
    await context.dispatch('CLEAR_MESSAGES', null, { root: false });
  },

  CLEAR_MESSAGES(context) {
    try {
      context.state.messagesRef$.unsubscribe();
    } catch (e) {
      console.log('not unsubscribe messages');
    }
    context.state.messages$.value.length = 0;
  },

  async SET_CURR_CHAT(context, chat: string) {
    const tempChat = chat.trim();
    if (!!tempChat && tempChat.length > 0) {
      if (tempChat === context.state.currChat$.value) {
        context.state.currChat$.next(null);
        await context.dispatch('CLEAR_MESSAGES', null, { root: false });
      } else {
        if (context.state.chats$.value.includes(tempChat)) {
          context.state.currChat$.next(tempChat);
          await context.dispatch('GET_CHAT', tempChat, { root: false });
        }
      }
    }
  },

  async GET_CHAT(context, chatName: string) {
    context.state.isLoadProfile = true;
    try {
      const messagesRef = await context.dispatch('chat/firestore/GET_MESSAGES', chatName, { root: true });
      const fieldMessages = context.rootGetters['chat/firestore/FIELD_CHAT']?.messages;

      context.state.messagesRef$ = messagesRef.subscribe((observer: any) => {
        const searchFieldMessages = observer[fieldMessages];
        // eslint-disable-next-line no-extra-boolean-cast
        if (!!searchFieldMessages) {
          context.state.messages$.next(searchFieldMessages);
        }
        context.state.isLoadProfile = false;
      });
    } catch (e) {
      context.state.isLoadProfile = false;
      throw new Error('err save chat');
    }
  },

  async ADD_MESSAGE(context, message: string) {
    try {
      const uid = context.rootGetters['auth/USER_DATA']?.uid;
      const userName = context.rootGetters['auth/USER_DATA']?.name;
      const isAuth = context.rootGetters['auth/IS_AUTH'];

      if (isAuth && !!uid && !!userName) {
        const date =
          new Date().toISOString().split('T')[0] +
          'T' +
          new Date().toLocaleString().split(',')[1].trim() +
          ':' +
          new Date().getMilliseconds();

        const itemMessage: IMessagesItem = {
          uid: uid,
          name: userName,
          message: message,
          date: date,
        };

        const currChat = context.state.currChat$.value;

        // eslint-disable-next-line no-extra-boolean-cast
        if (!!currChat) {
          const message: IChatMessage = {
            chatName: currChat,
            message: itemMessage,
          };
          await context.dispatch('chat/firestore/PUSH_MESSAGE', message, { root: true });
        }
      }
    } catch (e) {
      throw new Error('cant find user or err push');
    }
  },

  async DELETE_MESSAGE(context, messageDelete: IMessagesItem) {
    try {
      const currChat = context.state.currChat$.value;

      // eslint-disable-next-line no-extra-boolean-cast
      if (!!currChat) {
        const message: IChatMessage = {
          chatName: currChat,
          message: messageDelete,
        };
        await context.dispatch('chat/firestore/REMOVE_MESSAGE', message, { root: true });
      }
    } catch (e) {
      throw new Error('err delete message');
    }
  },

  async CREATE_CHAT(context, chatName: string) {
    const result = await context.dispatch('chat/firestore/CREATE_CHAT', chatName, { root: true });
    if (result) {
      await context.dispatch('ADD_USER_TO_CHAT', chatName, { root: false });
      context.state.isHideCreate = true;
      return true;
    } else {
      return false;
    }
  },

  async JOIN_CHAT(context, chatName: string) {
    const result = await context.dispatch('chat/firestore/JOIN_CHAT', chatName, { root: true });
    if (result) {
      await context.dispatch('ADD_USER_TO_CHAT', chatName, { root: false });
      context.state.isHideJoin = true;
      return true;
    } else {
      return false;
    }
  },

  async ADD_USER_TO_CHAT(context, chatName: string) {
    const uid = context.rootGetters['auth/USER_DATA']?.uid;

    // eslint-disable-next-line no-extra-boolean-cast
    if (!!uid) {
      const dataUser: IChatUser = {
        uid: uid,
        chatName: chatName,
      };
      await context.dispatch('chat/firestore/ADD_USER_TO_CHAT', dataUser, { root: true });
      await context.dispatch('CLEAR_MESSAGES', null, { root: false });
      await context.dispatch('SET_CURR_CHAT', chatName, { root: false });
    }
  },

  async OUT_CHAT(context, chatName: string) {
    const uid = context.rootGetters['auth/USER_DATA']?.uid;

    // eslint-disable-next-line no-extra-boolean-cast
    if (!!uid) {
      const dataDelete: IChatUser = {
        uid: uid,
        chatName: chatName,
      };
      await context.dispatch('chat/firestore/OUT_CHAT_USER', dataDelete, { root: true });
    }
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
