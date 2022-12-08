import Vuex from 'vuex';
import { GetterTree, MutationTree, ActionTree } from 'vuex';
import ContactsModule from './modules/contacts/contacts-module';
import HomeModule from './modules/home/home-module';
import HeaderModule from './modules/header/header-module';
import NeonModule from './modules/neon/neon-module';
import ProjectsModule from './modules/projects/projects-module';
import TodoModule from './modules/todo/todo-module';
import InfoModule from './modules/info/info-module';
import TodoTasksModule from './modules/todo/tasks-module';
import TodoModalModule from './modules/todo/modal-module';
import TodoPopupModule from './modules/todo/popup-module';
import TodoCategoriModule from './modules/todo/categories-module';
import ShopModule from './modules/shop/shop-module';
import ChatModule from './modules/chat/chat-module';
import AuthModule from './modules/auth/auth-module';

class State {}
const getters = <GetterTree<State, any>>{};
const mutations = <MutationTree<State>>{};
const actions = <ActionTree<State, any>>{};

export default new Vuex.Store({
  state: new State(),
  getters: getters,
  mutations: mutations,
  actions: actions,
  modules: {
    neon: NeonModule,
    header: HeaderModule,
    home: HomeModule,
    contacts: ContactsModule,
    projects: ProjectsModule,
    info: InfoModule,
    projectMenu: ProjectsModule,
    todo: TodoModule,
    shop: ShopModule,
    chat: ChatModule,
    auth: AuthModule,
  },
});
