export class SelectButtonModel {
  label: string = "";
  index: number = 0;

  apply(lambda: (x: SelectButtonModel) => void): SelectButtonModel {
    lambda(this);
    return this;
  }
}
