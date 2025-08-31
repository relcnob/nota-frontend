'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/util/axios';
import { DashboardMetrics } from '../types/metrics';

export function useDashboardMetrics(userId?: string) {
  return useQuery({
    queryKey: ['dashboard', userId],
    queryFn: async () => {
      const res = await api.get(`/users/${userId}/metrics`);
      if (res.status !== 200) {
        throw new Error('Failed to fetch dashboard metrics');
      }
      const data = await res;
      console.log(res);

      return data.data.data as DashboardMetrics;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
}
