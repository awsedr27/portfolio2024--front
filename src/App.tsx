import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login/Login';
import NaverLogin from './pages/login/naver/NaverLogin';
import Main from './pages/Main';
import Layout from './pages/common/Layout';

function App() {

  return (
    <Router>
      <Routes>
          <Route path="/login" Component={Login} />
          <Route path="/login/naver" Component={NaverLogin} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Main />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
