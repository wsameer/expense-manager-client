import { InfoIcon, Rabbit } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const NoData = () => {
  const { t } = useTranslation('common');

  return (
    <div className={`grid grid-cols-1 gap-4 place-items-center p-8`}>
      <Rabbit className="h-24 w-24" />
      <p className="scroll-m-20 text-l tracking-tight text-muted-foreground">
        {t('no-data-for-this-month')}
      </p>
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>{t('dashboard.empty-data-message')}</AlertDescription>
      </Alert>
    </div>
  );
};
