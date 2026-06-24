import { config } from './config';

/**
 * Cliente HTTP personalizado y ultraligero para consumir el backend Laravel.
 */
class LaravelApiClient {
  private get baseUrl() {
    return config.laravelApiUrl.replace(/\/$/, '');
  }

  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    if (!config.laravelApiUrl) {
      throw new Error('La URL de la API de Laravel (VITE_LARAVEL_API_URL) no está configurada.');
    }

    const url = `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMsg = `Error en petición Laravel API (${response.status}): ${response.statusText}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMsg = errorJson.message || errorJson.error || errorMsg;
      } catch {}
      throw new Error(errorMsg);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json() as Promise<T>;
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
