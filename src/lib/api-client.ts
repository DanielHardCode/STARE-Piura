import { config, isMockMode } from './config';
import { supabase } from './supabase/client';

async function getAccessToken(): Promise<string | null> {
  if (isMockMode || !supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const baseUrl = config.laravelApiUrl.replace(/\/$/, '');
  const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;

  const token = await getAccessToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

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
