import { useLocation, useNavigate } from 'react-router-dom';
import styles from './ReviewDetail.module.css'; 
import { useEffect, useRef, useState } from 'react';
import { MyPageReviewDetail } from './ReviewDetailScreenData';
import { MyPageReviewItem } from '../list/MyPageReviewListScreenData';
import axiosInstance from '../../../../network/Api';
import { ReviewDeleteRequest, ReviewSaveRequest, ReviewUpdateRequest } from '../../../../data/review/ReviewRequest';
import { ValidateReviewSaveRequest, ValidateReviewUpdateRequest } from '../../../../validation/ValidationReview';
import { useSpinner } from '../../../../context/SpinnerContext';
const ReviewDetail: React.FC = () => {
    const location = useLocation();
    const nav = useNavigate();
    const imgLocation = process.env.REACT_APP_PRODUCT_IMG_LOCATION;
    const baseUrl = process.env.REACT_APP_API_URL;
    const {reviewItem}: {reviewItem:MyPageReviewItem} = location.state;
    const {loading,setLoading } = useSpinner();
    const loadingRef = useRef(false);
    const [reviewDetailScreenData, setReviewDetailScreenData] = useState<MyPageReviewDetail>({
      reviewId:reviewItem.reviewId,reviewComment:reviewItem.reviewComment,reviewRating:reviewItem.reviewRating,reviewReply:reviewItem.reviewReply,reviewUseYn:reviewItem.reviewUseYn});
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
      const handleSubmit=async (e: React.FormEvent)=>{
        e.preventDefault();
        try{
          if(reviewDetailScreenData.reviewId!=null){
            const reviewUpdateRequest:ReviewUpdateRequest={reviewId:reviewDetailScreenData.reviewId,comment:reviewDetailScreenData.reviewComment||'',rating:reviewDetailScreenData.reviewRating||0}
            const validationMessage=ValidateReviewUpdateRequest(reviewUpdateRequest);
            if(validationMessage){
              alert(validationMessage);
              return;
            }
            if(loadingRef.current){return;}
            loadingRef.current=true;
            setLoading(true);
            const response = await axiosInstance.post('/api/review/update', reviewUpdateRequest);
            alert("리뷰가 수정되었습니다");
          }else{
            const reviewSaveRequest:ReviewSaveRequest={orderItemId:reviewItem.orderItemId,comment:reviewDetailScreenData.reviewComment||'',rating:reviewDetailScreenData.reviewRating||0}
            const validationMessage=ValidateReviewSaveRequest(reviewSaveRequest);
            if(validationMessage){
              alert(validationMessage);
              return;
            }
            if(loadingRef.current){return;}
            loadingRef.current=true;
            setLoading(true);
            const response = await axiosInstance.post('/api/review/save', reviewSaveRequest);
            alert("리뷰가 등록되었습니다");
          }
          setLoading(false);
          loadingRef.current=false;
          nav('/myPage/review/list?type=reviewable',{ replace: true });
        }catch(error){
          setLoading(false);
          nav('/errorPage',{ replace: true });
        }
      }
      const handleStarClick=(index:number)=>{
        setReviewDetailScreenData(prev=>{
          return(
            {
              ...prev,
              reviewRating:index+1
            }
          )
        })
      }
      const handleChangeText=(e:React.ChangeEvent<HTMLTextAreaElement>)=>{
        setReviewDetailScreenData((prev) => ({
          ...prev,
          reviewComment:e.target.value,
        }));
      }
      function Star({ filled,onClick }: { filled: boolean,onClick:()=>void }) {
        return (
          <span onClick={onClick} style={{ color: filled ? 'gold' : 'lightgray', fontSize: '48px',cursor:'pointer' }}>
            {'\u2605'}
          </span>
        );
      }
      const handleReviewDelete=async ()=>{
        try{
          if(reviewDetailScreenData.reviewId==null){
            return;
          }
          if(loadingRef.current){return;}
          loadingRef.current=true;
          setLoading(true);
          const reviewDeleteRequest:ReviewDeleteRequest={reviewId:reviewDetailScreenData.reviewId}
          const response = await axiosInstance.post('/api/review/delete', reviewDeleteRequest);
          alert("리뷰가 삭제되었습니다");
          setLoading(false);
          loadingRef.current=false;
          nav('/myPage/review/list?type=reviewable',{ replace: true });
        }catch(error){
          setLoading(false);
          nav('/errorPage',{ replace: true });
        }
      }
    return(
        <div className={styles.reviewDetailContainer}>
            <form onSubmit={handleSubmit}>
                <div className={styles.headerTitle}>
                    <h2>{(reviewDetailScreenData.reviewId!=null) ? '리뷰 상세' : '리뷰 작성'}</h2>
                    <div className={styles.starContainer}>
                    {Array.from({ length: 5 }, (_, index) => (
                        <Star key={index} onClick={() => handleStarClick(index)} filled={index < (reviewDetailScreenData.reviewRating?reviewDetailScreenData.reviewRating:0)} />
                    ))}
                    </div>
                    <div className={styles.imgContainer}>
                      {reviewItem.imageUrl ? (
                      <img src={`${baseUrl}${imgLocation}${reviewItem.imageUrl}`} alt={reviewItem.productName} />
                      ) : (
                      <p>이미지 없음</p>
                      )}
                    </div>
                    <div className={styles.productContainer}>
                      <div className={styles.productName}>
                        {reviewItem.productName} x {reviewItem.quantity}
                      </div>
                    </div>
                    <div className={styles.textAreaContainer}>                   
                      <textarea
                      className={styles.reviewTextarea}
                      value={reviewDetailScreenData.reviewComment||''}
                      onChange={(e:React.ChangeEvent<HTMLTextAreaElement>) => {handleChangeText(e)}}
                      placeholder="리뷰를 입력하세요"
                      rows={4}
                      />
                    </div>
                    {(reviewDetailScreenData.reviewReply)&&(
                      <>
                        <div className={styles.reviewReplyContainer}><p>판매자 답글 : {reviewDetailScreenData.reviewReply}</p></div>
                        <div className={styles.reviewReplyInformation}>* 판매자 답글이 존재하면 리뷰를 수정할 수 없습니다</div>
                      </>
                    )}
                    <div className={styles.buttonContainer}>
                      {(!reviewDetailScreenData.reviewReply)&&<button type="submit">{(reviewDetailScreenData.reviewId!=null) ? '수정하기' : '작성하기'}</button>}
                      {(reviewDetailScreenData.reviewId!=null)&&<button className={styles.deleteBtn} onClick={handleReviewDelete} type="button">삭제하기</button>}
                    </div>
                </div>
            </form>
            
        </div>
    )
}
export default ReviewDetail;