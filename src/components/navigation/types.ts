export type SideNavigationItem = {
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  path: string;
  label: string;
};
