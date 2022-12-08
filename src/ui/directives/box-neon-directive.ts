import ShadowSevice from '@/ui/shadow-neon/shadow-neon';

const shadowSevice = new ShadowSevice();

export interface IBoxShadow {
  el?: any;
  color: string;
  style: string;
  neon: boolean;
  hover: boolean;
}

export class BoxShadowDirective {
  enableShadow(metaBoxShadow: IBoxShadow) {
    if (metaBoxShadow.el != undefined) {
      if (metaBoxShadow.neon) {
        const neonShadow = shadowSevice.getBoxNeon(metaBoxShadow.style, metaBoxShadow.color);
        metaBoxShadow.el.style.boxShadow = neonShadow;
      }
    }
  }

  disableShadow(metaBoxShadow: IBoxShadow) {
    if (metaBoxShadow.el != undefined) {
      metaBoxShadow.el.style.boxShadow = '';
    }
  }
}
