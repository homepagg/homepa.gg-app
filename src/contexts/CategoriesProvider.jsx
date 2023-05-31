import { createContext, useContext, useReducer } from 'react';

const initialState = {
    items: [...(JSON.parse(localStorage.getItem('hgg.categories.data')) || [])],
};

const reducer = (state, action) => ({ ...state, ...action });

export const Categories = createContext();

export const CategoriesProvider = ({ children }) => {
    const [categories, categoriesDispatcher] = useReducer(
        reducer,
        initialState
    );

    return (
        <Categories.Provider value={{ categories, categoriesDispatcher }}>
            {children}
        </Categories.Provider>
    );
};

export const useCategories = () => {
    const { categories, categoriesDispatcher } = useContext(Categories);

    const addCategory = (category) => categoriesDispatcher(category);

    const removeCategory = (id) =>
        categoriesDispatcher([
            ...(categories.filter((c) => c.id !== id) || []),
        ]);

    return { categories, addCategory, removeCategory, categoriesDispatcher };
};
