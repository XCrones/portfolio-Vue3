import ShadowSevice from '@/ui/shadow-neon/shadow-neon';

const shadowSevice = new ShadowSevice();

export interface ITextShadow {
  el?: any;
  isNeon: boolean;
  color: string;
  colorShadow: string;
  styleShadow: string;
  isSetColor: boolean;
  isHover: boolean;
}

export class TextNeonDirective {
  enableShadow(metaTextShadow: ITextShadow) {
    if (metaTextShadow.el != undefined) {
      if (metaTextShadow.isNeon) {
        const neonShadow = shadowSevice.getTextNeon(metaTextShadow.styleShadow, metaTextShadow.colorShadow);
        metaTextShadow.el.style.textShadow = neonShadow;
      }
      if (metaTextShadow.isSetColor) {
        metaTextShadow.el.style.color = metaTextShadow.color;
      }
    }
  }

  disableShadow(metaTextShadow: ITextShadow) {
    if (metaTextShadow.el != undefined) {
      metaTextShadow.el.style.color = '';
      metaTextShadow.el.style.textShadow = '';
    }
  }
}
