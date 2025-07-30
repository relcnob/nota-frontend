'use client';

import { useParams } from 'next/navigation';
import { useList } from '@/hooks/useList';
import {
  ArrowUpDown,
  Calendar,
  CircleCheck,
  CircleUserRound,
  Crown,
  Funnel,
  LucideCalendarSync,
  Pen,
  Plus,
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
  const params = useParams();
  const id = params?.id as string;
  const auth = useAuth();
  const { data, isLoading, isError } = useList(id);

  const updateItemLocally = async (updatedItem: Partial<Item>) => {
    if (!listData || !auth.user) return;

    const updatedItems = listData.items.map((item) =>
      item.id === updatedItem.id ? { ...item, ...updatedItem } : item,
    );

    setListData({ ...listData, items: updatedItems });
  };

  const updateItemToBeCreatedLocally = (updatedItem: Partial<Item>) => {
    setItemsToBeAdded((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? { ...item, ...updatedItem } : item)),
    );
  };

  useEffect(() => {
    if (data) {
      console.log('List data:', data.data);
      setListData(data.data);
    }
  }, [data]);

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
      name: '',
      quantity: 1,
      category: '',
      notes: '',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setItemsToBeAdded((prev) => [...prev, newItem]);
  };

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
                <div className="group flex cursor-pointer items-center gap-2">
                  <h1 className="text-2xl font-semibold">{listData.title}</h1>
                  {isEditor ||
                    (isOwner && (
                      <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <Pen className="cursor-pointer" size={20} />
                      </div>
                    ))}
                </div>
                <div className="flex items-end gap-2">
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
                  listData.items.map((item) => (
                    <ItemElement key={item.id} item={item} onUpdate={updateItemLocally} />
                  ))}
                {itemsToBeAdded.length > 0 &&
                  itemsToBeAdded.map((item, index) => (
                    <ItemElement
                      key={`new-${index}`}
                      item={item}
                      onUpdate={updateItemToBeCreatedLocally}
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
            <div className="sticky top-0 col-span-1 h-screen overflow-y-auto p-4">
              {data && data.data !== listData ? (
                <div className="flex w-full items-center gap-2 rounded-md bg-yellow-500 px-4 py-2 text-white">
                  <TriangleAlert size={18} />
                  <p className={'text-sm font-semibold'}>Unsaved changes!</p>
                </div>
              ) : (
                <div className="block h-[36px] w-full"></div>
              )}
              <h2 className="mt-6 mb-2 text-xl font-semibold">About</h2>
              <p className="text-sm">{listData.description || 'No description provided.'}</p>
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
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Collaborators</h2>
                  {isOwner && (
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-500">Edit</p>
                      <Pen className="inline-block stroke-gray-500" size={14} />
                    </div>
                  )}
                </div>
                <div>
                  {listData.collaborators.map((collab) => (
                    <div key={collab.id} className="mt-2">
                      {collab.user.username} - {collab.role}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
