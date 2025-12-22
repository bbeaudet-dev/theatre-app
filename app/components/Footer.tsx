import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t bg-white dark:bg-zinc-900 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
          <div>
            © {currentYear} Broadway Pulse
          </div>
          <div>
            <Link 
              href="/about" 
              className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

