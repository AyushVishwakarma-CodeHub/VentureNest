import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Page not found</p>
      <Button asChild>
        <Link to={ROUTES.HOME}>Return Home</Link>
      </Button>
    </div>
  );
}

export function ServerErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">500</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Server Error</p>
      <Button asChild>
        <Link to={ROUTES.HOME}>Return Home</Link>
      </Button>
    </div>
  );
}
