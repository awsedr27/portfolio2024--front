
import React, { useEffect, useRef, useState } from 'react';
import styles from './Header.module.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTimes, faBars, faUser } from '@fortawesome/free-solid-svg-icons';
import { useLayoutContext } from '../../../context/LayoutContext';
import axiosInstance from '../../../network/Api';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CategoryItemResponse, CategoryListResponse } from '../../../data/category/CategoryResponse';
import { useSpinner } from '../../../context/SpinnerContext';

const Header: React.FC = () => {
  const { cartListCnt,setCartListCnt} = useLayoutContext();
  const [text, setText] = useState<string>('');
  const {loading,setLoading } = useSpinner();
  const loadingRef = useRef(false);
  const nav = useNavigate();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isopenMyDropDown, setIsopenMyDropDown] = useState(false);
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
    setIsopenMyDropDown(false);
    setIsOpen(false);
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
  const toggleDropdown = () => {
    if(isopenMyDropDown){
      setIsopenMyDropDown(false);
    }
    setIsOpen(!isOpen);
  }

  const toggleMyDropdown = () => {
    if(isOpen){
      setIsOpen(false);
    }
    setIsopenMyDropDown(!isopenMyDropDown);
  }

  const handleCategorySelect = (category:string) => {
    setIsOpen(false);
  };
  const handleLogOut=async ()=>{
    try{
      if(loadingRef.current){
        return }
      loadingRef.current=true;
      setLoading(true);
      const logout = await axiosInstance.post('/api/user/logout',null,{withCredentials:true});
      localStorage.removeItem('accessToken');
      loadingRef.current = false;
      setLoading(false);
      nav("/login");

     // window.location.replace("/login");
    }catch(error){
      console.log('로그아웃 실패');
      loadingRef.current = false;
      setLoading(false);
    }
  }
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
                    <Link className={styles.navLinksText} to={`/product/category/${category.categoryId}`}>{category.name}</Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
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
              <button className={styles.userIconButton} onClick={toggleMyDropdown}>
                <FontAwesomeIcon icon={faUser}/>
              </button>
              {isopenMyDropDown && (
                <ul className={styles.myDropDownMenu}>
                    <li>
                      <Link to={`/myPage`}>마이페이지</Link>
                    </li>
                    <li>
                      <button onClick={handleLogOut}>로그아웃</button>
                    </li>
                </ul>
              )}
        </div>

      </nav>
    </header>
  );
};

export default Header;
