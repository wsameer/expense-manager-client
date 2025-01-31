import { cn } from '@/lib/utils';

import { Link as RouterLink, LinkProps } from 'react-router-dom';

export const Link = ({ className, children, ...props }: LinkProps) => {
  return (
    <RouterLink
      className={cn('text-zinc-600 hover:text-zinc-900', className)}
      {...props}
    >
      {children}
    </RouterLink>
  );
};
