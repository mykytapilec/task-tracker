const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

interface ApiRequestOptions extends RequestInit {
  token?: string;
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

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'Something went wrong',
    }));

    throw new Error(error.message);
  }

  return response.json();
};
