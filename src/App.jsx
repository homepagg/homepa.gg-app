import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import AppFooter from './components/AppFooter/AppFooter';
import AppHeader from './components/AppHeader/AppHeader';
import Setup from './components/Setup/Setup';
import Theme from './components/Theme/Theme';
import styles from './App.module.scss';

const AuthRoute = lazy(() => import('./routes/AuthRoute/AuthRoute'));
const ErrorRoute = lazy(() => import('./routes/ErrorRoute/ErrorRoute'));
const HomeRoute = lazy(() => import('./routes/HomeRoute/HomeRoute'));
const LogoutRoute = lazy(() => import('./routes/LogoutRoute/LogoutRoute'));

const Loading = () => {
    return <></>;
};

function App() {
    return (
        <>
            <Theme />
            <Setup />
            <div className={styles.container}>
                <AppHeader />
                <div className={styles.main}>
                    <Suspense fallback={<Loading />}>
                        <Routes>
                            <Route index element={<HomeRoute />} />
                            <Route path="auth" element={<AuthRoute />} />
                            <Route path="logout" element={<LogoutRoute />} />
                            <Route path="error" element={<ErrorRoute />} />
                            <Route path="*" element={<ErrorRoute />} />
                        </Routes>
                    </Suspense>
                </div>
                <AppFooter />
            </div>
        </>
    );
}

export default App;
