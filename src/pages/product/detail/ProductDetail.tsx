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
    const [quantity, setQuantity] = useState(1);
    const { productId } = useParams<{ productId: string }>();
    const [productDetail, setProductDetail] = useState<ProductDetailScreenData>();
   
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
  
  useEffect(() => {
    setProductDetail(prevProduct => {
      if (prevProduct === undefined) {
        return prevProduct;
      }
      return {
        ...prevProduct,
        caculatedPrice: quantity*prevProduct.price
      };
    })
  }, [quantity]);
  
  if (!productDetail) {
    return <div>Loading...</div>;
  }
  const increaseQuantity = () => {
    setQuantity(prevQuantity => (prevQuantity+1 > 50 ? 50 : prevQuantity+1));
  };

  const decreaseQuantity = () => {
    setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };
  return (
    <div className={styles.productDetail}>
      <div className={styles.productContent}>
        <div className={styles.imgContainer}>
          <img src={"../logo192.png"} alt={productDetail.name} />
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.textContainer}>
            <h1>{productDetail.name}</h1>
            <p>{productDetail.description}</p>
            <p className={styles.price}>Price: ${productDetail.price}</p>
            <p>Category ID: {productDetail.categoryId}</p>
            <p className={styles.createdDate}>등록일: {new Date(productDetail.createDate).toLocaleDateString()}</p>
          </div>
          <div className={styles.cartContainer}>
            
            <div className={styles.cartItemContainer}>
              <div>
                <p>{productDetail.name}</p>
              </div>
              <div className={styles.cartQuantityAndPrice}>
                <div className={styles.quantityControls}>
                  <button onClick={decreaseQuantity} className={styles.controlButton}>-</button>
                  <p className={styles.quantity}>{quantity}</p>
                  <button onClick={increaseQuantity} className={styles.controlButton}>+</button>  
                </div>
                  <p style={{fontWeight:'bold'}}>{productDetail.caculatedPrice}원</p>
              </div>
              <p style={{fontSize:10}}>최대 50개 구매가능</p>
            </div>
            <h1 style={{textAlign:'right',color:'rgb(223, 0, 17)'}}>{productDetail.caculatedPrice}원</h1>
          </div>
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <button className={styles.buyNowButton}>바로구매</button>
        <button className={styles.addToCartButton}>장바구니</button>
      </div>
    </div>
  );
};

export default ProductDetail;
