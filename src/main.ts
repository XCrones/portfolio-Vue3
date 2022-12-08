import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import { BoxShadowDirective, IBoxShadow } from './ui/directives/box-neon-directive';
import { ITextShadow, TextNeonDirective } from './ui/directives/text-neon-directive';
import { IRotateShadow, RotateShadowDirective } from './ui/directives/rotate-shadow-directive';
import { ITodoResize, TodoResizeDirective } from './ui/directives/todo-resize-directive';

import '@/assets/styles/index.scss';
import 'material-icons/css/material-icons.min.css';

import '@/firebase/firebase';

const app = createApp(App);

const boxShadowDirective = new BoxShadowDirective();
const textNeonDirective = new TextNeonDirective();
const rotateShadowDirective = new RotateShadowDirective();
const todoResizeDirective = new TodoResizeDirective();

const removeListeners = (el: any) => {
  el.removeEventListener('mouseover', el.__vHoverOver__, true);
  el.removeEventListener('mouseleave', el.__vHoverLeave__, true);
  delete el.__vHoverOver__;
  delete el.__vHoverLeave__;
};

const addListeners = (el: any) => {
  el.addEventListener('mouseover', el.__vHoverOver__, true);
  el.addEventListener('mouseleave', el.__vHoverLeave__, true);
};

app.directive('tableResize', {
  beforeMount(el, binding) {
    const metaTodoResize: ITodoResize = {
      el: el,
      width: binding.value['width'],
      filter: binding.value['filter'],
    };

    todoResizeDirective.resize(metaTodoResize);
  },
  beforeUpdate(el, binding) {
    const metaTodoResize: ITodoResize = {
      el: el,
      width: binding.value['width'],
      filter: binding.value['filter'],
    };

    todoResizeDirective.resize(metaTodoResize);
  },
});

app.directive('boxShadow', {
  mounted(el, binding) {
    const metaBoxShadow: IBoxShadow = {
      el: el,
      color: binding.value['color'],
      style: binding.value['style'],
      neon: binding.value['neon'],
      hover: binding.value['hover'],
    };

    removeListeners(el);

    if (metaBoxShadow.hover) {
      el.__vHoverOver__ = () => {
        boxShadowDirective.enableShadow(metaBoxShadow);
      };
      el.__vHoverLeave__ = () => {
        boxShadowDirective.disableShadow(metaBoxShadow);
      };
      addListeners(el);
    } else {
      if (metaBoxShadow.neon) {
        boxShadowDirective.enableShadow(metaBoxShadow);
      } else {
        boxShadowDirective.disableShadow(metaBoxShadow);
      }
    }
  },
  updated(el, binding) {
    const metaBoxShadow: IBoxShadow = {
      el: el,
      color: binding.value['color'],
      style: binding.value['style'],
      neon: binding.value['neon'],
      hover: binding.value['hover'],
    };

    if (metaBoxShadow.hover) {
      removeListeners(el);

      el.__vHoverOver__ = () => {
        boxShadowDirective.enableShadow(metaBoxShadow);
      };
      el.__vHoverLeave__ = () => {
        boxShadowDirective.disableShadow(metaBoxShadow);
      };

      addListeners(el);
    } else {
      if (metaBoxShadow.neon) {
        boxShadowDirective.enableShadow(metaBoxShadow);
      } else {
        boxShadowDirective.disableShadow(metaBoxShadow);
      }
    }
  },
  unmounted(el, binding) {
    removeListeners(el);
  },
});

