import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login/Login';
import NaverLogin from './pages/login/naver/NaverLogin';
import Main from './pages/Main';
import Layout from './pages/common/layout/Layout';
import ProductDetail from './pages/product/detail/ProductDetail';
import ProductList from './pages/product/list/ProductList';
import CartList from './pages/cart/list/CartList';
import OrderCheckout from './pages/order/checkout/OrderCheckout';
import ErrorPage from './pages/common/errorPage/ErrorPage';
import SidebarLayout from './pages/common/sidebarLayout/SidebarLayout';
import UserInfo from './pages/myPage/userInfo/UserInfo';
import MyPageReviewList from './pages/myPage/review/list/MyPageReviewList';
import ReviewDetail from './pages/myPage/review/detail/ReviewDetail';

function App() {

  return (
    <Router>
      <Routes>
          <Route path="/login" Component={Login} />
          <Route path="/login/naver" Component={NaverLogin} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Main />} />
          <Route path="/product/category/:categoryId" element={<ProductList/>} />
          <Route path="/product/search" element={<ProductList/>} />
          <Route path="/product/:productId" element={<ProductDetail/>} />
          <Route path="/cart/list" element={<CartList/>} />
          <Route path="/order/checkout" element={<OrderCheckout/>}/>
          <Route path="/errorPage" element={<ErrorPage/>}/>
          <Route path="/myPage" element={<SidebarLayout />}>
            <Route index element={<UserInfo/>} />
            <Route path="review/list" element={<MyPageReviewList/>} />
            <Route path="review/detail" element={<ReviewDetail/>} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
