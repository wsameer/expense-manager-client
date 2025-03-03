import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers';

import { EmptyData } from '@/components/shared/empty-data';
import type { IncomeCategory } from '../types';
import { SortableItem } from './sortable-item';

interface CategoryListProps {
  categories: IncomeCategory[] | undefined;
  onDragEnd: (event: DragEndEvent) => void;
  onCategoryClick: (category: IncomeCategory) => void;
}

export const CategoryList = ({
  categories,
  onDragEnd,
  onCategoryClick,
}: CategoryListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  if (!categories || categories.length === 0) {
    return <EmptyData />;
  }

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={onDragEnd}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
    >
      <SortableContext
        items={categories}
        strategy={verticalListSortingStrategy}
      >
        {categories.map((category) => (
          <SortableItem
            key={category.id}
            onClickHandler={onCategoryClick}
            category={category}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};
