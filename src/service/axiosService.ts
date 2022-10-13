import axios, { AxiosInstance } from "axios";

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
    return this.instance.get<any, ResponseType, any>(url);
  }

  post<ResponseType>(url: string, data: any) {
    return this.instance.post<any, ResponseType, any>(url, data);
  }

  patch<ResponseType>(url: string, data: any) {
    return this.instance.patch<any, ResponseType, any>(url, data);
  }

  delete<ResponseType>(url: string) {
    return this.instance.delete<any, ResponseType, any>(url);
  }
}

export default new AxiosService();
