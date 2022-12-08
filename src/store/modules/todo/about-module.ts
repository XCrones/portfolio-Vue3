import { GetterTree, MutationTree, ActionTree } from 'vuex';

export interface IInfoProject {
  title?: string;
  subtitle?: string[];
  nameProject?: string;
}

class State {
  about: IInfoProject[] = [
    {
      nameProject: 'список задач',
    },
    {
      title: 'стандартный функционал для todo листов',
      subtitle: ['создание', 'удаление', 'изменение', 'статус', 'сортировка'],
    },
    {
      title: 'валидация форм',
      subtitle: ['Vuelidate', 'validator - (max,min)length, require'],
    },
    {
      title: 'реализованы приоритеты',
    },
    {
      title: 'реализованы категории',
      subtitle: ['добавление(с лимитом 24шт.)'],
    },
    {
      title: 'реализованы: пагинация, popup и модальные окна',
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
