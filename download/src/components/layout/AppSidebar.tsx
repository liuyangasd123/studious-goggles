"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarGroup,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar";
import { Home, LineChart, CandlestickChart, User, Settings, ShieldCheck, Repeat, Briefcase } from "lucide-react";
import Image from "next/image";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/trade/BTC-USDT", label: "Trade", icon: Repeat },
  { href: "/charts/BTC-USDT", label: "Charts", icon: CandlestickChart },
  { href: "/profile", label: "Profile", icon: User },
];

const secondaryNavItems = [
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/security", label: "Security", icon: ShieldCheck },
  { href: "/portfolio", label: "Portfolio", icon: Briefcase },
];


export function AppSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    setOpenMobile(false);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
         <Link href="/" className="flex items-center gap-2" onClick={handleLinkClick}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-headline text-xl font-semibold text-foreground group-data-[collapsible=icon]:hidden">
              TradeWave
            </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-full">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))}
                  tooltip={item.label}
                  onClick={handleLinkClick}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>

          <SidebarGroup className="mt-4">
            <SidebarGroupLabel className="group-data-[collapsible=icon]:justify-center">
                <span className="group-data-[collapsible=icon]:hidden">More</span>
            </SidebarGroupLabel>
             <SidebarMenu>
                {secondaryNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                    onClick={handleLinkClick}
                    >
                    <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                    </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroup>

        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton tooltip="App Settings" onClick={handleLinkClick}>
                    <Settings/>
                    <span>Settings</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
