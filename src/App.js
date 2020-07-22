import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { BookmarksProvider } from './contexts/BookmarksProvider';
import { CategoriesProvider } from './contexts/CategoriesProvider';
import { SessionProvider } from './contexts/SessionProvider';
import { SettingsProvider } from './contexts/SettingsProvider';
import AppFooter from './components/AppFooter';
import AppHeader from './components/AppHeader';
import Setup from './components/Setup';
import Theme from './components/Theme';
import Auth from './routes/Auth';
import Error from './routes/Error';
import Home from './routes/Home';
import Logout from './routes/Logout';
import styles from './App.module.css';

function App() {
  return (
    <SessionProvider>
      <SettingsProvider>
        <CategoriesProvider>
          <BookmarksProvider>
            <Setup />
            <Theme />
            <Router>
              <div className={styles.app}>
                <AppHeader />
                <main className={styles.main}>
                  <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/auth" component={Auth} />
                    <Route path="/error" component={Error} />
                    <Route path="/logout" component={Logout} />
                  </Switch>
                </main>
                <AppFooter />
              </div>
            </Router>
          </BookmarksProvider>
        </CategoriesProvider>
      </SettingsProvider>
    </SessionProvider>
  );
}

export default App;
