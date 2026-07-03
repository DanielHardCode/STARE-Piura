import { config } from './config';
import { apiFetch } from './api-client';

class LaravelApiClient {
  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    if (!config.laravelApiUrl) {
      throw new Error('La URL de la API de Laravel (VITE_LARAVEL_API_URL) no está configurada.');
    }

    return apiFetch<T>(path, options);
  }

  async get<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  async post<T>(path: string, body?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(path: string, body?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }
}

export const laravelApi = new LaravelApiClient();
export const isLaravelConfigured = (): boolean => {
  return !!config.laravelApiUrl;
};
