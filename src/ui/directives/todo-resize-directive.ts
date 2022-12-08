export interface ITodoResize {
  el?: any;
  width: number;
  filter: string;
}

export class TodoResizeDirective {
  private readonly sm: number = 640;
  private readonly md: number = 768;
  private readonly lg: number = 1024;

  resize(metaResize: ITodoResize) {
    if (metaResize.el != undefined) {
      if (metaResize.width < this.lg && metaResize.filter === 'date') {
        metaResize.el.style.display = 'none';
      } else if (metaResize.width > this.lg && metaResize.filter === 'date') {
        metaResize.el.style.display = 'table-cell';
      }

      if (metaResize.width < this.md && metaResize.filter === 'priority') {
        metaResize.el.style.display = 'none';
      } else if (metaResize.width > this.md && metaResize.filter === 'priority') {
        metaResize.el.style.display = 'table-cell';
      }

      if (metaResize.width < this.sm && metaResize.filter === 'category') {
        metaResize.el.style.display = 'none';
      } else if (metaResize.width > this.sm && metaResize.filter === 'category') {
        metaResize.el.style.display = 'table-cell';
      }
    }
  }
}
