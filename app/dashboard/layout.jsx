"use client";
import React from 'react';
import { SignedIn } from '@clerk/nextjs';
import SideNav from './_components/SideNav';

function DashboardLayout({ children }) {
    return (
            <SignedIn>
            <div className="flex">
                <div className="md:w-64 fixed">
                    <SideNav />
                </div>
                <div className="flex-grow md:ml-64 p-4">
                    {children}
                </div>
            </div>
        </SignedIn>
        
    );
}

export default DashboardLayout;
