'use client';

import React from 'react';
import { LayoutDashboard, MessageSquare } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';

const menuList = [
  { name: 'My Forms', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Responses', icon: MessageSquare, path: '/dashboard/responses' },
];

function SideNav() {
  const path = usePathname();

  return (
    <div className="h-screen flex flex-col bg-white border-r border-gray-200">

      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 3L14.5 9H21L15.75 13.1L17.85 19L12 15.4L6.15 19L8.25 13.1L3 9H9.5L12 3Z" fill="white" opacity="0.95" />
            </svg>
          </div>
          <span className="font-display font-bold text-sm tracking-tight text-gray-900">
            INTELLIFORM
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {menuList.map((menu) => {
          const active = path === menu.path;
          return (
            <Link key={menu.path} href={menu.path}>
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                active
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}>
                <menu.icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-blue-600' : ''}`} />
                {menu.name}
                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <UserButton afterSignOutUrl="/" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-700 truncate">My Account</p>
            <p className="text-[11px] text-gray-400">Manage profile</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideNav;
