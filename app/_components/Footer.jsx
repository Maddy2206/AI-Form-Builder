import React from 'react';
import Link from 'next/link';

function Footer() {
  return (
    <footer className="border-t border-gray-100 dark:border-gray-800/70 py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 3L14.5 9H21L15.75 13.1L17.85 19L12 15.4L6.15 19L8.25 13.1L3 9H9.5L12 3Z"
                fill="white"
                opacity="0.95"
              />
            </svg>
          </div>
          <span className="font-display font-bold text-sm text-gray-800 dark:text-gray-200">INTELLIFORM</span>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          © 2025 INTELLIFORM · Built for humans.
        </p>
        <div className="flex gap-5 text-xs text-gray-500 dark:text-gray-400">
          <Link href="/About" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">About</Link>
          <Link href="/Features" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">Features</Link>
          <Link href="/dashboard" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">Dashboard</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
