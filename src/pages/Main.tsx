import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './Main.module.css';
import { MainScreenData } from './MainScreenData';
import { ProductListRequest } from '../data/product/ProductRequest';
import { ProductListResponse } from '../data/product/ProductResponse';
import { transformProductListResponse } from '../converter/ProductConverter';
import axiosInstance from '../network/Api';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ProductItemComponent from '../components/product/ProductItemComponent';
import { CartSaveRequest } from '../data/cart/CartRequest';
import { CartSaveResponse } from '../data/cart/CartResponse';
import { useLayoutContext } from '../context/LayoutContext';
import { useSpinner } from '../context/SpinnerContext';



const Main: React.FC = () => {
  const [mainScreenData, setMainScreenData] = useState<MainScreenData>({productList:[]});
  const {loading,setLoading } = useSpinner();
  const { categoryId } = useParams<{ categoryId: string }>();
  const categoryIdRequest=Number(categoryId)||undefined;
  const lastProductIdRef = useRef<number | undefined>(undefined);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const nav = useNavigate();
  const { setCartListCnt } = useLayoutContext();
  const fetchProducts = useCallback(async (productListRequest:ProductListRequest) => {
    if(loadingRef.current){
      return }
    loadingRef.current=true;
    setLoading(true);
    try {
      const response = await axiosInstance.post('/api/product/list', productListRequest);
      const resultData:ProductListResponse = response.data;
      const productList=transformProductListResponse(resultData);
      if(productList.length==0){
        hasMoreRef.current=false;
      }
      setMainScreenData(prevState => ({
        productList: [...prevState.productList, ...productList] 
      }));    
      lastProductIdRef.current = productList[productList.length - 1]?.productId;
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
        loadingRef.current = false;
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProducts({categoryId:categoryIdRequest});
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && hasMoreRef.current) {
      fetchProducts({productId:lastProductIdRef.current,categoryId:categoryIdRequest});
    }
  }, []);
  const handleProductClick = (productId: number) => {
    nav(`/product/${productId}`);
  };

  const handleCartSaveIconClick = async (productId: number) => {
    try{
      if(loadingRef.current){
        return;
      }
      loadingRef.current=true;
      setLoading(true);
      const cartSaveRequest:CartSaveRequest={productId:productId};
      const response=await axiosInstance.post('/api/cart/save',cartSaveRequest);
      const resultData:CartSaveResponse = response.data;
      alert('장바구니에 '+resultData.quantity+'개를 담았습니다');
      const cartListCount=await axiosInstance.post('/api/cart/list/count');
      setCartListCnt(cartListCount.data);
    }catch(error){
      console.log(error)
    }finally {
      setLoading(false);
      loadingRef.current=false;
  }
  };
  return (
    <div className={styles.productList}>
      {((!loading)&&(mainScreenData.productList.length===0))&&(<div>상품 목록이 없습니다</div>)}
      {mainScreenData.productList.map(product => (
        <ProductItemComponent key={product.productId} productItem={product} onClick={handleProductClick} onCartSaveClick={handleCartSaveIconClick}/>
      ))}
    </div>
  );
};

export default Main;
