import React from 'react';

export const ErrorMessage = ({ message }: { message?: string }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        {message ?? 'Error loading data. Please try again.'}
      </h3>
    </div>
  );
};
