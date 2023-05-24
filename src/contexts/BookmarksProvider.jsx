import { createContext, useContext, useReducer } from 'react';

const initialState = [
    ...(JSON.parse(localStorage.getItem('hgg.bookmarks.data')) || []),
];

const reducer = (state, action) => [...state, ...action];

export const BookmarksContext = createContext(initialState);

export const BookmarksProvider = ({ children }) => {
    const [bookmarks, bookmarksReducer] = useReducer(reducer, initialState);

    return (
        <BookmarksContext.Provider value={{ bookmarks, bookmarksReducer }}>
            {children}
        </BookmarksContext.Provider>
    );
};

export const useBookmarks = () => {
    console.log({ BookmarksContext });
    const { bookmarks, bookmarksDispatcher } = useContext(BookmarksContext);

    const addBookmark = (bookmark) => bookmarksDispatcher(bookmark);

    const removeBookmark = (id) =>
        bookmarksDispatcher([...(bookmarks.filter((b) => b.id !== id) || [])]);

    console.log({ bookmarks, bookmarksDispatcher });

    return { bookmarks, addBookmark, removeBookmark, bookmarksDispatcher };
};
