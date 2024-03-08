import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux'
import { persistor, store } from './redux/store';
import {
  QueryClient,
  QueryClientProvider
} from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { PersistGate } from 'redux-persist/integration/react';
const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient()
root.render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store} key={'abc'}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

reportWebVitals();
