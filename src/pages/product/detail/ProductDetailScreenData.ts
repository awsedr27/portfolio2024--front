export interface ProductDetailScreenData {
    productId:number;
    name:string;
    description?:string;
    price:number;
    categoryId:number;
    imageUrl:string;
    createDate:Date;
    caculatedPrice:number;
  }
