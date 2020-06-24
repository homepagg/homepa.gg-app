import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { BookmarksProvider } from './contexts/BookmarksProvider';
import { CategoriesProvider } from './contexts/CategoriesProvider';
import { SessionProvider } from './contexts/SessionProvider';
import AppHeader from './components/AppHeader';
import Auth from './routes/Auth';
import Error from './routes/Error';
import Home from './routes/Home';
import Update from './routes/Update';
import './App.css';

function App() {
  return (
    <SessionProvider>
      <CategoriesProvider>
        <BookmarksProvider>
          <AppHeader />
          <Router>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/auth" component={Auth} />
              <Route exact path="/error" component={Error} />
              <Route exact path="/update" component={Update} />
            </Switch>
          </Router>
        </BookmarksProvider>
      </CategoriesProvider>
    </SessionProvider>
  );
}

export default App;
