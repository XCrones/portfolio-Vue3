import { GetterTree, MutationTree, ActionTree } from 'vuex';

export interface IAboutMe {
  title: string;
  frameWork: string;
  greetings: string;
  whatIsThis: string;
  search: [{ about: string; goal: string }, { about: string; goal: string }, { about: string; goal: string }];
  subtitle: string;
}

export interface ISkills {
  title: string;
  about: Array<string>;
  img: string;
}

class State {
  aboutMe: IAboutMe = {
    title: 'frontend developer',
    frameWork: 'vue.js',
    greetings: 'привет, меня зовут Сергей!',
    whatIsThis: 'данное портфолио демонстрирует мой уровень компетенции в web разработке.',
    search: [
      { about: 'моя цель: ', goal: 'поиск работы;' },
      { about: 'позиция: ', goal: 'frontend developer vue.js;' },
      { about: 'опыт работы: ', goal: '2 года;' },
    ],
    subtitle: 'буду рад вашим предложениям!',
  };
  skills: ISkills[] = [
    {
      title: 'уверенное знание HTML',
      img: 'html',
      about: ['семантическая вёрстка', 'адаптивная вёрстка', 'именование по БЭМ'],
    },
    {
      title: 'уверенное знание CSS',
      img: 'css',
      about: ['flexbox', 'animation', 'SCSS(SASS)'],
    },
    {
      title: 'хорошее знание JS',
      img: 'js',
      about: ['ES6+', 'promise', 'SCSS(fetch)'],
    },
    {
      title: 'хорошее знание TS',
      img: 'ts',
      about: ['interfaces', 'types', 'OOP'],
    },
    {
      title: 'хорошее знание Angular',
      img: 'angular',
      about: ['RxJs', 'DI', 'Animations'],
    },
    {
      title: 'хорошее знание VUE.js',
      img: 'vue',
      about: ['vuex, vue-router', 'vuelidate', 'transition, transitionGroup'],
    },
    {
      title: 'хорошее знание Tailwind',
      img: 'tailwind',
      about: ['Breakpoints', 'Flexbox/Grid', 'Transitions/Animation'],
    },
    {
      title: 'основы Webpack',
      img: 'webpack',
      about: ['установка loaders', 'установка modules', 'преобразование SASS/SCSS'],
    },
    {
      title: 'знание на уровне auth/firestore',
      img: 'firebase',
      about: ['auth', 'firestore', 'database'],
    },
    {
      title: 'базовое управление пакетами',
      img: 'npm',
      about: ['install', 'remove', 'update'],
    },
    {
      title: 'базовое знание библиотеки',
      img: 'jquery',
      about: ['доступ к элементам/аттрибутам', 'цепочки методов', 'анимации'],
    },
    {
      title: 'базовое знание редактора',
      img: 'ps',
      about: ['свойства элементов', 'нарезка элементов', 'горячие клавиши'],
    },
    {
      title: 'базовое знание редактора',
      img: 'figma',
      about: ['свойства элементов', 'экспорт', 'горячие клавиши'],
    },
    {
      title: 'базовое знание GIT',
      img: 'git',
      about: ['push/pull', 'status, add, commit', 'checkout'],
    },
    {
      title: 'основы БЭМ',
      img: 'bem',
      about: ['html', 'css', 'js'],
    },
  ];
}
const getters = <GetterTree<State, any>>{
  ABOUT_ME(state): IAboutMe {
    return state.aboutMe;
  },
  MY_SKILLS(state): ISkills[] {
    return state.skills;
  },
};
const mutations = <MutationTree<State>>{};
const actions = <ActionTree<State, any>>{};

const HomeModule = {
  namespaced: true,
  state: new State(),
  getters: getters,
  mutations: mutations,
  actions: actions,
};

export default HomeModule;
