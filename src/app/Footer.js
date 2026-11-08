// Calculate the year outside the component to avoid hydration/pre-rendering errors
const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-(--color-bg-header) border-t border-(--color-border-custom) py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-(--color-text-secondary) text-sm">
          © {currentYear} AIME. All rights reserved.
        </p>
        <p className="text-(--color-text-secondary) text-xs mt-2">
          Disclaimer: This site does not store any files on its server. All contents are provided by non-affiliated third parties.
        </p>
      </div>
    </footer>
  );
}