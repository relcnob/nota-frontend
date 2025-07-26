'use client';

import { useQuery } from '@tanstack/react-query';
import { List } from '@/util/types/list';

type ListsResponse = {
  lists: List[];
  meta: {
    page: number;
    limit: number;
    totalLists: boolean;
    totalPages: boolean;
  };
};

export function useLists(page: number, limit: number) {
  return useQuery<ListsResponse>({
    queryKey: ['lists', page, limit],
    queryFn: async () => {
      const res = await fetch(`/api/lists?page=${page}&limit=${limit}`);
      if (!res.ok) {
        throw new Error('Failed to fetch lists');
      }
      const data = await res.json();
      return data.data;
    },
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });
}
