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
export interface OrderListResponse {
  orderList:OrderListResultResponse[]
}
export interface OrderItemResponse {
  orderItemId: number;
  imageUrl: string;
  productName: string;
  quantity: number;
  price: number;
  status: string;
  createDate: string; 
}
export interface OrderListResultResponse {
  orderId: number;
  totalPrice: number;
  status: string;
  postcode: string;
  roadAddress: string;
  jibunAddress: string;
  detailAddress: string;
  createDate: string; 
  orderItems: OrderItemResponse[]; 
}