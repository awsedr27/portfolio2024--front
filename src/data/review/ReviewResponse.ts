export interface ReviewListResponse {
    reviewList:ReviewItemResponse[];
    reviewCnt:number;
  }
interface ReviewItemResponse {
    reviewId:number;
    rating:number;
    nickname:string;
    comment:string;
    reply:string;
    createDate:string;
  }
