"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface LanguageSwitcherProps {
  currentLang: string;
}

export function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        {currentLang === "en" && <div className="h-5 w-5 bg-yellow-400"></div>}
        <Link
          href="?lang=en"
          className={`text-base font-medium transition-colors ${currentLang === "en"
            ? "text-black"
            : "text-gray-400 hover:text-gray-600"
            }`}
        >
          EN
        </Link>
      </div>
      <div className="flex items-center gap-2">
        {currentLang === "vi" && <div className="h-5 w-5 bg-yellow-400"></div>}
        <Link
          href="?lang=vi"
          className={`text-base font-medium transition-colors ${currentLang === "vi"
            ? "text-black"
            : "text-gray-400 hover:text-gray-600"
            }`}
        >
          VI
        </Link>
      </div>
    </div>
  );
}

// This is a wrapper component that automatically gets the current language from the URL
export default function AutoLanguageSwitcher() {
  const searchParams = useSearchParams();
  const currentLang = searchParams.get("lang") || "en";

  return <LanguageSwitcher currentLang={currentLang} />;
}
