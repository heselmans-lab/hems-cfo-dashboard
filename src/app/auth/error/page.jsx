'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="max-w-md w-full space-y-6 bg-slate-900 border border-red-500/30 p-8 rounded-2xl shadow-2xl text-center">
        <div className="inline-flex p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Toegang Geweigerd
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Het gebruikte Google-account is niet geautoriseerd voor dit portaal.
        </p>
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 text-xs text-slate-400 text-left space-y-1">
          <p className="font-semibold text-slate-300">Wat kun je doen?</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Log in met het e-mailadres dat door Kristof werd goedgekeurd.</li>
            <li>Neem contact op met Kristof om jouw Google-account toe te voegen aan de toegangslijst.</li>
          </ul>
        </div>
        <div className="pt-2">
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl border border-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Terug naar aanmelden</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
