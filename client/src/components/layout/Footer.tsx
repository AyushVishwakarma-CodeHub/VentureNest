import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import { APP_NAME, APP_TAGLINE, FOOTER_LINKS, SOCIAL_LINKS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800 relative overflow-hidden">
      {/* Decorative gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary" />

      <div className="container mx-auto px-4 md:px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white">
                <Rocket size={24} />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                {APP_NAME}
              </span>
            </Link>
            
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-sm">
              {APP_TAGLINE}
            </p>

            <div className="mt-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">
                Subscribe to our newsletter
              </h4>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="max-w-[220px] bg-white dark:bg-slate-800"
                />
                <Button type="submit" variant="default" size="sm">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>

          {/* Links Columns */}
          {FOOTER_LINKS.map((group) => (
            <div key={group.title} className="flex flex-col gap-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">{group.title}</h4>
              <ul className="flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-400 text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © {currentYear} {APP_NAME}. All rights reserved.
          </p>

          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Created by{' '}
            <a 
              href="https://ayushrajvishwakarma.in/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:text-primary-400 font-semibold transition-colors underline decoration-dotted underline-offset-4"
            >
              Ayush Raj Vishwakarma
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
