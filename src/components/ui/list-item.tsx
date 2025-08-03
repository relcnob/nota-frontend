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

  return (
    <div className={`bg-background flex flex-row rounded-lg border px-4 py-2`}>
      <div className="ml-4 flex w-full flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-4">
          <h2 className="w-48 text-xl font-bold">{list.title}</h2>
          {list.description && <p className="w-36 text-sm text-gray-600">{list.description}</p>}
        </div>
        <div className="flex h-8 w-24 flex-row items-center justify-center gap-2">
          {list.items.length > 0 && (
            <Badge className="bg-primary text-primary-foreground">
              {`${list.items.filter((item) => item.completed).length} / ${list.items.length}`}
              {list.items.filter((item) => item.completed).length === list.items.length && (
                <Check className="stroke-primary-foreground ml-1" size={12} />
              )}
            </Badge>
          )}
        </div>
        <div className="flex w-[100px] items-center justify-center -space-x-2">
          {list.owner && (
            <HoverCard>
              <HoverCardTrigger asChild>
                <Avatar className="ring-background h-8 w-8 ring-2 grayscale hover:grayscale-0">
                  <AvatarFallback className="cursor-default font-semibold">
                    {list.owner.username.charAt(0).toLocaleUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </HoverCardTrigger>
              <HoverCardContent>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold">{list.owner.username}</p>
                  <p className="text-xs text-gray-500">Owner</p>
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
              <HoverCardContent>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold">{collab.user.username}</p>
                  <p className="text-xs text-gray-500">{collab.role}</p>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
        <div className="flex flex-row items-center gap-6">
          <Popover>
            <PopoverTrigger>
              <div className="bg-sidebar group border-sidebar hover:border-border flex cursor-pointer items-center justify-center rounded-md border p-2 transition-colors">
                <Calendar className="group-hover:stroke-primary stroke-gray-500 transition" />
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex flex-col">
                <p className="text-sm text-gray-500">
                  Created: {new Date(list.createdAt).toLocaleDateString()}{' '}
                  {new Date(list.createdAt).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                {list.updatedAt && list.createdAt !== list.updatedAt && (
                  <p className="mt-2 text-sm text-gray-500">
                    Updated: {new Date(list.updatedAt).toLocaleDateString()}{' '}
                    {new Date(list.updatedAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                )}
              </div>
            </PopoverContent>
          </Popover>
          <Link href={`/dashboard/lists/${list.id}`} className="group">
            <div className="bg-sidebar group border-sidebar hover:border-border flex cursor-pointer items-center justify-center rounded-md border p-2 transition-colors">
              <Pencil className="group-hover:stroke-primary stroke-gray-500 transition" />
            </div>
          </Link>
          <Popover open={isDeleteOpen} onOpenChange={setDeleteOpen}>
            <PopoverTrigger>
              <div className="bg-sidebar group border-sidebar hover:border-border flex cursor-pointer items-center justify-center rounded-md border p-2 transition-colors">
                <Trash className="group-hover:stroke-destructive stroke-gray-500 transition" />
              </div>
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
