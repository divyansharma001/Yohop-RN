import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost, unwrap } from '../services/api';
import { tokenStorage } from '../services/storage';
import type { Deal } from '../services/types';

export function useDeals(params?: {
  isActive?: boolean;
  isFlashSale?: boolean;
  isBounty?: boolean;
  category?: string;
}) {
  const qs = new URLSearchParams();
  if (params?.isActive !== undefined) qs.set('isActive', String(params.isActive));
  if (params?.isFlashSale) qs.set('isFlashSale', 'true');
  if (params?.isBounty) qs.set('isBounty', 'true');
  if (params?.category) qs.set('category', params.category);
  const suffix = qs.toString() ? `?${qs.toString()}` : '';
  return useQuery({
    queryKey: ['deals', params ?? {}],
    queryFn: () => unwrap(apiGet<Deal[]>(`/deals${suffix}`, false)),
  });
}

export function useNearbyDeals(params: {
  latitude: number;
  longitude: number;
  radius?: number;
}) {
  const qs = new URLSearchParams({
    lat: String(params.latitude),
    lng: String(params.longitude),
  });
  if (params.radius) qs.set('radius', String(params.radius));
  return useQuery({
    queryKey: ['deals', 'nearby', params],
    queryFn: () =>
      unwrap(apiGet<Deal[]>(`/deals/nearby?${qs.toString()}`, false)),
  });
}

export function useDeal(id: string | undefined) {
  return useQuery({
    queryKey: ['deals', id],
    queryFn: () => unwrap(apiGet<Deal>(`/deals/${id}`, false)),
    enabled: !!id,
  });
}

export function useSavedDeals() {
  return useQuery({
    queryKey: ['users', 'saved-deals'],
    queryFn: async () => {
      const token = await tokenStorage.get();
      if (!token) return [];
      return unwrap(apiGet<Deal[]>('/users/saved-deals'));
    },
  });
}

export function useToggleSavedDeal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dealId: string) =>
      unwrap(apiPost<{ saved: boolean }>('/users/save-deal', { dealId })),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users', 'saved-deals'] });
    },
  });
}
