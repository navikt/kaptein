import { AppErrorBoundary } from '@app/components/app/error-boundary';
import { reduxStore } from '@app/redux/configure-store';
import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Router } from './router';

export const App = () => {
  return (
    <StrictMode>
      <AppErrorBoundary>
        <Provider store={reduxStore}>
          <BrowserRouter>
            <Router />
          </BrowserRouter>
        </Provider>
      </AppErrorBoundary>
    </StrictMode>
  );
};
