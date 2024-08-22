// src/ProductDetail.tsx
import React, { useCallback, useEffect, useState } from 'react';
import axiosInstance from '../../../network/Api';
import { useNavigate, useParams } from 'react-router-dom';
import { ProductDetailScreenData } from './ProductDetailScreenData';
import { ProductDetailRequest } from '../../../data/product/ProductRequest';
import { ProductDetailResponse } from '../../../data/product/ProductResponse';
import { transformProductDetailResponse } from '../../../converter/ProductConverter';
import styles from './ProductDetail.module.css'; 
import { CartBuyNowRequest, CartSaveRequest } from '../../../data/cart/CartRequest';
import { CartSaveResponse } from '../../../data/cart/CartResponse';
import { useLayoutContext } from '../../../context/LayoutContext';

const ProductDetail: React.FC = () => {
    const [quantity, setQuantity] = useState(1);
    const nav = useNavigate();
    const { productId } = useParams<{ productId: string }>();
    const [productDetail, setProductDetail] = useState<ProductDetailScreenData>();
    const { setCartListCnt } = useLayoutContext();
    const imgLocation = process.env.REACT_APP_PRODUCT_IMG_LOCATION;
    const baseUrl = process.env.REACT_APP_API_URL;
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
  const increaseQuantity = () => {
     setQuantity(prevQuantity => (prevQuantity+1 > 50 ? 50 : prevQuantity+1));
  };

  const decreaseQuantity = () => {
    setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };
  if (!productDetail) {
    return <div>Loading...</div>;
  }
  const handleCartSaveBtnClick = async () => {
    try{
      const cartSaveRequest:CartSaveRequest={productId:productDetail.productId,quantity:quantity};
      const response=await axiosInstance.post('/api/cart/save',cartSaveRequest);
      const resultData:CartSaveResponse = response.data;
      alert('장바구니에 '+resultData.quantity+'개를 담았습니다');
      const cartListCount=await axiosInstance.post('/api/cart/list/count');
      await fetchProductDetail({productId:Number(productId)});
      setQuantity(1);
      setCartListCnt(cartListCount.data);
    }catch(error){
      console.log(error)
    }
  };
  const handleBuyNowBtnClick= async()=>{
    try{
      const cartBuyNowRequest:CartBuyNowRequest={productId:productDetail.productId,quantity:quantity};
      const response=await axiosInstance.post('/api/cart/buy-now',cartBuyNowRequest);
      
      if(response.status===200){
        const cartListCount=await axiosInstance.post('/api/cart/list/count');
        setCartListCnt(cartListCount.data);
        const orderList:number[]=[productDetail.productId]
        nav('/order/detail', { state: { orderList } });
      }
    }catch(error){
      console.log(error)
    }
  }
  return (
    <div className={styles.productDetail}>
      <div className={styles.productContent}>
        <div className={styles.imgContainer}>
          {productDetail.imageUrl ? (
            <img src={`${baseUrl}${imgLocation}${productDetail.imageUrl}`} alt={productDetail.name} />
          ) : (
            <p>이미지 준비 중</p>
          )}
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.textContainer}>
            <h1>{productDetail.name}</h1>
            <p>{productDetail.description}</p>
            <p className={styles.price}>{productDetail.price.toLocaleString('ko-KR')}원</p>
            <p>카테고리 : {productDetail.categoryName}</p>
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
                  <p style={{fontWeight:'bold'}}>{productDetail.caculatedPrice.toLocaleString('ko-KR')}원</p>
              </div>
              <p style={{fontSize:10}}>최대 50개 구매가능</p>
            </div>
            <h1 style={{textAlign:'right',color:'rgb(223, 0, 17)'}}>{productDetail.caculatedPrice.toLocaleString('ko-KR')}원</h1>
          </div>
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <button className={styles.buyNowButton} onClick={handleBuyNowBtnClick}>바로구매</button>
        <button className={styles.addToCartButton} onClick={handleCartSaveBtnClick}>장바구니</button>
      </div>
    </div>
  );
};

export default ProductDetail;
