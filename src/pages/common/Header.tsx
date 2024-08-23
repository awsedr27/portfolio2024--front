// Header.tsx
import React, { useEffect, useState } from 'react';
import styles from './Header.module.css'; 

// FontAwesome 관련 import
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTimes, faBars, faUser } from '@fortawesome/free-solid-svg-icons';
import { useLayoutContext } from '../../context/LayoutContext';
import axiosInstance from '../../network/Api';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { cartListCnt,setCartListCnt} = useLayoutContext();
  const [text, setText] = useState<string>('');
  const nav = useNavigate();
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
  const handleChangeText=(event:any)=>{
      setText(event.target.value);
  }
  const handleSearch=()=>{
    try{
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
        <a href="/">PortFolio</a>
      </div>
      <nav className={`${styles.navbar}`}>
        <ul className={styles.navLinks}>
          <li><a href="#home">Top50</a></li>
          <li><a href="#products">신제품</a></li>
          <li><a href="#about">About Us</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div className={styles.searchBar}>
          <input type="text" name="productName" placeholder="Search..." value={text} onChange={handleChangeText}/>
          <button onClick={handleSearch}>Search</button>
        </div>
        <div className={styles.cart}>
          <a href="/cart/list">
            <FontAwesomeIcon icon={faShoppingCart} />
            <span className={`${styles.cartCount} ${cartListCnt > 0 ? styles.active : styles.inActive}`}>{cartListCnt}</span>
          </a>
        </div>
        <div className={styles.user}>
          <a href="/user/info">
            <FontAwesomeIcon icon={faUser}/>
          </a>
        </div>

      </nav>
    </header>
  );
};

export default Header;
