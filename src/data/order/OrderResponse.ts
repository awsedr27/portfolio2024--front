export interface MyPageReviewListResponse {
    myPageReviewList:MyPageReviewItemResponse[]
  }
  export interface MyPageReviewItemResponse{
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
    orderItemCreateDate:string;
}