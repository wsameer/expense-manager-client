import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { ModeToggle } from '@/features/theme/mode-toggle';
import { SidebarTrigger } from '../ui/sidebar';
import { Separator } from '../ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';

type Props = {
  title?: string;
  subTitle?: string;
  showStickyHeader?: boolean;
  showHeaderText?: boolean;
  backButton?: {
    url?: string;
    title?: string;
  };
  rightElement?: React.ReactElement;
};
export const AppHeader = (props: Props) => {
  return (
    <header
      className="hidden md:flex h-16 w-full items-center justify-between gap-2 sticky top-0 z-30 bg-background px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
      id="app-header-desktop"
    >
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">
                Building Your Application
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Data Fetching</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-[200px] lg:w-[336px] rounded-xl bg-background pl-8"
          />
        </div>
        <ModeToggle />
      </div>
    </header>
  );
};
