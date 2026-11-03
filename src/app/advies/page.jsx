'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Home, 
  Flame, 
  Zap, 
  Sun, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Printer, 
  Share2, 
  HelpCircle, 
  Sparkles,
  PhoneCall,
  Check,
  RotateCcw,
  ExternalLink,
  HeartHandshake
} from 'lucide-react';

export default function EenvoudigAdviesPage() {
  // Wizard state
  const [step, setStep] = useState(1);

  // Accessibility: Text size scale (1 = normaal, 2 = groot, 3 = extra groot)
  const [textSize, setTextSize] = useState(2); // Standaard al lekker groot voor senioren!

  // Form state
  const [housingType, setHousingType] = useState('appartement'); // appartement | huis
  const [hasGas, setHasGas] = useState(true); // eigen gasketel vs centrale verwarming/geen gas
  const [hasSolar, setHasSolar] = useState(false); // zonnepanelen ja/nee

  const [currentSupplier, setCurrentSupplier] = useState('luminus'); // luminus | engie | total | mega | eneco | anders
  const [inputMode, setInputMode] = useState('monthly'); // 'monthly' | 'kwh' | 'average'
  
  // Maandbedragen
  const [monthlyElec, setMonthlyElec] = useState(75);
  const [monthlyGas, setMonthlyGas] = useState(110);

  // Exacte kWh (indien van factuur afgelezen)
  const [kwhElec, setKwhElec] = useState(1600);
  const [kwhGas, setKwhGas] = useState(6500);

  // Text size classes
  const fontClass = useMemo(() => {
    switch (textSize) {
      case 1: return { base: 'text-base', lg: 'text-lg', xl: 'text-xl', '2xl': 'text-2xl', '3xl': 'text-3xl', '4xl': 'text-4xl' };
      case 3: return { base: 'text-xl', lg: 'text-2xl', xl: 'text-3xl', '2xl': 'text-4xl', '3xl': 'text-5xl', '4xl': 'text-6xl' };
      default: // 2 (Groot)
        return { base: 'text-lg', lg: 'text-xl', xl: 'text-2xl', '2xl': 'text-3xl', '3xl': 'text-4xl', '4xl': 'text-5xl' };
    }
  }, [textSize]);

  // Berekening verbruik
  const effectiveUsage = useMemo(() => {
    if (inputMode === 'average') {
      const elec = housingType === 'appartement' ? 1500 : 3200;
      const gas = hasGas ? (housingType === 'appartement' ? 5500 : 14000) : 0;
      return { elec, gas };
    }
    if (inputMode === 'monthly') {
      // Slapend legacy contract hanteert vaak ~€0,38/kWh all-in stroom en ~€0,11/kWh gas
      const elec = Math.round((monthlyElec * 12) / 0.38);
      const gas = hasGas ? Math.round((monthlyGas * 12) / 0.11) : 0;
      return { elec, gas };
    }
    // 'kwh'
    return {
      elec: Number(kwhElec) || 1600,
      gas: hasGas ? (Number(kwhGas) || 6000) : 0
    };
  }, [inputMode, housingType, hasGas, monthlyElec, monthlyGas, kwhElec, kwhGas]);

  // Berekening huidige kosten vs nieuwe kosten
  const financialResult = useMemo(() => {
    const { elec, gas } = effectiveUsage;

    // 1. Huidige situatie (Slapend/Legacy contract zoals Luminus Basic of Engie Classic)
    // Vaak hoge vaste vergoeding (€ 65 - 85/jr) + hoge kWh prijs
    const currentElecCost = Math.round(75 + (elec * 0.355));
    const currentGasCost = gas > 0 ? Math.round(65 + (gas * 0.108)) : 0;
    const currentTotalYear = currentElecCost + currentGasCost;

    // 2. Nieuwe beste situatie (100% Vaste prijs met maximale welkomstkorting)
    // Gas: Engie Easy Fixed promo (-€432 eDeal korting) -> netto zeer scherp
    // Stroom: Ecopower (€0 vast recht) of Engie Flow met welkomstkorting
    let newElecCost = 0;
    let newGasCost = 0;

    if (hasSolar) {
      // Ecopower: €0 vast recht, top injectie
      newElecCost = Math.round(0 + (elec * 0.285));
    } else {
      // Engie / Total met welkomstpromo van ~€140-180
      newElecCost = Math.max(250, Math.round(55 + (elec * 0.295) - 150));
    }

    if (gas > 0) {
      // Engie Easy Fixed met eDeal korting van ~€250-430 (naar rato van verbruik)
      const gasDiscount = gas < 8000 ? 220 : 432;
      newGasCost = Math.max(350, Math.round(45 + (gas * 0.088) - gasDiscount));
    }

    const newTotalYear = newElecCost + newGasCost;
    const yearlySavings = Math.max(120, currentTotalYear - newTotalYear);
    const monthlySavings = Math.round(yearlySavings / 12);

    return {
      currentTotalYear,
      newTotalYear,
      yearlySavings,
      monthlySavings,
      currentElecCost,
      currentGasCost,
      newElecCost,
      newGasCost,
      recommendedGas: 'ENGIE Easy Fixed (12 maanden vast tarief)',
      recommendedGasDiscount: gas < 8000 ? '€ 220' : '€ 432',
      recommendedElec: hasSolar ? 'Ecopower Groene Burgerstroom' : 'ENGIE Easy of TotalEnergies (met welkomstkorting)'
    };
  }, [effectiveUsage, hasSolar]);

  // WhatsApp deellink genereren
  const whatsappShareUrl = useMemo(() => {
    const text = `Dag! Ik heb net via de Energie-Adviseur berekend hoeveel ${housingType === 'appartement' ? 'ons appartement' : 'ons huis'} kan besparen op energie:
    
💰 Besparing: ongeveer € ${financialResult.yearlySavings} per jaar (€ ${financialResult.monthlySavings}/maand minder!).
🔥 Aanrader Gas: ${financialResult.recommendedGas} (100% vaste prijs voor 1 jaar).
⚡ Aanrader Elektriciteit: ${financialResult.recommendedElec}.

Kan jij me helpen om deze overstap in orde te brengen? We hebben enkel de laatste factuur nodig voor het EAN-nummer.`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }, [financialResult, housingType]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <main className="min-h-screen bg-amber-50/40 text-slate-900 pb-20 font-sans print:bg-white print:text-black">
      {/* Top Bar met Toegankelijkheidsbediening */}
      <header className="bg-white border-b-2 border-amber-200 px-4 py-4 shadow-sm print:hidden">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-emerald-600 text-white rounded-2xl shadow-md">
              <HeartHandshake className="w-8 h-8" aria-hidden="true" />
            </span>
            <div>
              <h1 className={`font-black text-slate-900 leading-tight ${fontClass.xl}`}>
                Eenvoudige Energie-Adviseur
              </h1>
              <p className={`text-slate-600 font-medium ${fontClass.base}`}>
                100% Onafhankelijk & Vrijblijvend advies voor iedereen
              </p>
            </div>
          </div>

          {/* Lettergrootte knoppen */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border-2 border-slate-300" role="group" aria-label="Tekstgrootte aanpassen">
            <span className="text-xs font-bold uppercase text-slate-500 px-2">Lettergrootte:</span>
            <button
              onClick={() => setTextSize(1)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${textSize === 1 ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-200'}`}
              aria-label="Normale tekst"
              aria-pressed={textSize === 1}
            >
              A
            </button>
            <button
              onClick={() => setTextSize(2)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${textSize === 2 ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-200'}`}
              aria-label="Grote tekst"
              aria-pressed={textSize === 2}
            >
              A+
            </button>
            <button
              onClick={() => setTextSize(3)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${textSize === 3 ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-200'}`}
              aria-label="Extra grote tekst"
              aria-pressed={textSize === 3}
            >
              A++
            </button>
          </div>
        </div>
      </header>

      {/* Hoofdcontainer */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        
        {/* Voortgangsbalk */}
        <nav aria-label="Voortgang" className="mb-8 print:hidden">
          <ol className="flex items-center justify-between relative">
            <li className="flex-1 text-center">
              <button 
                onClick={() => setStep(1)} 
                className={`flex flex-col items-center gap-1 mx-auto focus:outline-none focus:ring-4 focus:ring-emerald-500 rounded-xl p-1`}
              >
                <span className={`w-12 h-12 rounded-full flex items-center justify-center font-black ${fontClass.lg} transition-all ${step >= 1 ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-200 text-slate-600'}`}>
                  1
                </span>
                <span className={`font-bold ${step === 1 ? 'text-emerald-800 underline underline-offset-4' : 'text-slate-600'} ${fontClass.base}`}>
                  Woning
                </span>
              </button>
            </li>
            <div className={`h-1.5 flex-1 transition-colors ${step >= 2 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
            <li className="flex-1 text-center">
              <button 
                onClick={() => setStep(2)} 
                className={`flex flex-col items-center gap-1 mx-auto focus:outline-none focus:ring-4 focus:ring-emerald-500 rounded-xl p-1`}
              >
                <span className={`w-12 h-12 rounded-full flex items-center justify-center font-black ${fontClass.lg} transition-all ${step >= 2 ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-200 text-slate-600'}`}>
                  2
                </span>
                <span className={`font-bold ${step === 2 ? 'text-emerald-800 underline underline-offset-4' : 'text-slate-600'} ${fontClass.base}`}>
                  Factuur
                </span>
              </button>
            </li>
            <div className={`h-1.5 flex-1 transition-colors ${step >= 3 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
            <li className="flex-1 text-center">
              <button 
                onClick={() => setStep(3)} 
                className={`flex flex-col items-center gap-1 mx-auto focus:outline-none focus:ring-4 focus:ring-emerald-500 rounded-xl p-1`}
              >
                <span className={`w-12 h-12 rounded-full flex items-center justify-center font-black ${fontClass.lg} transition-all ${step === 3 ? 'bg-emerald-600 text-white shadow-md ring-4 ring-emerald-300' : 'bg-slate-200 text-slate-600'}`}>
                  3
                </span>
                <span className={`font-bold ${step === 3 ? 'text-emerald-800 underline underline-offset-4' : 'text-slate-600'} ${fontClass.base}`}>
                  Jouw Besparing
                </span>
              </button>
            </li>
          </ol>
        </nav>

        {/* ========================================== */}
        {/* STAP 1: WONING & SITUATIE                   */}
        {/* ========================================== */}
        {step === 1 && (
          <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border-2 border-amber-100" aria-labelledby="stap1-titel">
            <h2 id="stap1-titel" className={`font-black text-slate-900 mb-2 ${fontClass['3xl']}`}>
              Stap 1: In wat voor woning woon je?
            </h2>
            <p className={`text-slate-600 mb-8 font-medium ${fontClass.lg}`}>
              Kies eenvoudig wat het beste past bij jouw situatie.
            </p>

            <fieldset className="mb-8">
              <legend className={`font-bold text-slate-800 mb-4 block ${fontClass.xl}`}>
                1. Wat voor soort woning is het?
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setHousingType('appartement')}
                  className={`p-6 rounded-2xl border-4 text-left flex items-start gap-4 transition-all focus:outline-none focus:ring-4 focus:ring-emerald-500 ${housingType === 'appartement' ? 'border-emerald-600 bg-emerald-50 shadow-md' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                  aria-pressed={housingType === 'appartement'}
                >
                  <Building2 className={`w-12 h-12 shrink-0 ${housingType === 'appartement' ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <div>
                    <span className={`font-black block text-slate-900 ${fontClass.xl}`}>Appartement</span>
                    <span className={`text-slate-600 block mt-1 ${fontClass.base}`}>Een flat of serviceflat met buren rondom.</span>
                  </div>
                  {housingType === 'appartement' && <CheckCircle2 className="w-8 h-8 text-emerald-600 ml-auto shrink-0" />}
                </button>

                <button
                  type="button"
                  onClick={() => setHousingType('huis')}
                  className={`p-6 rounded-2xl border-4 text-left flex items-start gap-4 transition-all focus:outline-none focus:ring-4 focus:ring-emerald-500 ${housingType === 'huis' ? 'border-emerald-600 bg-emerald-50 shadow-md' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                  aria-pressed={housingType === 'huis'}
                >
                  <Home className={`w-12 h-12 shrink-0 ${housingType === 'huis' ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <div>
                    <span className={`font-black block text-slate-900 ${fontClass.xl}`}>Huis</span>
                    <span className={`text-slate-600 block mt-1 ${fontClass.base}`}>Rijhuis, halfopen of alleenstaande woning.</span>
                  </div>
                  {housingType === 'huis' && <CheckCircle2 className="w-8 h-8 text-emerald-600 ml-auto shrink-0" />}
                </button>
              </div>
            </fieldset>

            <fieldset className="mb-8">
              <legend className={`font-bold text-slate-800 mb-4 block ${fontClass.xl}`}>
                2. Hoe wordt de woning verwarmd?
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setHasGas(true)}
                  className={`p-6 rounded-2xl border-4 text-left flex items-start gap-4 transition-all focus:outline-none focus:ring-4 focus:ring-emerald-500 ${hasGas ? 'border-emerald-600 bg-emerald-50 shadow-md' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                  aria-pressed={hasGas}
                >
                  <Flame className={`w-12 h-12 shrink-0 ${hasGas ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <div>
                    <span className={`font-black block text-slate-900 ${fontClass.xl}`}>Eigen Aardgas</span>
                    <span className={`text-slate-600 block mt-1 ${fontClass.base}`}>Ik heb een eigen gasketel en een eigen gasmeter.</span>
                  </div>
                  {hasGas && <CheckCircle2 className="w-8 h-8 text-emerald-600 ml-auto shrink-0" />}
                </button>

                <button
                  type="button"
                  onClick={() => setHasGas(false)}
                  className={`p-6 rounded-2xl border-4 text-left flex items-start gap-4 transition-all focus:outline-none focus:ring-4 focus:ring-emerald-500 ${!hasGas ? 'border-emerald-600 bg-emerald-50 shadow-md' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                  aria-pressed={!hasGas}
                >
                  <Zap className={`w-12 h-12 shrink-0 ${!hasGas ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <div>
                    <span className={`font-black block text-slate-900 ${fontClass.xl}`}>Centraal of Alleen Stroom</span>
                    <span className={`text-slate-600 block mt-1 ${fontClass.base}`}>Geen eigen gasmeter (via syndicus of elektrische verwarming).</span>
                  </div>
                  {!hasGas && <CheckCircle2 className="w-8 h-8 text-emerald-600 ml-auto shrink-0" />}
                </button>
              </div>
            </fieldset>

            <fieldset className="mb-10">
              <legend className={`font-bold text-slate-800 mb-4 block ${fontClass.xl}`}>
                3. Liggen er zonnepanelen op het dak?
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setHasSolar(false)}
                  className={`p-6 rounded-2xl border-4 text-left flex items-start gap-4 transition-all focus:outline-none focus:ring-4 focus:ring-emerald-500 ${!hasSolar ? 'border-emerald-600 bg-emerald-50 shadow-md' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                  aria-pressed={!hasSolar}
                >
                  <span className="w-12 h-12 flex items-center justify-center text-3xl shrink-0">❌</span>
                  <div>
                    <span className={`font-black block text-slate-900 ${fontClass.xl}`}>Nee, geen zonnepanelen</span>
                    <span className={`text-slate-600 block mt-1 ${fontClass.base}`}>Standaard voor bijna alle appartementen.</span>
                  </div>
                  {!hasSolar && <CheckCircle2 className="w-8 h-8 text-emerald-600 ml-auto shrink-0" />}
                </button>

                <button
                  type="button"
                  onClick={() => setHasSolar(true)}
                  className={`p-6 rounded-2xl border-4 text-left flex items-start gap-4 transition-all focus:outline-none focus:ring-4 focus:ring-emerald-500 ${hasSolar ? 'border-emerald-600 bg-emerald-50 shadow-md' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                  aria-pressed={hasSolar}
                >
                  <Sun className={`w-12 h-12 shrink-0 ${hasSolar ? 'text-amber-500' : 'text-slate-400'}`} />
                  <div>
                    <span className={`font-black block text-slate-900 ${fontClass.xl}`}>Ja, wél zonnepanelen</span>
                    <span className={`text-slate-600 block mt-1 ${fontClass.base}`}>Ik wek zelf stroom op en stuur stroom terug naar het net.</span>
                  </div>
                  {hasSolar && <CheckCircle2 className="w-8 h-8 text-emerald-600 ml-auto shrink-0" />}
                </button>
              </div>
            </fieldset>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className={`w-full sm:w-auto px-8 py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-lg flex items-center justify-center gap-3 transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-400 ${fontClass.xl}`}
              >
                <span>Volgende Stap: Factuur</span>
                <ArrowRight className="w-8 h-8" />
              </button>
            </div>
          </section>
        )}

        {/* ========================================== */}
        {/* STAP 2: FACTUUR & HUIDIGE LEVERANCIER       */}
        {/* ========================================== */}
        {step === 2 && (
          <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border-2 border-amber-100" aria-labelledby="stap2-titel">
            <h2 id="stap2-titel" className={`font-black text-slate-900 mb-2 ${fontClass['3xl']}`}>
              Stap 2: Wat betaal je vandaag?
            </h2>
            <p className={`text-slate-600 mb-8 font-medium ${fontClass.lg}`}>
              Neem even een recente factuur of bankafschrift erbij. Geen zorgen als je het niet exact weet!
            </p>

            {/* Huidige leverancier */}
            <fieldset className="mb-8">
              <legend className={`font-bold text-slate-800 mb-4 block ${fontClass.xl}`}>
                1. Bij wie ben je nu klant?
              </legend>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: 'luminus', name: 'Luminus' },
                  { id: 'engie', name: 'Engie (Electrabel)' },
                  { id: 'total', name: 'TotalEnergies' },
                  { id: 'mega', name: 'Mega' },
                  { id: 'eneco', name: 'Eneco' },
                  { id: 'anders', name: 'Weet ik niet zeker' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCurrentSupplier(item.id)}
                    className={`p-4 rounded-2xl border-4 font-bold text-center transition-all focus:outline-none focus:ring-4 focus:ring-emerald-500 ${currentSupplier === item.id ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-md' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'} ${fontClass.lg}`}
                    aria-pressed={currentSupplier === item.id}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Hoe wil je verbruik invullen? */}
            <fieldset className="mb-8">
              <legend className={`font-bold text-slate-800 mb-4 block ${fontClass.xl}`}>
                2. Hoe wil je jouw verbruik schatten?
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setInputMode('monthly')}
                  className={`p-5 rounded-2xl border-4 text-left transition-all ${inputMode === 'monthly' ? 'border-emerald-600 bg-emerald-50 shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                  aria-pressed={inputMode === 'monthly'}
                >
                  <span className={`font-black block text-slate-900 ${fontClass.lg}`}>💶 Mijn Maandbedrag</span>
                  <span className={`text-slate-600 block mt-1 ${fontClass.base}`}>"Ik weet wat ik per maand betaal"</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInputMode('average')}
                  className={`p-5 rounded-2xl border-4 text-left transition-all ${inputMode === 'average' ? 'border-emerald-600 bg-emerald-50 shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                  aria-pressed={inputMode === 'average'}
                >
                  <span className={`font-black block text-slate-900 ${fontClass.lg}`}>📊 Het Gemiddelde</span>
                  <span className={`text-slate-600 block mt-1 ${fontClass.base}`}>"Gebruik het gemiddelde voor mijn type woning"</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInputMode('kwh')}
                  className={`p-5 rounded-2xl border-4 text-left transition-all ${inputMode === 'kwh' ? 'border-emerald-600 bg-emerald-50 shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                  aria-pressed={inputMode === 'kwh'}
                >
                  <span className={`font-black block text-slate-900 ${fontClass.lg}`}>📑 Exacte Factuur</span>
                  <span className={`text-slate-600 block mt-1 ${fontClass.base}`}>"Ik vul het aantal kWh van de jaarafrekening in"</span>
                </button>
              </div>
            </fieldset>

            {/* Invoervelden afhankelijk van modus */}
            {inputMode === 'monthly' && (
              <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 sm:p-8 mb-8 space-y-6">
                <div>
                  <label htmlFor="input-monthly-elec" className={`font-bold text-slate-900 block mb-2 ${fontClass.xl}`}>
                    ⚡ Voorschot Elektriciteit per maand:
                  </label>
                  <div className="flex items-center gap-4">
                    <span className={`font-black text-emerald-700 ${fontClass['2xl']}`}>€</span>
                    <input
                      id="input-monthly-elec"
                      type="number"
                      min="20"
                      max="400"
                      step="5"
                      value={monthlyElec}
                      onChange={(e) => setMonthlyElec(Number(e.target.value))}
                      className={`w-36 p-4 font-black border-4 border-slate-300 rounded-2xl text-center focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-200 ${fontClass['2xl']}`}
                    />
                    <span className={`text-slate-600 font-bold ${fontClass.lg}`}>per maand</span>
                  </div>
                </div>

                {hasGas && (
                  <div>
                    <label htmlFor="input-monthly-gas" className={`font-bold text-slate-900 block mb-2 ${fontClass.xl}`}>
                      🔥 Voorschot Aardgas per maand:
                    </label>
                    <div className="flex items-center gap-4">
                      <span className={`font-black text-amber-700 ${fontClass['2xl']}`}>€</span>
                      <input
                        id="input-monthly-gas"
                        type="number"
                        min="20"
                        max="500"
                        step="5"
                        value={monthlyGas}
                        onChange={(e) => setMonthlyGas(Number(e.target.value))}
                        className={`w-36 p-4 font-black border-4 border-slate-300 rounded-2xl text-center focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-200 ${fontClass['2xl']}`}
                      />
                      <span className={`text-slate-600 font-bold ${fontClass.lg}`}>per maand</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {inputMode === 'kwh' && (
              <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 sm:p-8 mb-8 space-y-6">
                <div>
                  <label htmlFor="input-kwh-elec" className={`font-bold text-slate-900 block mb-2 ${fontClass.xl}`}>
                    ⚡ Elektriciteitsverbruik op jaarafrekening:
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      id="input-kwh-elec"
                      type="number"
                      min="500"
                      max="10000"
                      step="50"
                      value={kwhElec}
                      onChange={(e) => setKwhElec(Number(e.target.value))}
                      className={`w-44 p-4 font-black border-4 border-slate-300 rounded-2xl text-center focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-200 ${fontClass['2xl']}`}
                    />
                    <span className={`text-slate-600 font-bold ${fontClass.lg}`}>kWh per jaar</span>
                  </div>
                </div>

                {hasGas && (
                  <div>
                    <label htmlFor="input-kwh-gas" className={`font-bold text-slate-900 block mb-2 ${fontClass.xl}`}>
                      🔥 Aardgasverbruik op jaarafrekening:
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        id="input-kwh-gas"
                        type="number"
                        min="1000"
                        max="30000"
                        step="100"
                        value={kwhGas}
                        onChange={(e) => setKwhGas(Number(e.target.value))}
                        className={`w-44 p-4 font-black border-4 border-slate-300 rounded-2xl text-center focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-200 ${fontClass['2xl']}`}
                      />
                      <span className={`text-slate-600 font-bold ${fontClass.lg}`}>kWh per jaar</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {inputMode === 'average' && (
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-6 mb-8">
                <p className={`text-emerald-900 font-medium ${fontClass.lg}`}>
                  ✓ Wij rekenen met het officiële Vlaamse VREG-gemiddelde voor een <strong>{housingType}</strong>: 
                  <strong> {effectiveUsage.elec} kWh elektriciteit</strong>
                  {hasGas ? ` en ${effectiveUsage.gas} kWh aardgas` : ''} per jaar.
                </p>
              </div>
            )}

            {/* Navigatieknoppen */}
            <div className="flex flex-col-reverse sm:flex-row justify-between gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`px-8 py-5 border-4 border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-2xl flex items-center justify-center gap-3 transition-colors ${fontClass.xl}`}
              >
                <ArrowLeft className="w-8 h-8" />
                <span>Vorige</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className={`px-8 py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-lg flex items-center justify-center gap-3 transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-400 ${fontClass.xl}`}
              >
                <span>Bereken Mijn Besparing</span>
                <ArrowRight className="w-8 h-8" />
              </button>
            </div>
          </section>
        )}

        {/* ========================================== */}
        {/* STAP 3: HET RESULTAAT & ADVIES              */}
        {/* ========================================== */}
        {step === 3 && (
          <section className="space-y-6" aria-labelledby="stap3-titel">
            {/* Grote Groene Besparingskaart */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border-4 border-emerald-500">
              <div className="relative z-10">
                <span className="inline-flex items-center gap-2 bg-emerald-800/80 text-emerald-100 px-4 py-2 rounded-xl font-bold uppercase tracking-wide text-sm mb-4">
                  <Sparkles className="w-5 h-5" /> 100% Onafhankelijke Berekening
                </span>
                
                <h2 id="stap3-titel" className={`font-black leading-tight mb-4 ${fontClass['4xl']}`}>
                  Jouw geschatte besparing:
                </h2>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border-2 border-white/20 my-6">
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className="text-6xl sm:text-7xl font-black text-amber-300 tracking-tight">
                      € {financialResult.yearlySavings}
                    </span>
                    <span className={`font-bold text-white/90 ${fontClass['2xl']}`}>
                      per jaar minder!
                    </span>
                  </div>
                  <p className={`mt-3 text-emerald-100 font-semibold ${fontClass.lg}`}>
                    Dat is ongeveer <strong className="text-white underline">€ {financialResult.monthlySavings} per maand</strong> die je rechtstreeks op zak houdt.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-emerald-50 font-medium">
                  <div className="flex items-center gap-3 bg-emerald-800/60 p-4 rounded-xl">
                    <CheckCircle2 className="w-8 h-8 text-amber-300 shrink-0" />
                    <span className={fontClass.base}><strong>100% Vaste prijs:</strong> Geen onaangename verrassingen in de winter.</span>
                  </div>
                  <div className="flex items-center gap-3 bg-emerald-800/60 p-4 rounded-xl">
                    <CheckCircle2 className="w-8 h-8 text-amber-300 shrink-0" />
                    <span className={fontClass.base}><strong>Geen papierwerk:</strong> De nieuwe leverancier zegt je oude contract gratis op.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Het Heldere Advies: Wat moet je kiezen? */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border-2 border-amber-100 space-y-8">
              <h3 className={`font-black text-slate-900 border-b-2 border-slate-100 pb-4 ${fontClass['2xl']}`}>
                🎯 De Beste Keuze voor Jouw Situatie:
              </h3>

              {/* Aardgas */}
              {hasGas && (
                <div className="p-6 rounded-2xl border-4 border-amber-300 bg-amber-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Flame className="w-10 h-10 text-amber-600 shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">Aanrader Aardgas</span>
                        <h4 className={`font-black text-slate-900 ${fontClass.xl}`}>
                          ENGIE Easy Fixed (1 Jaar Vast)
                        </h4>
                      </div>
                    </div>
                    <p className={`text-slate-700 font-medium ${fontClass.base}`}>
                      Met de eDeal-welkomstkorting (tot <strong>{financialResult.recommendedGasDiscount}</strong>) en 12 maanden vaste prijszekerheid.
                    </p>
                  </div>
                  <div className="text-right sm:shrink-0">
                    <span className="text-xs font-bold text-slate-500 uppercase block">Geschat voorschot</span>
                    <span className={`font-black text-emerald-700 ${fontClass['2xl']}`}>
                      ~€ {Math.round(financialResult.newGasCost / 12)} / mnd
                    </span>
                  </div>
                </div>
              )}

              {/* Elektriciteit */}
              <div className="p-6 rounded-2xl border-4 border-emerald-300 bg-emerald-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Zap className="w-10 h-10 text-emerald-600 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">Aanrader Elektriciteit</span>
                      <h4 className={`font-black text-slate-900 ${fontClass.xl}`}>
                        {hasSolar ? 'Ecopower Groene Burgerstroom' : 'ENGIE Easy of TotalEnergies (Promo)'}
                      </h4>
                    </div>
                  </div>
                  <p className={`text-slate-700 font-medium ${fontClass.base}`}>
                    {hasSolar 
                      ? 'Geen jaarlijkse abonnementskost (€0 vast recht) én de hoogste vergoeding voor je zonnepanelen.' 
                      : 'Blijvend scherpe prijs met welkomstkorting voor nieuwe klanten.'}
                  </p>
                </div>
                <div className="text-right sm:shrink-0">
                  <span className="text-xs font-bold text-slate-500 uppercase block">Geschat voorschot</span>
                  <span className={`font-black text-emerald-700 ${fontClass['2xl']}`}>
                    ~€ {Math.round(financialResult.newElecCost / 12)} / mnd
                  </span>
                </div>
              </div>

              {/* Duidelijke Veiligheidsgaranties */}
              <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-6">
                <h4 className={`font-bold text-slate-800 mb-3 flex items-center gap-2 ${fontClass.lg}`}>
                  <ShieldCheck className="w-7 h-7 text-emerald-600 shrink-0" />
                  Belangrijke Zekerheden bij een Overstap in Vlaanderen:
                </h4>
                <ul className={`space-y-2 text-slate-700 font-medium list-disc list-inside ${fontClass.base}`}>
                  <li><strong>Het licht of de verwarming valt NOOIT uit:</strong> Netbeheerder Fluvius blijft altijd ononderbroken stroom en gas leveren via dezelfde leidingen.</li>
                  <li><strong>Geen opzegboete:</strong> In België mag je altijd gratis veranderen van energieleverancier (wettelijk beschermd).</li>
                  <li><strong>Geen technieker over de vloer:</strong> Er hoeft niemand thuis te komen; alles gebeurt administratief via de computer.</li>
                </ul>
              </div>

              {/* Actieknoppen: Delen met Familie & Printen */}
              <div className="pt-4 border-t-2 border-slate-100 flex flex-col sm:flex-row gap-4 print:hidden">
                <a
                  href={whatsappShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 p-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-lg flex items-center justify-center gap-3 text-center transition-transform hover:scale-102 focus:outline-none focus:ring-4 focus:ring-emerald-400 ${fontClass.xl}`}
                >
                  <Share2 className="w-8 h-8" />
                  <span>Stuur Advies via WhatsApp naar Familie</span>
                </a>

                <button
                  type="button"
                  onClick={handlePrint}
                  className={`p-5 bg-white border-4 border-slate-300 hover:border-slate-400 text-slate-800 font-bold rounded-2xl flex items-center justify-center gap-3 transition-colors ${fontClass.xl}`}
                >
                  <Printer className="w-8 h-8 text-slate-600" />
                  <span>Druk af op papier</span>
                </button>
              </div>

              {/* Terug naar start */}
              <div className="text-center pt-2 print:hidden">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className={`text-slate-500 hover:text-slate-800 font-bold inline-flex items-center gap-2 ${fontClass.base}`}
                >
                  <RotateCcw className="w-5 h-5" /> Opnieuw beginnen
                </button>
              </div>
            </div>
          </section>
        )}

      </div>
    </main>
  );
}
