import React from 'react';
import { ListGroup } from '@/components/list-group';
import { ListItem } from '@/components/list-group/list-item';
import { AccountGroup } from '@/types/api';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { ACCOUNTS_ROUTE } from '@/router/routes';
import { capitalize, formattedAmount } from '@/lib/utils';
import { ErrorMessage } from '@/components/errors/error-message';

import { ACCOUNT_GROUPS } from '../constants';
import { AccountGroupEnum } from '../types';
import { useAccounts } from '../api/get-accounts';
import { AddAccount } from './add-account';


const displaySkeletonLoader = () => (
  <div>
    <Skeleton className="h-[24px] w-[150px] rounded-xl" />
    <Skeleton className="mt-2 h-[96px] w-full rounded-xl" />
  </div>
);

export const AccountGroups = () => {
  const { allAccounts, isError, isLoading, getBalanceSumByGroup } =
    useAccounts();
  const navigate = useNavigate();

  if (isError) {
    return (
      <ErrorMessage message='Unable to get your accounts data.' />
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {displaySkeletonLoader()}
        {displaySkeletonLoader()}
        {displaySkeletonLoader()}
        {displaySkeletonLoader()}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {ACCOUNT_GROUPS.map(({ id, label, key }) => {
        return (
          <ListGroup
            key={id}
            title={capitalize(label)}
            rightSideElement={
              <p className="text-sm text-muted-foreground">
                {formattedAmount(getBalanceSumByGroup(key as AccountGroup))}
              </p>
            }
          >
            {allAccounts?.map(({ id, name, group, balance }) => {
              if (key === group) {
                return (
                  <ListItem
                    key={id}
                    label={name}
                    onClick={() =>
                      navigate(`${ACCOUNTS_ROUTE}/${id}`, {
                        state: {
                          fromAccountsPage: true,
                        },
                      })
                    }
                    rightElement={
                      <p className="text-xs font-mono">
                        {formattedAmount(balance)}
                      </p>
                    }
                  />
                );
              }
            })}
            {key !== 'CASH' && (
              <AddAccount group={key as unknown as AccountGroupEnum} />
            )}
          </ListGroup>
        );
      })}
    </div>
  );
};
