'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import ListItem from '@/components/ui/list-item';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/auth-context';
import { useLists } from '@/util/hooks/useLists';
import { CheckCircle2, CircleXIcon, Plus, TriangleAlert } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useCreateList, useDeleteList } from '@/util/hooks/useList';

export default function ListsPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pageSize, setPageSize] = useState(10);
  const { data: listData, isLoading: isLoadingLists, isError, refetch } = useLists(page, pageSize);
  const [lists, setLists] = useState(listData?.lists ?? []);

  // CREATE LIST FORM
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [listTitle, setListTitle] = useState('');
  const [listDescription, setListDescription] = useState('');

  const {
    mutate: createList,
    isSuccess: isListCreated,
    isError: isListCreationError,
  } = useCreateList();
  const {
    mutate: deleteList,
    isSuccess: isListDeleted,
    isError: isListDeletionError,
  } = useDeleteList();

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setListTitle('');
    setListDescription('');
  };

  const handleListCreate = async () => {
    if (!user) return;
    if (!listTitle) {
      toast('Title is required', {
        id: 'missing-title',
        position: 'top-center',
        dismissible: true,
        icon: <TriangleAlert size={16} />,
      });
      return;
    }
    createList({ title: listTitle, description: listDescription, ownerId: user.id });
    handleDialogClose();
  };

  useEffect(() => {
    if (isListCreated) {
      toast('List created successfully', {
        id: 'list-created',
        position: 'top-center',
        dismissible: true,
        icon: <CheckCircle2 size={16} />,
      });
      setListTitle('');
      setListDescription('');
      refetch();
    }
  }, [isListCreated]);

  useEffect(() => {
    if (isListDeleted) {
      toast('List deleted successfully', {
        id: 'list-deleted',
        position: 'top-center',
        dismissible: true,
        icon: <CheckCircle2 size={16} />,
      });
      refetch();
    }
  }, [isListDeleted]);

  useEffect(() => {
    if (isError) {
      toast('An error occurred while deleting the list', {
        id: 'list-deletion-error',
        position: 'top-center',
        dismissible: true,
        icon: <CircleXIcon size={16} />,
      });
    }
  }, [isError]);

  useEffect(() => {
    if (isListCreationError) {
      toast('An error occurred while creating the list', {
        id: 'list-creation-error',
        position: 'top-center',
        dismissible: true,
        icon: <CircleXIcon size={16} />,
      });
    }
  }, [isListCreationError]);

  useEffect(() => {
    if (isListDeletionError) {
      toast('An error occurred while deleting the list', {
        id: 'list-deletion-error',
        position: 'top-center',
        dismissible: true,
        icon: <CircleXIcon size={16} />,
      });
    }
  }, [isListDeletionError]);

  const handleDelete = async (listId: string) => {
    if (!user || !listId) return;
    console.log('Deleting list with ID:', listId);
    deleteList(listId);
  };

  useEffect(() => {
    if (listData && page > 1) {
      setLists((prev) => [...prev, ...listData.lists]);
    } else if (listData && page === 1) {
      setLists(listData.lists);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listData?.lists, page]);

  return (
    <div className="flex h-full w-full flex-col pt-4">
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
          <div className="mb-4 flex w-full flex-row items-center justify-between pr-4">
            <h1 className="text-3xl font-semibold">{`Your Lists (${lists.length})`}</h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="cursor-pointer">
                  <Plus /> Add List
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a new list</DialogTitle>
                  <DialogDescription>
                    To create a new list provide with a title and an optional description.
                  </DialogDescription>
                </DialogHeader>
                <section className="flex flex-col gap-2">
                  <h2 className="text-muted-foreground m-0 text-sm font-semibold">Title</h2>
                  <Input
                    placeholder="fx. Groceries"
                    value={listTitle}
                    onChange={(e) => setListTitle(e.target.value)}
                  />
                  <h2 className="text-muted-foreground m-0 text-sm font-semibold">{`Description (optional)`}</h2>
                  <Input
                    type="text"
                    placeholder="Briefly describe your list"
                    value={listDescription}
                    onChange={(e) => setListDescription(e.target.value)}
                  />
                </section>
                <section className="flex w-full flex-row justify-end gap-4">
                  <Button
                    variant="outline"
                    className="cursor-pointer px-6"
                    size="sm"
                    onClick={handleDialogClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    className="cursor-pointer px-6"
                    size="sm"
                    onClick={handleListCreate}
                  >
                    Create
                  </Button>
                </section>
              </DialogContent>
            </Dialog>
          </div>
          <div className="text-muted-foreground mb-2 grid w-full grid-cols-12 pr-12 pl-4 text-sm font-semibold">
            <p className="col-span-3">Title</p>
            <p className="col-span-2">Description</p>
            <p className="col-span-2 w-full text-center">Tasks</p>
            <p className="col-span-1 w-full text-center">Owner</p>
            <p className="col-span-2 w-full text-center">Collaborators</p>
            <p className="col-span-2 w-full text-center"></p>
          </div>
        </div>
      )}
      <div className="scrollbar-thin scrollbar-thumb-rounded-md scrollbar-track-rounded-md scrollbar-thumb-gray-300 grid flex-grow grid-cols-1 gap-4 overflow-y-auto pt-2 pr-4 pb-4">
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
            {listData && page !== listData.meta.totalPages && (
              <Button
                variant="default"
                className="mx-auto mt-4 w-fit cursor-pointer px-8"
                onClick={() => setPage((prev) => prev + 1)}
              >
                Load more lists
              </Button>
            )}
          </>
        )}
        {!isLoadingLists && lists && lists.length === 0 && (
          <div className="mb-6 grid grid-cols-1 items-center gap-2">
            <h2 className="width-full text-muted-foreground text-center text-lg font-semibold">
              No lists found.
            </h2>
            <p className="width-full text-muted-foreground text-center">
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
