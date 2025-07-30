'use client';

import { List } from '@/util/types/list';
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Calendar, Pencil, Trash } from 'lucide-react';
import Link from 'next/link';
import { Button } from './button';
import { Avatar, AvatarFallback } from './avatar';

import { HoverCardTrigger, HoverCard, HoverCardContent } from './hover-card';
function ListItem({ list, onDelete }: { list: List; onDelete: (id: string) => void }) {
  return (
    <div className={`bg-background flex flex-row rounded-lg border px-4 py-2`}>
      <div className="ml-4 flex w-full flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-4">
          <h2 className="w-48 text-xl font-bold">{list.title}</h2>
          {list.description && <p className="w-36 text-sm text-gray-600">{list.description}</p>}
        </div>
        <div className="flex -space-x-2">
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
        <div className="flex flex-row items-center gap-4">
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
          <Popover>
            <PopoverTrigger>
              <div className="bg-sidebar group border-sidebar hover:border-border flex cursor-pointer items-center justify-center rounded-md border p-2 transition-colors">
                <Trash className="group-hover:stroke-destructive stroke-gray-500 transition" />
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <div>
                <p className="mb-4 justify-center text-center text-sm text-gray-500">
                  Are you sure you want to delete list{' '}
                  <span className="font-semibold">{list.title}</span>?
                </p>
                <Button
                  className="w-full cursor-pointer"
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(list.id)}
                >
                  Delete
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}

export default ListItem;
