import React, { useContext, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Categories } from '../contexts/CategoriesProvider.js';

const MoveHandle = ({ children, container, index, setDragging }) => {
  const categoriesState = useContext(Categories);
  const { categoriesReducer } = categoriesState;

  const [, drop] = useDrop({
    accept: 'group',
    hover(item, monitor) {
      if (!container.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = container.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (
        (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) ||
        (dragIndex > hoverIndex && hoverClientY > hoverMiddleY)
      )
        return;

      categoriesReducer({
        type: 'REORDER',
        drag: dragIndex,
        hover: hoverIndex,
      });

      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    item: { type: 'group', index },
    end: () => categoriesReducer({ type: 'UPDATE_REMOTE' }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(container));

  useEffect(() => {
    setDragging(isDragging);
  }, [setDragging, isDragging]);

  return <>{children}</>;
};

export default MoveHandle;
