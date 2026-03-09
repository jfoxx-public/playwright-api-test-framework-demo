export interface IPet {
  id?: number;
  name: string;
  type: string;
  age: number;
}

export interface IDataResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface IResponseOptions {
  message?: string;
  status?: string;
  statusCode?: number;
}
