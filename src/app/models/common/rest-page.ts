export interface RestPage<T> {
  content?: T;
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  first: boolean;
  last: boolean;
  empty: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  totalElements: number;
  totalPages: number;
}
