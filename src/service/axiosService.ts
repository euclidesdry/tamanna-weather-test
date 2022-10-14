import axios, { AxiosInstance } from "axios";
import { IAPIResponseTemplate } from "../types/api";

class AxiosService {
  instance: AxiosInstance;

  constructor() {
    const instance = axios.create();
    instance.interceptors.response.use(this.handleSuccess, this.handleError);
    this.instance = instance;
  }

  handleSuccess(response: any) {
    return response;
  }

  handleError(error: any) {
    return Promise.reject(error);
  }

  get<ResponseType>(url: string) {
    return this.instance.get<any, IAPIResponseTemplate<ResponseType>, any>(url);
  }

  post<ResponseType>(url: string, data: any) {
    return this.instance.post<any, IAPIResponseTemplate<ResponseType>, any>(
      url,
      data
    );
  }

  patch<ResponseType>(url: string, data: any) {
    return this.instance.patch<any, IAPIResponseTemplate<ResponseType>, any>(
      url,
      data
    );
  }

  delete<ResponseType>(url: string) {
    return this.instance.delete<any, IAPIResponseTemplate<ResponseType>, any>(
      url
    );
  }
}

export default new AxiosService();
