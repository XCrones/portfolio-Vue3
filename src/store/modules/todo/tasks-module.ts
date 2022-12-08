import { GetterTree, MutationTree, ActionTree } from 'vuex';
import { BehaviorSubject } from 'rxjs';

export interface ITasks {
  id: number;
  name: string;
  category: string;
  priority: number;
  date: string;
  status: boolean;
  description: string;
}

export interface ISorting {
  type: string;
  state: boolean;
}

export interface IDelete {
  itemId: number;
  isGlobal?: boolean;
}

export interface IToggleStatus {
  itemId: number;
  isGlobal?: boolean;
  statusGlobal?: boolean;
}

export interface IThead {
  title: string;
  filter: string;
}

const sortValue = (a: any, b: any, state: boolean) => {
  return a < b ? (state ? 1 : -1) : state ? -1 : 1;
};

class State {
  tasks$: BehaviorSubject<ITasks[]> = new BehaviorSubject<ITasks[]>([
    {
      id: 1,
      name: 'изучить angular',
      category: 'обучение',
      priority: 2,
      date: '2022-04-29',
      status: false,
      description: 'изучить angular и все связанные с ним технологии',
    },
    {
      id: 2,
      name: 'продать honor',
      category: 'продажа',
      priority: 0,
      date: '2022-09-01',
      status: true,
      description: 'продать фитнес браслет honor',
    },
    {
      id: 3,
      name: 'купить apple watch',
      category: 'покупка',
      priority: 1,
      date: '2022-06-02',
      status: false,
      description: 'купить apple watch',
    },
    {
      id: 4,
      name: 'отдых на горе море',
      category: 'поездка',
      priority: 1,
      date: '2022-09-20',
      status: true,
      description: 'поехать с палатками на горе море',
    },
    {
      id: 5,
      name: 'сходить на брусья',
      category: 'спорт',
      priority: 2,
      date: '2022-08-03',
      status: false,
      description: 'отжиматься на брусьях',
    },
  ]);

  theadTable: IThead[] = [
    { title: 'название', filter: 'name' },
    { title: 'категория', filter: 'category' },
    { title: 'приоритет', filter: 'priority' },
    { title: 'дата', filter: 'date' },
    { title: 'статус', filter: 'status' },
  ];
}
const getters = <GetterTree<State, any>>{
  TASK_LIST(state): BehaviorSubject<ITasks[]> {
    return state.tasks$;
  },
  CATEGORIES(state): string[] {
    const categories = state.tasks$.value.map((value) => value.category.toLowerCase());
    return categories as string[];
  },
  THEAD_TABLE(state): IThead[] {
    return state.theadTable;
  },
};

const mutations = <MutationTree<State>>{};

const actions = <ActionTree<State, any>>{
  TOGGLE_STATUS(context, itemToggle: IToggleStatus) {
    if (itemToggle.isGlobal === undefined && context.state.tasks$.value.length > 0) {
      context.state.tasks$.value.find((item) => {
        if (item.id === itemToggle.itemId) {
          item.status = !item.status;
        }
      });
    }
    if (itemToggle.isGlobal && itemToggle.statusGlobal != undefined) {
      context.state.tasks$.value.map((item) => {
        if (itemToggle.statusGlobal != undefined) {
          item.status = itemToggle.statusGlobal;
        }
      });
    }
  },

  TASK_DELETE(context, deleteItem: IDelete) {
    if (deleteItem.isGlobal === undefined && context.state.tasks$.value.length > 0) {
      context.state.tasks$.next(context.state.tasks$.value.filter((item) => item.id != deleteItem.itemId));
    }
    if (deleteItem.isGlobal) {
      context.state.tasks$.value.length = 0;
    }
  },

  PUSH_NEW(context, item: ITasks) {
    const tempItem = JSON.parse(JSON.stringify(item));
    tempItem.date = String(new Date().toISOString().split('T')[0]);
    const lastElem = context.state.tasks$.value.slice(-1);
    tempItem.id = lastElem.length > 0 ? lastElem[0].id + 1 : 1;
    context.state.tasks$.value.push(tempItem);
  },

  SAVE_EDITED(context, item: ITasks) {
    const search = context.state.tasks$.value.find((v) => v.id === item.id);
    if (search != undefined) {
      Object.assign(search, item);
      const date = String(new Date().toISOString().split('T')[0]);
      search.date = date;
    }
  },

  SORT(context, option: ISorting) {
    context.state.tasks$.value.sort((a, b) => {
      switch (option.type) {
        case 'name':
          return sortValue(a.name.toLowerCase(), b.name.toLowerCase(), option.state);

        case 'date':
          return sortValue(a.date, b.date, option.state);

        case 'status':
          return sortValue(a.status, b.status, option.state);

        case 'priority':
          return sortValue(a.priority, b.priority, option.state);

        case 'category':
          return sortValue(a.category, b.category, option.state);

        default:
          return 0;
      }
    });
  },
};

const TodoTasksModule = {
  namespaced: true,
  state: new State(),
  getters: getters,
  mutations: mutations,
  actions: actions,
};

export default TodoTasksModule;
