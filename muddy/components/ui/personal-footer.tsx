import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FaTwitter, FaFacebook, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-8 flex h-20 w-full flex-col items-center justify-between gap-1 border-t p-5 text-center md:flex-row">
      <span className="text-muted-foreground text-xs">
        © {currentYear} MCFS. All rights reserved.
      </span>
      <div className="flex justify-center gap-1">
        <Link
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
          className="text-muted-foreground hover:!bg-primary flex size-8 items-center justify-center rounded transition-all duration-500 hover:scale-105 hover:text-white"
        >
          <FaTwitter className="size-4" />
        </Link>
        <Link
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="text-muted-foreground hover:!bg-primary flex size-8 items-center justify-center rounded transition-all duration-500 hover:scale-105 hover:text-white"
        >
          <FaFacebook className="size-4" />
        </Link>
        <Link
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="text-muted-foreground hover:!bg-primary flex size-8 items-center justify-center rounded transition-all duration-500 hover:scale-105 hover:text-white"
        >
          <FaLinkedin className="size-4" />
        </Link>
      </div>
    </footer>
  );
}
