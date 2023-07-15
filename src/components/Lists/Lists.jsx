import { useState } from 'react';
import {
    pointerWithin,
    DndContext,
    DragOverlay,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';

import { useBookmarks } from '../../contexts/BookmarksProvider';
import { useCategories } from '../../contexts/CategoriesProvider';
import { useSettings } from '../../contexts/SettingsProvider';
import Dropzones from '../Dropzones/Dropzones';
import Category from '../Category/Category';
import Bookmark from '../Bookmark/Bookmark';

const Lists = () => {
    const {
        bookmarks: { items: bookmarks },
    } = useBookmarks();

    const {
        categories: { items: categories },
        categoriesDispatcher,
    } = useCategories();

    const { settings } = useSettings();

    const [active, setActive] = useState(null);
    const [localCategories, setLocalCategories] = useState([...categories]);

    const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

    const handleDragOver = (event) => {
        const { active, over } = event;
        const temp = [...categories];

        if (!active || !over) return;

        if (over.id === 'dropzone-edit') {
            console.log('Edit ', active.id);
        }

        if (over.id === 'dropzone-delete') {
            console.log('Delete ', active.id);
        }

        if (
            active.data.current.type === 'category' &&
            active.id !== over.id &&
            temp.some((i) => i.id === over.id)
        ) {
            const oldIndex = temp.findIndex((i) => i.id === active.id);
            const newIndex = temp.findIndex((i) => i.id === over.id);
            const dragItem = temp.splice(oldIndex, 1)[0];

            temp.splice(newIndex, 0, dragItem);
            setLocalCategories(temp);
        }
    };

    const handleDragStart = (event) => {
        let newActive = null;

        if (event.active.data.current.type === 'bookmark') {
            newActive = {
                type: 'bookmark',
                data: bookmarks.find(
                    (bookmark) => bookmark.id === event.active.id
                ),
            };
        }

        if (event.active.data.current.type === 'category') {
            newActive = {
                type: 'category',
                data: localCategories.find(
                    (category) => category.id === event.active.id
                ),
            };
        }

        // debugger;

        console.log({ newActive });

        setActive(newActive);
    };

    const handleDragEnd = (event) => {
        const type = event.active.data.current.type;
        const target = event.over.id;

        console.log(target, type)

        
        setActive(null);
        categoriesDispatcher({ items: [...localCategories] });
    };

    return (
        <>
            {localCategories?.length > 0 && (
                <DndContext
                    collisionDetection={pointerWithin}
                    sensors={sensors}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDragStart={handleDragStart}
                >
                    <Dropzones />

                    <SortableContext
                        items={localCategories}
                        strategy={() => null}
                    >
                        {settings.show_faves_category && (
                            <Category group="favorites" name="Favorites" />
                        )}
                        {localCategories.map((category, index) => (
                            <Category
                                draggable
                                group={category.id}
                                key={category.id}
                                index={index}
                                name={category.name}
                            />
                        ))}
                    </SortableContext>
                    <DragOverlay adjustScale={false}>
                        {active?.type === 'category' ? (
                            <Category
                                draggable
                                group={active.data.id}
                                key={active.data.id}
                                name={active.data.name}
                            />
                        ) : active?.type === 'bookmark' ? (
                            <Bookmark bookmark={active.data} dragging={true} />
                        ) : (
                            <></>
                        )}
                    </DragOverlay>
                </DndContext>
            )}
        </>
    );
};

export default Lists;
