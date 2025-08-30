'use client';

import React, { useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from './sidebar';
import { Button } from './button';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { Separator } from './separator';
import { useLists } from '@/util/hooks/useLists';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible';
import { ChevronDown } from 'lucide-react';
import { Badge } from './badge';
import { Skeleton } from './skeleton';

function AppSidebar() {
  const { logout } = useAuth();

  const { data: listData, isLoading: isLoadingLists } = useLists(1, 4);
  const [isRecentOpen, setIsRecentOpen] = useState(true);
  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-2">
        <h2 className="text-lg font-semibold">Nota</h2>
        <p className="text-muted-foreground text-sm">Welcome to your dashboard</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <ul className="space-y-2">
            <li>
              <Button
                asChild
                className="align-start w-full cursor-pointer justify-start"
                variant={'ghost'}
                size="sm"
              >
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </li>
            <li>
              <Button
                asChild
                className="align-start w-full cursor-pointer justify-start"
                variant={'ghost'}
                size="sm"
              >
                <Link href="/dashboard/lists">All lists</Link>
              </Button>
            </li>
          </ul>
        </SidebarGroup>
        <Separator />
        <SidebarGroup>
          {isLoadingLists && (
            <div className="flex w-full flex-col">
              <h2 className="mb-2 px-3 py-2 text-sm font-medium">Recently created</h2>
              <div className="flex w-full flex-col space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          )}
          {!isLoadingLists && listData && listData.lists.length === 0 && (
            <>
              <h2 className="mb-2px-3 py-2 text-sm font-medium">Recently created</h2>
              <p>No lists found.</p>
            </>
          )}
          {!isLoadingLists && listData && listData.lists.length > 0 && (
            <Collapsible open={isRecentOpen} onOpenChange={setIsRecentOpen}>
              <CollapsibleTrigger asChild>
                <Button
                  className="mb-2 flex w-full cursor-pointer items-center justify-between px-2 py-1"
                  variant={'ghost'}
                >
                  <h2 className="text-sm font-medium">Recently created</h2>
                  <ChevronDown
                    size={16}
                    className={`stroke-muted-foreground ${isRecentOpen ? 'rotate-180' : ''}`}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ul className="space-y-2">
                  {listData.lists.map((list) => {
                    const completedItems = list.items.filter((item) => item.completed).length;
                    const allItems = list.items.length;
                    return (
                      <li key={list.id}>
                        <Button
                          asChild
                          className="align-start w-full cursor-pointer justify-between"
                          variant={'ghost'}
                          size="sm"
                        >
                          <Link
                            href={`/dashboard/lists/${list.id}`}
                            className="flex w-full flex-row items-center justify-between"
                          >
                            <p className="no-wrap max-w-[calc(100%-5rem)] truncate">{list.title}</p>
                            {allItems > 0 ? (
                              <Badge className="text-xs">{`${completedItems} / ${allItems}`}</Badge>
                            ) : (
                              <Badge className="bg-muted-foreground text-xs">0</Badge>
                            )}
                          </Link>
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          )}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <ul className="space-y-2">
              <Button asChild className="w-full cursor-pointer" variant={'outline'} size="sm">
                <Link href="/dashboard/profile">Profile</Link>
              </Button>
              <Button
                variant="default"
                onClick={logout}
                size="sm"
                className="w-full cursor-pointer"
              >
                Logout
              </Button>
            </ul>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
