import { useQuery } from '@tanstack/react-query';
import { apiGet, unwrap } from '../services/api';
import type { ProfileStats, User } from '../services/types';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => unwrap(apiGet<User>('/profile')),
  });
}

export function useProfileStats() {
  return useQuery({
    queryKey: ['profile', 'stats'],
    queryFn: () => unwrap(apiGet<ProfileStats>('/profile/stats')),
  });
}
