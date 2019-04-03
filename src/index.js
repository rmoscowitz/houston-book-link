import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import { createBrowserHistory } from 'history';
import registerServiceWorker from './registerServiceWorker';
import App from './components/App';

import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

ReactGA.initialize('UA-100392725-1');

const history = createBrowserHistory();
history.listen(location => {
  ReactGA.set({ page: location.pathname });
  ReactGA.pageview(location.pathname);
});

ReactDOM.render(
  <App history={history}/>,
  document.getElementById('root')
);

registerServiceWorker();
