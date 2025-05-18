import Link from "next/link";
import { Github, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background/80 py-6 mt-10">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} ai-amazona. All rights reserved.</span>
        </div>
        <nav className="flex gap-4">
          <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
        </nav>
        <div className="flex gap-3">
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
            <Github className="h-5 w-5" />
          </a>
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
            <Twitter className="h-5 w-5" />
          </a>
          <a href="mailto:support@ai-amazona.com" className="hover:text-primary">
            <Mail className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
} 