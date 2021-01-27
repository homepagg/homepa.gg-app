import React, { useContext, useEffect } from 'react';
import styled from 'styled-components/macro';
import { useDrag, useDrop } from 'react-dnd';
import { Categories } from '../contexts/CategoriesProvider.js';
import { ReactComponent as MoveSvg } from '../images/icons/move.svg';

const Move = styled.span`
  align-items: center;
  cursor: grab;
  display: flex;
  height: 36px;
  justify-content: center;
  left: -20px;
  opacity: 0.5;
  padding: 5px;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  transition: opacity var(--animation-time) var(--animation-ease);
  width: 36px;

  &:active {
    cursor: grabbing;
  }

  ${'' /* ${Container}:hover & {
    opacity: 0.12;
  }

  ${Container}:hover &:hover {
    opacity: 1;
  } */}
`;

const MoveHandle = ({ container, index, setDragging }) => {
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

      console.log('Calling `categoriesReducer` with "REORDER" type');
      categoriesReducer({
        type: 'REORDER',
        drag: dragIndex,
        hover: hoverIndex,
      });
    },
  });

  const [{ isDragging }, drag] = useDrag({
    item: { type: 'group', index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(container));

  useEffect(() => {
    setDragging(isDragging);
  }, [setDragging, isDragging]);

  return (
    <Move data-sortable-handle>
      <MoveSvg />
    </Move>
  );
};

export default MoveHandle;
