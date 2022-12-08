export default class ShadowSevice {
  private _colorNeon = '#00ff84';
  private _colorShadow = '#0fa';
  private _colorRedNeon = '#ff2121';
  private _colorRedShadow = '#ff3c00';

  get colorNeonGreen(): string {
    return this._colorNeon;
  }
  get colorGreen(): string {
    return this._colorShadow;
  }
  get colorRedneon(): string {
    return this._colorRedNeon;
  }
  get colorRedShadow(): string {
    return this._colorRedShadow;
  }

  textShadowLight(color: string): string {
    return `0 0 1px ${color}, 0 0 1px ${color}, 0 0 1px ${color}, 0 0 1px ${color}, 0 0 1px ${color}, 0 0 1px ${color}, 0 0 1px ${color}, 0 0 2px ${color}`;
  }

  textShadowMedium(color: string): string {
    return `0 0 2px ${color}, 0 0 2px ${color}, 0 0 2px ${color}, 0 0 2px ${color}, 0 0 2px ${color}, 0 0 2px ${color}, 0 0 2px ${color}, 0 0 6px ${color}`;
  }

  textShadowHight(color: string): string {
    return `0 0 2px ${color}, 0 0 4px ${color}, 0 0 4px ${color}, 0 0 4px ${color}, 0 0 4px ${color}, 0 0 4px ${color}, 0 0 4px ${color}, 0 0 8px ${color}`;
  }

  boxShadowLight(color: string): string {
    return `0 0 0.1rem ${color}, 0 0 0.1rem ${color}, 0 0 0.8rem ${color}, 0 0 0.1rem ${color}, 0 0 0.1rem ${color}`;
  }

  boxShadowMedium(color: string): string {
    return `0 0 0.1rem ${color}, 0 0 0.1rem ${color}, 0 0 1rem ${color}, 0 0 0.1rem ${color}, 0 0 1.4rem ${color}`;
  }

  boxShadowHight(color: string): string {
    return `0 0 0.1rem ${color}, 0 0 0.1rem ${color}, 0 0 1rem ${color}, 0 0 0.1rem ${color}, 0 0 1.4rem ${color}`;
  }

  getBoxNeon(style: string, color: string): string {
    const tempStyle = style.toLowerCase().trim();
    switch (tempStyle) {
      case 'light':
        return this.boxShadowLight(color);
      case 'medium':
        return this.boxShadowMedium(color);
      case 'hight':
        return this.boxShadowHight(color);
      default:
        return '';
    }
  }

  getTextNeon(style: string, color: string): string {
    const tempStyle = style.toLowerCase().trim();
    switch (tempStyle) {
      case 'light':
        return this.textShadowLight(color);
      case 'medium':
        return this.textShadowMedium(color);
      case 'hight':
        return this.textShadowHight(color);
      default:
        return 'empty';
    }
  }
}
