import { useLocation, useNavigate } from 'react-router-dom';
import styles from './ReviewDetail.module.css'; 
import { useEffect, useState } from 'react';
import { MyPageReviewDetail } from './ReviewDetailScreenData';
const ReviewDetail: React.FC = () => {
    const location = useLocation();
    const nav = useNavigate();
    const {orderItemId,reviewDetail}: {orderItemId:number,reviewDetail:MyPageReviewDetail} = location.state;
    const [reviewDetailScreenData, setReviewDetailScreenData] = useState<MyPageReviewDetail>(reviewDetail);
    console.log(reviewDetail)
    console.log(reviewDetailScreenData)
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
      const handleSubmit=(e: React.FormEvent)=>{
        e.preventDefault();
      }
      function Star({ filled }: { filled: boolean }) {
        return (
          <span style={{ color: filled ? 'gold' : 'lightgray', fontSize: '24px' }}>
            {'\u2605'}
          </span>
        );
      }
    return(
        <div className={styles.reviewDetailContainer}>
            <form onSubmit={handleSubmit}>
                <div>
                    <h2>{reviewDetailScreenData.reviewId ? '리뷰 수정' : '리뷰 작성'}</h2>
                    <div>
                    {Array.from({ length: 5 }, (_, index) => (
                        <Star key={index} filled={index < (reviewDetailScreenData.reviewRating?reviewDetailScreenData.reviewRating:0)} />
                    ))}
                    </div>
                    <textarea
                    value={reviewDetailScreenData.reviewComment||''}
                    onChange={(e) => {}}
                    placeholder="리뷰를 입력하세요"
                    rows={4}
                    />
                    <button type="submit">{reviewDetailScreenData?.reviewId ? '수정하기' : '작성하기'}</button>
                </div>
            </form>
        </div>
    )
}
export default ReviewDetail;