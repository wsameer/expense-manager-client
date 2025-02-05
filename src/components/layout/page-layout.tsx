import React, { ReactNode, ReactElement } from 'react';
import { AppHeader, Head } from '../seo';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '../ui/sidebar';
import { AppSidebar } from '../navigation/sidebar/app-sidebar';
import { Separator } from '../ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { AppBottomBar } from '../navigation/bottombar/app-bottombar';

interface PageLayoutProps {
  title?: string;
  subTitle?: string;
  children?: ReactNode;
  showHeaderText?: boolean;
  rightElement?: ReactElement;
  backButton?: {
    url: string;
    title?: string;
  };
}

export const PageLayout = React.memo<PageLayoutProps>(
  ({ title, children, subTitle, showHeaderText = false }) => {

    return (
      <div className="flex flex-col sm:gap-2 md:pt-0">
        <SidebarProvider>
          <Head title={title} />
          <AppSidebar />
          <AppBottomBar />
          <SidebarInset>
            <AppHeader />
            {/* <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1 hidden md:block" />
                <Separator
                  orientation="vertical"
                  className="mr-2 h-4 hidden md:block"
                />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">
                        Building Your Application
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header> */}
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    );
  },
);

// export const PageLayout = React.memo<PageLayoutProps>(
//   ({
//     title,
//     children,
//     subTitle,
//     rightElement,
//     showHeaderText = false,
//     backButton,
//   }) => {
//     const { isMobile } = useResponsive();
//     const pageTitleRef = useRef<HTMLDivElement>(null);
//     const [showStickyHeader, setShowStickyHeader] = useState(showHeaderText);

//     useEffect(() => {
//       const handleScroll = () => {
//         if (pageTitleRef.current) {
//           // Get the distance from the top of the viewport to the bottom of the pageTitle element
//           const titleBottom =
//             pageTitleRef.current.getBoundingClientRect().bottom;

//           // Adjust when to show the sticky header based on the header height
//           const headerHeight = 58; // because h-14 is 56px
//           setShowStickyHeader(titleBottom < headerHeight);
//         }
//       };

//       window.addEventListener('scroll', handleScroll);
//       return () => window.removeEventListener('scroll', handleScroll);
//     }, [showHeaderText]);

//     return (
//       <div className="flex flex-col sm:gap-2 md:pt-0 md:pl-14">
//         <Head title={title} />
//         {isMobile ? (
//           <MobileHeader
//             title={title}
//             showStickyHeader={showStickyHeader}
//             rightElement={rightElement}
//             backButton={backButton}
//           />
//         ) : (
//           <AppHeader />
//         )}

//         <main className="flex-1 overflow-y-auto">
//           <div className="container pb-24">
//             <div className="mx-auto w-full min-w-0">
//               <div className="space-y-2">
//                 {!showHeaderText && (
//                   <h1
//                     ref={pageTitleRef}
//                     className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl"
//                     id="page-title"
//                   >
//                     {title}
//                   </h1>
//                 )}
//                 {subTitle && (
//                   <p className="text-sm text-muted-foreground">{subTitle}</p>
//                 )}
//               </div>
//               <div
//                 className={cn({
//                   'pt-4': !showHeaderText,
//                 })}
//               >
//                 {children}
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     );
//   },
// );
