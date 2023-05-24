import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDrag } from 'react-dnd';
import Color from 'color';

import { ItemTypes } from '../../types/ItemTypes.d.ts';
import { BookmarksContext } from '../../contexts/BookmarksProvider';
import { useSession } from '../../contexts/SessionProvider';
import BookmarkForm from '../BookmarkForm/BookmarkForm.jsx';

import styles from './Bookmark.module.scss';

const Bookmark = ({ bookmark }) => {
    const { session } = useSession();
    const bookmarksState = useContext(BookmarksContext);
    const { bookmarksDispatcher } = bookmarksState;
    const [addingBookmark, setAddingBookmark] = useState(false);
    const [accentColor, setAccentColor] = useState('');
    const container = useRef();

    const [, containerRef] = useDrag({
        type: ItemTypes.BOOKMARK,
        item: { bookmark },
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult();
            if (item && dropResult?.type === 'edit') setAddingBookmark(true);
            if (item && dropResult?.type === 'delete')
                bookmarksDispatcher({ type: 'EDIT', id: bookmark.id });
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    containerRef(container);

    useEffect(() => {
        if (!container.current) return;

        let color;

        switch (session.theme) {
            case 'light':
                color = Color(bookmark.color).lightness(84);
                break;
            case 'dark':
                color = Color(bookmark.color).lightness(24);
                break;
            default:
                color = Color(bookmark.color);
        }

        const hsl = color.hsl().object();

        setAccentColor(
            `${Math.round(hsl.h)} ${Math.round(hsl.s)}% ${Math.round(hsl.l)}%`
        );
    }, [bookmark.color, container, session.theme]);

    return (
        <>
            <li
                className={styles.container}
                draggable="true"
                ref={container}
                style={{ '--accent-color': `${accentColor}` }}
            >
                <a
                    className={styles.link}
                    href={bookmark.link}
                    rel="nofollow noopener"
                    title={bookmark.name}
                >
                    <span className={styles.icon}>
                        <img
                            className={styles.image}
                            alt=""
                            src={`http://www.google.com/s2/favicons?domain=${bookmark.link}`}
                        />
                    </span>
                    <span className={styles.text}>{bookmark.name}</span>
                </a>
            </li>
            {addingBookmark && (
                <BookmarkForm
                    bookmarkId={bookmark.id}
                    closeModal={() => setAddingBookmark(false)}
                    showModal={addingBookmark}
                />
            )}
        </>
    );
};

export default Bookmark;
