import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { TokenStorage } from '../auth/TokenStorage';

export interface ApiClientConfig {
  baseURL: string;
  tokenStorage: TokenStorage;
  onUnauthorized?: () => void;
}

export class ApiClient {
  private instance: AxiosInstance;
  private tokenStorage: TokenStorage;
  private onUnauthorized?: () => void;

  constructor(config: ApiClientConfig) {
    this.tokenStorage = config.tokenStorage;
    this.onUnauthorized = config.onUnauthorized;

    this.instance = axios.create({
      baseURL: config.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor: Add JWT token
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.tokenStorage.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor: Handle 401
    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.tokenStorage.removeToken();
          this.onUnauthorized?.();
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const response = await this.instance.get<T>(url, { params });
    return response.data;
  }

  async post<T, D = unknown>(url: string, data?: D): Promise<T> {
    const response = await this.instance.post<T>(url, data);
    return response.data;
  }

  async put<T, D = unknown>(url: string, data?: D): Promise<T> {
    const response = await this.instance.put<T>(url, data);
    return response.data;
  }

  async patch<T, D = unknown>(url: string, data?: D): Promise<T> {
    const response = await this.instance.patch<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.instance.delete<T>(url);
    return response.data;
  }

  async uploadFile<T>(url: string, file: File, fieldName = 'file'): Promise<T> {
    const formData = new FormData();
    formData.append(fieldName, file);

    const response = await this.instance.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}
