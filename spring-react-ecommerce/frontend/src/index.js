import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './index.css';
import App from './App';
import store from './store';

// Direct API calls to Spring Boot backend on port 5000
axios.defaults.baseURL = 'http://localhost:5000';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
