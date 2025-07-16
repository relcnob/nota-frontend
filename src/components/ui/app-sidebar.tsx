'use client';

import React from 'react';
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

function AppSidebar() {
  const { logout } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-2">
        <h2 className="text-lg font-semibold">Nota</h2>
        <p className="text-sm text-gray-500">Welcome to your dashboard</p>
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
                <Link href="/dashboard/lists">Lists</Link>
              </Button>
            </li>
          </ul>
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
