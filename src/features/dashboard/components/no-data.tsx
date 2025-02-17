import { Rabbit } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const NoData = () => {
  const { t } = useTranslation('common');

  return (
    <div className={`grid grid-cols-1 gap-4 place-items-center p-8`}>
      <Rabbit className="h-24 w-24" />
      <p className="scroll-m-20 text-l tracking-tight text-muted-foreground">
        {t('no-data-for-this-month')}
      </p>
    </div>
  );
};
