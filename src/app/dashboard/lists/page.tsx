'use client';

import ListItem from '@/components/ui/list-item';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/auth-context';
import { useLists } from '@/hooks/useLists';
import { useEffect, useState } from 'react';

export default function ListsPage() {
  const { user } = useAuth();
  const { data: listData, isLoading: isLoadingLists, isError } = useLists(1, 10);
  const [lists, setLists] = useState(listData?.lists ?? []);

  const handleDelete = async (listId: string) => {
    if (!user || !listId) return;
    console.log('Deleting list with ID:', listId);
  };

  useEffect(() => {
    if (listData) {
      setLists(listData.lists);
    }
  }, [isLoadingLists, listData]);

  return (
    <div className="w-full">
      {isLoadingLists && !listData ? (
        <Skeleton className="mb-12 h-[36px] w-[200px] rounded-full" />
      ) : (
        <h1 className="mb-12 text-3xl font-semibold">{`Your Lists (${lists.length})`}</h1>
      )}
      <div className="mb-6 grid grid-cols-1 gap-4">
        {isLoadingLists && !listData && (
          <>
            <Skeleton className="h-[60px] w-full rounded-md" />
            <Skeleton className="h-[60px] w-full rounded-md" />
            <Skeleton className="h-[60px] w-full rounded-md" />
            <Skeleton className="h-[60px] w-full rounded-md" />
            <Skeleton className="h-[60px] w-full rounded-md" />
          </>
        )}
        {!isLoadingLists && lists && lists.length > 0 && (
          <>
            {lists.map((list) => (
              <ListItem key={list.id} list={list} onDelete={() => handleDelete(list.id)} />
            ))}
          </>
        )}
        {!isLoadingLists && lists && lists.length === 0 && (
          <div className="mb-6 grid grid-cols-1 items-center gap-2">
            <h2 className="width-full text-center text-lg font-semibold text-gray-500">
              No lists found.
            </h2>
            <p className="width-full text-center text-gray-500">
              Try creating a new list or adjust the filters.
            </p>
          </div>
        )}
        {isError && (
          <p className="width-full text-center text-red-500">
            Failed to load lists. Please try again later.
          </p>
        )}
      </div>
    </div>
  );
}
