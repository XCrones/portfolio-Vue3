import { GetterTree, MutationTree, ActionTree } from 'vuex';

export interface IContacts {
  service: string;
  img: string;
  link: string;
  localLink: string;
  nickName: string;
}

class State {
  contacts: IContacts[] = [
    {
      service: 'gitHub',
      img: 'github',
      link: 'https://github.com/XCrones/portfolio-angular-14',
      localLink: 'XCrones',
      nickName: 'XCrones',
    },
    {
      service: 'gmail',
      img: 'gmail',
      link: 'mailto:Lymar.Serjey@gmail.com',
      localLink: 'Lymar.Serjey@gmail.com',
      nickName: 'Лымарь Сергей',
    },
    {
      service: 'telegram',
      img: 'telegram',
      link: 'https://t.me/LymarSerjey',
      localLink: '@LymarSerjey',
      nickName: 'Лымарь Сергей',
    },
    {
      service: 'hh',
      img: 'hh',
      link: 'https://hh.ru/resume/0b952de7ff081a79d00039ed1f734d70356a78?from=share_ios',
      localLink: 'https://hh.ru/resume/0b952de7ff081a79d00039ed1f734d70356a78?from=share_ios',
      nickName: 'Лымарь Сергей',
    },
    {
      service: 'skype',
      img: 'skype',
      link: 'skype:Lymar.Serjey@gmail.com?userinfo',
      localLink: 'Lymar.Serjey@gmail.com',
      nickName: 'Лымарь Сергей',
    },
  ];
}
const getters = <GetterTree<State, any>>{
  contacts(state): IContacts[] {
    return state.contacts;
  },
};
const mutations = <MutationTree<State>>{};
const actions = <ActionTree<State, any>>{};

const ContactsModule = {
  namespaced: true,
  state: new State(),
  getters: getters,
  mutations: mutations,
  actions: actions,
};

export default ContactsModule;
