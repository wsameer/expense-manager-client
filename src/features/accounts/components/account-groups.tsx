import { capitalize, cn, formattedAmount } from '@/lib/utils';
import { ErrorMessage } from '@/components/errors/error-message';

import { ACCOUNT_GROUPS } from '../constants';
import { AccountGroupEnum } from '../types';
import { useAccounts } from '../api/get-accounts';
import { AddAccount } from './add-account';
import { SkeletonLoader } from './skeleton-loaders';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AccountGroup } from '@/store/accountsStore';

export const AccountGroups = () => {
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
      <div className="p-4">
        <div className="grid gap-4">
          {ACCOUNT_GROUPS.map(({ id, label, key }) => {
            const filteredAccounts = filteredAccountsByGroup(key);

            return (
              <div
                key={id}
                id={`${id}-card-container`}
              >
                {/* Group Header */}
                <div className="bg-white hover:bg-muted dark:bg-muted dark:hover:bg-zinc-900 dark:border-zinc-900 rounded-2xl border px-3 py-2 text-sm z-50 relative">
                  <div className="flex justify-between items-center gap-2 h-11">
                    <div
                      className="flex-1"
                      onClick={() => handleAccountGroupClick(key)}
                      tabIndex={0}
                      role="button"
                      onKeyDown={(e) =>
                        e.key === 'Enter' && handleAccountGroupClick(key)
                      }
                    >
                      <p className="text-base text-foreground">
                        {capitalize(label)}
                      </p>
                      {key !== 'CASH' && (
                        <p className="text-xs text-muted-foreground">
                          {`${filteredAccounts.length} accounts`}
                        </p>
                      )}
                    </div>
                    <p className="text-base text-mono text-foreground pr-1">
                      {formattedAmount(
                        getBalanceSumByGroup(key as AccountGroup),
                      )}
                    </p>
                    {key !== 'CASH' && (
                      <AddAccount group={key as unknown as AccountGroupEnum} />
                    )}
                  </div>
                </div>

                {/* Grouped Accounts */}
                {filteredAccounts.map(({ id, name, balance }, index) => {
                  const isCardExpanded = expandStack.includes(key);
                  const baseScale = 0.97;
                  const scaleFactor = 0.04;
                  const scaleValue = isCardExpanded
                    ? 1
                    : baseScale - index * scaleFactor;

                  return (
                    <div
                      key={id}
                      className={cn(
                        'relative bg-background dark:bg-zinc-800 border dark:border-zinc-900',
                        'flex justify-between rounded-xl p-3 -mt-10',
                        'transition-all duration-400 ease-in-out',
                        {
                          '-mt-2 rounded-2xl': isCardExpanded,
                        },
                      )}
                      style={{
                        zIndex: filteredAccounts.length - index,
                        transform: `scale(${Math.max(scaleValue, 0.5)})`,
                      }}
                    >
                      <p
                        className={`text-sm ${isCardExpanded ? 'text-foreground' : 'text-transparent'}`}
                      >
                        {name}
                      </p>
                      <p
                        className={`text-sm ${isCardExpanded ? 'text-foreground' : 'text-transparent'}`}
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
      </div>
    </ScrollArea>
  );
};
