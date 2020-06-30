import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { BookmarksProvider } from './contexts/BookmarksProvider';
import { CategoriesProvider } from './contexts/CategoriesProvider';
import { SessionProvider } from './contexts/SessionProvider';
import { SettingsProvider } from './contexts/SettingsProvider';
import AppHeader from './components/AppHeader';
import AppSettings from './components/AppSettings';
import Auth from './routes/Auth';
import Error from './routes/Error';
import Home from './routes/Home';
import Logout from './routes/Logout';
import Setup from './routes/Setup';
import styles from './App.module.css';

function App() {
  return (
    <SessionProvider>
      <SettingsProvider>
        <CategoriesProvider>
          <BookmarksProvider>
            <AppHeader />
            <Router>
              <AppSettings />
              <main className={styles.main}>
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route path="/auth" component={Auth} />
                  <Route path="/error" component={Error} />
                  <Route path="/logout" component={Logout} />
                  <Route path="/setup" component={Setup} />
                </Switch>
              </main>
            </Router>
          </BookmarksProvider>
        </CategoriesProvider>
      </SettingsProvider>
    </SessionProvider>
  );
}

export default App;
