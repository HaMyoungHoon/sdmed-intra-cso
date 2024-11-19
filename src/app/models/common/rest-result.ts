export interface RestResult<T> {
  result?: boolean;
  code?: number;
  msg?: string;
  data?: T;
}
