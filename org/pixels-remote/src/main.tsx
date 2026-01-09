import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import { Provider } from 'jotai';
import { shellStore } from 'shell/state';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <Provider store={shellStore}>
      <App />
    </Provider>
  </StrictMode>,
);
