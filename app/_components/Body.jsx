'use client';

import React from 'react';
import Link from 'next/link';
import { SignInButton, useUser } from '@clerk/nextjs';

/* ─── Form preview mockup shown in the hero ─── */
function FormPreview() {
  return (
    <div className="card-float relative select-none">
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-3xl bg-blue-500/10 dark:bg-blue-500/15 blur-2xl scale-110 pointer-events-none" />

      <div className="relative bg-white dark:bg-[#141418] border border-gray-100 dark:border-gray-800 rounded-3xl shadow-2xl shadow-black/10 dark:shadow-black/50 p-6 w-[310px]">
        {/* Traffic lights + badge */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-sm shadow-sm shadow-blue-500/30">
              ✦
            </div>
            <div>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-none">Generated · 4s</p>
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 leading-tight mt-0.5">
                Job Application
              </p>
            </div>
          </div>
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-3">
          {/* Name: auto-filled */}
          <div>
            <label className="text-[11px] font-medium text-gray-500 dark:text-gray-400 block mb-1">
              Full Name <span className="text-red-400">*</span>
            </label>
            <div className="w-full rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 px-3 py-2 flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Alex Johnson</span>
              <span className="flex items-center gap-1 text-[10px] text-blue-500 font-medium">
                <span>⚡</span>
                <span>Auto-filled</span>
              </span>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-[11px] font-medium text-gray-500 dark:text-gray-400 block mb-1">
              Email Address <span className="text-red-400">*</span>
            </label>
            <div className="w-full rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 px-3 py-2 text-sm text-gray-400 dark:text-gray-500">
              alex@company.com
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="text-[11px] font-medium text-gray-500 dark:text-gray-400 block mb-1.5">
              Rate your experience
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className={`text-xl leading-none ${
                    i <= 4
                      ? 'text-yellow-400'
                      : 'text-gray-200 dark:text-gray-700'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <button className="mt-5 w-full rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold py-2.5 shadow-md shadow-blue-500/25 hover:opacity-90 transition-opacity">
          Submit Application →
        </button>
      </div>
    </div>
  );
}

/* ─── Feature cards ─── */
const FEATURES = [
  {
    icon: '⚡',
    title: 'Instant Generation',
    desc: 'Describe your form in plain English. Fields, types, labels, and placeholders are built instantly. No templates needed.',
  },
  {
    icon: '🎯',
    title: 'Smart Auto-Fill',
    desc: 'Recognises returning users and pre-fills their name, email, and more. Fewer taps, higher completion rates.',
  },
  {
    icon: '📊',
    title: 'Built-in Analytics',
    desc: 'Response timelines, field-level breakdowns, pie and bar charts. All inside the dashboard. No third-party tools.',
  },
];

/* ─── How it works steps ─── */
const STEPS = [
  { n: '01', title: 'Sign in', desc: 'Create a free account. No credit card, no catch.' },
  { n: '02', title: 'Describe it', desc: 'Tell us what form you need in one sentence.' },
  { n: '03', title: 'Customize', desc: 'Edit fields, pick a theme, and set your background.' },
  { n: '04', title: 'Share & track', desc: 'One link. Every response tracked with live charts.' },
];

/* ─── Main landing page ─── */
function Body() {
  const { isSignedIn } = useUser();

  const PrimaryButton = ({ children, href }) => {
    const inner = (
      <button className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-950 dark:bg-gray-50 text-white dark:text-gray-950 text-sm font-semibold hover:opacity-85 transition-opacity shadow-lg shadow-black/10 dark:shadow-black/30">
        {children}
        <span className="group-hover:translate-x-0.5 transition-transform duration-150">→</span>
      </button>
    );
    if (href) return <Link href={href}>{inner}</Link>;
    return <SignInButton>{inner}</SignInButton>;
  };

  return (
    <div className="bg-[#F9F9F7] dark:bg-[#090A0F] text-gray-950 dark:text-gray-50 transition-colors duration-300 overflow-x-hidden">

      {/* ═══════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden">

        {/* Gradient blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="blob-1 absolute -top-32 -left-16 w-[520px] h-[520px] rounded-full bg-blue-400/20 dark:bg-blue-600/12 blur-[110px]" />
          <div className="blob-2 absolute -bottom-24 -right-20 w-[580px] h-[580px] rounded-full bg-violet-400/15 dark:bg-violet-600/10 blur-[130px]" />
          <div className="blob-3 absolute top-1/3 right-1/3 w-[280px] h-[280px] rounded-full bg-cyan-400/12 dark:bg-cyan-500/8 blur-[80px]" />
        </div>

        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none dot-grid text-gray-400/25 dark:text-gray-600/15" />

        <div className="relative max-w-6xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-8 items-center">

            {/* Left copy */}
            <div>
              {/* Badge */}

              {/* Headline */}
              <h1 className="font-display font-bold leading-[1.04] tracking-tight">
                <span className="anim-fade-up anim-d1 block text-[clamp(2.6rem,6vw,4.5rem)] text-gray-950 dark:text-gray-50">
                  Build forms in 
                </span>
                <span className="anim-fade-up anim-d2 block text-[clamp(2.6rem,6vw,4.5rem)] text-gray-950 dark:text-gray-50">
                  in <span className="gradient-text">seconds</span> not minutes
                </span>
                {/* <span className="anim-fade-up anim-d3 block text-[clamp(2.6rem,6vw,4.5rem)] gradient-text">
                  complete.
                </span> */}
              </h1>

              {/* Subtext */}
              <p className="anim-fade-up anim-d4 mt-6 text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-md leading-relaxed">
               Turn your idea into a polished form.
Simply tell us what you need to collect, and we'll generate a beautifully organized form.
Ready to customize and share.
              </p>

              {/* CTAs */}
              <div className="anim-fade-up anim-d5 flex flex-wrap gap-3 mt-8">
                {isSignedIn ? (
                  <PrimaryButton href="/dashboard">Open Dashboard</PrimaryButton>
                ) : (
                  <PrimaryButton>Start Building Free</PrimaryButton>
                )}
                <a href="#how-it-works">
                  <button className="px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-white/[0.04] backdrop-blur-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200">
                    See how it works
                  </button>
                </a>
              </div>

              {/* Mini stats */}
              <div className="anim-fade-up anim-d6 flex gap-7 mt-10 pt-8 border-t border-gray-200 dark:border-gray-800">
                {[
                  { val: '100+', label: 'Forms created' },
                  { val: '10K+', label: 'Responses' },
                  { val: '< 1 min', label: 'Build time' },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="font-display font-bold text-2xl text-gray-950 dark:text-gray-50">{s.val}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: form preview */}
            <div className="flex justify-center lg:justify-end">
              <FormPreview />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURES
      ═══════════════════════════════════════════ */}
      <section className="py-24 border-t border-gray-100 dark:border-gray-800/70">
        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-[0.18em] mb-3">
              Features
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-[2.5rem] text-gray-950 dark:text-gray-50 leading-tight">
              Everything you need,<br className="hidden sm:block" /> nothing you don&apos;t
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="group relative rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#111115] p-7 hover:border-blue-200 dark:hover:border-blue-900 hover:shadow-xl hover:shadow-blue-500/5 dark:hover:shadow-blue-900/10 transition-all duration-300"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-violet-500/0 group-hover:from-blue-500/[0.03] group-hover:to-violet-500/[0.03] transition-all duration-300" />

                <div className="relative">
                  <div className="w-12 h-12 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-2xl mb-5 group-hover:scale-105 transition-transform duration-200">
                    {f.icon}
                  </div>
                  <h3 className="font-display font-semibold text-lg text-gray-950 dark:text-gray-50 mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════ */}
      <section
        id="how-it-works"
        className="py-24 bg-white dark:bg-[#0C0D12] border-t border-gray-100 dark:border-gray-800/70"
      >
        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-[0.18em] mb-3">
              Process
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-[2.5rem] text-gray-950 dark:text-gray-50 leading-tight">
              Idea to live form in 4 steps
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((s, i) => (
              <div key={i} className="relative">
                {/* Step number */}
                <p className="font-display font-bold text-6xl text-gray-100 dark:text-gray-800/70 leading-none mb-4 select-none">
                  {s.n}
                </p>

                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-7 left-[calc(50%+28px)] right-0 h-px border-t-2 border-dashed border-gray-200 dark:border-gray-800" />
                )}

                <h3 className="font-display font-semibold text-lg text-gray-950 dark:text-gray-50 mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA BAND
      ═══════════════════════════════════════════ */}
      <section className="relative py-28 border-t border-gray-100 dark:border-gray-800/70 overflow-hidden">

        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-blue-400/8 dark:bg-blue-600/8 blur-[120px]" />
        </div>

        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-gray-950 dark:text-gray-50 leading-[1.1] mb-5">
            Ready to build forms<br />
            <span className="gradient-text">that get responses?</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-9 leading-relaxed">
            Free to start. No credit card. No design skills.
          </p>
          {isSignedIn ? (
            <Link href="/dashboard">
              <button className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gray-950 dark:bg-gray-50 text-white dark:text-gray-950 text-base font-semibold hover:opacity-85 transition-opacity shadow-xl shadow-black/10 dark:shadow-black/30">
                Open Dashboard <span>→</span>
              </button>
            </Link>
          ) : (
            <SignInButton>
              <button className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gray-950 dark:bg-gray-50 text-white dark:text-gray-950 text-base font-semibold hover:opacity-85 transition-opacity shadow-xl shadow-black/10 dark:shadow-black/30">
                Create your first form <span>→</span>
              </button>
            </SignInButton>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════ */}
      <footer className="border-t border-gray-100 dark:border-gray-800/70 py-8 bg-white/50 dark:bg-[#090A0F]/80">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-5">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm shadow-blue-500/30">
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
            <Link href="/About" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              About
            </Link>
            <Link href="/Features" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              Features
            </Link>
            <Link href="/dashboard" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Body;
