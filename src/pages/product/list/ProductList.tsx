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





const ProductList: React.FC = () => {
  const [productListScreenData, setProductListScreenData] = useState<ProductListScreenData>({productList:[]});
  const [loading, setLoading] = useState(false);
  const { categoryId } = useParams<{ categoryId: string }>();
  const categoryIdRequest=Number(categoryId)||undefined;
  const location = useLocation();
  let searchKeyword:string|undefined = new URLSearchParams(location.search).get('keyword')||undefined;
  if(categoryIdRequest){
    searchKeyword=undefined;
  }
  const lastProductIdRef = useRef<number | undefined>(undefined);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const nav = useNavigate();
  const { setCartListCnt } = useLayoutContext();
  const getProductList = useCallback(async (productListRequest:ProductListRequest) => {
    if(loadingRef.current){return []}
    loadingRef.current=true;
    setLoading(true);
    try {
      const response = await axiosInstance.post('/api/product/list', productListRequest);
      const resultData:ProductListResponse = response.data;
      const productList=transformProductListResponse(resultData);
      if(productList.length==0){
        hasMoreRef.current=false;
      }   
      lastProductIdRef.current = productList[productList.length - 1]?.productId;
      return productList;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    } finally {
        loadingRef.current = false;
        setLoading(false);
    }
  }, []);
  const init=async ()=>{
    hasMoreRef.current=true;
    lastProductIdRef.current=undefined;
    const productList=await getProductList({categoryId:categoryIdRequest,productName:searchKeyword});
    setProductListScreenData(prev=>{
      return({
        productList:productList
      })
    });
  }
  const handleScroll = useCallback(async () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && hasMoreRef.current) {
      const productList=await getProductList({productId:lastProductIdRef.current,categoryId:categoryIdRequest,productName:searchKeyword});
      setProductListScreenData(prev=>{
        return({
          productList:[...prev.productList, ...productList]
        })
      })
    }
  }, [categoryIdRequest,searchKeyword]);
  useEffect(() => {
    window.scrollTo(0, 0);
    init();
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
      const cartSaveRequest:CartSaveRequest={productId:productId};
      const response=await axiosInstance.post('/api/cart/save',cartSaveRequest);
      const resultData:CartSaveResponse = response.data;
      alert('장바구니에 '+resultData.quantity+'개를 담았습니다');
      const cartListCount=await axiosInstance.post('/api/cart/list/count');
      setCartListCnt(cartListCount.data);
    }catch(error){
      console.log(error)
    }
  };

  return (
    
    <div className={styles.productList}>
      {productListScreenData.productList.map(product => (
        <ProductItemComponent key={product.productId} productItem={product} onClick={handleProductClick} onCartSaveClick={handleCartSaveIconClick}/>
      ))}
    {loading && <p>Loading...</p>}
    </div>
  );
};

export default ProductList;
