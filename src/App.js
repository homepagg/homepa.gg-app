import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { BookmarksProvider } from './contexts/BookmarksProvider';
import { CategoriesProvider } from './contexts/CategoriesProvider';
import AppHeader from './components/AppHeader';
import Home from './routes/Home';
import Auth from './routes/Auth';
import './App.css';

function App() {
  return (
    <CategoriesProvider>
      <BookmarksProvider>
        <AppHeader />
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/auth" component={Auth} />
          </Switch>
        </Router>
      </BookmarksProvider>
    </CategoriesProvider>
  );
}

export default App;
