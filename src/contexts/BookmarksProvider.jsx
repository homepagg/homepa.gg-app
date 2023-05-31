import { createContext, useContext, useReducer } from 'react';

const initialState = {
    items: [...(JSON.parse(localStorage.getItem('hgg.bookmarks.data')) || [])],
};

const reducer = (state, action) => ({ ...state, ...action });

export const BookmarksContext = createContext();

export const BookmarksProvider = ({ children }) => {
    const [bookmarks, bookmarksDispatcher] = useReducer(reducer, initialState);

    return (
        <BookmarksContext.Provider value={{ bookmarks, bookmarksDispatcher }}>
            {children}
        </BookmarksContext.Provider>
    );
};

export const useBookmarks = () => {
    const { bookmarks, bookmarksDispatcher } = useContext(BookmarksContext);

    const addBookmark = (bookmark) =>
        bookmarksDispatcher({ items: [...bookmarks.items, bookmark] });

    const removeBookmark = (id) =>
        bookmarksDispatcher({
            items: [...(bookmarks.filter((b) => b.id !== id) || [])],
        });

    return { bookmarks, bookmarksDispatcher, addBookmark, removeBookmark };
};
