"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";


import { LanguageToggle } from '@/components/language-toggle';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Navbar() {
  const t = useTranslations("landing");

  const text = {
    features: t("features"),
    pricing: t("pricing"),
    resources: t("resources"),
    blog: t("blog"),
    login: t("login"),
    signup: t("signup"),
  };

  return (
    <nav className="w-full backdrop-blur-md border-b border-[#BFC4CC]/30 fixed top-0 z-50 bg-[#FFFFFF]/70 dark:bg-[#0F111A]/70 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 relative">

        {/* 🟦 Logo */}
        <div className="flex-shrink-0 absolute left-6">
          <Link href="/" className="inline-flex items-center">
            <img src="/LOGO.png" alt="Logo" className="h-25 w-auto" />
            <span className="sr-only">Home</span>
          </Link>
        </div>

        {/* espacio central (sin enlaces) */}
        <div className="flex-1" />

        {/* 🟥 Botones */}
        <div className="absolute right-6 flex items-center gap-4">


          <Link
            href="/login"
            className="px-5 py-2 bg-[#66F9C4] text-[#0F111A] font-medium rounded-lg hover:bg-[#55dfad] transition"
          >
            {text.login}
          </Link>


          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
