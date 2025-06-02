'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppWindow, LayoutDashboard, Package, FileText, Truck, Star, Menu, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import React from 'react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, pageTitle: 'Dashboard Overview' },
  { href: '/products', label: 'Products', icon: Package, pageTitle: 'Product Management' },
  { href: '/invoices', label: 'Invoices', icon: FileText, pageTitle: 'Invoice Generation' },
  { href: '/shipping', label: 'Shipping', icon: Truck, pageTitle: 'Shipping List' },
  { href: '/favorites', label: 'Favorites', icon: Star, pageTitle: 'Favorite Products' },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);

  const currentRouteItem = navItems.find(item => pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)));
  const pageTitle = currentRouteItem?.pageTitle || 'InvoMaster';


  const commonNavLinks = (closeMobileNav?: () => void) => (
    <>
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={closeMobileNav}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
              isActive ? 'bg-accent/20 text-primary' : 'text-muted-foreground'
            }`}
          >
            <item.icon className={`h-5 w-5 ${isActive ? 'text-primary': ''}`} />
            {item.label}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-card md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold font-headline text-primary">
              <AppWindow className="h-6 w-6" />
              <span className="">InvoMaster</span>
            </Link>
          </div>
          <nav className="flex-1 grid items-start px-2 text-sm font-medium lg:px-4 py-4 space-y-1">
            {commonNavLinks()}
          </nav>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
          <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
              <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link href="/" onClick={() => setIsMobileNavOpen(false)} className="flex items-center gap-2 font-semibold font-headline text-primary">
                  <AppWindow className="h-6 w-6" />
                  <span className="">InvoMaster</span>
                </Link>
              </div>
              <nav className="grid gap-2 text-base font-medium p-4">
                {commonNavLinks(() => setIsMobileNavOpen(false))}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <h1 className="font-headline text-xl font-semibold">{pageTitle}</h1>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" data-ai-hint="user avatar" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
