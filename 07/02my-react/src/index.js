import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.jsx';
import * as serviceWorker from './serviceWorker';
import baseObj from './api/home.js'

import 'lib-flexible';
// import { createStore } from 'redux';

import { Provider } from 'react-redux';
import store from '@/store/store.js';


window.api = baseObj
// const store = createStore(reducer)
//连接组件

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
