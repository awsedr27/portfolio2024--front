export interface ReviewListResponse {
    reviewList:ReviewItemResponse[];
    reviewCnt:number;
  }
interface ReviewItemResponse {
    reviewId:number;
    rating:number;
    userName:string;
    comment:string;
    reply:string;
    createDate:string;
  }
