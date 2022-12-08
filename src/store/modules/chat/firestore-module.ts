import { GetterTree, MutationTree, ActionTree } from 'vuex';
import { IMessagesItem } from './profile-module';
import { dataBase } from '@/firebase/firebase';
import { arrayRemove, arrayUnion, doc, getDoc, onSnapshot, setDoc, Unsubscribe, updateDoc } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';

const COLLECTION_USERS = 'chat-users';
const COLLECTION_CHATS = 'chats';

export interface IChatUser {
  uid: string;
  chatName: string;
}

export interface IChatMessage {
  chatName: string;
  message: IMessagesItem;
}

export interface IUpdataProfile {
  uid: string;
  data: string[];
}

export interface IUpdateChat {
  chatName: string;
  data: IMessagesItem[];
}

export interface IFieldUser {
  chats: 'chats';
}

export interface IFieldChats {
  messages: 'messages';
}

class State {
  profileRef$!: Unsubscribe;
  messagesRef$!: Unsubscribe;

  profile$: BehaviorSubject<string[] | undefined> = new BehaviorSubject<string[] | undefined>([]);
  messages$: BehaviorSubject<IMessagesItem[] | undefined> = new BehaviorSubject<IMessagesItem[] | undefined>([]);

  fieldProfile: IFieldUser = {
    chats: 'chats',
  };
  fieldChat: IFieldChats = {
    messages: 'messages',
  };
}

const getters = <GetterTree<State, any>>{
  FIELD_PROFILE(state) {
    return state.fieldProfile;
  },
  FIELD_CHAT(state) {
    return state.fieldChat;
  },
};

const mutations = <MutationTree<State>>{};

const actions = <ActionTree<State, any>>{
  async CHECK_FIELDS_PROFILE(context, uid: string) {
    const docRef = doc(dataBase, COLLECTION_USERS, uid);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();

    // eslint-disable-next-line no-extra-boolean-cast
    if (!!data) {
      const hasKeyChats = Object.prototype.hasOwnProperty.call(data, context.state.fieldProfile.chats);
      if (!hasKeyChats) {
        await setDoc(docRef, {
          chats: [],
        });
      }
    } else {
      await setDoc(docRef, {
        chats: [],
      });
    }
  },

  async GET_PROFILE(context, uid: string): Promise<BehaviorSubject<string[] | undefined>> {
    await context.dispatch('CHECK_FIELDS_PROFILE', uid, { root: false });

    context.state.profileRef$ = onSnapshot(doc(dataBase, COLLECTION_USERS, uid), (doc: any) => {
      // eslint-disable-next-line no-extra-boolean-cast
      if (!!doc.data()) {
        context.state.profile$.next(doc.data());
      }
    });

    return context.state.profile$;
  },

  async CHECK_FIELDS_CHAT(context, chatName) {
    const docRef = doc(dataBase, COLLECTION_CHATS, chatName);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();

    try {
      const hasKeyMessages = Object.prototype.hasOwnProperty.call(data, context.state.fieldChat.messages);
      if (!hasKeyMessages) {
        const cuChat: IUpdateChat = {
          chatName: chatName,
          data: [],
        };
        await context.dispatch('PUSH_MESSAGE', cuChat, { root: false });
      }
    } catch (e) {
      const cuChat: IUpdateChat = {
        chatName: chatName,
        data: [],
      };
      await context.dispatch('PUSH_MESSAGE', cuChat, { root: false });
    }
  },

  async GET_MESSAGES(context, chatName: string): Promise<BehaviorSubject<IMessagesItem[] | undefined>> {
    await context.dispatch('CHECK_FIELDS_CHAT', chatName, { root: false });

    context.state.messagesRef$ = onSnapshot(doc(dataBase, COLLECTION_CHATS, chatName), (doc: any) => {
      // eslint-disable-next-line no-extra-boolean-cast
      if (!!doc.data()) {
        context.state.messages$.next(doc.data());
      }
    });

    return context.state.messages$;
  },

  async CREATE_CHAT(context, chatName: string): Promise<boolean> {
    const db = doc(dataBase, COLLECTION_CHATS, chatName);
    const docSnap = await getDoc(db);
    const data = docSnap.data();

    if (!data) {
      await setDoc(db, {
        messages: [],
      });
      return true;
    } else {
      return false;
    }
  },

  async JOIN_CHAT(context, chatName: string) {
    const docRef = doc(dataBase, COLLECTION_CHATS, chatName);
    const docSnap = await getDoc(docRef);
    const resultCheckNmae = docSnap.data();

    // eslint-disable-next-line no-extra-boolean-cast
    if (!!resultCheckNmae) {
      return true;
    } else {
      return false;
    }
  },

  async ADD_USER_TO_CHAT(contetx, dataUser: IChatUser) {
    const db = doc(dataBase, COLLECTION_USERS, dataUser.uid);

    try {
      await updateDoc(db, {
        chats: arrayUnion(dataUser.chatName),
      });
    } catch (e) {
      await setDoc(db, {
        chats: [dataUser.chatName],
      });
    }
  },

  async OUT_CHAT_USER(context, dataUser: IChatUser) {
    const db = doc(dataBase, COLLECTION_USERS, dataUser.uid);

    try {
      await updateDoc(db, {
        chats: arrayRemove(dataUser.chatName),
      });
    } catch (e) {
      console.log(e);
    }
  },

  async PUSH_MESSAGE(context, dataChat: IChatMessage) {
    const db = doc(dataBase, COLLECTION_CHATS, dataChat.chatName);

    try {
      await updateDoc(db, {
        messages: arrayUnion(dataChat.message),
      });
    } catch (e) {
      await setDoc(db, {
        messages: [dataChat.message],
      });
    }
  },

  async REMOVE_MESSAGE(context, dataChat: IChatMessage) {
    const db = doc(dataBase, COLLECTION_CHATS, dataChat.chatName);

    try {
      await updateDoc(db, {
        messages: arrayRemove(dataChat.message),
      });
    } catch (e) {
      console.log(e);
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
