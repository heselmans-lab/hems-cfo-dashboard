'use client';

import React from 'react';
import { signIn } from 'next-auth/react';
import { Shield, Lock, CheckCircle2, HeartHandshake } from 'lucide-react';

export default function SignInPage() {
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="max-w-md w-full space-y-8 bg-slate-900/90 border border-slate-800 p-8 rounded-2xl shadow-2xl backdrop-blur-sm">
        
        {/* Header with icon */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400">
            <Shield className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            HEMS Senior Energieportaal
          </h1>
          <p className="text-sm text-slate-400">
            Beveiligde toegang voor familieleden en beheerder.
          </p>
        </div>

        {/* Informational Context Box */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-2 font-semibold text-slate-200">
            <HeartHandshake className="w-4 h-4 text-amber-400" />
            <span>Familieberaad Tessenderlo</span>
          </div>
          <p className="leading-relaxed">
            Voor Alain en Francis is dit portaal strikt beperkt tot het energiedossier en de beslissingsmatrix van Bomma in Tessenderlo. Andere sites blijven onzichtbaar en ontoegankelijk.
          </p>
        </div>

        {/* Security / MFA Badge */}
        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-950/40 border border-emerald-800/40 rounded-lg text-emerald-400 text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Verplichte 2-stapsverificatie (MFA) via Google Auth</span>
        </div>

        {/* Sign In Button */}
        <div className="space-y-4 pt-2">
          <button
            onClick={() => signIn('google', { callbackUrl: '/?site=bomma_tessenderlo' })}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-slate-100 text-slate-900 font-semibold rounded-xl transition duration-150 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Inloggen met Google</span>
          </button>

          {/* Dev Mode Simulation Login */}
          {isDev && (
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block text-center">
                Lokale Dev Simulator (Niet in Productie)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => signIn('dev-login', { email: 'alain@familie.be', callbackUrl: '/?site=bomma_tessenderlo' })}
                  className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs rounded-lg border border-slate-700"
                >
                  Als Alain (Tessenderlo)
                </button>
                <button
                  onClick={() => signIn('dev-login', { email: 'heselmans@gmail.com', callbackUrl: '/' })}
                  className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs rounded-lg border border-slate-700"
                >
                  Als Kristof (Admin)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="text-center pt-2">
          <p className="text-[11px] text-slate-500">
            Alleen geautoriseerde Google-accounts hebben toegang. Onbekende accounts worden automatisch geweigerd.
          </p>
        </div>

      </div>
    </div>
  );
}
