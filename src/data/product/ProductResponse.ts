export interface ProductListResponse{
  productList:ProductItemResponse[];
  }

  interface ProductItemResponse{
    productId:number;
    name:string;
    description?:string;
    price:number;
    categoryId:number;
    createDate:string;
  }

  export interface ProductDetailResponse{
    productId:number;
    name:string;
    description?:string;
    price:number;
    categoryId:number;
    createDate:string;
  }
  