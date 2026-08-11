const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

interface ApiRequestOptions extends RequestInit {
  token?: string;
}

interface ApiErrorResponse {
  message?: string;
}

export const apiClient = async <T>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> => {
  const { token, ...fetchOptions } = options;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...fetchOptions.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage =
      data && typeof data === 'object' && 'message' in data
        ? (data as ApiErrorResponse).message
        : 'Something went wrong';

    throw new Error(errorMessage);
  }

  return data as T;
};
