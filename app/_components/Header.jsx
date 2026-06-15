'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';

function Header() {
  const { isSignedIn } = useUser();
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  if (
    path.includes('aiform') ||
    path.includes('About') ||
    path.includes('Features') ||
    path.startsWith('/dashboard') ||
    path.startsWith('/edit-form') ||
    path.startsWith('/sign-in') ||
    path.startsWith('/sign-up')
  )
    return null;

  const navLinks = [
    { href: '/About', label: 'About' },
    { href: '/Features', label: 'Features' },
    ...(isSignedIn ? [{ href: '/dashboard', label: 'Dashboard' }] : []),
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
      <div
        className={`max-w-6xl mx-auto flex items-center justify-between rounded-2xl px-5 py-2.5 transition-all duration-300 ${
          scrolled
            ? 'bg-white/85 dark:bg-gray-950/90 backdrop-blur-xl border border-gray-200/80 dark:border-gray-800/60 shadow-xl shadow-black/5 dark:shadow-black/30'
            : 'bg-transparent border border-transparent'
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm shadow-blue-500/30 group-hover:scale-105 transition-transform duration-200">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 3L14.5 9H21L15.75 13.1L17.85 19L12 15.4L6.15 19L8.25 13.1L3 9H9.5L12 3Z"
                fill="white"
                opacity="0.95"
              />
            </svg>
          </div>
          <span className="font-display font-bold text-[15px] tracking-tight text-gray-950 dark:text-gray-50">
            INTELLIFORM
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-3.5 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-lg transition-all duration-150"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          {isSignedIn ? (
            <div className="flex items-center gap-2.5">
              <Link href="/dashboard">
                <button className="px-4 py-2 text-sm font-semibold bg-gray-950 dark:bg-gray-50 text-white dark:text-gray-950 rounded-xl hover:opacity-80 transition-opacity shadow-sm">
                  Dashboard
                </button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <SignInButton>
              <button className="px-4 py-2 text-sm font-semibold bg-gray-950 dark:bg-gray-50 text-white dark:text-gray-950 rounded-xl hover:opacity-80 transition-opacity shadow-sm">
                Get Started
              </button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
