import React from 'react';
import Dashboard from './pages/Dashboard/Dashboard';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import { GlobalStyle } from './components/GlobalStyles';
import { Redirect, Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import Task from './pages/Task/Task';

const Homepage = () => {
  return <Redirect to={'/dashboard'} />;
};

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Switch>
          <Route exact path={'/dashboard'} component={Dashboard} />
          <Route exact path={'/task/:id'} component={Task} />
          <Route exact path={'/'} component={Homepage} />
        </Switch>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
