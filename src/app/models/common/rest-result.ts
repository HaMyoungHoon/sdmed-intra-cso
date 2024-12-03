export class RestResult<T> {
  result?: boolean;
  code?: number;
  msg?: string;
  data?: T;

  get default(): RestResult<T> {
    return this
  }
}
