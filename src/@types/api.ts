import { AxiosRequestConfig } from 'axios';

export type IAPIResponseTemplate<ReturnedDataType = any> = {
  headers: { 'set-cookie': string[]; 'x-total-count': string };
  data: ReturnedDataType;
  config: AxiosRequestConfig;
  request: object | any;
  status: number;
  statusText: string;
};

export type BaseResponseDataType = {
  status: string;
  data: [];
  errors: null | string;
};
