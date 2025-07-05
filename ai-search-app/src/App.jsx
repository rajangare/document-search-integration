import logo from './logo.svg';
import './App.css';
import SearchPage from './page/SearchPage';
import { Provider } from 'react-redux';
import { store } from './data/configureStore';
import SearchResult from './page/SearchResult';
import {BrowserRouter , Route, Routes } from 'react-router-dom';

function App() {
  return (

    <div>
      <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/result" element={<SearchResult />} />
        </Routes>
      </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
