export class TableDialogColumn {
  field: string;
  header: string;
  constructor() {
    this.field = "";
    this.header = "";
  }

  build(field: string, header: string): TableDialogColumn {
    this.field = field;
    this.header = header;
    return this;
  }
}