app.directive('textShadow', {
  mounted(el, binding) {
    const metaTextShadow: ITextShadow = {
      el: el,
      isNeon: binding.value['isNeon'],
      color: binding.value['color'],
      colorShadow: binding.value['colorShadow'],
      styleShadow: binding.value['styleShadow'],
      isSetColor: binding.value['isSetColor'],
      isHover: binding.value['isHover'],
    };

    removeListeners(el);

    if (metaTextShadow.isHover) {
      el.__vHoverOver__ = () => {
        textNeonDirective.enableShadow(metaTextShadow);
      };
      el.__vHoverLeave__ = () => {
        textNeonDirective.disableShadow(metaTextShadow);
      };
      addListeners(el);
    } else {
      if (metaTextShadow.isNeon) {
        textNeonDirective.enableShadow(metaTextShadow);
      } else {
        textNeonDirective.disableShadow(metaTextShadow);
      }
    }
  },
  updated(el, binding) {
    const metaTextShadow: ITextShadow = {
      el: el,
      isNeon: binding.value['isNeon'],
      color: binding.value['color'],
      colorShadow: binding.value['colorShadow'],
      styleShadow: binding.value['styleShadow'],
      isSetColor: binding.value['isSetColor'],
      isHover: binding.value['isHover'],
    };

    if (metaTextShadow.isHover) {
      removeListeners(el);

      el.__vHoverOver__ = () => {
        textNeonDirective.enableShadow(metaTextShadow);
      };
      el.__vHoverLeave__ = () => {
        textNeonDirective.disableShadow(metaTextShadow);
      };

      addListeners(el);
    } else {
      if (metaTextShadow.isNeon) {
        textNeonDirective.enableShadow(metaTextShadow);
      } else {
        textNeonDirective.disableShadow(metaTextShadow);
      }
    }
  },
  unmounted(el, binding) {
    removeListeners(el);
  },
});

app.directive('rotateShadow', {
  mounted(el, binding) {
    const metaRotateShadow: IRotateShadow = {
      el: el,
      color: binding.value['color'],
      colorShadow: binding.value['colorShadow'],
      styleShadow: binding.value['styleShadow'],
      isRotate: binding.value['isRotate'],
      isNeon: binding.value['isNeon'],
      isFixedShadow: binding.value['isFixedShadow'],
      isHover: binding.value['isHover'],
      isFixedColor: binding.value['isFixedColor'],
    };
    rotateShadowDirective.rotate(metaRotateShadow);

    removeListeners(el);

    if (metaRotateShadow.isHover) {
      el.__vHoverOver__ = () => {
        rotateShadowDirective.enableShadow(metaRotateShadow);
      };
      el.__vHoverLeave__ = () => {
        rotateShadowDirective.disableShadow(metaRotateShadow);
      };

      addListeners(el);
    } else {
      if (metaRotateShadow.isNeon) {
        rotateShadowDirective.enableShadow(metaRotateShadow);
      } else {
        rotateShadowDirective.disableShadow(metaRotateShadow);
      }
    }
  },
  updated(el, binding) {
    const metaRotateShadow: IRotateShadow = {
      el: el,
      color: binding.value['color'],
      colorShadow: binding.value['colorShadow'],
      styleShadow: binding.value['styleShadow'],
      isRotate: binding.value['isRotate'],
      isNeon: binding.value['isNeon'],
      isFixedShadow: binding.value['isFixedShadow'],
      isHover: binding.value['isHover'],
      isFixedColor: binding.value['isFixedColor'],
    };
    rotateShadowDirective.rotate(metaRotateShadow);

    if (metaRotateShadow.isHover) {
      removeListeners(el);

      el.__vHoverOver__ = () => {
        rotateShadowDirective.enableShadow(metaRotateShadow);
      };
      el.__vHoverLeave__ = () => {
        rotateShadowDirective.disableShadow(metaRotateShadow);
      };

      addListeners(el);
    } else {
      if (metaRotateShadow.isNeon) {
        rotateShadowDirective.enableShadow(metaRotateShadow);
      } else {
        rotateShadowDirective.disableShadow(metaRotateShadow);
      }
    }
  },

  unmounted(el, binding) {
    removeListeners(el);
  },
});

app.use(store);
app.use(router);
app.mount('#app');
