'use client';

import { useParams } from 'next/navigation';
import { useList, useUpdateList } from '@/util/hooks/useList';
import {
  ArrowUpDown,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  CircleCheck,
  CircleUserRound,
  Crown,
  Funnel,
  LucideCalendarSync,
  Pen,
  Plus,
  RefreshCcw,
  TriangleAlert,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { formatRelativeDate } from '@/util/helpers/formatRelativeDate';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { useAuth } from '@/context/auth-context';
import { useEffect, useState } from 'react';
import { List } from '@/util/types/list';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { ItemElement } from '@/components/ui/item';
import { Item } from '@/util/types/item';
import Link from 'next/link';
import { useBulkItems } from '@/util/hooks/useBulkItems';
import { toast } from 'sonner';

const SortOptions = [
  { label: 'Name (A-Z)', value: 'name_asc' },
  { label: 'Name (Z-A)', value: 'name_desc' },
  { label: 'Newest First', value: 'createdAt_desc' },
  { label: 'Oldest First', value: 'createdAt_asc' },
  { label: 'Last Updated', value: 'updatedAt_desc' },
  { label: 'Completed First', value: 'completed_desc' },
  { label: 'Incomplete First', value: 'completed_asc' },
  { label: 'Quantity (High → Low)', value: 'quantity_desc' },
  { label: 'Quantity (Low → High)', value: 'quantity_asc' },
];

export default function ListDetailPage() {
  const [isOwner, setIsOwner] = useState(false);
  const [isEditor, setIsEditor] = useState<boolean | undefined>();
  const [listData, setListData] = useState<List | null>(null);
  const [itemCategories, setItemCategories] = useState<string[]>([]);
  const [itemsToBeAdded, setItemsToBeAdded] = useState<Partial<Item>[]>([]);
  const [itemsToBeUpdated, setItemsToBeUpdated] = useState<Partial<Item>[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [editedList, setEditedList] = useState<Partial<List>>({});
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [itemsToBeRemoved, setItemsToBeRemoved] = useState<string[]>([]);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const params = useParams();
  const id = params?.id as string;
  const auth = useAuth();
  const {
    mutate,
    isPending,
    isError: isListMutationError,
    isSuccess: isListMutationSuccess,
  } = useUpdateList();
  const { data, isLoading, isError } = useList(id);
  const { bulkUpdateItems, bulkCreateItems, bulkRemoveItems } = useBulkItems();
  useEffect(() => {
    if (data && !isLoading) {
      setListData(data.data);
    }
  }, [data, isLoading]);

  const updateItemLocally = async (updatedItem: Partial<Item>) => {
    if (!listData || !auth.user) return;

    const updatedItems = listData.items.map((item) =>
      item.id === updatedItem.id ? { ...item, ...updatedItem } : item,
    );

    setItemsToBeUpdated((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === updatedItem.id);

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          ...updatedItem,
        };
        return updated;
      }

      return [...prev, updatedItem];
    });

    setListData({ ...listData, items: updatedItems });
  };

  const deleteItemLocally = (itemId: string) => {
    if (!listData) return;

    const updatedItems = listData.items.filter((item) => item.id !== itemId);
    setListData({ ...listData, items: updatedItems });
    setItemsToBeRemoved((prev) => [...prev, itemId]);
  };

  const updateItemToBeCreatedLocally = (updatedItem: Partial<Item>) => {
    setItemsToBeAdded((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? { ...item, ...updatedItem } : item)),
    );
  };

  const deleteItemToBeCreatedLocally = (itemId: string) => {
    setItemsToBeAdded((prev) => prev.filter((item) => item.id !== itemId));
  };

  useEffect(() => {
    if (!listData) return;
    setTitle(listData.title);
    setDescription(listData.description || '');

    if ((data && listData !== data.data) || itemsToBeAdded.length > 0) {
      setHasUnsavedChanges(true);
    } else {
      setHasUnsavedChanges(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listData, itemsToBeAdded]);

  useEffect(() => {
    if (auth.user && listData) {
      setIsOwner(auth.user.id === listData.owner.id);
      setIsEditor(
        listData?.collaborators.some(
          (collab) => collab.userId === auth.user?.id && collab.role === 'editor',
        ),
      );
      const itemCategories = listData.items.reduce((acc, item) => {
        if (item.category && !acc.includes(item.category)) {
          acc.push(item.category);
        }
        return acc;
      }, [] as string[]);
      setItemCategories(itemCategories);
    }
  }, [auth.user, id, listData]);

  const createNewItem = () => {
    const newItem: Partial<Item> = {
      id: `new-${Date.now()}`,
      name: 'Untitled',
      quantity: 1,
      category: '',
      notes: '',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      listId: listData?.id || '',
      addedById: auth.user?.id || '',
    };
    setItemsToBeAdded((prev) => [...prev, newItem]);
  };

  const setHandlers = {
    Title: (value: string) => {
      setTitle(value);
      setHasUnsavedChanges(true);
    },
    Description: (value: string) => {
      setDescription(value);
      setHasUnsavedChanges(true);
    },
  };

  const submitHandlers = {
    Title: () => {
      setIsEditingTitle(false);
      if (title !== listData?.title) {
        setListData((prev) => (prev ? { ...prev, title } : null));
        setEditedList((prev) => ({ ...prev, title }));
        setHasUnsavedChanges(true);
      }
    },
    Description: () => {
      setIsEditingDescription(false);
      if (description !== listData?.description) {
        setListData((prev) => (prev ? { ...prev, description } : null));
        setEditedList((prev) => ({ ...prev, description }));
        setHasUnsavedChanges(true);
      }
    },
  };

  const resetChanges = () => {
    setListData(data?.data || null);
    setEditedList({});
    setItemsToBeAdded([]);
  };

  const saveChanges = () => {
    if (!listData || !auth.user) return;

    if (itemsToBeAdded.length > 0) {
      const stripIdFromNewItems = itemsToBeAdded
        .map((item) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id, ...rest } = item;
          return rest;
        })
        .filter((item): item is Partial<Item> => item !== undefined);
      bulkCreateItems.mutate(stripIdFromNewItems);
      setItemsToBeAdded([]);
    }

    if (itemsToBeUpdated.length > 0) {
      bulkUpdateItems.mutate(itemsToBeUpdated);
    }

    if (itemsToBeRemoved.length > 0) {
      bulkRemoveItems.mutate(itemsToBeRemoved);
      setItemsToBeRemoved([]);
    }

    if (Object.keys(editedList).length > 0 || title !== listData.title) {
      mutate({
        id: listData.id,
        ...editedList,
      });
      setEditedList({});
    }
  };

  useEffect(() => {
    if (
      bulkCreateItems.isSuccess ||
      bulkUpdateItems.isSuccess ||
      bulkRemoveItems.isSuccess ||
      isListMutationSuccess
    ) {
      toast('Changes saved successfully!', {
        id: 'bulk-save-success',
        position: 'top-center',
        dismissible: true,
        icon: <CheckCircle2 size={16} />,
      });
      setHasUnsavedChanges(false);
    }
  }, [
    bulkCreateItems.isSuccess,
    bulkUpdateItems.isSuccess,
    bulkRemoveItems.isSuccess,
    isListMutationSuccess,
  ]);

  return (
    <div className={'w-full'}>
      {isLoading && !listData ? (
        <p>Loading...</p>
      ) : isError || !listData ? (
        <p>Error loading list</p>
      ) : null}
      {!isLoading && listData && (
        <>
          <section className={'grid grid-cols-3 gap-8'}>
            <div className={'col-span-2'}>
              <div className="mb-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Link href={`/dashboard/lists/`} className="mx-2 flex items-center">
                    <ChevronLeft size={24} />
                  </Link>
                  <div className="group flex items-center gap-2">
                    {isEditingTitle ? (
                      <input
                        autoFocus
                        type="text"
                        className="w-[20rem] rounded border px-2 py-0 text-lg"
                        value={title}
                        onChange={(e) => setHandlers.Title(e.target.value)}
                        onBlur={submitHandlers.Title}
                        onKeyDown={(e) => e.key === 'Enter' && submitHandlers.Title()}
                      />
                    ) : (
                      <>
                        <HoverCard>
                          <HoverCardTrigger className="cursor-pointer">
                            <div
                              className="group flex items-center gap-2"
                              onClick={() => (isEditor || isOwner) && setIsEditingTitle(true)}
                            >
                              <h1
                                className={`${listData.title.length > 0 ? '' : 'text-gray-500'} max-w-[20rem] overflow-hidden text-2xl font-semibold text-ellipsis whitespace-nowrap`}
                              >
                                {listData.title.length > 0 ? listData.title : 'Untitled'}
                              </h1>
                              <div className="mt-1 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                {(isEditor || isOwner) && <Pen size={18} />}
                              </div>
                            </div>
                          </HoverCardTrigger>
                          <HoverCardContent
                            className={`w-fit ${listData.title.length > 0 ? '' : 'opacity-0'}`}
                          >
                            <p className="text-sm">{listData.title}</p>
                          </HoverCardContent>
                        </HoverCard>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-end gap-2">
                  {hasUnsavedChanges && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                      onClick={resetChanges}
                    >
                      <RefreshCcw size={24} /> Reset Changes
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="cursor-pointer">
                        <ArrowUpDown size={24} /> Sort
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {SortOptions.map((option) => (
                        <DropdownMenuItem key={option.value} className="cursor-pointer">
                          <span>{option.label}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="cursor-pointer">
                        <Funnel size={24} /> Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <Command>
                        <CommandInput placeholder="Search" />
                        <CommandList>
                          <CommandEmpty>No results found.</CommandEmpty>
                          <CommandGroup heading="Status">
                            <CommandItem>Completed</CommandItem>
                            <CommandItem>Incomplete</CommandItem>
                          </CommandGroup>

                          {listData?.collaborators.length > 0 && (
                            <>
                              <CommandSeparator />
                              <CommandGroup heading="Collaborators">
                                {listData.collaborators.map((collaborator) => (
                                  <CommandItem key={collaborator.id}>
                                    {collaborator.user.username}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </>
                          )}
                          {itemCategories.length > 0 && (
                            <>
                              <CommandSeparator />
                              <CommandGroup heading="Categories">
                                {itemCategories.map((category) => (
                                  <CommandItem key={category}>{category}</CommandItem>
                                ))}
                              </CommandGroup>
                            </>
                          )}
                        </CommandList>
                      </Command>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="space-y-4">
                {listData.items.length > 0 &&
                  listData.items
                    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
                    .map((item) => (
                      <ItemElement
                        key={item.id}
                        item={item}
                        onUpdate={updateItemLocally}
                        onDelete={() => deleteItemLocally(item.id)}
                      />
                    ))}
                {itemsToBeAdded.length > 0 &&
                  itemsToBeAdded
                    .sort((a, b) => (a.createdAt ?? '').localeCompare(b.createdAt ?? ''))
                    .map((item, index) => (
                      <ItemElement
                        key={`new-${index}`}
                        item={item}
                        onUpdate={updateItemToBeCreatedLocally}
                        onDelete={(id: string) => {
                          deleteItemToBeCreatedLocally(id);
                        }}
                      />
                    ))}
                {listData.items.length === 0 && itemsToBeAdded.length === 0 && (
                  <p className="text-gray-500">No items in this list.</p>
                )}
                <div className="my-6 flex justify-center">
                  <Button
                    variant="outline"
                    size="default"
                    className="cursor-pointer"
                    onClick={createNewItem}
                  >
                    <Plus size={24} /> Add item
                  </Button>
                </div>
              </div>
            </div>
            <div className="border-box sticky top-0 col-span-1 flex h-[calc(100vh-60px)] flex-col overflow-y-auto p-4">
              {hasUnsavedChanges ? (
                <div className="flex w-full items-center gap-2 rounded-md bg-yellow-500 px-4 py-2 text-white">
                  <TriangleAlert size={18} />
                  <p className={'text-sm font-semibold'}>Unsaved changes!</p>
                </div>
              ) : (
                <div className="block h-[36px] w-full"></div>
              )}
              <div className="group flex flex-col">
                <div className="mt-6 mb-2 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">About</h2>
                  {isOwner || isEditor ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="cursor-pointer opacity-0 transition-opacity group-hover:opacity-100"
                      disabled={isEditingDescription}
                      onClick={() => setIsEditingDescription(true)}
                    >
                      <Pen size={16} /> Edit
                    </Button>
                  ) : (
                    <></>
                  )}
                </div>
                {isEditingDescription ? (
                  <textarea
                    autoFocus
                    className="min-h-[150px] w-full rounded border p-2 text-sm"
                    value={description}
                    onChange={(e) => setHandlers.Description(e.target.value)}
                    onBlur={() => {
                      setIsEditingDescription(false);
                      submitHandlers.Description();
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && submitHandlers.Description()}
                  />
                ) : (
                  <div className="flex w-full flex-col">
                    <p className="mb-0 text-sm text-gray-500">
                      {listData.description
                        ? isDescriptionExpanded
                          ? listData.description
                          : listData.description.length > 120
                            ? listData.description.slice(0, 120) + '...'
                            : listData.description
                        : 'No description provided.'}
                    </p>
                    {listData?.description && listData.description.length > 120 && (
                      <Button
                        variant="ghost"
                        className="mx-auto cursor-pointer text-xs"
                        onClick={() => setIsDescriptionExpanded((prev) => !prev)}
                      >
                        <ChevronDown
                          className={`inline-block transition-transform ${
                            isDescriptionExpanded ? 'rotate-180' : ''
                          }`}
                          size={16}
                        />

                        {isDescriptionExpanded ? 'Show less' : 'Show more'}
                      </Button>
                    )}
                  </div>
                )}
              </div>
              <Separator className="my-2" />
              <div className="my-2 flex flex-col gap-2">
                <div className="flex items-center">
                  <Crown className="mr-2" size={18} />
                  <p>Owner</p>
                  <p className="ml-auto">{listData.owner.username || 'Unknown'}</p>
                </div>
                <div className="flex items-center">
                  <CircleCheck className="mr-2" size={18} />
                  <p>Items</p>
                  <p className="ml-auto">{listData.items.length}</p>
                </div>
                <div className="flex items-center">
                  <CircleUserRound className="mr-2" size={18} />
                  <p>Collaborators</p>
                  <p className="ml-auto">{listData.collaborators.length}</p>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-2" size={18} />
                  <p>Created</p>
                  <p className="ml-auto">{new Date(listData.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center">
                  <LucideCalendarSync className="mr-2" size={18} />
                  <p>Last edited</p>
                  <HoverCard>
                    <HoverCardTrigger className="ml-auto cursor-pointer">
                      <p>{formatRelativeDate(listData.updatedAt)}</p>
                    </HoverCardTrigger>
                    <HoverCardContent className="flex w-fit items-center justify-center">
                      <p className="mx-auto font-semibold">
                        {new Date(listData.updatedAt).toLocaleDateString()}
                      </p>
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <Separator className="my-2" />
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Collaborators</h2>
                    {isOwner && (
                      <Link
                        className="group flex items-center gap-2"
                        href={`/dashboard/lists/${id}/collaborators`}
                      >
                        <p className="group-hover:text-primary text-sm text-gray-500 transition">
                          Edit
                        </p>
                        <Pen
                          className="group-hover:stroke-primary inline-block stroke-gray-500 transition"
                          size={14}
                        />
                      </Link>
                    )}
                  </div>
                  <div className="mt-2 max-h-[250px] overflow-y-auto">
                    {listData.collaborators.map((collab) => (
                      <div key={collab.id} className="mt-2">
                        {collab.user.username} - {collab.role}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-auto flex w-full flex-col items-center justify-center gap-2">
                <Button
                  disabled={!hasUnsavedChanges || isPending}
                  variant="default"
                  size="lg"
                  className="w-full cursor-pointer"
                  onClick={saveChanges}
                >
                  {hasUnsavedChanges ? 'Save changes' : 'No changes to save'}
                </Button>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
