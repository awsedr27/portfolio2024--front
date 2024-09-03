import { ReviewItem } from "../../../components/review/ReviewItemComponentScreenData";

export interface ProductDetailScreenData {
    productId:number;
    name:string;
    description?:string;
    price:number;
    categoryName:string;
    imageUrl:string;
    createDate:Date;
    caculatedPrice:number;
  }
  export interface ReviewListWithCount {
    reviewList:ReviewItem[];
    reviewCnt:number;

  }
