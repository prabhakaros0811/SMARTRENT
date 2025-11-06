'use client';

import Link from 'next/link';
import {
  Home,
  History,
  MessageSquareWarning,
  Star,
} from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { UserNav } from '@/components/user-nav';
import { Icons } from '@/components/icons';
import { mockTenants } from '@/lib/data';
import React from 'react';

export default function TenantDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const [currentUser, setCurrentUser] = React.useState(mockTenants[0]);

    React.useEffect(() => {
        const loggedInTenantId = localStorage.getItem('loggedInTenantId');
        const tenant = mockTenants.find(t => t.id === loggedInTenantId);
        if (tenant) {
            setCurrentUser(tenant);
        }
    }, []);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Icons.logo className="w-7 h-7 text-primary" />
            <span className="text-lg font-semibold tracking-tighter">eMall Portal</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/tenant/dashboard" passHref>
                <SidebarMenuButton tooltip="Dashboard">
                  <Home />
                  Dashboard
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/tenant/dashboard/history" passHref>
                <SidebarMenuButton tooltip="Payment History">
                  <History />
                  Payment History
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/tenant/dashboard/complaints" passHref>
                <SidebarMenuButton tooltip="Complaints">
                  <MessageSquareWarning />
                  Complaints
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Feedback">
                <Star />
                Feedback
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
            <SidebarTrigger className="flex items-center gap-2 font-semibold" />
            <UserNav user={currentUser} />
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
