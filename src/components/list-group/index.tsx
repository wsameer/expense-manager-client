import React from 'react';

type Props = {
  title: string;
  children: React.ReactNode;
  rightSideElement?: React.ReactNode;
  noStyle?: boolean;
};

export const ListGroup = React.memo<Props>(
  ({ title, rightSideElement, children, noStyle }) => {
    return (
      <div className="list-group">
        <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
          <div className="flex justify-between">
            <p className="text-sm mb-1">{title}</p>
            {rightSideElement}
          </div>
        </h2>
        <div
          className={
            noStyle
              ? ''
              : 'bg-background border dark:bg-zinc-800 rounded-xl overflow-hidden'
          }
        >
          {children}
        </div>
      </div>
    );
  },
);

ListGroup.displayName = 'ListGroup';
