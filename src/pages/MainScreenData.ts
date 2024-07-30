export interface MainScreenData {
    productList:ProductItem[];
    productBannerData:string;
  }
interface ProductItem {
    productId:number;
    name:string;
    description?:string;
    price:number;
    categoryId:number;
    createDate:string;
  }