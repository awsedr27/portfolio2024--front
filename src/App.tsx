import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login/Login';
import NaverLogin from './pages/login/naver/NaverLogin';
import Main from './pages/Main';
import Layout from './pages/common/Layout';
import ProductDetail from './pages/product/detail/ProductDetail';
import ProductList from './pages/product/list/ProductList';
import CartList from './pages/cart/list/CartList';

function App() {

  return (
    <Router>
      <Routes>
          <Route path="/login" Component={Login} />
          <Route path="/login/naver" Component={NaverLogin} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Main />} />
          <Route path="/product/category/:categoryId" element={<ProductList/>} />
          <Route path="/product/:productId" element={<ProductDetail/>} />
          <Route path="/cart/list" element={<CartList/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
