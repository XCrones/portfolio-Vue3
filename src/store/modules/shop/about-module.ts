import { GetterTree, MutationTree, ActionTree } from 'vuex';

export interface IInfoProject {
  title?: string;
  subtitle?: Array<string>;
  nameProject?: string;
}

class State {
  about: IInfoProject[] = [
    {
      nameProject: 'fake shop',
    },
    {
      title: 'в качестве сервера использовал Firebase',
      subtitle: ['auth-sign (in/up)', 'firestore', 'listner firestore'],
    },
    {
      title: 'основано на Fake Store API',
    },
    {
      title: 'валидация форм',
      subtitle: ['Vuelidate', 'validator - (max,min)length, require', 'email'],
    },
    {
      title: 'компоненты магазина',
      subtitle: ['корзина', 'аутентификация', 'пагинация', 'модальные окна', 'профиль истории заказов'],
    },
    {
      title: 'стилизация',
      subtitle: ['tailwindcss'],
    },
    {
      title: 'из стороннего',
      subtitle: ['иконки bootstrap', 'иконки materialize'],
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
