import React, { useCallback, useEffect, useRef, useState } from 'react';
import axiosInstance from '../../../network/Api';
import { useNavigate, useParams } from 'react-router-dom';
import { ProductDetailScreenData, ReviewListWithCount } from './ProductDetailScreenData';
import { ProductDetailRequest } from '../../../data/product/ProductRequest';
import { ProductDetailResponse } from '../../../data/product/ProductResponse';
import { transformProductDetailResponse } from '../../../converter/ProductConverter';
import styles from './ProductDetail.module.css'; 
import { CartBuyNowRequest, CartSaveRequest } from '../../../data/cart/CartRequest';
import { CartSaveResponse } from '../../../data/cart/CartResponse';
import { useLayoutContext } from '../../../context/LayoutContext';
import ReviewItemComponent from '../../../components/review/ReviewItemComponent';
import { ReviewListRequest } from '../../../data/review/ReviewRequest';
import { ReviewListResponse } from '../../../data/review/ReviewResponse';
import { transformReviewListResponse } from '../../../converter/ReviewConverter';
import { useSpinner } from '../../../context/SpinnerContext';

const ProductDetail: React.FC = () => {
    const [quantity, setQuantity] = useState(1);
    const nav = useNavigate();
    const {loading,setLoading } = useSpinner();
    const { productId } = useParams<{ productId: string }>();
    const [productDetail, setProductDetail] = useState<ProductDetailScreenData>();
    const [reviewListWithCount, setReviewListWithCount] = useState<ReviewListWithCount>();
    const lastReviewIdRef = useRef<number | undefined>(undefined);
    const lastReviewRatingRef = useRef<number | undefined>(undefined);
    const loadingRef = useRef(false);
    const reviewHasMoreRef = useRef(true);
    const [reviewHasMore, setReviewHasMore] = useState(true);
    const [reviewSortBy, setReviewSortBy] = useState('LATEST');
    const { setCartListCnt } = useLayoutContext();
    const imgLocation = process.env.REACT_APP_PRODUCT_IMG_LOCATION;
    const baseUrl = process.env.REACT_APP_API_URL;
    const init = useCallback(async () => {
      try{
        if(loadingRef.current){return;}
        loadingRef.current=true;
        setLoading(true);
        const productDetail=await getProductDetail({productId:Number(productId)});
        const reviewListWithCount=await getReviewListWithCount({productId:Number(productId),sortBy:"LATEST"});
        setProductDetail(productDetail);
        setReviewListWithCount(reviewListWithCount);
        setLoading(false);
        loadingRef.current=false;
      }catch(error){
        setLoading(false);
        nav('/errorPage',{ replace: true });
      }
    }, []);

    const getProductDetail = useCallback(async (productDetailRequest:ProductDetailRequest) => {
          const response = await axiosInstance.post('/api/product/detail', productDetailRequest);
          const resultData:ProductDetailResponse = response.data;
          const productDetail=transformProductDetailResponse(resultData);
          return productDetail;
      }, []);
      const getReviewListWithCount = useCallback(async (reviewListRequest:ReviewListRequest) => {
          const response = await axiosInstance.post('/api/review/list', reviewListRequest);
          const resultData:ReviewListResponse = response.data;
          const reviewList=transformReviewListResponse(resultData);
          const reviewCnt:number=resultData.reviewCnt;
          if(reviewList.length==0){
            reviewHasMoreRef.current=false;
            setReviewHasMore(false);
          }
          lastReviewIdRef.current = reviewList[reviewList.length - 1]?.reviewId;
          lastReviewRatingRef.current = reviewList[reviewList.length - 1]?.rating;
          return {reviewList,reviewCnt};
      }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
    init();
    }, []);

  if (!productDetail||!reviewListWithCount) {
    return <div>Loading...</div>;
  }
  const caculatedPrice: number = (productDetail.price * quantity);



  const increaseQuantity = () => {
     setQuantity(prevQuantity => (prevQuantity+1 > 50 ? 50 : prevQuantity+1));
  };

  const decreaseQuantity = () => {
    setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };
  const handleCartSaveBtnClick = async () => {
    try{
      if(loadingRef.current){return;}
      loadingRef.current=true;
      setLoading(true);
      const cartSaveRequest:CartSaveRequest={productId:productDetail.productId,quantity:quantity};
      const response=await axiosInstance.post('/api/cart/save',cartSaveRequest);
      const resultData:CartSaveResponse = response.data;
      alert('장바구니에 '+resultData.quantity+'개를 담았습니다');
      const cartListCount=await axiosInstance.post('/api/cart/list/count');
      setCartListCnt(cartListCount.data);
      setLoading(false);
      loadingRef.current=false;
      return;
    }catch(error){
      console.log(error);
      setLoading(false);
      nav('/errorPage',{ replace: true });
    }
  };
  const handleBuyNowBtnClick= async()=>{
    try{
      if(loadingRef.current){return;}
      loadingRef.current=true;
      setLoading(true);
      const cartBuyNowRequest:CartBuyNowRequest={productId:productDetail.productId,quantity:quantity};
      const response=await axiosInstance.post('/api/cart/buy-now',cartBuyNowRequest);
      if(response.status===200){
        const cartListCount=await axiosInstance.post('/api/cart/list/count');
        setCartListCnt(cartListCount.data);
        const orderList:number[]=[productDetail.productId];
        setLoading(false);
        nav('/order/checkout', { state: { orderList } });
      }
    }catch(error){
      console.log(error);
      setLoading(false);
      nav('/errorPage',{ replace: true });
    }
  }
  const handleChangeReviewSoryBy=async (event:any)=>{
    try{
      if(loadingRef.current){return;}
      loadingRef.current=true;
      setLoading(true);
      reviewHasMoreRef.current=true
      setReviewHasMore(true);
      const reviewListWithCount=await getReviewListWithCount({productId:Number(productId),sortBy:String(event.target.value)});
      setReviewListWithCount(reviewListWithCount);
      setReviewSortBy(event.target.value);
      setLoading(false);
      loadingRef.current=false;
    }catch(error){
      console.log(error);
      setLoading(false);
      nav('/errorPage',{ replace: true });
    }
  }
  const handleClickReviewLoadMoreBtn=async ()=>{
    try{
      if(loadingRef.current){return;}
      loadingRef.current=true;
      setLoading(true);
      if(!reviewHasMoreRef.current){
        return;
      }
        const reviewListWithCount=await getReviewListWithCount({productId:Number(productId),sortBy:reviewSortBy,reviewId:lastReviewIdRef.current,rating:lastReviewRatingRef.current});
        setReviewListWithCount(prev=>{
          if(!prev){
            return(undefined);
          }
          return({
            reviewCnt:reviewListWithCount.reviewCnt,
            reviewList:[...prev.reviewList,...reviewListWithCount.reviewList]
          })
        });
        setLoading(false);
        loadingRef.current=false;
    }catch(error){
      console.log(error);
      setLoading(false);
      nav('/errorPage',{ replace: true });
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
                  <p style={{fontWeight:'bold'}}>{caculatedPrice.toLocaleString('ko-KR')}원</p>
              </div>
              <p style={{fontSize:10}}>최대 50개 구매가능</p>
            </div>
            <h1 style={{textAlign:'right',color:'rgb(223, 0, 17)'}}>{caculatedPrice.toLocaleString('ko-KR')}원</h1>
          </div>
        </div>
      </div>
      <div className={styles.reviewAndBtnContainer}>
        <div className={styles.reviewContainer}>
          <h3>전체 리뷰 {reviewListWithCount.reviewCnt}건</h3>
          <div className={styles.reviewSortBySelectBox}>
            <select className={styles.reviewSelector} onChange={handleChangeReviewSoryBy}>
              <option value="LATEST">--최신등록순--</option>
              <option value="OLDEST">오래된순</option>
              <option value="HIGHRATING">별점높은순</option>
              <option value="LOWRATING">별점낮은순</option>
            </select>
          </div>
          <div className={styles.reviewList}>
          {reviewListWithCount.reviewList.map((item,index) => (
            <ReviewItemComponent key={item.reviewId} reviewItem={item}></ReviewItemComponent>      
            ))}
            {reviewHasMore && (
              <button onClick={handleClickReviewLoadMoreBtn} disabled={loading}>
                {loading ? '로딩 중...' : '더보기'}
              </button>
            )}
          </div>
        </div>
        <div className={styles.buttonGroup}>
          <button className={styles.buyNowButton} onClick={handleBuyNowBtnClick}>바로구매</button>
          <button className={styles.addToCartButton} onClick={handleCartSaveBtnClick}>장바구니</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
