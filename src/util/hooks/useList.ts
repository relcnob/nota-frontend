'use client';

import { useQuery } from '@tanstack/react-query';
import { List } from '@/util/types/list';
import api from '@/util/axios';

type ListResponse = {
  data: List;
};

export function useList(id: string | undefined) {
  return useQuery<ListResponse>({
    queryKey: ['list', id],
    queryFn: async () => {
      if (!id) throw new Error('Missing list ID');
      const res = await api.get(`/lists/${id}`);
      if (res.status !== 200) {
        throw new Error('Failed to fetch list');
      }
      return res.data as ListResponse;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}
