  export interface ReviewListRequest {
    productId:number;
    sortBy:string;
    reviewId?:number;
    rating?:number;
  }
  export interface ReviewSaveRequest {
    orderItemId:number;
    rating:number;
    comment:string;
  }
  export interface ReviewUpdateRequest {
    reviewId:number;
    rating:number;
    comment:string;
  }
  export interface ReviewDeleteRequest {
    reviewId:number;
  }