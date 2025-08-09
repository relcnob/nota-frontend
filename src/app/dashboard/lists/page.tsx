'use client';

import { Button } from '@/components/ui/button';
import ListItem from '@/components/ui/list-item';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/auth-context';
import { useLists } from '@/util/hooks/useLists';
import { Plus } from 'lucide-react';
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
    <div className="w-full pt-4">
      {isLoadingLists && !listData ? (
        <div className="mb-4 flex w-full flex-col items-center justify-center gap-4">
          <div className="mb-4 flex w-full flex-row items-center justify-between">
            <Skeleton className="h-[36px] w-[200px] rounded-full" />
            <Skeleton className="h-[36px] w-[100px] rounded-full" />
          </div>
          <Skeleton className="mb-4 h-[36px] w-full rounded-full" />
        </div>
      ) : (
        <div className="flex w-full flex-col gap-4">
          <div className="mb-4 flex w-full flex-row items-center justify-between">
            <h1 className="text-3xl font-semibold">{`Your Lists (${lists.length})`}</h1>
            <Button variant="outline" className="cursor-pointer">
              <Plus /> Add List
            </Button>
          </div>
          <div className="mb-4 grid w-full grid-cols-12 px-4 text-sm font-semibold text-gray-500">
            <p className="col-span-3">Title</p>
            <p className="col-span-3">Description</p>
            <p className="col-span-2 w-full text-center">Tasks</p>
            <p className="col-span-2 w-full text-center">Collaborators</p>
          </div>
        </div>
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
