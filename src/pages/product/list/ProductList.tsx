import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProductListScreenData } from "./ProductListScreenData";
import { ProductListRequest } from "../../../data/product/ProductRequest";
import axiosInstance from "../../../network/Api";
import { ProductListResponse } from "../../../data/product/ProductResponse";
import { transformProductListResponse } from "../../../converter/ProductConverter";
import styles from './ProductList.module.css';
import ProductItemComponent from "../../../components/product/ProductItemComponent";




const ProductList: React.FC = () => {
  const [productListScreenData, setProductListScreenData] = useState<ProductListScreenData>({productList:[]});
  const [loading, setLoading] = useState(false);
  const { categoryId } = useParams<{ categoryId: string }>();
  const lastProductIdRef = useRef<number | undefined>(undefined);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const nav = useNavigate();
  const fetchProducts = useCallback(async (productListRequest:ProductListRequest) => {
    if(loadingRef.current){return false}
    loadingRef.current=true;
    setLoading(true);

    try {
      const response = await axiosInstance.post('/api/product/list', productListRequest);
      const resultData:ProductListResponse = response.data;
      const productList=transformProductListResponse(resultData);
      if(productList.length==0){
        hasMoreRef.current=false;
      }
      setProductListScreenData(prevState => ({
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
    fetchProducts({categoryId:Number(categoryId)});
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && hasMoreRef.current) {
      fetchProducts({productId:lastProductIdRef.current,categoryId:Number(categoryId)});
    }
  }, []);
  const handleProductClick = (productId: number) => {
    nav(`/product/${productId}`);
  };
  const handleCartSaveIconClick = (productId: number) => {
    alert(productId);
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
