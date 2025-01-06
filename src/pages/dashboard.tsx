import { PageLayout } from '@/components/layout';
import React from 'react';

export const DashboardRoute = () => {
  return (
    <PageLayout title="Dashboard">
      <p className='text-white'> Hello you are logged in mate!</p>
    </PageLayout>
  );
};
