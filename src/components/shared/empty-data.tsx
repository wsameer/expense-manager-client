import { Ghost } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const EmptyData = () => {
  const { t } = useTranslation('common');
  return (
    <div className="flex flex-col gap-2 items-center justify-center mt-40 text-center">
      <Ghost
        className="text-muted-foreground"
        size={32}
      />
      <p className="text-muted-foreground">{t('no-data-available')}</p>
    </div>
  );
};
