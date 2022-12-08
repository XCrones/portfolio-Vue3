import ShadowSevice from '@/ui/shadow-neon/shadow-neon';

const shadowSevice = new ShadowSevice();

export interface IRotateShadow {
  el?: any;
  color: string;
  colorShadow: string;
  styleShadow: string;
  isRotate: boolean;
  isNeon: boolean;
  isFixedShadow: boolean;
  isFixedColor: boolean;
  isHover: boolean;
}

export class RotateShadowDirective {
  rotate(metaRotateShadow: IRotateShadow) {
    if (metaRotateShadow.el != undefined) {
      if (metaRotateShadow.isRotate) {
        metaRotateShadow.el.style.transform = 'rotate(-180deg)';
        if (metaRotateShadow.isFixedColor) {
          this.setColor(metaRotateShadow.el, metaRotateShadow.color);
        }

        if (metaRotateShadow.isNeon && metaRotateShadow.isFixedShadow) {
          this.enableShadow(metaRotateShadow);
        } else {
          this.clearShadow(metaRotateShadow.el);
        }
      } else {
        this.disableRotate(metaRotateShadow);
      }
    }
  }

  enableShadow(metaRotateShadow: IRotateShadow) {
    if (metaRotateShadow.el != undefined) {
      if (metaRotateShadow.isNeon) {
        const neonShadow = shadowSevice.getTextNeon(metaRotateShadow.styleShadow, metaRotateShadow.colorShadow);
        this.setShadow(metaRotateShadow.el, neonShadow);
      } else {
        this.clearShadow(metaRotateShadow.el);
      }
      this.setColor(metaRotateShadow.el, metaRotateShadow.color);
    }
  }

  disableShadow(metaRotateShadow: IRotateShadow) {
    if (metaRotateShadow.el != undefined) {
      if (!metaRotateShadow.isRotate) {
        this.clearColor(metaRotateShadow.el);
        this.clearShadow(metaRotateShadow.el);
      }
    }
  }

  private setColor(el: any, color: string) {
    el.style.color = color;
  }

  private clearColor(el: any) {
    el.style.color = '';
  }

  private setShadow(el: any, color: string) {
    el.style.textShadow = color;
  }
  private clearShadow(el: any) {
    el.style.textShadow = '';
  }

  private disableRotate(metaRotateShadow: IRotateShadow) {
    metaRotateShadow.el.style.transform = 'rotate(0deg)';
    this.disableShadow(metaRotateShadow);
  }
}
