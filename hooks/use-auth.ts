import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost, unwrap } from '../services/api';
import { guestStorage, tokenStorage } from '../services/storage';
import type { AuthResponse, User } from '../services/types';

export const ME_QUERY_KEY = ['auth', 'me'] as const;

export function useMe() {
  return useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: async () => {
      const token = await tokenStorage.get();
      if (!token) return null;
      return unwrap(apiGet<User>('/auth/me'));
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const res = await unwrap(
        apiPost<AuthResponse>('/auth/login', payload, false),
      );
      await tokenStorage.set(res.token);
      await guestStorage.disable();
      return res;
    },
    onSuccess: (res) => {
      qc.setQueryData(ME_QUERY_KEY, res.user);
    },
  });
}

export function useRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      name: string;
      email: string;
      password: string;
      referralCode?: string;
    }) => {
      const res = await unwrap(
        apiPost<AuthResponse>('/auth/register', payload, false),
      );
      await tokenStorage.set(res.token);
      await guestStorage.disable();
      return res;
    },
    onSuccess: (res) => {
      qc.setQueryData(ME_QUERY_KEY, res.user);
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return async () => {
    await tokenStorage.clear();
    await guestStorage.disable();
    qc.setQueryData(ME_QUERY_KEY, null);
    qc.clear();
  };
}
