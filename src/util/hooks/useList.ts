'use client';

import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
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

export function useUpdateList() {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: async (data: Partial<List>) => {
      const res = await api.patch(`/lists/${data.id}`, data);
      if (res.status !== 200) {
        throw new Error('Failed to update list');
      }
      return res.data as List;
    },
    onError: (error) => {
      console.error('Error updating list:', error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists'] });
      queryClient.invalidateQueries({ queryKey: ['list'] });
    },
  });
}

export function useDeleteList() {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/lists/${id}`);
      if (res.status !== 204) {
        throw new Error('Failed to delete list');
      }
      return res.data as List;
    },
    onError: (error) => {
      console.error('Error deleting list:', error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists'] });
    },
  });
}

export function useCreateList() {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: async (data: Partial<List>) => {
      const res = await api.post('/lists', data);
      if (res.status !== 201) {
        throw new Error('Failed to create list');
      }
      return res.data as List;
    },
    onError: (error) => {
      console.error('Error creating list:', error);
    },
    onSuccess: () => {
      console.log('List created successfully');
      queryClient.invalidateQueries({ queryKey: ['lists'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['list'] });
    },
  });
}
