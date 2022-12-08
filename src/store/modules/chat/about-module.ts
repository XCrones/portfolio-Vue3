import { GetterTree, MutationTree, ActionTree } from 'vuex';

export interface IInfoProject {
  title?: string;
  subtitle?: Array<string>;
  nameProject?: string;
}

class State {
  about: IInfoProject[] = [
    {
      nameProject: 'чат',
    },
    {
      title: 'в качестве сервера использовал Firebase',
      subtitle: ['auth-sign (in/up)', 'firestore', 'listner firestore'],
    },
    {
      title: 'валидация форм',
      subtitle: ['formGroup', 'validator - (max,min)length, require', 'email'],
    },
    {
      title: 'компоненты чата',
      subtitle: ['профиль', 'выйти из чата', 'создать чат', 'присоединится к чату', 'удаление сообщений(только своих)'],
    },
    {
      title: 'стилизация',
      subtitle: ['tailwindcss'],
    },
    {
      title: 'из стороннего',
      subtitle: ['иконки bootstrap'],
    },
    {
      title: 'что применял',
      subtitle: ['vuex', 'directives', 'rxjs'],
    },
  ];
}
const getters = <GetterTree<State, any>>{
  ABOUT_PROJECT(state): IInfoProject[] {
    return state.about;
  },
};
const mutations = <MutationTree<State>>{};
const actions = <ActionTree<State, any>>{};

const AboutModule = {
  namespaced: true,
  state: new State(),
  getters: getters,
  mutations: mutations,
  actions: actions,
};

export default AboutModule;
