import { ReviewListResponse } from "../data/review/ReviewResponse";
import { ReviewListWithCount } from "../pages/product/detail/ProductDetailScreenData";

export const transformReviewListResponse = (responseData: ReviewListResponse): ReviewListWithCount["reviewList"] => {
    
    return responseData.reviewList.map(item => ({
        reviewId:item.reviewId,
        rating:item.rating,
        nickname:item.nickname,
        comment:item.comment,
        reply:item.reply,
        createDate: new Date(item.createDate)
    }));
};