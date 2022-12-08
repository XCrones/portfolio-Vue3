export class PaginatorV2Service {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  private currPage = 1;
  private sumItems = 4;
  private readonly defaultSumItems = 4;

  init(sumItems?: number) {
    this.sumItems = !sumItems ? this.defaultSumItems : sumItems < 1 ? 1 : sumItems;
  }

  isEqualPage(page: number): boolean {
    return this.currPage === page + 1;
  }

  setCurrPage(page: number) {
    this.currPage = page + 1;
  }

  pages(arr: any[]): any[] {
    try {
      const pages = new Array(Math.ceil(arr.length / this.sumItems));
      return pages;
    } catch (e) {
      return [];
    }
  }

  parse(arr: any[]): any[] {
    try {
      const from = (this.currPage - 1) * this.sumItems;
      const to = from + this.sumItems;
      const result = arr.slice(from, to);
      return result;
    } catch (e) {
      return [];
    }
  }
}
