import React, { useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { ItemTypes } from '../../types/ItemTypes.d.ts';
import { useSettings } from '../../contexts/SettingsProvider.jsx';

const MoveHandle = ({ children, container, index, setDragging }) => {
    const { settings, settingsDispatcher } = useSettings();
    const { order } = settings;

    const [, drop] = useDrop({
        accept: 'group',
        hover(item, monitor) {
            if (!container.current) return;

            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) return;

            const hoverBoundingRect =
                container.current?.getBoundingClientRect();
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            if (
                (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) ||
                (dragIndex > hoverIndex && hoverClientY > hoverMiddleY)
            )
                return;

            const newOrder = [...order];
            const dragItem = newOrder.splice(dragIndex, 1)[0];
            newOrder.splice(hoverIndex, 0, dragItem);

            settingsDispatcher({ order: newOrder });

            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.GROUP,
        item: { index },
        end: () => console.log('end'),
        collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    });

    drag(drop(container));

    useEffect(() => setDragging(isDragging), [setDragging, isDragging]);

    return <>{children}</>;
};

export default MoveHandle;
