import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Modal from 'react-modal';

import { BookmarksProvider } from './contexts/BookmarksProvider';
import { CategoriesProvider } from './contexts/CategoriesProvider';
import { SessionProvider } from './contexts/SessionProvider';
import { SettingsProvider } from './contexts/SettingsProvider';
import { DropboxProvider } from './contexts/DropboxProvider';
import App from './App';

import './styles/global.scss';

Modal.setAppElement('#root');

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <DropboxProvider>
                <SessionProvider>
                    <SettingsProvider>
                        <CategoriesProvider>
                            <BookmarksProvider>
                                <App />
                            </BookmarksProvider>
                        </CategoriesProvider>
                    </SettingsProvider>
                </SessionProvider>
            </DropboxProvider>
        </BrowserRouter>
    </React.StrictMode>
);
