import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Account } from '@/types/api';

type Props = {
  data: Account;
};

export const AccountDetails = React.memo(({ data }: Props) => {
  return (
    <div>
      <Tabs defaultValue="daily">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="annually">Annually</TabsTrigger>
        </TabsList>
        <TabsContent value="daily">Daily transactions</TabsContent>
        <TabsContent value="monthly">Monthly transactions</TabsContent>
        <TabsContent value="annually">Yearly transactions</TabsContent>
      </Tabs>
    </div>
  );
});

AccountDetails.displayName = 'AccountDetails';
