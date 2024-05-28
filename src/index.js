import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App/App';
import { Online, Offline } from 'react-detect-offline';
import { Alert } from 'antd'


ReactDOM.createRoot(document.getElementById('root')).render (
  <>
    <Online>
       <App />
    </Online>
    <Offline>
      <div className='offline'>
        <Alert type='error'
        message='The page is unavailable due to internet connection problems. Please check your internet connection and try refreshing the page.'
        />
      </div>
    </Offline>
  </>
  
);



