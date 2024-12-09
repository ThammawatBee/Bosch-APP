import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ChakraProvider } from '@chakra-ui/react';
import './assets/fonts/font'
import theme from "./theme";
import { Settings} from 'luxon'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

Settings.defaultZone = 'Asia/Bangkok';

root.render(
    <ChakraProvider value={theme}>
      <App />
    </ChakraProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
