import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './Main.module.css';
import { MainScreenData } from './MainScreenData';
import { ProductListRequest } from '../data/product/ProductRequest';
import { ProductListResponse } from '../data/product/ProductResponse';
import { transformProductListResponse } from '../converter/ProductConverter';
import axiosInstance from '../network/Api';



const Main: React.FC = () => {
  const [products, setProducts] = useState<MainScreenData["productList"]>([]);
  const [loading, setLoading] = useState(false);

  const lastProductIdRef = useRef<number | undefined>(undefined);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);

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
      setProducts(prevProducts => [...(prevProducts || []), ...(productList||[])]);
      lastProductIdRef.current = productList[productList.length - 1]?.productId;

    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
        loadingRef.current = false;
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts({});
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && hasMoreRef.current) {
      fetchProducts({productId:lastProductIdRef.current});
    }
  }, []);


  return (
    
    <div className={styles.productList}>
      {products.map(product => (
        <div key={product.productId} className={styles.productItem}>
          <img src={"logo192.png"} alt={product.name} />
          <h3>{product.name}</h3>
          <p>{product.productId}</p>
          <p>{product.description}</p>
          <p>{product.price}</p>
        </div>
      ))}
    {loading && <p>Loading...</p>}
    </div>
  );
};

export default Main;
