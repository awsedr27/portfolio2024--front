import { useCallback, useEffect, useRef, useState } from "react";
import { ProductListScreenData } from "./ProductListScreenData";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useLayoutContext } from "../../../context/LayoutContext";
import { ProductListRequest } from "../../../data/product/ProductRequest";
import axiosInstance from "../../../network/Api";
import { ProductListResponse } from "../../../data/product/ProductResponse";
import { transformProductListResponse } from "../../../converter/ProductConverter";
import { CartSaveRequest } from "../../../data/cart/CartRequest";
import { CartSaveResponse } from "../../../data/cart/CartResponse";
import ProductItemComponent from "../../../components/product/ProductItemComponent";
import styles from './ProductList.module.css';
import { useSpinner } from "../../../context/SpinnerContext";

const ProductList: React.FC = () => {
  const [productListScreenData, setProductListScreenData] = useState<ProductListScreenData>({productList:[]});
  const { categoryId } = useParams<{ categoryId: string }>();
  const categoryIdRequest=Number(categoryId)||undefined;
  const location = useLocation();
  let searchKeyword:string|undefined = new URLSearchParams(location.search).get('keyword')||undefined;
  if(categoryIdRequest){
    searchKeyword=undefined;
  }
  const lastProductIdRef = useRef<number | undefined>(undefined);
  const {loading,setLoading } = useSpinner();
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const nav = useNavigate();
  const { setCartListCnt } = useLayoutContext();

  const getProductList = useCallback(async (productListRequest:ProductListRequest) => {
      const response = await axiosInstance.post('/api/product/list', productListRequest);
      const resultData:ProductListResponse = response.data;
      const productList=transformProductListResponse(resultData);
      if(productList.length==0){
        hasMoreRef.current=false;
      }   
      lastProductIdRef.current = productList[productList.length - 1]?.productId;
      return productList;
  }, []);
  const init=async ()=>{
    try{
      if(loadingRef.current){
        return;}
      loadingRef.current=true;
      setLoading(true);
      hasMoreRef.current=true;
      lastProductIdRef.current=undefined;
      const productList=await getProductList({categoryId:categoryIdRequest,productName:searchKeyword});
      setProductListScreenData(prev=>{
        return({productList:productList})
      });
      setLoading(false);
      loadingRef.current = false;
    }catch(error){
      console.log(error);
      setLoading(false);
      nav('/errorPage',{ replace: true });
    }
  }
  useEffect(() => {
    window.scrollTo(0, 0);
    init();
  }, [categoryIdRequest,searchKeyword]);

  const handleScroll = useCallback(async () => {
    try{
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && hasMoreRef.current) {
        if(loadingRef.current){return;}
        loadingRef.current=true;
        setLoading(true);
        const productList=await getProductList({productId:lastProductIdRef.current,categoryId:categoryIdRequest,productName:searchKeyword});
        setProductListScreenData(prev=>{
          return({
            productList:[...prev.productList, ...productList]
          })
        })
        setLoading(false);
        loadingRef.current = false;
      }
    }catch(error){
      console.log(error);
      setLoading(false);
      nav('/errorPage',{ replace: true });
    }
  }, [categoryIdRequest,searchKeyword]);
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);


  const handleProductClick = (productId: number) => {
    nav(`/product/${productId}`);
  };
  const handleCartSaveIconClick = async (productId: number) => {
    try{
      if(loadingRef.current){return;}
      loadingRef.current=true;
      setLoading(true);
      const cartSaveRequest:CartSaveRequest={productId:productId};
      const response=await axiosInstance.post('/api/cart/save',cartSaveRequest);
      const resultData:CartSaveResponse = response.data;
      alert('장바구니에 '+resultData.quantity+'개를 담았습니다');
      const cartListCount=await axiosInstance.post('/api/cart/list/count');
      setCartListCnt(cartListCount.data);
      setLoading(false);
      loadingRef.current=false;
    }catch(error){
      console.log(error);
      setLoading(false);
      nav('/errorPage',{ replace: true });
    }
  };

  return (
    <div className={styles.productList}>
      {((!loading)&&(productListScreenData.productList.length===0))&&(<div>상품 목록이 없습니다</div>)}
      {productListScreenData.productList.map(product => (
        <ProductItemComponent key={product.productId} productItem={product} onClick={handleProductClick} onCartSaveClick={handleCartSaveIconClick}/>
      ))}
    </div>
  );
};

export default ProductList;
