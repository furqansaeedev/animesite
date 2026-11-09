import Link from "next/link";
import { Play } from "lucide-react";

// Calculate the year outside the component to avoid hydration/pre-rendering errors
const currentYear = new Date().getFullYear();

export default function Footer() {
  // Create an array of letters A-Z, plus a # for numbers/symbols
  const alphabet = ["#", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];

  return (
    <footer className="bg-(--color-bg-header) border-t border-(--color-border-custom) pt-12 pb-8 mt-auto w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* A-Z Navigation */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-(--color-text-primary) mb-4">
            Quick A to Z Navigation
          </h2>
          <div className="flex flex-wrap gap-2">
            {alphabet.map((letter) => (
              <Link
                key={letter}
                href={`/anime?search=${letter}`} // Links to the search page filtered by letter
                className="flex items-center justify-center w-10 h-10 bg-(--color-bg-card) border border-(--color-border-custom) text-(--color-text-secondary) font-bold text-sm rounded-md hover:bg-(--color-gold-primary) hover:text-(--color-bg-main) hover:border-(--color-gold-primary) transition-colors"
              >
                {letter}
              </Link>
            ))}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-(--color-border-custom) pt-8 flex flex-col items-center justify-center text-center gap-4">
          
          <Link href="/" className="flex items-center gap-2 mb-2">
            <Play className="text-(--color-gold-primary) fill-current" size={24} />
            <span className="text-xl font-bold text-(--color-gold-primary) tracking-wider">AIME</span>
          </Link>

          <p className="text-(--color-text-secondary) text-sm">
            © {currentYear} AIME. All rights reserved.
          </p>
          <p className="text-(--color-text-secondary) text-xs max-w-2xl">
            Disclaimer: This site does not store any files on its server. All contents are provided by non-affiliated third parties.
          </p>
        </div>

      </div>
    </footer>
  );
}