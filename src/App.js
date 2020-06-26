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
import Update from './routes/Update';
import './App.css';

function App() {
  return (
    <SessionProvider>
      <SettingsProvider>
        <CategoriesProvider>
          <BookmarksProvider>
            <AppHeader />
            <AppSettings />
            <main>
              <Router>
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route path="/auth" component={Auth} />
                  <Route path="/error" component={Error} />
                  <Route path="/update" component={Update} />
                </Switch>
              </Router>
            </main>
          </BookmarksProvider>
        </CategoriesProvider>
      </SettingsProvider>
    </SessionProvider>
  );
}

export default App;
