import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import App from './app/App';
import { preloadRouteRemotes } from './app/helpers/Run';

// Start the current route's downloads before React mounts. Do not await this:
// the Suspense boundary in App can paint immediately while the route resolves.
void preloadRouteRemotes(window.location.pathname);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <BrowserRouter future={{ v7_startTransition: true }}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
