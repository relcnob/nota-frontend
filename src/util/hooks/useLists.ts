'use client';

import { useQuery } from '@tanstack/react-query';
import { List } from '@/util/types/list';
import api from '@/util/axios';

type ListsResponse = {
  lists: List[];
  meta: {
    page: number;
    limit: number;
    totalLists: number;
    totalPages: number;
  };
};

export function useLists(page: number, limit: number) {
  return useQuery<ListsResponse>({
    queryKey: ['lists', page, limit],
    queryFn: async () => {
      const res = await api.get('/lists', { params: { page, limit } });
      if (res.status !== 200) {
        throw new Error('Failed to fetch lists');
      }
      const data = await res;
      return data.data.data as ListsResponse;
    },
    staleTime: 1000 * 60 * 5,
  });
}
