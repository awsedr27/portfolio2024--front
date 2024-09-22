
import React, { useEffect, useRef, useState } from 'react';
import styles from './Header.module.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTimes, faBars, faUser } from '@fortawesome/free-solid-svg-icons';
import { useLayoutContext } from '../../../context/LayoutContext';
import axiosInstance from '../../../network/Api';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CategoryItemResponse, CategoryListResponse } from '../../../data/category/CategoryResponse';

const Header: React.FC = () => {
  const { cartListCnt,setCartListCnt} = useLayoutContext();
  const [text, setText] = useState<string>('');
  const nav = useNavigate();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryItemResponse[]>([]);

  useEffect(() => {
    const fetchHeader = async () => {
      try {
        const categoryListRs = await axiosInstance.post('/api/category/list');
        const categoryList:CategoryListResponse=categoryListRs.data;
        const cartListCnt = await axiosInstance.post('/api/cart/list/count');
        setCategories(categoryList.categoryList);
        setCartListCnt(cartListCnt.data);
      } catch (error) {
        console.error('Failed to fetch cart list count:', error);
      }
    };
    fetchHeader();
  }, []);
  useEffect(() => {
    if (!location.pathname.startsWith('/product/search')) {
      setText('');
    }else{
      const searchParams = new URLSearchParams(location.search);
      const keyword = searchParams.get('keyword');  
      setText(keyword || '');  
    }
  }, [location.pathname]);

  const handleChangeText=(event:any)=>{
      setText(event.target.value);
  }
  const handleSearch=(e:any)=>{
      e.preventDefault();
      if(text.length==0||text.trim()===''){
        alert('검색어를 입력해주세요');
        return;
      }
      if (inputRef.current) {
        inputRef.current.blur();
      }
      nav("/product/search?keyword="+encodeURIComponent(text));
  }
  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleCategorySelect = (category:string) => {
    setIsOpen(false);
  };
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/">PortFolio</Link>
      </div>
      <nav className={`${styles.navbar}`}>
        <ul className={styles.navLinks}>
          <li className={styles.dropdown}>
            <button className={styles.dropdownButton} onClick={toggleDropdown}>
              카테고리
            </button>
            {isOpen && (
              <ul className={styles.dropdownMenu}>
                {categories.map((category, index) => (
                  <li key={index} onClick={() => handleCategorySelect(category.name)}>
                    <Link to={`/product/category/${category.categoryId}`}>{category.name}</Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
          {/* <li><Link to="/product/category/3">Top50</Link></li>
          <li><Link to="/product/category/2">신제품</Link></li> */}
        </ul>
        <div className={styles.searchBar}>
          <form onSubmit={handleSearch}>
          <input type="text" ref={inputRef} name="productName" placeholder="Search..." value={text} onChange={handleChangeText}/>
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
