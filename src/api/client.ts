const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const TOKEN_KEY = 'task-tracker-token';

interface ApiRequestOptions extends RequestInit {
  token?: string;
  params?: Record<string, string | undefined>;
}

interface ApiErrorResponse {
  message?: string;
}

export const apiClient = async <T>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> => {
  const { token, params, ...fetchOptions } = options;

  const storedToken = localStorage.getItem(TOKEN_KEY);
  const authToken = token ?? storedToken;

  const query = params
    ? new URLSearchParams(
        Object.entries(params).filter(
          (entry): entry is [string, string] => entry[1] !== undefined,
        ),
      ).toString()
    : '';

  const url = `${API_URL}/api${endpoint}${query ? `?${query}` : ''}`;

  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && {
        Authorization: `Bearer ${authToken}`,
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
