export class Vector2d {
  width: number = 0;
  height: number = 0;
  x: number = 0;
  y: number = 0;
  init(): void {
    this.width = 0;
    this.height = 0;
    this.x = 0;
    this.y = 0;
  }
  isInit(): boolean {
    return this.width == 0 && this.height == 0 && this.x == 0 && this.y == 0;
  }
  rotate(): Vector2d {
    let buff = this.width;
    this.width = this.height;
    this.height = buff;
    buff = this.x;
    this.x = this.y;
    this.y = buff;
    return this;
  }
  copy(data: Vector2d): Vector2d {
    this.width = data.width;
    this.height = data.height;
    this.x = data.x;
    this.y = data.y;
    return this;
  }
  setRect(left: number, top: number, right: number, bottom: number): Vector2d {
    this.x = left;
    this.y = top;
    this.width = right > left ? right - left : 0;
    this.height = bottom > top ? bottom - top : 0;
    return this;
  }
  get left(): number {
    return this.x;
  }
  set left(value: number) {
    const right = this.right;
    this.x = value;
    this.width = right - value;
//    this.width = right > value ? right - value : 0;
  }
  get top(): number {
    return this.y;
  }
  set top(value: number) {
    const bottom = this.bottom;
    this.y = value;
    this.height = bottom - value;
//    this.height = bottom > value ? bottom - value : 0;
  }
  get right(): number {
    return this.width + this.left;
  }
  set right(value: number) {
    this.width = value - this.left;
//    this.width = value > this.left ? value - this.left : 0;
  }
  get bottom(): number {
    return this.height + this.top;
  }
  set bottom(value: number) {
    this.height = value - this.top;
//    this.height = value > this.top ? value - this.top : 0;
  }
}
