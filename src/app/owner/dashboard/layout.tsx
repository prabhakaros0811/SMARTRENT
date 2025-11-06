import Link from 'next/link';
import {
  Home,
  Users,
  FileText,
  MessageSquareWarning,
  Lightbulb,
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
import { mockOwner } from '@/lib/data';

export default function OwnerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
              <Link href="/owner/dashboard" passHref>
                <SidebarMenuButton tooltip="Dashboard">
                  <Home />
                  Dashboard
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/owner/dashboard/tenants" passHref>
                <SidebarMenuButton tooltip="Tenants">
                  <Users />
                  Tenants
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/owner/dashboard/properties" passHref>
                <SidebarMenuButton tooltip="Properties">
                  <FileText />
                  Properties
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/owner/dashboard/complaints" passHref>
                <SidebarMenuButton tooltip="Complaints">
                  <MessageSquareWarning />
                  Complaints
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <Link href="/owner/dashboard/rent-prediction" passHref>
                <SidebarMenuButton tooltip="AI Rent Predictor">
                  <Lightbulb />
                  AI Rent Predictor
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
            <SidebarTrigger className="flex items-center gap-2 font-semibold" />
            <UserNav user={mockOwner} />
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
