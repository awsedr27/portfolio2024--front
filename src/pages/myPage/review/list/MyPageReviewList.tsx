import { useLocation, useNavigate } from 'react-router-dom';
import styles from './MyPageReviewList.module.css'; 
import { useEffect, useRef, useState } from 'react';
import axiosInstance from '../../../../network/Api';
import { MyPageReviewListScreenData } from './MyPageReviewListScreenData';
import { MyPageReviewListRequest } from '../../../../data/order/OrderRequest';
import { MyPageReviewListResponse } from '../../../../data/order/OrderResponse';
import { transformMyPageReviewListResponseToMyPageReviewListScreenData } from '../../../../converter/OrderConverter';
import { MyPageReviewDetail } from '../detail/ReviewDetailScreenData';
const MyPageReviewList: React.FC = () => {
    const nav = useNavigate();
    const location = useLocation();
    let type:string = new URLSearchParams(location.search).get('type')?.toUpperCase()||'REVIEWABLE';
    const [myPageReviewList, setMyPageReviewList] = useState<MyPageReviewListScreenData>({myPageReviewList:[]});
    const imgLocation = process.env.REACT_APP_PRODUCT_IMG_LOCATION;
    const baseUrl = process.env.REACT_APP_API_URL;

    const lastMyPageReviewIdRef = useRef<number | undefined>(undefined);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [expandedReviewId, setExpandedReviewId] = useState<number | null>(null);
    const lastRequestId = useRef(0);
    const getMyPageReviewList=async (orderItemId?:number)=>{
        try{
            const request:MyPageReviewListRequest={type:type,orderItemId:orderItemId}
            const response = await axiosInstance.post('/api/order/myPage/review/list',request);
            const result:MyPageReviewListResponse=response.data;
            const reviewList=transformMyPageReviewListResponseToMyPageReviewListScreenData(result.myPageReviewList);
            return reviewList;
        }catch(error){
            nav('/errorPage',{ replace: true });
            return [];
        }
    }
    useEffect(() => {
        const requestId = ++lastRequestId.current;
        if(type!=='REVIEWABLE'&&type!=='REVIEWED'){
            nav('/errorPage',{ replace: true });
            return ;
        }
        const loadInitialReviews = async () => {
            setExpandedReviewId(null);
            setLoading(true);
            setHasMore(true);
            const reviewList=await getMyPageReviewList();               
            if (requestId === lastRequestId.current) {
                if(reviewList.length<5){
                    setHasMore(false);
                }
                setMyPageReviewList(prev=>{
                    lastMyPageReviewIdRef.current=reviewList[reviewList.length-1]?.orderItemId;
                    return({
                        myPageReviewList:reviewList
                    })
                });
                setLoading(false);
            }
        }
        loadInitialReviews();
      }, [type]);
    const handleTabClick = (tab:string) => {
        nav(`/myPage/review/list/?type=${tab}`);
    };
    const handleAddMyPageReviewList=async ()=>{
        const requestId = ++lastRequestId.current;
        setLoading(true);
        const reviewList=await getMyPageReviewList(lastMyPageReviewIdRef.current);
        if (requestId === lastRequestId.current) {
            if(reviewList.length<5){
                setHasMore(false);
            }
            setMyPageReviewList(prev=>{
                const result=[...prev.myPageReviewList,...reviewList];
                lastMyPageReviewIdRef.current=result[result.length-1]?.orderItemId;
                return({
                    myPageReviewList:result
                })
            })
            setLoading(false);
        }
    }
    const handleToggle = (orderItemId:number,reviewDetail:MyPageReviewDetail) => {
        if(!reviewDetail.reviewId){
            nav('/myPage/review/detail', { state: {orderItemId:orderItemId,reviewDetail:reviewDetail} });
            return;
        }else{
            setExpandedReviewId(prevId => prevId === orderItemId ? null : orderItemId); 
            return;
        }
      };
      function Star({ filled }: { filled: boolean }) {
        return (
          <span style={{ color: filled ? 'gold' : 'lightgray', fontSize: '24px' }}>
            {'\u2605'}
          </span>
        );
      }
    const handleClickReview=(orderItemId:number,reviewDetail:MyPageReviewDetail)=>{
        nav('/myPage/review/detail', { state: {orderItemId:orderItemId,reviewDetail:reviewDetail} });
    }
   return(
        <div className={styles.myPageReviewListContainer}>
            <div className={styles.headerTitle}><h2>상품리뷰</h2></div>
            <div className={styles.tabButtonContainer}>
                <button onClick={() => handleTabClick('reviewable')} className={`${styles.tabButton} ${type === 'REVIEWABLE' ? styles.active : ''}`}>작성 가능 리뷰</button>
                <button onClick={() => handleTabClick('reviewed')} className={`${styles.tabButton} ${type === 'REVIEWED' ? styles.active : ''}`}>내가 쓴 리뷰</button>
            </div>
        {loading?(
            <div className={styles.loadingContainer}>
                <p>Loading...</p>
            </div>
            ):(
            myPageReviewList.myPageReviewList.length === 0 ? (
                type === 'REVIEWABLE' ? (
                    <div className={styles.noReviewList}><span>작성 가능한 리뷰가 없습니다</span></div> 
                ) : (
                    <div className={styles.noReviewList}><span>작성하신 리뷰가 없습니다.</span></div> 
                )
            ) : (
                <div className={styles.reviewListContainer}>
                    {myPageReviewList.myPageReviewList.map((review) => (
                        <div className={styles.reviewListBox} key={review.orderItemId} onClick={() => handleToggle(review.orderItemId,
                            {reviewId:review.reviewId,reviewComment:review.reviewComment,reviewReply:review.reviewReply,reviewRating:review.reviewRating,reviewUseYn:review.reviewUseYn}
                        )}
>
                          <div className={styles.dateAndPriceContainer}>
                            <div className={styles.createDate}>{review.orderItemCreateData.toLocaleDateString()}</div>
                            <div className={styles.price}>{review.price.toLocaleString('ko-KR')}원</div>
                          </div>
                          <div className={styles.content}>
                            <div className={styles.imgContainer}>
                                {review.imageUrl ? (
                                <img src={`${baseUrl}${imgLocation}${review.imageUrl}`} alt={review.productName} />
                                ) : (
                                <p>이미지 없음</p>
                                )}
                            </div>
                            <div className={styles.productNameAndInformation}>
                                <div className={styles.productName}>{review.productName}</div>
                                <div className={styles.information}>
                                {type==='REVIEWABLE'&&'리뷰를 작성하시려면 클릭하세요'}
                                {(type==='REVIEWED'&&(expandedReviewId !== review.orderItemId))&&'리뷰를 보시려면 클릭하세요'}
                                </div>
                            </div>
                          </div>
                          {(expandedReviewId === review.orderItemId)&&review.reviewId&& (
                            <div className={styles.reviewDetails}>
                                <div className={styles.reviewDetailButtonContainer}>
                                    <button onClick={(e) => { e.stopPropagation();handleClickReview(review.orderItemId,
                                        {reviewId:review.reviewId,reviewComment:review.reviewComment,reviewReply:review.reviewReply,reviewRating:review.reviewRating,reviewUseYn:review.reviewUseYn}) }}>상세보기</button>
                                </div>
                                <div className={styles.starAndName}>
                                    <div className={styles.reviewRatingContainer}>
                                    {Array.from({ length: 5 }, (_, index) => (
                                        <Star key={index} filled={index < (review.reviewRating?review.reviewRating:0)} />
                                    ))}
                                    </div>
                                    <p className={styles.productNameAndQuantity}>{review.productName}X{review.quantity}개</p>
                                </div>
                                <p className={styles.reviewComment}>리뷰 : {review.reviewComment}</p>
                                <p className={styles.reviewReply}>판매자 답글 : {review.reviewReply}</p>
                                <div className={styles.reviewActions}>
                                </div>
                            </div>
                        )}
                        </div>
                    ))}
                <div className={styles.addButton}>
                    {hasMore&&<button disabled={loading} onClick={handleAddMyPageReviewList}>더보기</button>}
                </div>
                </div>
                
            )
        )
        }
        </div>
    )
}
export default MyPageReviewList;