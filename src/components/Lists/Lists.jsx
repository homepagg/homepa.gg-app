import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { useCategories } from '../../contexts/CategoriesProvider';
import { useSettings } from '../../contexts/SettingsProvider';
import Dropzones from '../Dropzones/Dropzones';
import Category from '../Category/Category';

const Lists = () => {
    const { categories } = useCategories();
    const { settings } = useSettings();

    return (
        <>
            {categories?.length > 0 && (
                <DndProvider backend={HTML5Backend}>
                    <Dropzones />
                    {settings.show_faves_category && (
                        <Category group="favorites" name="Favorites" />
                    )}
                    {categories.map((category, index) => (
                        <Category
                            draggable={true}
                            group={category.id}
                            key={category.id}
                            index={index}
                            name={category.name}
                        />
                    ))}
                </DndProvider>
            )}
        </>
    );
};

export default Lists;
