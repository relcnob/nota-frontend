'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/util/axios';
import { Item } from '@/util/types/item';

export function useBulkItems() {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<Item>[]) => {
      const res = await api.patch('/items/bulk', updates);
      if (res.status !== 200) {
        throw new Error('Bulk update failed');
      }
      return res.data.data as Item[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists'] });
      queryClient.invalidateQueries({ queryKey: ['list'] });
    },
    onError: (err) => {
      console.error('🔴 Bulk PATCH failed:', err);
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newItems: Partial<Item>[]) => {
      const res = await api.post('/items/bulk', newItems);
      if (res.status !== 200) {
        throw new Error('Bulk create failed');
      }
      return res.data.data as Item[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists'] });
      queryClient.invalidateQueries({ queryKey: ['list'] });
    },
    onError: (err) => {
      console.error('🔴 Bulk POST failed:', err);
    },
  });

  return {
    bulkUpdateItems: updateMutation,
    bulkCreateItems: createMutation,
  };
}
