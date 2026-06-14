'use client';

import React from 'react';
import { SignedIn } from '@clerk/nextjs';
import SideNav from './_components/SideNav';

function DashboardLayout({ children }) {
  return (
    <SignedIn>
      <div className="flex min-h-screen bg-gray-50">
        <div className="hidden md:flex md:w-60 md:flex-col fixed inset-y-0 z-40">
          <SideNav />
        </div>
        <div className="flex-1 md:ml-60 min-h-screen">
          {children}
        </div>
      </div>
    </SignedIn>
  );
}

export default DashboardLayout;
