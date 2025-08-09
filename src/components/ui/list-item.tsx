'use client';

import { List } from '@/util/types/list';
import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Calendar, Pencil, Trash, Check } from 'lucide-react';
import Link from 'next/link';
import { Button } from './button';
import { Avatar, AvatarFallback } from './avatar';

import { HoverCardTrigger, HoverCard, HoverCardContent } from './hover-card';
import { Badge } from './badge';
function ListItem({ list, onDelete }: { list: List; onDelete: (id: string) => void }) {
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  const isLongTitle = list.title.length > 24;
  const shortTitle = isLongTitle ? list.title.slice(0, 24) + '...' : list.title;

  const isLongDescription = list.description && list.description.length > 32;
  const shortDescription =
    isLongDescription && list.description
      ? list.description.slice(0, 32) + '...'
      : list.description || 'No description';

  return (
    <div className={`bg-background flex flex-row rounded-lg border px-4 py-2`}>
      <div className="grid w-full grid-cols-12 items-center justify-between">
        <div className="col-span-3 flex flex-row items-center gap-4">
          {isLongTitle ? (
            <Popover>
              <PopoverTrigger asChild>
                <h2 className="hover:text-primary text max-w-[16rem] cursor-pointer text-lg font-semibold text-gray-700">
                  {shortTitle}
                </h2>
              </PopoverTrigger>
              <PopoverContent>
                <div className="flex flex-col">
                  <h2 className="text-lg font-semibold text-gray-700">{list.title}</h2>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <h2 className="text-lg font-semibold text-gray-700">{shortTitle}</h2>
          )}
        </div>
        <div className="col-span-3 flex flex-row items-center gap-4">
          {isLongDescription ? (
            <Popover>
              <PopoverTrigger asChild>
                <p className="hover:text-primary cursor-pointer text-sm text-gray-500">
                  {shortDescription}
                </p>
              </PopoverTrigger>
              <PopoverContent>
                <div className="flex flex-col px-2 py-1">
                  <p className="text-sm text-gray-500">{list.description}</p>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <p className="text-sm text-gray-500">{shortDescription}</p>
          )}
        </div>
        <div className="col-span-2 flex h-8 w-24 w-full flex-row items-center justify-center gap-2">
          {list.items.length > 0 && (
            <Badge className="bg-primary text-primary-foreground">
              {`${list.items.filter((item) => item.completed).length} / ${list.items.length}`}
              {list.items.filter((item) => item.completed).length === list.items.length && (
                <Check className="stroke-primary-foreground ml-1" size={12} />
              )}
            </Badge>
          )}
        </div>
        <div className="col-span-2 flex w-full items-center justify-center -space-x-2">
          {list.owner && (
            <HoverCard>
              <HoverCardTrigger asChild>
                <Avatar className="ring-background h-8 w-8 ring-2 grayscale hover:grayscale-0">
                  <AvatarFallback className="cursor-default font-semibold">
                    {list.owner.username.charAt(0).toLocaleUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </HoverCardTrigger>
              <HoverCardContent asChild>
                <div className="flex w-fit flex-col items-center gap-1">
                  <p className="text-sm font-semibold">{list.owner.username}</p>
                  <p className="text-xs text-gray-500">{list.owner.email}</p>
                  <Badge variant="outline" className="mt-2 w-full">
                    <p className="text-xs text-gray-500">Owner</p>
                  </Badge>
                </div>
              </HoverCardContent>
            </HoverCard>
          )}
          {list.collaborators?.map((collab) => (
            <HoverCard key={collab.id}>
              <HoverCardTrigger asChild>
                <Avatar className="ring-background h-8 w-8 ring-2 grayscale hover:grayscale-0">
                  <AvatarFallback className="cursor-default font-semibold">
                    {collab.user.username.charAt(0).toLocaleUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </HoverCardTrigger>
              <HoverCardContent asChild>
                <div className="flex w-fit flex-col items-center gap-1">
                  <p className="text-sm font-semibold">{collab.user.username}</p>
                  <p className="text-xs text-gray-500">{collab.user.email}</p>
                  <Badge variant="outline" className="mt-2 w-full">
                    <p className="text-xs text-gray-500">{collab.role}</p>
                  </Badge>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
        <div className="col-span-2 flex flex-row items-center justify-end gap-6">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="group cursor-pointer p-1">
                <Calendar className="group-hover:stroke-primary stroke-gray-500 transition" />
              </Button>
            </PopoverTrigger>
            <PopoverContent asChild>
              <div className="flex w-fit flex-col gap-2">
                <Badge className="w-full">
                  <p className="text-sm">
                    Created: {new Date(list.createdAt).toLocaleDateString()}{' '}
                    {new Date(list.createdAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </Badge>
                {list.updatedAt && list.createdAt !== list.updatedAt && (
                  <Badge className="w-full">
                    <p className="text-sm">
                      Updated: {new Date(list.updatedAt).toLocaleDateString()}{' '}
                      {new Date(list.updatedAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </Badge>
                )}
              </div>
            </PopoverContent>
          </Popover>
          <Button asChild variant="outline" size="icon" className="cursor-pointer p-1">
            <Link href={`/dashboard/lists/${list.id}`} className="group">
              <Pencil size={20} className="group-hover:stroke-primary stroke-gray-500 transition" />
            </Link>
          </Button>
          <Popover open={isDeleteOpen} onOpenChange={setDeleteOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="group cursor-pointer p-1">
                <Trash
                  size={20}
                  className="group-hover:stroke-destructive stroke-gray-500 transition"
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div>
                <p className="mb-4 justify-center text-center text-sm text-gray-500">
                  Are you sure you want to delete this list?
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    className="cursor-pointer"
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="cursor-pointer"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      onDelete(list.id);
                      setDeleteOpen(false);
                    }}
                  >
                    <Trash className="stroke-white" />
                    Delete
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}

export default ListItem;
