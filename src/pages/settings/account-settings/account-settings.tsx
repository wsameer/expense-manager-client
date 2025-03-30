import { PageLayout } from '@/components/layout/page-layout';
import { SETTINGS_ROUTE } from '@/app/router/routes';
import { ErrorMessage } from '@/components/errors/error-message';
import { useAccounts } from '@/features/accounts/api/get-accounts';
import { getUniqueGroups } from './utils';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const AccountSettingsPage = () => {
  const { allAccounts, isError } = useAccounts();

  if (isError) {
    return <ErrorMessage message="Unable to get your accounts data." />;
  }

  const uniqueGroups = getUniqueGroups(allAccounts);

  return (
    <PageLayout
      title="Accounts"
      subTitle="Manage your bank accounts and categories"
      backButtonProps={{
        url: SETTINGS_ROUTE,
        label: 'Settings',
      }}
    >
      <div className="flex gap-3 w-full overflow-hidden">
        <div className="flex-none">
          <Button
            className="h-[150px] w-[60px] p-2 rounded-xl"
            variant="outline"
          >
            <Plus />
          </Button>
        </div>

        <div className="flex-1 min-w-0">
          <Carousel
            opts={{
              align: 'start',
              containScroll: 'trimSnaps',
            }}
            className="w-full"
          >
            <CarouselContent>
              {uniqueGroups.map((account, index) => (
                <CarouselItem
                  key={index}
                  className="basis-2/4 min-w-0"
                >
                  <Card className="h-[150px] shadow-none p-4">
                    <CardHeader className="flex flex-col space-y-1.5 p-0">
                      <CardTitle>{account}</CardTitle>
                      <CardDescription>
                        Deploy your new project in one-click.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </PageLayout>
  );
};
