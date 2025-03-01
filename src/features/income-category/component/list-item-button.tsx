import React from 'react';
import { cn } from '@/lib/utils';

interface ListItemButtonProps extends React.LiHTMLAttributes<HTMLLIElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  trailing?: React.ReactNode;
  active?: boolean;
  onClickHandler?: React.MouseEventHandler<HTMLLIElement>;
}

export const ListItemButton = ({
  icon,
  title,
  description,
  trailing,
  active = false,
  className,
  onClickHandler,
  ...props
}: ListItemButtonProps) => {
  return (
    <li
      className={cn(
        'flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-colors',
        'bg-white dark:bg-muted hover:bg-muted dark:hover:bg-background border',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'cursor-pointer',
        active && 'bg-muted',
        className,
      )}
      onClick={onClickHandler}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClickHandler?.(e as unknown as React.MouseEvent<HTMLLIElement>);
        }
      }}
      {...props}
    >
      {icon && <div className="shrink-0">{icon}</div>}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm">{title}</div>
        {description && (
          <div className="text-xs text-muted-foreground truncate">
            {description}
          </div>
        )}
      </div>
      {trailing && <div className="shrink-0 ml-2">{trailing}</div>}
    </li>
  );
};
