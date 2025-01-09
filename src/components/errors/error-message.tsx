import React from 'react';
import { SnailIcon } from 'lucide-react';

export const ErrorMessage = ({ message, classes = '' }: { message?: string, classes?: string }) => (
  <div className={`grid grid-cols-1 gap-4 place-items-center p-8 ${classes}`}>
    <SnailIcon className='h-24 w-24' />
    <p className="scroll-m-20 text-l tracking-tight">
      {message ?? 'Error loading data. Please try again.'}
    </p>
  </div>
);
