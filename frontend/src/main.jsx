import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'


import { Provider } from 'react-redux';
import rootReducer from './redux/reducers';
import { createStore } from 'redux';

import { QueryClient, QueryClientProvider } from 'react-query';  // Importez ces éléments

import './assets/style/index.css'
import './assets/style/theme.css'
import './assets/style/grid.css'
import "./assets/boxicons-2.0.7/css/boxicons.min.css"

// Créez une instance de QueryClient
const queryClient = new QueryClient();

document.title = 'DEPART-SRSP'

const store = createStore(
  rootReducer
)

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <StrictMode>
      {/* Enveloppez l'application avec QueryClientProvider */}
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>
  </Provider>
)
