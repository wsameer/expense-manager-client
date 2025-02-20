import { AccountGroup } from '@/types/api';
import { capitalize, cn, formattedAmount } from '@/lib/utils';
import { ErrorMessage } from '@/components/errors/error-message';

import { ACCOUNT_GROUPS } from '../constants';
import { AccountGroupEnum } from '../types';
import { useAccounts } from '../api/get-accounts';
import { AddAccount } from './add-account';
import { SkeletonLoader } from './skeleton-loaders';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export const AccountGroups = () => {
  // const navigate = useNavigate();
  const [expandStack, setExpandStack] = useState<string[]>([]);
  const { allAccounts, isError, isLoading, getBalanceSumByGroup } =
    useAccounts();

  if (isError) {
    return <ErrorMessage message="Unable to get your accounts data." />;
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4">
        <SkeletonLoader />
        <SkeletonLoader />
        <SkeletonLoader />
        <SkeletonLoader />
      </div>
    );
  }

  const handleAccountGroupClick = (key: string) =>
    setExpandStack((prevKeys) =>
      prevKeys.includes(key)
        ? prevKeys.filter((k) => k !== key)
        : [...prevKeys, key],
    );

  const filteredAccountsByGroup = (groupKey: string) =>
    allAccounts?.filter(
      ({ group }) => group === groupKey && group !== 'CASH',
    ) || [];

  return (
    <ScrollArea className="h-[600px] -mx-4">
      <div className="grid grid-cols-1 p-4 gap-4">
        <div className="grid gap-4">
          {ACCOUNT_GROUPS.map(({ id, label, key }) => {
            const filteredAccounts = filteredAccountsByGroup(key);

            return (
              <div
                key={id}
                id={`${id}-card-container`}
              >
                {/* Group Header */}
                <div className="bg-background rounded-2xl border px-3 py-2 text-sm z-50 relative">
                  <div className="flex justify-between items-center gap-2">
                    {/* Clickable Group Info */}
                    <div
                      className="flex-1"
                      onClick={() => handleAccountGroupClick(key)}
                      tabIndex={0}
                      role="button"
                      onKeyDown={(e) =>
                        e.key === 'Enter' && handleAccountGroupClick(key)
                      }
                    >
                      <p className="text-md text-muted-foreground">
                        {capitalize(label)}
                      </p>
                      <p className="text-lg text-mono text-muted-foreground">
                        {formattedAmount(
                          getBalanceSumByGroup(key as AccountGroup),
                        )}
                      </p>
                    </div>

                    {/* Add Account Button (if not CASH) */}
                    {key !== 'CASH' && (
                      <AddAccount group={key as unknown as AccountGroupEnum} />
                    )}
                  </div>
                </div>

                {/* Grouped Accounts */}
                {filteredAccounts.map(({ id, name, balance }, index) => {
                  const isCardExpanded = expandStack.includes(key);
                  const baseScale = 0.97;
                  const scaleFactor = 0.03;
                  const scaleValue = isCardExpanded
                    ? 1
                    : baseScale - index * scaleFactor;

                  return (
                    <div
                      key={id}
                      className={cn(
                        'relative dark:bg-zinc-900/30 bg-white dark:border-zinc-800',
                        'flex justify-between rounded-xl border px-3 pt-4 pb-2 -mt-10',
                        'transition-all duration-400 ease-in-out',
                        { '-mt-3 rounded-2xl': isCardExpanded },
                      )}
                      style={{
                        zIndex: filteredAccounts.length - index,
                        transform: `scale(${Math.max(scaleValue, 0.5)})`,
                      }}
                    >
                      <p
                        className={`text-sm ${isCardExpanded ? 'text-muted-foreground' : 'text-transparent'}`}
                      >
                        {name}
                      </p>
                      <p
                        className={`text-sm text-muted-foreground ${isCardExpanded ? 'text-muted-foreground' : 'text-transparent'}`}
                      >
                        {formattedAmount(balance)}
                      </p>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* {ACCOUNT_GROUPS.map(({ id, label, key }) => {
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
      })} */}
      </div>
    </ScrollArea>
  );
};
