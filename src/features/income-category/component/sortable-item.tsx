import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { ListItemButton } from '@/components/ui/list-item-button';
import { IncomeCategory } from '../types';
import { GripVertical } from 'lucide-react';

export const SortableItem = ({
  category,
  onClickHandler,
}: {
  category: IncomeCategory;
  onClickHandler: (c: IncomeCategory) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: category.id,
      data: category,
    });

  const style = {
    transform: transform ? CSS.Translate.toString(transform) : undefined,
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onClickHandler(category)}
      className="w-full"
    >
      <ListItemButton
        title={category.name}
        description={category.description}
        iconLeft={
          <GripVertical
            {...attributes}
            {...listeners}
            height={14}
            width={14}
            className="text-muted-foreground hover:cursor-grab focus:outline-none"
          />
        }
      />
    </div>
  );
};
