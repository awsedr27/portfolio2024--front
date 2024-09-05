export interface MyPageReviewListScreenData {
    myPageReviewList:MyPageReviewItem[]
}
export interface MyPageReviewItem{
    imageUrl: string; 
    productName: string; 
    quantity: number; 
    price: number; 
    reviewId: number|null; 
    reviewUseYn: string|null;
    reviewRating: number|null; 
    reviewComment: string|null;
    reviewReply: string|null;
    orderItemId: number;
    orderItemCreateData:Date
}
