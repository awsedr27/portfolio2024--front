import { OrderSaveRequest } from "../data/order/OrderRequest";
import { ReviewSaveRequest, ReviewUpdateRequest } from "../data/review/ReviewRequest";


export const ValidateReviewSaveRequest = (reviewSaveRequest: ReviewSaveRequest): string|undefined => {
    if(reviewSaveRequest.orderItemId<=0){
        return '잘못된 요청입니다';
    }
    if (reviewSaveRequest.rating < 1 || reviewSaveRequest.rating > 5){
        return '별점은 1~5점까지 가능합니다';
    }
    if (reviewSaveRequest.comment.trim() === '') {
        return '리뷰글은 필수 입력 사항입니다';
    }
    return;
};

export const ValidateReviewUpdateRequest = (reviewUpdateRequest: ReviewUpdateRequest): string|undefined => {
    if(reviewUpdateRequest.reviewId<=0){
        return '잘못된 요청입니다';
    }
    if (reviewUpdateRequest.rating < 1 || reviewUpdateRequest.rating > 5){
        return '별점은 1~5점까지 가능합니다';
    }
    if (reviewUpdateRequest.comment.trim() === '') {
        return '리뷰글은 필수 입력 사항입니다';
    }
    return;
};

