// src/ProductDetail.tsx
import React, { useCallback, useEffect, useState } from 'react';
import axiosInstance from '../../../network/Api';
import { useParams } from 'react-router-dom';
import { ProductDetailScreenData } from './ProductDetailScreenData';
import { ProductDetailRequest } from '../../../data/product/ProductRequest';
import { ProductDetailResponse } from '../../../data/product/ProductResponse';
import { transformProductDetailResponse } from '../../../converter/ProductConverter';
import styles from './ProductDetail.module.css'; 




const ProductDetail: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const [productDetail, setProductDetail] = useState<ProductDetailScreenData | null>(null);
   
    const fetchProductDetail = useCallback(async (productDetailRequest:ProductDetailRequest) => {
        try {
          const response = await axiosInstance.post('/api/product/detail', productDetailRequest);
          const resultData:ProductDetailResponse = response.data;
          const productDetail=transformProductDetailResponse(resultData);
          setProductDetail(productDetail);
        } catch (error) {
          console.error('Error fetching productDetail:', error);
        }
      }, []);
  useEffect(() => {
    fetchProductDetail({productId:Number(productId)});
  }, []);

  if (!productDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.productDetail}>

        <img src={"../logo192.png"} alt={productDetail.name} />

      <h1>{productDetail.name}</h1>
      <p>{productDetail.description}</p>
      <p className={styles.price}>Price: ${productDetail.price}</p>
      <p>Category ID: {productDetail.categoryId}</p>
      <p className={styles.createdDate}>Created on: {new Date(productDetail.createDate).toLocaleDateString()}</p>
    </div>
  );
};

export default ProductDetail;
