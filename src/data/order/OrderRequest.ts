export interface OrderSaveRequest {
    orderSaveList:OrderItemSaveRequest[];
    postcode: string;
    roadAddress: string;
    jibunAddress: string;
    detailAddress: string;
  }

export interface OrderItemSaveRequest{
    productId:number;
    quantity:number;
}
export interface MyPageReviewListRequest{
  type:string;
  orderItemId?:number;
}
export interface OrderListRequest{
  status?:string;
  orderId?:number;
}
export interface OrderCancelRequest{
  orderId:number;
}
export interface OrderItemCancelRequest{
  orderId:number;
  orderItemId:number;
}