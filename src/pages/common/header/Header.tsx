
import React, { useEffect, useState } from 'react';
import styles from './Header.module.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTimes, faBars, faUser } from '@fortawesome/free-solid-svg-icons';
import { useLayoutContext } from '../../../context/LayoutContext';
import axiosInstance from '../../../network/Api';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { cartListCnt,setCartListCnt} = useLayoutContext();
  const [text, setText] = useState<string>('');
  const nav = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const fetchCartListCount = async () => {
      try {
        const response = await axiosInstance.post('/api/cart/list/count');
        setCartListCnt(response.data);
      } catch (error) {
        console.error('Failed to fetch cart list count:', error);
      }
    };
    fetchCartListCount();
  }, []);
  useEffect(() => {
    if (!location.pathname.startsWith('/product/search')) {
      setText('');
    }
  }, [location.pathname]);

  const handleChangeText=(event:any)=>{
      setText(event.target.value);
  }
  const handleSearch=(e:any)=>{
    try{
      e.preventDefault();
      if(text.length==0||text.trim()===''){
        alert('검색어를 입력해주세요');
        return;
      }
      nav("/product/search?keyword="+encodeURIComponent(text));
      
    }catch(error){
      
    }
  }

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/">PortFolio</Link>
      </div>
      <nav className={`${styles.navbar}`}>
        <ul className={styles.navLinks}>
          <li><Link to="#contact">카테고리</Link></li>
          <li><Link to="#home">Top50</Link></li>
          <li><Link to="#products">신제품</Link></li>
        </ul>
        <div className={styles.searchBar}>
          <form onSubmit={handleSearch}>
          <input type="text" name="productName" placeholder="Search..." value={text} onChange={handleChangeText}/>
          <button type='submit'>Search</button>
          </form>
        </div>
        <div className={styles.cart}>
          <Link to="/cart/list">
            <FontAwesomeIcon icon={faShoppingCart} />
            <span className={`${styles.cartCount} ${cartListCnt > 0 ? styles.active : styles.inActive}`}>{cartListCnt}</span>
          </Link>
        </div>
        <div className={styles.user}>
          <Link to="/myPage">
            <FontAwesomeIcon icon={faUser}/>
          </Link>
        </div>

      </nav>
    </header>
  );
};

export default Header;
