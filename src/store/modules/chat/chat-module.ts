import { GetterTree, MutationTree, ActionTree } from 'vuex';
import AboutModule from './about-module';
import FirestoreModule from './firestore-module';
import ProfileModule from './profile-module';

class State {}
const getters = <GetterTree<State, any>>{};
const mutations = <MutationTree<State>>{};
const actions = <ActionTree<State, any>>{};

const ChatModule = {
  namespaced: true,
  state: new State(),
  getters: getters,
  mutations: mutations,
  actions: actions,
  modules: {
    about: AboutModule,
    profile: ProfileModule,
    firestore: FirestoreModule,
  },
};

export default ChatModule;
