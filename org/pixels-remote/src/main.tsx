import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './app/AddRecipient.tsx';
import { Provider } from 'jotai';
import { sharedStore } from '@org/shared-state'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <Provider store={sharedStore}>
      <App />
    </Provider>
  </StrictMode>,
);
